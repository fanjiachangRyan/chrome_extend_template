import styles from './index.less'
import Layout from "@/popup/components/layout";
import {useState} from "react";
import {useRequest} from "ahooks";
import {getBalanceByAddress, getCurrentAccount} from "@/api";
import {formatCountByDenom} from "@/api/utils";
import {Button, Input, InputNumber, message} from "antd";
import {gas_fee, gas_price} from "@/config/define";
import {useNavigate} from "react-router";
import {msgSend} from "@/popup/pages/send/api";
import useGetFee from "@/popup/hooks/getFee";


const Send = () => {
  const [currentAccount, setCurrentAccount] = useState<any>({})
  const [available, setAvailable] = useState<string>('0')
  const [amount, setAmount] = useState<string>('0')
  const [toAddress, setToAddress] = useState<string>('')
  const navigator = useNavigate()
  const {gas} = useGetFee()

  useRequest(() => getBalanceByAddress(currentAccount.address), {
    ready: !!currentAccount.address,
    refreshDeps: [currentAccount.address],
    onSuccess: (res: any) => {
      const {balances = []} = res ?? {}
      const _balances = balances[0] ?? {}
      const amount = formatCountByDenom('umec', _balances.amount || '0')

      setAvailable(amount.amount || '0')
    }
  })

  useRequest(() => getCurrentAccount(), {
    ready: true,
    refreshDeps: [],
    onSuccess: (res: any) => {
      setCurrentAccount(() => res ?? {})
    }
  })

  const {loading, run} = useRequest(msgSend, {
    manual: true,
    onSuccess: (res: any) => {
      if (res?.code !== 0) {
        return message.error('send failed!')
      }

      message.success('send success')
      navigator('/transactionDetail', {state: {hash: res.transactionHash}})
    },
    onError: (error: any) => {
      message.error(error || '')
    }
  })

  return (
      <Layout>
        <p className={styles.subject}>Available</p>
        <p className={styles.available}>{available} <span>MEC</span></p>
        <p className={styles.subject}>Enter recipient address</p>
        <div className={styles.amount}>
          <Input value={toAddress} onChange={(e: any) => setToAddress(e.target.value)}/>

        </div>
        <p className={styles.subject}>Amount</p>
        <div className={styles.amount}>
          <InputNumber
              controls={false}
              value={amount}
              onChange={(number: any) => {
                setAmount(() => number)
              }}
              max={available}
              className={styles.addressInput}
              min={'0'}
          />
        </div>
        <p className={styles.fees}>fees: {((gas ?? 0) * gas_price / 1000000).toFixed(6)} <span>MEC</span></p>
        <Button
            loading={loading} className={styles.send}
            onClick={() => {
              run({amount, toAddress, memo: '', gas})
            }}>Send</Button>
      </Layout>
  )
}

export default Send
