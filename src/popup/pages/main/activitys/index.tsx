import styles from './index.less'
import {useState} from "react";
import {useRequest} from "ahooks";
import {getCurrentAccount, getTransMessageByAccount} from "@/api";
import {RightOutlined} from '@ant-design/icons'
import moment from "moment";
import {useNavigate} from "react-router";
import {dealType} from "@/api/utils";
import success from '@/assets/images/success.png'
import failed from '@/assets/images/failed.png'
import {message, Pagination} from "antd";

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

  useRequest(() => getTransMessageByAccount(currentAccount.address, current), {
    ready: !!currentAccount.address,
    refreshDeps: [currentAccount.address, current],
    onSuccess: (res: any) => {
      if (res.code !== 200) {
        return message.error(res.msg)
      }

      setTotal(res.amount)

      setTransactions(() => res?.data ?? [])
    }
  })

  return (
      <div className={styles.activity}>
        {
          transactions.map((item: any) => {
            const type = dealType(item.type)
            const timeOffset = new Date().getTimezoneOffset()
            const endTimeStamp = moment(item.timestamp).utcOffset(-timeOffset)
            const time =  moment(endTimeStamp).format('YYYY-MM-DD hh:mm:ss')

            return (
                <div className={styles.item} key={item.transaction_hash} onClick={() => {
                  navigator('/transactionDetail', {state: {hash: item.transaction_hash, isList: true}})
                }}>
                  <img className={styles.item_status} src={item.success ? success : failed}
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
