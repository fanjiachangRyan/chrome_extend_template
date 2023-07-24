import {
  PREFIX,
  ClientAddrType,
  RequestAddrList, gas_price
} from "@/config/define";
import {txClient} from "@/store/cosmos.bank.v1beta1/module";
import {getWallet, math, storage} from "@/api/utils";

export const msgSend = async ({amount, toAddress, memo, gas}: any) => {
  try {
    const wallet = await getWallet()

    const [account] = await wallet.getAccounts()

    const {clientAddrType = ClientAddrType.Test} = await storage.get(['clientAddrType'])
    const addr = `${RequestAddrList[clientAddrType]}:26657`

    const client = txClient( {signer: wallet, addr, prefix: PREFIX})
    const value: any = {
      fromAddress: account.address,
      toAddress: toAddress,
      amount: [{denom: 'umec', amount: math.multiply(amount, 1000000)}]
    }

    const fee = {
      amount: [{denom: 'umec', amount: `${(gas * gas_price).toFixed(0)}`}],
      gas: String(gas),
    }

    return await client.sendMsgSend({value, fee, memo})
  } catch (error) {
    return Promise.reject(error)
  }
}
