import styles from './index.less'
import Layout from "@/popup/components/layout";
import {useRequest} from "ahooks";
import {
  getBalanceByAddress,
  getCurrentAccount,
  getDelegateRate,
  getDelegationAmount,
} from "@/api";
import {useState} from "react";
import {formatCountByDenom} from "@/api/utils";
import {Button, InputNumber, message} from "antd";
import {gas_fee} from "@/config/define";
import {sendMsgStake} from "./api";
import {useNavigate} from "react-router";


const StakeFlexible = () => {
  const [balance, setBalance] = useState<any>({})
  const [amount, setAmount] = useState<any>('')
  const [flexibleRate, setFlexibleRate] = useState<number>(0)
  const [delegationInfo, setDelegationInfo] = useState<any>({})
  const navigator = useNavigate()

  useRequest(() => getCurrentAccount(), {
    ready: true,
    refreshDeps: [],
    onSuccess: (res: any) => {
      getBalancesAction.run(res.address)
      getDelegationAction.run(res.address)
    }
  })

  const getBalancesAction = useRequest(getBalanceByAddress, {
    manual: true,
    onSuccess: (res: any) => {
      const {balances = []} = res
      const _coins: any[] = balances.map((item: any) => formatCountByDenom(item.denom, item.amount))
      const mec = _coins.find((item: any) => item.denom === 'MEC') ?? {}

      setBalance(() => mec)
    }
  })

  useRequest(() => getDelegateRate(), {
    ready: true,
    refreshDeps: [],
    onSuccess: (res: any) => {
      const {data = 0} = res ?? {}

      setFlexibleRate(data.toFixed(2))
    }
  })

  const getDelegationAction = useRequest(getDelegationAmount, {
    manual: true,
    onSuccess: (res: any) => {
      const {delegation_response = {}} = res ?? {}
      setDelegationInfo(() => delegation_response ?? {})
    }
  })

  const {run, loading} = useRequest(sendMsgStake, {
    manual: true,
    onSuccess: (res: any) => {
      if (res.code === 0) {
        message.success('Stake success!')
        return navigator('/stakeResult', {state: {hash: res.transactionHash, type: 'flexible'}})
      } else {
        message.error('Stake failed')
      }
    }
  })

  return (
      <Layout title={'Stake'}>
        <div className={styles.item}>
          <div className={styles.row}>
            <p className={styles.subject}>Staking APY</p>
            <p className={styles.value}>{`${flexibleRate || 0}%`}</p>
          </div>
          <div className={styles.row}>
            <p className={styles.subject}>Total Staked</p>
            <p className={styles.value}>
              {formatCountByDenom(delegationInfo.balance?.denom || '', delegationInfo.balance?.amount || '0').amount}
              <span>{formatCountByDenom(delegationInfo.balance?.denom || '', delegationInfo.balance?.amount || '0').denom}</span>
            </p>
          </div>
          <div className={styles.row}>
            <p className={styles.subject}>Your Staked MEC</p>
            <p className={styles.value}>
              {formatCountByDenom(delegationInfo.balance?.denom || '', delegationInfo.balance?.amount || '0').amount}
              <span>{formatCountByDenom(delegationInfo.balance?.denom || '', delegationInfo.balance?.amount || '0').denom}</span>
            </p>
          </div>
        </div>
        <p className={styles.stakeTitle}>ENTER RECIPIENT ADDRESS</p>
        <p className={styles.stakeDesc}>Available - {balance.amount} <span>{balance.denom}</span></p>
        <div className={styles.item}>
          <div className={styles.input}>
            <InputNumber value={amount} onChange={(val: any) => setAmount(val)} max={balance.amount || '0'} min={'0'}/>
          </div>
          <p className={styles.inputDesc}>Awarded Staking Rewards upon expiration</p>
          <p className={styles.gasFees}>Gas
            Fees: {formatCountByDenom('umec', `${gas_fee}`).amount} {formatCountByDenom('umec', `${gas_fee}`).denom}</p>
        </div>
        <p className={styles.stakeTitle}>ENTER RECIPIENT ADDRESS</p>
        <p className={styles.stakeRewardsDesc}>
          The staked MEC starts earning reward at the end of the Epoch in which it was staked. The rewards will become
          available at the end of one full Epoch of staking.
        </p>
        <Button loading={loading} className={styles.stakeButton} onClick={() => {
          run({
            amount,
            feeAmount: gas_fee,
            validatorAddress: delegationInfo.delegation?.validator_address
          })
        }}>Stake Now</Button>
      </Layout>
  )
}

export default StakeFlexible
