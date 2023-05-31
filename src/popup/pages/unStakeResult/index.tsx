import styles from './index.less'
import Layout from "@/popup/components/layout";
import {useLocation} from "react-router";
import {useState} from "react";
import {useRequest} from "ahooks";
import {getBalanceByAddress, getCurrentAccount, getTransInfoByHash} from "@/api";
import {gas_fee} from "@/config/define";
import success from "@/assets/images/success.png";
import {formatCountByDenom} from "@/api/utils";

const UnStakeResult = () => {
  const {state = {}} = useLocation()
  const {hash = '', type = 'fixed', amount = '0'} = state
  const [stakeAmount, setStakeAmount] = useState<any>({})
  const [balance, setBalance] = useState<any>({})

  useRequest(() => getTransInfoByHash(hash), {
    ready: !!hash && type === 'flexible',
    refreshDeps: [hash],
    onSuccess: (res: any) => {
      const {tx = {}} = res ?? {}
      const amount = tx?.body?.messages?.[0]?.amount ?? {}
      const _amount = formatCountByDenom(amount.denom || 'umec', amount.amount || '0') ?? {}

      setStakeAmount(() => _amount)
    }
  })

  useRequest(() => getCurrentAccount(), {
    ready: true,
    refreshDeps: [],
    onSuccess: (res: any) => {
      run(res.address)
    }
  })

  const {run} = useRequest(getBalanceByAddress, {
    manual: true,
    onSuccess: (res: any) => {
      const {balances = []} = res
      const _balance = balances[0]

      const amount = formatCountByDenom(_balance.denom || 'umec', _balance.amount || '0') ?? {}

      setBalance(() => amount)
    }
  })

  return (
      <Layout title={'Unstake success'}>
        <div className={styles.result}>
          <img className={styles.img} src={success}/>
        </div>
        <div className={styles.item}>
          <div className={styles.row}>
            <p className={styles.subject}>Unstake</p>
            {type === 'flexible' && <p className={styles.value}>{stakeAmount.amount || '0'} <span>{stakeAmount.denom || 'MEC'}</span></p>}
            {type === 'fixed' && <p className={styles.value}>{formatCountByDenom('umec', amount).amount} <span>MEC</span></p>}
          </div>
          <div className={styles.row}>
            <p className={styles.subject}>Gas Fees</p>
            <p className={styles.value}>{formatCountByDenom('umec', `${gas_fee}`).amount || '0'} MEC</p>
          </div>
          <div className={styles.row}>
            <p className={styles.subject}>Total Amount</p>
            <p className={styles.value}>{balance.amount} <span>{balance.denom}</span></p>
          </div>

        </div>
      </Layout>
  )
}

export default UnStakeResult
