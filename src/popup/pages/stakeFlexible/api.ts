import {ClientAddrType, gas_price, PREFIX, RequestAddrList} from "@/config/define";
import {txClient} from "@/store/cosmos.staking.v1beta1/module";
import {getWallet, math, storage} from "@/api/utils";

export const sendMsgStake = async ({amount, validatorAddress, memo}: any) => {
  try {
    const wallet = await getWallet()

    const [account] = await wallet.getAccounts()
    const {clientAddrType = ClientAddrType.Test} = await storage.get(['clientAddrType'])
    const addr = `${RequestAddrList[clientAddrType]}:26657`

    const client = txClient( {signer: wallet, addr, prefix: PREFIX})

    const value: any = {
      delegatorAddress: account.address,
      validatorAddress,
      amount: {denom: 'umec', amount: math.multiply(amount, 1000000)}
    }

    return  await client.sendMsgDelegate({value, memo })
  } catch (error) {
    return Promise.reject(error)
  }
}
