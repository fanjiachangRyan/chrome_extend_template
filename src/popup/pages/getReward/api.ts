import {ClientAddrType, gas_fee, gas_limit, PREFIX, RequestAddrList} from "@/config/define";
import {txClient} from "@/store/cosmos.distribution.v1beta1/module";
import {getWallet, storage} from "@/api/utils";

export const getReward = async (validatorAddress: string) => {
  try {
    const wallet = await getWallet()

    const [account] = await wallet.getAccounts()
    const {clientAddrType = ClientAddrType.Test} = await storage.get(['clientAddrType'])
    const addr = `${RequestAddrList[clientAddrType]}:26657`
    const client = txClient({signer: wallet, addr, prefix: PREFIX})

    const value: any = {
      delegatorAddress: account.address,
      validatorAddress
    }

    const fee = {
      amount: [{denom: 'umec', amount: `${gas_fee}`}],
      gas: String(gas_limit),
    }

    console.log('value-->', value)
    return await client.sendMsgWithdrawDelegatorReward({value, fee, memo: ''})
  } catch (error) {
    return Promise.reject(error)
  }
}
