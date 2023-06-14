import styles from './index.less'
import Layout from "@/popup/components/layout";
import {useState} from "react";
import {useRequest} from "ahooks";
import {
  getCurrentAccount,
  getDelegateRate,
  getDelegationAmount,
  getDepositAnnualRateList,
  getFixedDeposit,
  getKycInfo,
  getRegionInfo,
} from "@/api";
import {formatCountByDenom} from "@/api/utils";
import {useNavigate} from "react-router";
import {Button} from "antd";

const SelectStake = () => {
  const [fixedAmount, setFixAmount] = useState<any>({})
  const [delegationInfo, setDelegationInfo] = useState<any>({})
  const [regionInfo, setRegionInfo] = useState<any>({})
  const [isKyc, setIsKyc] = useState<boolean>(false)
  const [flexibleRate, setFlexibleRate] = useState<number>(0)
  const [maxRate, setMaxRate] = useState<string>('0%')
  const navigator = useNavigate()

  const {loading} = useRequest(() => getCurrentAccount(), {
    ready: true,
    refreshDeps: [],
    onSuccess: (res: any) => {
      getDelegationAction.run(res.address)
    }
  })

  const getKycInfoAction = useRequest(getKycInfo, {
    manual: true,
    onSuccess: (res: any) => {
      const {kyc = {}} = res ?? {}

      getRegionInfoAction.run(kyc.regionId)
    }
  })

  const getRegionInfoAction = useRequest(getRegionInfo, {
    manual: true,
    onSuccess: (res: any) => {
      setRegionInfo(() => res?.region ?? {})
    }
  })

  const getDelegationAction = useRequest(getDelegationAmount, {
    manual: true,
    onSuccess: (res: any) => {
      const {delegation_response = {}} = res ?? {}
      const {delegation = {}} = delegation_response
      if (delegation.unmovable === '1000000') {
        setIsKyc(true)
        getFixedDetailAction.run(delegation.delegator_address)
        getKycInfoAction.run(delegation.delegator_address)
      }
      setDelegationInfo(() => delegation_response ?? {})
    }
  })

  const getFixedDetailAction = useRequest(getFixedDeposit, {
    manual: true,
    onSuccess: (res: any) => {
      const {FixedDeposit = []} = res ?? {}
      const amount: any = FixedDeposit.reduce((prev: number, item: any) => {
        prev += (item.principal?.amount || 0) * 1

        return prev
      }, 0)

      const total = formatCountByDenom('umec', `${amount || '0'}`)
      setFixAmount(() => total ?? {})
    }
  })

  const getDelegateRateAction = useRequest(() => getDelegateRate(), {
    ready: true,
    refreshDeps: [],
    onSuccess: (res: any) => {
      const {data = 0} = res ?? {}

      setFlexibleRate(data.toFixed(2))
    }
  })

  const getDepositAnnualRateListAction = useRequest(() => getDepositAnnualRateList(), {
    ready: true,
    refreshDeps: [],
    onSuccess: (res: any) => {
      const {FixedDepositAnnualRate = {}}: any = res ?? {}

      const values = Object.values(FixedDepositAnnualRate) ?? []

      const _values = values.map((item: any) => item * 1)

      const maxVal = _values.reduce((prev: number, item: any) => item > prev ? item : prev, 0)

      setMaxRate(() => `${maxVal * 100}%`)
    }
  })

  return (
      <Layout title={'Select Stake'}
              loading={getDepositAnnualRateListAction.loading || getDelegateRateAction.loading || getFixedDetailAction.loading || getRegionInfoAction.loading || loading || getKycInfoAction.loading}>
        <div className={styles.item} onClick={() => navigator('/stakeFlexible')}>
          <p className={styles.header}>
            {isKyc ? regionInfo.name : 'Staking'}
          </p>
          <div className={styles.row}>
            <p className={styles.subject}>Staking APY</p>
            <p className={styles.value}>{`${flexibleRate || 0}%`}</p>
          </div>
          <div className={styles.row}>
            <p className={styles.subject}>Total Staked</p>
            <p className={styles.value}>
              {formatCountByDenom(delegationInfo.balance?.denom || '', delegationInfo.balance?.amount || '0').amount}
              <span>MEC</span>
            </p>
          </div>
        </div>
        {isKyc && (
            <div className={styles.item} onClick={() => navigator('/stakeFixed')}>
              <p className={styles.header}>
                Treasury
              </p>
              <div className={styles.row}>
                <p className={styles.subject}>Staking APY</p>
                <p className={styles.value}>{maxRate}</p>
              </div>
              <div className={styles.row}>
                <p className={styles.subject}>Total Staked</p>
                <p className={styles.value}>
                  {fixedAmount.amount}
                  <span>{fixedAmount.denom}</span>
                </p>
              </div>
            </div>
        )}
        <Button className={styles.stakeButton} onClick={() => navigator('/stakeList')}>Stake & Earn</Button>
      </Layout>
  )
}

export default SelectStake
