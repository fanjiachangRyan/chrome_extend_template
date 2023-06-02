import styles from './index.less'
import {useState} from "react";
import {useRequest} from "ahooks";
import {getCurrentAccount} from "@/api";
import {RightOutlined} from '@ant-design/icons'
import moment from "moment";
import {useNavigate} from "react-router";
import {cutStr, dealType} from "@/api/utils";
import {getTransInfo} from "@/popup/pages/main/activitys/api";
import success from '@/assets/images/success.png'
import failed from '@/assets/images/failed.png'
import {Pagination} from "antd";

const Activitys = () => {
  const [transactions, setTransactions] = useState<any[]>([])
  const [currentAccount, setCurrentAccount] = useState<any>([])
  const navigator = useNavigate()
  const [total, setTotal] = useState<number>(0)
  const [current, setCurrent] = useState<number>(1)
  useRequest(() => getCurrentAccount(), {
    ready: true,
    refreshDeps: [],
    onSuccess: (res: any) => {
      setCurrentAccount(() => res ?? {})
    }
  })

  useRequest(() => getTransInfo(currentAccount.address, current), {
    ready: !!currentAccount.address,
    refreshDeps: [currentAccount.address, current],
    onSuccess: (res: any) => {
      const {amount = 0, list = []} = res ?? {}
      setTotal(amount)
      setTransactions(() => list ?? [])
    }
  })

  return (
      <div className={styles.activity}>
        {
          transactions.map((item: any) => {
            const {tx = {}, tx_response} = item
            const time = tx_response?.timestamp ? moment(tx_response.timestamp).format('YYYY-MM-DD hh:mm:ss') : ''
            const type = dealType(tx.body?.messages?.[0]?.['@type'])

            return (
                <div className={styles.item} key={tx_response.txhash} onClick={() => {
                  navigator('/transactionDetail', {state: {hash: tx_response.txhash}})
                }}>
                  <img className={styles.item_status} src={tx_response?.code === 0 ? success : failed}
                       alt=""/>
                  <div className={styles.item_detail}>
                    <p className={styles.item_detail_title}>{type}</p>
                    <p className={styles.item_detail_time}>{time}</p>
                  </div>
                  <RightOutlined
                      className={styles.item_arrow}
                  />
                </div>
            )
          })
        }
        {
         (total > 10) && <div className={styles.pagination}>
            <Pagination size={"small"} total={total} current={current} onChange={(page: number) => setCurrent(page)}/>
          </div>
        }
      </div>
  )
}

export default Activitys
