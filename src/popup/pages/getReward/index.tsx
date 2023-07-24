import styles from './index.less'
import Layout from "@/popup/components/layout";
import {useLocation, useNavigate} from "react-router";
import {useState} from "react";
import {useRequest} from "ahooks";
import {getCurrentAccount, getDelegationAmount, getRewardByAddress, getGas} from "@/api";
import {formatCountByDenom} from "@/api/utils";
import {Button, message} from "antd";
import {getReward} from "./api";

const GetReward = () => {
  const {state = {}} = useLocation()
  const {isKyc = false} = state
  const [delegation, setDelegation] = useState<any>({})
  const [reward, setReward] = useState<any>({})
  const navigator = useNavigate()

  const getGasAction = useRequest(getGas, {
    manual: true,
    onSuccess: (res: any) => {
      const {data = 200000} = res ?? {}

      msgGetRewardAction.run(delegation.validator_address, parseInt(`${data * 1.2}`))
    }
  })

  const {loading} = useRequest(() => getCurrentAccount(), {
    ready: true,
    refreshDeps: [],
    onSuccess: (res: any) => {
      if (!res.address) return
      getDelegationAction.run(res.address)
      getRewardAction.run(res.address)
    }
  })

  const getRewardAction = useRequest(getRewardByAddress, {
    manual: true,
    onSuccess: (res: any) => {
      const {rewards = []} = res ?? {}

      setReward(() => rewards[0] ?? {})
    }
  })

  const getDelegationAction = useRequest(getDelegationAmount, {
    manual: true,
    onSuccess: (res: any) => {
      const {delegation_response = {}} = res

      setDelegation(() => delegation_response?.delegation ?? {})
    }
  })

  const msgGetRewardAction = useRequest(getReward, {
    manual: true,
    onSuccess: (res: any) => {
      if (res.code === 0) {
        message.success('Withdraw reward success!')
        return navigator('/transactionDetail', {state: {hash: res.transactionHash}})
      } else {
        message.error('Withdraw reward  failed')
      }
    }
  })

  return <Layout title={'Get Reward'}>
    <div className={styles.item}>
      <div className={styles.row}>
        <p className={styles.subject}>Your Stake</p>
        <p className={styles.value}>{isKyc ?
            (
                `${delegation.amount == '0' ? `0` :
                    `${formatCountByDenom('umec', delegation.amount).amount} MEC`}`
            ) :
            (`${delegation.unKycAmount == '0' ? `0` :
                    `${formatCountByDenom('umec', delegation.unKycAmount).amount} MEC`}`
            )
        }
        </p>
      </div>
      <div className={styles.row}>
        <p className={styles.subject}>Staking Rewards Earned</p>
        <p className={styles.value}>{reward.amount == 0 ? '0' : `${formatCountByDenom('umec', reward.amount).amount} MEC`}</p>
      </div>
      <div className={styles.row}>
        <p className={styles.subject}>Total Get Reward MEC</p>
        <p className={styles.value}>{reward.amount == 0 ? '0' : `${formatCountByDenom('umec', reward.amount).amount} MEC`}</p>
      </div>

      <Button loading={msgGetRewardAction.loading || getGasAction.loading || loading} className={styles.button} disabled={reward.amount == 0} onClick={() => {
       getGasAction.run({transsaction_type: '/cosmos.distribution.v1beta1.MsgWithdrawDelegatorReward'})
      }}>Get Reward</Button>
    </div>
  </Layout>
}

export default GetReward
