import styles from './index.less'
import Layout from "@/popup/components/layout";
import {formatCountByDenom} from "@/api/utils";
import define from "@/popup/define";
import {useRequest} from "ahooks";
import {getCurrentAccount, getDelegationAmount, getKycInfo, getRewardByAddress} from "@/api";
import {useState} from "react";
import {Button, InputNumber, message} from "antd";
import {sendMsgUnStake} from './api'
import {useNavigate} from "react-router";

const UnStakeFlexible = () => {
  const [delegationInfo, setDelegationInfo] = useState<any>({})
  const [rewards, setRewards] = useState<any>({})
  const [amount, setAmount] = useState<string>('')
  const [isKyc, setIsKyc] = useState<boolean>(false)
  const navigator = useNavigate()

  useRequest(() => getCurrentAccount(), {
    ready: true,
    refreshDeps: [],
    onSuccess: (res: any) => {
      getDelegationAction.run(res.address)
      getRewardsAction.run(res.address)
      getKycInfoAction.run(res.address)
    }
  })

  const getDelegationAction = useRequest(getDelegationAmount, {
    manual: true,
    onSuccess: (res: any) => {
      const {delegation_response = {}} = res ?? {}
      setDelegationInfo(() => delegation_response ?? {})
    }
  })

  const getRewardsAction = useRequest(getRewardByAddress, {
    manual: true,
    onSuccess: (res: any) => {
      const {rewards = []} = res ?? {}

      setRewards(() => rewards[0] ?? {})
    }
  })

  const getKycInfoAction = useRequest(getKycInfo, {
    manual: true,
    onSuccess: () => setIsKyc(true)
  })

  const {run, loading} = useRequest(sendMsgUnStake, {
    manual: true,
    onSuccess: (res: any) => {
      if (res.code === 0) {
        message.success('Unstake success!')
        return navigator('/unStakeResult', {state: {hash: res.transactionHash, type: 'flexible'}})
      } else {
        message.error('Unstake failed')
      }
    }
  })

  return <Layout title={'Unstake'}>
    <div className={styles.row}>
      <p className={styles.subject}>YOU STAKE</p>
      <p className={styles.value}>{formatCountByDenom(delegationInfo.balance?.denom || '', delegationInfo.balance?.amount || '0').amount}
        <span>{formatCountByDenom(delegationInfo.balance?.denom || '', delegationInfo.balance?.amount || '0').denom}</span>
      </p>
    </div>
    <div className={styles.row}>
      <p className={styles.subject}>Staking Rewards Earned</p>
      <p className={styles.value}>{formatCountByDenom(rewards.denom || '', rewards.amount || '0').amount}
        <span>{formatCountByDenom(rewards.denom || '', rewards.amount || '0').denom}</span>
      </p>
    </div>
    <div className={styles.row}>
      <p className={styles.subject}>Total unstaked {define.COIN}</p>
      <p className={styles.value}>{formatCountByDenom(delegationInfo.balance?.denom || '', delegationInfo.balance?.amount || '0').amount}
        <span>{formatCountByDenom(delegationInfo.balance?.denom || '', delegationInfo.balance?.amount || '0').denom}</span>
      </p>
    </div>
    <div className={styles.amount}>
      <InputNumber value={amount} onChange={(number: any) => setAmount(number)} min={'0'} max={formatCountByDenom(delegationInfo.balance?.denom || '', delegationInfo.balance?.amount || '0').amount}/>
    </div>
    <Button loading={loading} className={styles.unStake} onClick={() => {
      run({amount, validatorAddress: delegationInfo.delegation?.validator_address, isKyc})
    }}>Unstake Now</Button>
  </Layout>
}

export default UnStakeFlexible
