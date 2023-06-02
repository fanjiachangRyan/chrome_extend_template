import {Cosmos} from "@/api/cosmos";
import {CHAIN_ID, PREFIX} from "@/config/define";
import {getParseNetwork} from "@/config/utils";
import {toBech32} from '@cosmjs/encoding'
import {rawSecp256k1PubkeyToRawAddress} from '@cosmjs/amino'
import {storage, checkData} from "@/api/utils";
import { fromString} from 'uint8arrays/from-string'
import { toString } from 'uint8arrays/to-string'
import http from './request'
import localHttp from './localRequest'
export const ME = async () => {
  const {wallet_end_url} = await getParseNetwork()
  return instanceME(wallet_end_url)
}

const instanceME = (url: string) => {
  const instance = new Cosmos(url, CHAIN_ID)
  instance.setBech32MainPrefix(PREFIX)
  instance.setPath("m/44'/118'/0'/0/0")
  return instance
}

export const getAccount = async (): Promise<any> => {
  const cosmosInstance = await ME()
  return new Promise((resolve, reject) => {

    storage.get(['currentAccount'], async ({ currentAccount }: any) => {
      const account = {
        address: '',
        mnemonic: '',
        mnemonicArr: [],
        pw: '',
        accountName: '',
      }
      if (!currentAccount) {
        resolve(account)
        return
      }

      try {
        let privKey
        if (currentAccount.priv) {
          privKey = Buffer.from(fromString(currentAccount.priv.slice(2), 'base16'))
        } else if (currentAccount.mnemonic) {
          privKey = cosmosInstance.getECPairPriv(currentAccount.mnemonic) || new Uint8Array()
        }
        const pubKeyAny = cosmosInstance.getPubKeyAny(privKey)

        const addr = toBech32(PREFIX, rawSecp256k1PubkeyToRawAddress(pubKeyAny.value))

        const data = {
          ...currentAccount,
          address: addr,
          privKey,
          pubKeyAny,
          privKeyString: privKey ? '0x' + toString(privKey, 'base16') : '',
          pubKeyAnyString: '0x' + toString(pubKeyAny.value, 'base16'),
        }
        // console.log('getAcount: ', data)
        resolve(data)
      } catch (error) {
        resolve(account)
      }
    })
  })
}

export const getAccountList = (): Promise<any[]> => {
  return new Promise(async(resolve, reject) => {
    const cosmosInstance = await ME()

    storage.get(['accountList'], ({ accountList }) => {
      const list = accountList.map((item: any) => {
        let privKey
        if (item.priv) {
          privKey = Buffer.from(fromString(item.priv.slice(2), 'base16'))
        } else {
          privKey = cosmosInstance.getECPairPriv(item?.mnemonic) || new Uint8Array()
        }

        const pubKeyAny = cosmosInstance.getPubKeyAny(privKey)
        const addr = toBech32(PREFIX, rawSecp256k1PubkeyToRawAddress(pubKeyAny.value))

        return {
          ...item,
          address: addr,
          privKey,
          pubKeyAny,
        }
      })
      resolve(list)
    })
  })
}

export const addAccount = async ({mnemonic = '', priv}: any) => {
  const cosmosInstance = await ME()
  try {
    let privKey
    if (priv) {
      privKey = Buffer.from(fromString(priv.slice(2), 'base16'))
    } else {
      privKey = cosmosInstance.getECPairPriv(mnemonic)
    }

    const pubKeyAny = cosmosInstance.getPubKeyAny(privKey)

    const address = toBech32(PREFIX, rawSecp256k1PubkeyToRawAddress(pubKeyAny.value))

    const {pw} = await storage.get(['pw'])


    const account = {
      address,
      mnemonic,
      mnemonicArr: mnemonic.split(' '),
      pw,
      accountName: 'Account',
      isActive: true,
      priv,
    }

    return new Promise((resolve: any, reject: any) => {
      storage.get(['accountList'], async ({accountList}) => {
        accountList = checkData(accountList) || []

        if (!accountList.find((item: any) => item.address === account.address)) {
          accountList.forEach((item: any) => (item.isActive = false))
          accountList.push(account)

          await storage.set({accountList: accountList})
        } else {
          reject({code: 10004, msg: 'The imported account already exists'})
        }

        await storage.set({
          currentAccount: {
            ...account,
          },
        })

        resolve(account)
      })
    })
  } catch (e) {
    return Promise.reject(e)
  }
}


export const resetAccount = async (): Promise<any> => {
  await storage.remove('currentAccount')
  await storage.remove('accountList')
  await storage.remove('pw')
  return 'success'
}

