import {clientAddrList, gas_fee, gas_limit, getClientAddrType, PREFIX} from "@/config/define";
import {txClient} from "@/store/cosmos.staking.v1beta1/module";
import {getWallet} from "@/api/utils";

export const sendMsgUnStake = async ({amount, validatorAddress,isKyc = true, memo}: any) => {
  try {
    const wallet = await getWallet()

    const [account] = await wallet.getAccounts()
    const addrType:any = await getClientAddrType()
    const addr = clientAddrList[addrType]
    const client = txClient( {signer: wallet, addr, prefix: PREFIX})

    const value: any = {
      delegatorAddress: account.address,
      validatorAddress,
      amount: {denom: 'umec', amount: `${amount * 1000000}`},
      isKyc
    }

    const fee = {
      amount: [{denom: 'umec', amount: `${gas_fee}`}],
      gas: String(gas_limit),
    }

    return  await client.sendMsgUndelegate({value, fee, memo })
  } catch (error) {
    return Promise.reject(error)
  }
}
