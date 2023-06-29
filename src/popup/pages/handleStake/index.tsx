import styles from './index.less'
import Layout from "@/popup/components/layout";
import {useLocation} from "react-router-dom";
import {useRequest} from "ahooks";
import {getCurrentAccount, getDelegationAmount, getFixDepositDetail, getRewardByAddress} from "@/api";
import {useState} from "react";
import {formatCountByDenom} from "@/api/utils";
import {Button, message} from "antd";
import moment from "moment/moment";
import define from "@/popup/define";
import {useNavigate} from "react-router";
import {sendMsgUnDeposit} from "./api";
import useGetFee from "@/popup/hooks/getFee";

const HandleStake = () => {
  const {state = {}} = useLocation()
  const stakeId = state.stakeId || ''
  const type = state.type || ''
  const isKyc = state.isKyc
  const title = state.title
  const [fixedInfo, setFixedInfo] = useState<any>({})
  const [time, setTime] = useState<string>('')
  const [delegationInfo, setDelegationInfo] = useState<any>({})
  const [rewards, setRewards] = useState<any>({})
  const navigator = useNavigate()
  const {gas} = useGetFee()

  useRequest(() => getCurrentAccount(), {
    ready: true,
    refreshDeps: [],
    onSuccess: (res: any) => {
      if (type === 'fixed') {
        getFixedDetailAction.run({id: stakeId, address: res.address})
      } else {
        getDelegationAction.run(res.address)
        getRewardsAction.run(res.address)
      }
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

  const getFixedDetailAction = useRequest(getFixDepositDetail, {
    manual: true,
    onSuccess: (res: any) => {
      const {FixedDeposit = {}} = res
      setFixedInfo(() => FixedDeposit ?? {})

      const timeOffset = new Date().getTimezoneOffset()
      const endTimeStamp = moment(FixedDeposit.end_time).utcOffset(-timeOffset)
      const current = moment(new Date())
      const long = endTimeStamp.diff(current, 'second')
      const day = parseInt(`${long / (60 * 60 * 24)}`)
      const hour = parseInt(`${long % (60 * 60 * 24) / 3600}`)
      let times = ''

      if (long > 0) {
        if (day > 0 || hour > 0) {
          times = `in ${day > 0 ? `${day} days` : ''} ${hour > 0 ? `${hour} hours` : ''}`
        } else {
          times = `in 1 hours`
        }
      }

      setTime(() => times)
    }
  })

  const {loading, run} = useRequest(sendMsgUnDeposit, {
    manual: true,
    onSuccess: (res: any) => {
      if (res.code === 0) {
        message.success('Unstake success!')
        return navigator('/transactionDetail', {state: {hash: res.transactionHash, type: 'fixed'}})
      } else {
        message.error('Unstake failed')
      }
    }
  })

  return (
      <Layout title={type === 'flexible' ? title : 'Unstake MEC'}>
        <div className={styles.item}>
          {(type === 'fixed') && (
              <>
                {!!time && <div className={styles.row}>
                  <p className={styles.subject}>Current Epoch Ends</p>
                  <p className={styles.time}>{time}</p>
                </div>}
                <div className={styles.row}>
                  <p className={styles.subject}>YOU STAKE</p>
                  <p className={styles.value}>{formatCountByDenom(fixedInfo.principal?.denom || '', fixedInfo.principal?.amount || '0').amount}
                    <span>{formatCountByDenom(fixedInfo.principal?.denom || '', fixedInfo.principal?.amount || '0').denom}</span>
                  </p>
                </div>
                <div className={styles.row}>
                  <p className={styles.subject}>Staking Rewards Earned</p>
                  <p className={styles.value}>{formatCountByDenom(fixedInfo.interest?.denom || '', fixedInfo.interest?.amount || '0').amount}
                    <span>{formatCountByDenom(fixedInfo.interest?.denom || '', fixedInfo.interest?.amount || '0').denom}</span>
                  </p>
                </div>
                <div className={styles.row}>
                  <p className={styles.subject}>Total unstaked {define.COIN}</p>
                  <p className={styles.value}>{formatCountByDenom(fixedInfo.principal?.denom || '', fixedInfo.principal?.amount || '0').amount}
                    <span>{formatCountByDenom(fixedInfo.principal?.denom || '', fixedInfo.principal?.amount || '0').denom}</span>
                  </p>
                </div>
              </>
          )}
          {(type === 'flexible') && (
              <>
                <div className={styles.row}>
                  <p className={styles.subject}>YOU STAKE</p>
                  <p className={styles.value}>{formatCountByDenom(delegationInfo.balance?.denom || '', (isKyc ? `${Number(delegationInfo.delegation?.amount) + Number(delegationInfo?.delegation?.unmovable)}` : delegationInfo.delegation?.unKycAmount) || '0').amount}
                    <span>MEC</span>
                  </p>
                </div>
                <div className={styles.row}>
                  <p className={styles.subject}>Staking Rewards Earned</p>
                  <p className={styles.value}>{formatCountByDenom(rewards.denom || '', rewards.amount || '0').amount}
                    <span>MEC</span>
                  </p>
                </div>
                <div className={styles.row}>
                  <p className={styles.subject}>Total unstaked {define.COIN}</p>
                  <p className={styles.value}>{formatCountByDenom(delegationInfo.balance?.denom || '', `${(isKyc ? delegationInfo.delegation?.amount : delegationInfo.delegation?.unKycAmount)}` || '0').amount}
                    <span>MEC</span>
                  </p>
                </div>
              </>
          )}
        </div>
        <div className={styles.buttons}>
          {
              (type === 'flexible') &&
            <Button className={styles.unStake} style={{width: '45%'}} onClick={() => {
              navigator('/getReward', {state: {isKyc}})
            }}>Get Reward</Button>
          }
          <Button loading={loading} className={styles.unStake} style={{width: type === 'flexible' ? '45%' : '100%'}}
                  onClick={() => {
                    if (type === 'flexible') {
                      return navigator('/unStakeFlexible', {state: {isKyc}})
                    }
                    run({id: stakeId, gas})
                  }}>Unstake Now</Button>
        </div>
      </Layout>
  )
}

export default HandleStake
