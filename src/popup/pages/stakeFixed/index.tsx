import styles from './index.less'
import Layout from "@/popup/components/layout";
import {useRequest} from "ahooks";
import {
  getBalanceByAddress,
  getCurrentAccount,
  getDepositAnnualRateList,
  getFixedDeposit
} from "@/api";
import {useState} from "react";
import {formatCountByDenom} from "@/api/utils";
import {Button, InputNumber, message, Select} from "antd";
import {gas_fee, gas_price} from "@/config/define";
import {sendMsgFixed} from "@/popup/pages/stakeFixed/api";
import {useNavigate} from "react-router";
import useGetFee from "@/popup/hooks/getFee";

const StakeFixed = () => {
  const [maxRate, setMaxRate] = useState<string>('0%')
  const [fixedAmount, setFixAmount] = useState<any>({})
  const [balance, setBalance] = useState<any>({})
  const [amount, setAmount] = useState<string>('')
  const [rateList, setRateList] = useState<any>({})
  const [currentRate, setCurrentRate] = useState<string>('')
  const navigator = useNavigate()
  const {gas} = useGetFee()

  useRequest(() => getCurrentAccount(), {
    ready: true,
    refreshDeps: [],
    onSuccess: (res: any) => {
      getFixedDetailAction.run(res.address)
      getBalancesAction.run(res.address)
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

  useRequest(() => getDepositAnnualRateList(), {
    ready: true,
    refreshDeps: [],
    onSuccess: (res: any) => {
      const {FixedDepositAnnualRate = {}}: any = res ?? {}
      setRateList(() => FixedDepositAnnualRate)

      const values = Object.values(FixedDepositAnnualRate) ?? []

      const _values = values.map((item: any) => item * 1)

      const maxVal = _values.reduce((prev: number, item: any) => item > prev ? item : prev, 0)

      setMaxRate(() => `${maxVal * 100}%`)
    }
  })

  const {run, loading} = useRequest(sendMsgFixed, {
    manual: true,
    onSuccess: (res: any) => {
      if (res.code === 0) {
        message.success('Stake success!')
        return navigator('/transactionDetail', {state: {hash: res.transactionHash, type: 'fixed'}})
      } else {
        message.error('Stake failed')
      }
    }
  })

  return (
      <Layout title={'Stake'}>
        <div className={styles.item}>
          <p className={styles.header}>
            Treasury
          </p>
          <div className={styles.row}>
            <p className={styles.subject}>Period Staking APY MAX</p>
            <p className={styles.value}>{maxRate}</p>
          </div>
          <div className={styles.row}>
            <p className={styles.subject}>Total Staked</p>
            <p className={styles.value}>
              {fixedAmount.amount}
              <span>MEC</span>
            </p>
          </div>
        </div>
        <p className={styles.stakeTitle}>STAKING REWARDS</p>
        <p className={styles.stakeDesc}>Available - {balance.amount} <span>{balance.denom}</span></p>
        <div className={styles.item}>
          <div className={styles.input}>
            <InputNumber controls={false} value={amount} precision={6} onChange={(val: any) => setAmount(val)} max={balance.amount || '0'} min={'0.01'}/>
          </div>
          <p className={styles.inputDesc}>Staking Rewards Start in 24 hours</p>
          <p className={styles.gasFees}>Gas
            Fees: {formatCountByDenom('umec', `${gas * gas_price}`).amount} MEC</p>
          <p className={styles.selectSubject}>APR</p>
          <Select
              className={styles.rateSelect}
              value={currentRate}
              onChange={(value: any) => {
                setCurrentRate(value)
              }}
              options={Object.keys(rateList).map((key: string) => {
                const month = key.split('_')[1]

                return {label: `${month}months - ${rateList[key] * 100}%`, value: key, key}

              })}
          >
            {/*{*/}
            {/*  Object.keys(rateList).map((key: string) => {*/}
            {/*    const month = key.split('_')[1]*/}

            {/*    return (*/}
            {/*        <Select.Option title={`${month}months - ${rateList[key] * 100}%`} key={key}  value={key} >*/}
            {/*          {`${month} months-${rateList[key] * 100}%`}*/}
            {/*        </Select.Option>*/}
            {/*    )*/}
            {/*  })*/}
            {/*}*/}
          </Select>
        </div>
        <p className={styles.stakeTitle}>STAKING REWARDS</p>
        <p className={styles.stakeRewardsDesc}>
          The staked MEC starts earning reward at the end of the Epoch in which it was staked. The rewards will become available at the end of one full Epoch of staking.
        </p>
        <Button loading={loading} className={styles.stakeButton} onClick={() => {
          if (!amount || !currentRate) return message.warning('Amount & APR can not be empty!')
          run({amount, month: currentRate, gas})
        }}>Stake Now</Button>
      </Layout>
  )
}

export default StakeFixed
