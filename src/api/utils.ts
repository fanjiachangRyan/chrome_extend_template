import {getCurrentAccount} from "@/api/index";
import {DirectSecp256k1HdWallet, DirectSecp256k1Wallet} from '@cosmjs/proto-signing'
import {ClientAddrType, PREFIX, setClientAddrType} from "@/config/define";

const customStorage = {
  get: function (keys: string[], callback: (v: any) => void) {
    const values: any = {}
    try {
      keys.forEach((item: string) => {
        const _temp = localStorage.getItem(item)
        values[item] = _temp ? JSON.parse(_temp) : undefined
      })

      if (typeof callback === 'function') {
        callback(values)
      }

      return Promise.resolve(values)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  set: function (data: any, callback: (v: any) => void) {
    try {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const item = data[key]
          localStorage.setItem(key, JSON.stringify(item))
        }
      }

      if (typeof callback === 'function') {
        callback(data)
      }

      return Promise.resolve(data)
    } catch (error) {
      return Promise.reject(error)
    }
  },
  remove: function (key: string) {
    localStorage.removeItem(key)
  },
  clear: function () {
    localStorage.clear()
  },
}

export const storage = chrome?.storage?.local || customStorage

export const checkData = (list: any[]) => {
  if (!Array.isArray(list)) {
    return []
  }
  return list.filter((item: any) => !!item.address)
}

export const getCurrentTab = async () => {
  const queryOptions = {active: true, currentWindow: true}
  const [tab] = await chrome.tabs.query(queryOptions)
  return tab
}

export const disconnect = async () => {
  const account: any = await getCurrentAccount()
  const tabs: any[] = await chrome.tabs.query({active: true})
  tabs.forEach((tab: any) => {
    chrome.tabs.sendMessage(
        tab.id,
        {
          from: 'popup',
          value: 'disconnect',
          account: account,
        },
        () => {
        }
    )
  })
}

export const cutStr = (val: string, startLength = 6, endLength = 6) => {
  if (val.length < startLength + endLength) return val;

  return `${val.slice(0, startLength)}...${val.slice(0 - endLength)}`;
};

interface FormatCountByDenomFn {
  (
      denom: string,
      amount: string,
      isInt?: boolean,
      amountCutLength?: number,
  ): any
}

export const formatCountByDenom: FormatCountByDenomFn = (denom = '', amount: any, isInt = false, amountCutLength = 6) => {
  const firstChar = denom.slice(0, 1) || ''
  let newAmount = '0'
  if (!amount || amount == '0') return {denom, amount: '0'}

  let _amount: any = typeof amount === 'string' ? amount : `${amount}`

  if (firstChar.toUpperCase() === 'U') {
    _amount = `${_amount * 1 / Math.pow(10, amountCutLength)}`

    const amountArr = _amount.split('.')

    if (amountArr[1]) {
      newAmount = `${amountArr[0]}.${amountArr[1].slice(0, 6)}`
    } else {
      newAmount = _amount
    }

    return {
      denom: denom.slice(1, denom.length).toUpperCase(),
      amount: newAmount
    }
  }

  if (amountCutLength > 6) {
    newAmount = `${_amount.slice(0, _amount.length - (amountCutLength - 6))}`
  }

  return {
    denom: denom.toUpperCase(),
    amount: newAmount
  }
}

export const getWallet = async () => {
  // const mnemonic = 'champion session feature cry pretty middle hamster dinner snap grunt glass hire rent notable spoon bachelor gorilla fire salt dice riot brisk hair flag'
  const account: any = await getCurrentAccount()
  if (account.mnemonic) {
    return DirectSecp256k1HdWallet.fromMnemonic(account.mnemonic, {prefix: PREFIX})
  } else if (account.privKey) {
    return DirectSecp256k1Wallet.fromKey(account.privKey, PREFIX)
  } else {
    throw new Error('The account has no mnemonics and no private key')
  }
}

export const dealType = (type: string) => {
  if (!type) {
    return ''
  }
  const typeArr = type.split('.')

  return typeArr[typeArr.length - 1].replace(/^Msg/, '')
}
