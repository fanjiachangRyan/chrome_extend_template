import styles from './index.less'
import {useNavigate} from "react-router";
import {
  getCurrentAccount,
  getDelegationAmount,
  getFixedDeposit,
  getKycInfo,
  getRegionInfo,
  getRewardByAddress
} from "@/api";
import {useRequest} from "ahooks";
import {useState} from "react";
import Layout from "@/popup/components/layout";
import {formatCountByDenom} from "@/api/utils";
import app from '@/assets/images/app.png'
import moment from "moment";

const renderStake = () => {

}

const Stake = () => {
  const navigator = useNavigate()
  const [fixedDepositList, setFixedDepositList] = useState<any[]>([])
  const [delegation, setDelegation] = useState<any>({})
  const [rewards, setRewards] = useState<any>({denom: 'MEC', amount: '0'})
  const [fixDeposit, setDeposit] = useState<number>(0)
  const [regionInfo, setRegionInfo] = useState<any>({})
  useRequest(() => getCurrentAccount(), {
    ready: true,
    refreshDeps: [],
    onSuccess: (res: any) => {
      getFixedList.run(res.address)
      getDelegation.run(res.address)
      getRewardAction.run(res.address)
      getKycInfoAction.run(res.address)
    }
  })

  const getRewardAction = useRequest(getRewardByAddress, {
    manual: true,
    onSuccess: (res: any) => {
      const {rewards = []} = res
      const _reward: any = rewards[0] ?? {}
      const rs = formatCountByDenom(_reward.denom, rewards.amount || '0') ?? {denom: 'MEC', amount: '0'}

      setRewards(() => rs ?? {})
    }
  })

  const getKycInfoAction = useRequest(getKycInfo, {
    manual: true,
    onSuccess: (res: any) => {
      const {kyc = {}} = res

      getRegionInfoAction.run(kyc.regionId)
    }
  })

  const getRegionInfoAction = useRequest(getRegionInfo, {
    manual: true,
    onSuccess: (res: any) => {
      setRegionInfo(() => res?.region ?? {})
    }
  })

  const getFixedList = useRequest(getFixedDeposit, {
    manual: true,
    onSuccess: (res: any) => {
      const {FixedDeposit = []} = res
      setFixedDepositList(() => FixedDeposit ?? [])
      const _fix = FixedDeposit.reduce((prev: number, item: any) => {
        prev = prev + (item.principal?.amount || 0) * 1

        return prev
      }, 0)

      setDeposit(() => _fix)
    }
  })

  const getDelegation = useRequest(getDelegationAmount, {
    manual: true,
    onSuccess: (res: any) => {
      const {delegation_response = {}} = res ?? {}
      setDelegation(() => delegation_response)
    }
  })

  return (
      <Layout title={'Stake & Earn MEC'}>
        <div className={styles.stake}>
          <div className={styles.stakingTotal}>
            <p className={styles.staking_subject}>STAKING ON META COUNTRY VALIDATOR</p>
            <div className={styles.staking_detail}>
              <div className={styles.staking_detail_title}>
                <span>YOUR STAKE</span>
                <span>EARNED</span>
              </div>
              <div className={styles.staking_detail_count}>
                <span>{
                  formatCountByDenom('umec', `${(delegation?.balance?.amount || '0') * 1 + fixDeposit}`).amount && formatCountByDenom('umec', `${(delegation?.balance?.amount || '0') * 1 + fixDeposit}`).amount != 0
                      ? `${formatCountByDenom('umec', `${(delegation?.balance?.amount || '0') * 1 + fixDeposit}`).amount} ${formatCountByDenom('umec', `${(delegation?.balance?.amount || '0') * 1 + fixDeposit}`).denom}`
                      : '0'
                }</span>
                <span>{formatCountByDenom(rewards.denom, rewards.amount || '0').amount} MEC</span>
              </div>
            </div>
          </div>
          <div className={styles.staking} onClick={() => navigator('/stakeDetail', {state: {type: 'flexible', isKyc: false}})}>
            <div className={styles.staking_fixedDetail} style={{borderBottom: "none"}}>
              <div className={styles.staking_fixedDetail_info}>
                <img src={app} alt=""/>
                <div className={styles.staking_fixedDetail_info_detail}>
                  <p className={styles.staking_fixedDetail_info_detail_name}>Pool Staking</p>
                  <p className={styles.staking_fixedDetail_info_detail_desc}>Starts Earning</p>
                </div>
              </div>
              <div className={styles.staking_fixedDetail_count}>
                <p className={styles.staking_fixedDetail_count_long}>
                  {formatCountByDenom(delegation?.balance?.denom, delegation?.delegation?.unKycAmount || '0').amount} <span>MEC</span>
                </p>
              </div>
            </div>
          </div>
          {
            (delegation.delegation?.unmovable == '1000000') && <div className={styles.staking} onClick={() => navigator('/stakeDetail', {state: {type: 'flexible', isKyc: true}})}>
              <div className={styles.staking_fixedDetail} style={{borderBottom: "none"}}>
                <div className={styles.staking_fixedDetail_info}>
                  <img src={app} alt=""/>
                  <div className={styles.staking_fixedDetail_info_detail}>
                    <p className={styles.staking_fixedDetail_info_detail_name}>{regionInfo.name} Staking</p>
                    <p className={styles.staking_fixedDetail_info_detail_desc}>Period Staking APY M</p>
                  </div>
                </div>
                <div className={styles.staking_fixedDetail_count}>
                  <p className={styles.staking_fixedDetail_count_long}>
                    {formatCountByDenom(delegation?.balance?.denom, delegation?.delegation?.amount || '0').amount} <span>MEC</span>
                  </p>
                </div>
              </div>
            </div>
          }
          {
            fixedDepositList.map((item: any) => {
              const {end_time} = item
              const principal = formatCountByDenom(item.principal.denom, item.principal.amount) ?? {}
              const interest = formatCountByDenom(item.interest.denom, item.interest.amount)
              const endTimeStamp = moment(end_time).unix()
              const current = moment(new Date()).unix()
              const long = current - endTimeStamp
              const day = parseInt(`${long / (60 * 60 * 24)}`)
              const hour = parseInt(`${long % (60 * 60 * 24) / 3600}`)
              const min = parseInt(`${long % 60}`)
              const times = long > 0 ? `in ${day > 0 ? `${day} days` : ''} ${hour > 0 ? `${hour} hours` : ''} ${min > 0 ? `${min} mins` : ''}` : ''

              return (
                  <div className={styles.staking} key={item.id}
                       onClick={() => navigator('/stakeDetail', {state: {stakeId: item.id, type: 'fixed'}})}>
                    <div className={styles.staking_fixedDetail}>
                      <div className={styles.staking_fixedDetail_info}>
                        <img src={app} alt=""/>
                        <div className={styles.staking_fixedDetail_info_detail}>
                          <p className={styles.staking_fixedDetail_info_detail_name}>{regionInfo.name} Staking</p>
                          <p className={styles.staking_fixedDetail_info_detail_desc}>Staking Earning</p>
                        </div>
                      </div>
                      <div className={styles.staking_fixedDetail_count}>
                        <p className={styles.staking_fixedDetail_count_long}>{principal.amount} {principal.denom}</p>
                        <p className={styles.staking_fixedDetail_count_amount}>{interest.amount} {interest.denom}</p>
                      </div>
                    </div>
                    <div className={styles.staking_fixedTime}>
                      <span>{times}</span>
                      {(long <= 0) && <div className={styles.staking_fixedTime_dot}/>}
                    </div>
                  </div>
              )
            })
          }
        </div>
      </Layout>
  )
}

export default Stake
