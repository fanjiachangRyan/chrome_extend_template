import styles from './index.less'
import {useState} from "react";
import {useRequest} from "ahooks";
import {getCurrentAccount} from "@/api";
import {RightOutlined} from '@ant-design/icons'
import moment from "moment";
import {useNavigate} from "react-router";
import {cutStr} from "@/api/utils";
import {getTransInfo} from "@/popup/pages/main/activitys/api";
import success from '@/assets/images/success.png'
import failed from '@/assets/images/failed.png'

const Activitys = () => {
  const [transactions, setTransactions] = useState<any[]>([])
  const [currentAccount, setCurrentAccount] = useState<any>([])
  const [currentPage, setCurrentPage] = useState<number>(1)
  const navigator = useNavigate()
  useRequest(() => getCurrentAccount(), {
    ready: true,
    refreshDeps: [],
    onSuccess: (res: any) => {
      setCurrentAccount(() => res ?? {})
    }
  })
  useRequest(() => getTransInfo(currentAccount.address, currentPage), {
    ready: !!currentAccount.address,
    refreshDeps: [currentAccount.address, currentPage],
    onSuccess: (res: any) => {
      setTransactions(() => res ?? [])
    }
  })

  return (
      <div className={styles.activity}>
        {
          transactions.map((item: any) => {
            const {transInfo = {}} = item
            const time = transInfo.tx_response?.timestamp ? moment(transInfo.tx_response?.timestamp).format('YYYY-MM-DD hh:mm:ss') : ''

            return (
                <div className={styles.item} key={item.transaction_hash} onClick={() => {
                  navigator('/transactionDetail', {state: {hash: item.transaction_hash}})
                }}>
                  <img className={styles.item_status} src={transInfo.tx_response?.code === 0  ? success : failed} alt=""/>
                  <div className={styles.item_detail}>
                    <p className={styles.item_detail_title}>{`To ${cutStr(item.value?.to_address || '') || ''}`}</p>
                    <p className={styles.item_detail_time}>{time}</p>
                  </div>
                  <RightOutlined
                      className={styles.item_arrow}
                  />
                </div>
            )
          })
        }
      </div>
  )
}

export default Activitys
