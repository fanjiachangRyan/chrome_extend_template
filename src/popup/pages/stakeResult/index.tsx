import styles from './index.less'
import Layout from "@/popup/components/layout";
import {useLocation} from "react-router";
import {useState} from "react";
import {useRequest} from "ahooks";
import {getDelegateRate, getTransInfoByHash} from "@/api";
import {gas_fee} from "@/config/define";
import success from "@/assets/images/success.png";
import {formatCountByDenom} from "@/api/utils";

const StakeResult = () => {
  const {state = {}} = useLocation()
  const {type = 'fixed', hash = '', amount = '0'} = state
  const [stakeAmount, setStakeAmount] = useState<any>({})
  const [apy, setApy] = useState<any>(0)

  useRequest(() => getDelegateRate(), {
    ready: type === 'flexible',
    refreshDeps: [],
    onSuccess: (res: any) => {
      setApy(() => (res.data || 0).toFixed(2))
    }
  })

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


  return (
      <Layout title={'Stake Success'}>
        <div className={styles.result}>
          <img className={styles.img} src={success}/>
        </div>
        <div className={styles.item}>
          <div className={styles.row}>
            <p className={styles.subject}>Stake</p>
            {type === 'flexible' && <p className={styles.value}>{stakeAmount.amount || '0'} <span>{stakeAmount.denom || 'MEC'}</span></p>}
            {type === 'fixed' && <p className={styles.value}>{amount} <span>MEC</span></p>}
          </div>
          {
              type === 'flexible' && (
                  <div className={styles.row}>
                    <p className={styles.subject}>APY</p>
                    <p className={styles.value}>
                      {apy}%
                    </p>
                  </div>
              )
          }
          <div className={styles.row}>
            <p className={styles.subject}>Gas Fees</p>
            <p className={styles.value}>{formatCountByDenom('umec', `${gas_fee}`).amount || '0'} MEC</p>
          </div>
        </div>
      </Layout>
  )
}

export default StakeResult