export const setAccount = async (data: any) => {
  const currentAccount = await getAccount()
  const account = {
    address: currentAccount.address,
    mnemonic: currentAccount.mnemonic,
    mnemonicArr: currentAccount.mnemonicArr,
    pw: currentAccount.pw,
    isActive: currentAccount.isActive,
    priv: currentAccount.priv,
    accountName: data.accountName,
    ...data,
  }

  let accountList = await getAccountList()
  accountList = accountList.map((item: any) => {
    const newItem = {
      address: item.address,
      mnemonic: item.mnemonic,
      mnemonicArr: item.mnemonicArr,
      pw: item.pw,
      priv: item.priv,
      accountName: item.accountName,
    }
    if (item.address === account.address) {
      return account
    } else if (item.isActive) {
      return {
        ...newItem,
        isActive: false,
      }
    } else {
      return { ...newItem }
    }
  })

  // console.log('account:::', account)
  await storage.set({ currentAccount: account })

  // console.log('accountList:::', accountList)
  await storage.set({ accountList: checkData(accountList) })

  return 'success'
}

export const connect = async () => {
  const account: any = await getCurrentAccount()
  const tabs: any[] = await chrome.tabs.query({ active: true })
  tabs.forEach((tab: any) => {
    chrome.tabs.sendMessage(
        tab.id,
        {
          from: 'popup',
          value: 'requestConnectConfirm',
          account: account,
        },
        async (result) => {
          await storage.set({connectStatus: true})
        }
    )
  })
}

export const getCurrentAccount = async () => {
  return new Promise((resolve, reject) => {
    storage.get(['currentAccount'], async ({ currentAccount }: any) => {
      const account = {
        address: '',
        mnemonic: '',
        mnemonicArr: [],
        pw: '',
        accountName: '',
      }
      if (!currentAccount?.address) {
        resolve(account)
        return
      }

      try {
        const cosmosInstance = await ME()
        let privKey
        if (currentAccount.priv) {
          privKey = Buffer.from(fromString(currentAccount.priv.slice(2), 'base16'))
        } else if (currentAccount.mnemonic) {
          privKey = cosmosInstance.getECPairPriv(currentAccount.mnemonic) || new Uint8Array()
        }
        const pubKeyAny = cosmosInstance.getPubKeyAny(privKey)
        const addr = toBech32(PREFIX, rawSecp256k1PubkeyToRawAddress(pubKeyAny.value))

        const data = {
          ...currentAccount,
          address: addr,
          privKey,
          pubKeyAny,
          privKeyString: privKey ? '0x' + toString(privKey, 'base16') : '',
          pubKeyAnyString: '0x' + toString(pubKeyAny.value, 'base16'),
        }
        resolve(data)
      } catch (error) {
        console.error('getAccount:', error)
        resolve(account)
      }
    })
  })
}

export const getPassword = async () => {
 return new Promise(async (resolve: any, reject: any) => {
   try {
     const {pw} = await storage.get(['pw'])

     resolve(pw)
   } catch (e) {
     reject('get local password failed!')
   }
 })
}

export const getBalanceByAddress = async (address: string) => {
  return await http.get(`/cosmos/bank/v1beta1/balances/${address}`)
}
export const getFixedDeposit = async (address: string, query_type = 'ALL_STATE') => {
  return await http.get(`/cosmos/staking/v1beta1/fixed_deposit_by_acct/${address}/ALL_STATE`)
}

export const getDelegationAmount = async (address: string) => {
  return await http.get(`/cosmos/staking/v1beta1/delegation/${address}`)
}

export const getDepositAnnualRateList = async () => {
  return await http.get(`/cosmos/staking/v1beta1/fixed_deposit_interest_rate`)
}

export const getTransMessageByAccount = async (address: string, page_number = 1) => {
  return await localHttp.post(`/me/transaction/messageByAccount`, {account: address, page_number})
}

export const getTransInfoByHash = async (hash: string) => {
  return await http.get(`/cosmos/tx/v1beta1/txs/${hash}`)
}

export const getRewardByAddress = async (address: string) => {
  return await http.get(`/cosmos/distribution/v1beta1/rewards/${address}`)
}
export const getKycInfo = async (address: string) => {
  return await http.get(`/cosmos/staking/v1beta1/kyc/${address}`)
}

export const getRegionInfo = async (id: string) => {
  return await http.get(`/cosmos/staking/v1beta1/region/${id}`)
}

export const getFixDepositDetail = async ({id = '', address = ''}: any) => {
  return await http.get(`/cosmos/staking/v1beta1/fixed_deposit/${id}?address=${address}`)
}


export const getDelegateRate = async () => {
  return await localHttp.get(`/me/delegation/getParams`)
}

