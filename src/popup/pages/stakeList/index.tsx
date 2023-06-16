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
import {formatCountByDenom, math} from "@/api/utils";
import app from '@/assets/images/app.png'
import moment from "moment";


const Stake = () => {
  const navigator = useNavigate()
  const [fixedDepositList, setFixedDepositList] = useState<any[]>([])
  const [delegation, setDelegation] = useState<any>({})
  const [rewards, setRewards] = useState<any>('0')
  const [depositRewards, setDepositRewards] = useState<any>('0')
  const [fixDeposit, setDeposit] = useState<number>(0)
  const [regionInfo, setRegionInfo] = useState<any>({})
  const {loading} = useRequest(() => getCurrentAccount(), {
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
      const rs = _reward.amount ?? '0'

      setRewards(rs)
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
        prev = prev + (item.principal?.amount ?? '0') * 1

        return prev
      }, 0)

      const _rewards = FixedDeposit.reduce((prev: number, item: any) => {
        prev = prev + (item.interest?.amount ?? '0') * 1

        return prev
      }, 0)

      setDepositRewards(`${_rewards}`)

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
      <Layout title={'Stake & Earn MEC'}
              loading={getDelegation.loading || getFixedList.loading || getRegionInfoAction.loading || getKycInfoAction.loading || getRewardAction.loading || loading}>
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
                <span>{formatCountByDenom('umec', `${rewards * 1 + (depositRewards * 1)}`).amount} MEC</span>
              </div>
            </div>
          </div>
          {(delegation?.delegation?.unKycAmount != '0' || delegation?.delegation?.unmovable !== '1000000') && (
              <div className={styles.staking} onClick={() => navigator('/handleStake', {
                state: {
                  type: 'flexible',
                  isKyc: false,
                  title: 'Pool Staking'
                }
              })}>
                <div className={styles.staking_fixedDetail}>
                  <div className={styles.staking_fixedDetail_info}>
                    <img src={app} alt=""/>
                    <div className={styles.staking_fixedDetail_info_detail}>
                      <p className={styles.staking_fixedDetail_info_detail_name}>Pool Staking</p>
                      <p className={styles.staking_fixedDetail_info_detail_desc}>Starts Earning</p>
                    </div>
                  </div>
                  <div className={styles.staking_fixedDetail_count}>
                    <p className={styles.staking_fixedDetail_count_long}>
                      {formatCountByDenom(delegation?.balance?.denom, delegation?.delegation?.unKycAmount || '0').amount}
                      <span>MEC</span>
                    </p>
                  </div>
                </div>
              </div>
          )}
          {
              (delegation.delegation?.unmovable == '1000000') && <div className={styles.staking}
                                                                      onClick={() => navigator('/handleStake', {
                                                                        state: {
                                                                          type: 'flexible',
                                                                          isKyc: true,
                                                                          title: `${regionInfo.name || ''} Staking`
                                                                        }
                                                                      })}>
              <div className={styles.staking_fixedDetail}>
                <div className={styles.staking_fixedDetail_info}>
                  <img src={app} alt=""/>
                  <div className={styles.staking_fixedDetail_info_detail}>
                    <p className={styles.staking_fixedDetail_info_detail_name}>{regionInfo.name} Staking</p>
                    <p className={styles.staking_fixedDetail_info_detail_desc}>Starts Earning</p>
                  </div>
                </div>
                <div className={styles.staking_fixedDetail_count}>
                  <p className={styles.staking_fixedDetail_count_long}>
                    {/*{formatCountByDenom(delegation?.balance?.denom,   delegation?.delegation?.amount || '0').amount}*/}
                    {formatCountByDenom(delegation?.balance?.denom, math.add(delegation?.delegation?.amount, 1000000)).amount}
                    <span>MEC</span>
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
              const timeOffset = new Date().getTimezoneOffset()
              const endTimeStamp = moment(end_time).utcOffset(-timeOffset)
              const current = moment(new Date())


              const long = endTimeStamp.diff(current, 'second')

              const day = parseInt(`${long / (60 * 60 * 24)}`)
              const hour = parseInt(`${long % (60 * 60 * 24) / 3600}`)
              let times = ''

              if (long > 0) {
                if (day > 0 || hour > 0) {
                  times = `in ${day > 0 ? `${day} days` : ''} ${hour > 0 ? `${hour} hours` : ''}`
                } else {
                  times = `in 1 hour`
                }
              }

              return (
                  <div className={styles.staking} key={item.id}
                       onClick={() => navigator('/handleStake', {state: {stakeId: item.id, type: 'fixed'}})}>
                    <div className={styles.staking_fixedDetail}>
                      <div className={styles.staking_fixedDetail_info}>
                        <img src={app} alt=""/>
                        <div className={styles.staking_fixedDetail_info_detail}>
                          <p className={styles.staking_fixedDetail_info_detail_name}>Period Staking</p>
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
