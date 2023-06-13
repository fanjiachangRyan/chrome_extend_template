import { ClientAddrType, gas_fee, gas_limit, PREFIX, RequestAddrList} from "@/config/define";
import {txClient} from "@/store/cosmos.staking.v1beta1/module";
import {getWallet, storage} from "@/api/utils";
import {FixedDepositTerm} from "@/store/cosmos.staking.v1beta1/types/cosmos/staking/v1beta1/fixed_deposit";

export const sendMsgFixed = async ({amount, month, memo = ''}: any) => {
  try {
    const wallet = await getWallet()

    const [account] = await wallet.getAccounts()
    const {clientAddrType = ClientAddrType.Test} = await storage.get(['clientAddrType'])
    const addr = `${RequestAddrList[clientAddrType]}:26657`
    const client = txClient({signer: wallet, addr, prefix: PREFIX})

    const data = {
      annualRate_1_months: 0,
      annualRate_3_months: 1,
      annualRate_6_months: 2,
      annualRate_12_months: 3,
      annualRate_24_months: 4,
      annualRate_36_months: 5,
      annualRate_48_months: 6,
    }

    const value: any = {
      account: account.address,
      principal: {denom: 'umec', amount: `${amount * 1000000}`},
      term: (data[month] || -1)
    }

    const fee = {
      amount: [{denom: 'umec', amount: `${gas_fee}`}],
      gas: String(gas_limit),
    }

    return await client.sendMsgDoFixedDeposit({value, fee, memo})
  } catch (error) {
    return Promise.reject(error)
  }
}
