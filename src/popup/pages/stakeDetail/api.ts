import {ClientAddrType, gas_fee, gas_limit, PREFIX, RequestAddrList} from "@/config/define";
import {txClient} from "@/store/cosmos.staking.v1beta1/module";
import {getWallet, storage} from "@/api/utils";

export const sendMsgUnDeposit = async ({id, memo}: any) => {
  try {
    const wallet = await getWallet()

    const [account] = await wallet.getAccounts()
    const {clientAddrType = ClientAddrType.Test} = await storage.get(['clientAddrType'])
    const addr = `${RequestAddrList[clientAddrType]}:26657`
    const client = txClient({signer: wallet, addr, prefix: PREFIX})

    const value: any = {
      account: account.address,
      id
    }

    const fee = {
      amount: [{denom: 'umec', amount: `${gas_fee}`}],
      gas: String(gas_limit),
    }

    return await client.sendMsgDoFixedWithdraw({value, fee, memo})
  } catch (error) {
    return Promise.reject(error)
  }
}
