import Layout from "@/popup/components/layout";
import {useLocation} from "react-router-dom";
import {useRequest} from "ahooks";
import {getCurrentAccount, getTransDetailAfterTrans, getTransDetailByHash} from "@/api";
import styles from './index.less'
import success from '@/assets/images/success.png'
import failed from '@/assets/images/failed.png'
import {useState} from "react";
import {dealType, formatCountByDenom} from "@/api/utils";
import {message} from "antd";
import Message from "@/popup/pages/transactionDetail/message";

const TransactionDetail = () => {
  const {state = {}} = useLocation()
  const hash = state.hash
  const isList = state.isList
  const [transInfo, setTransInfo] = useState<any>({})
  const getCurrentAccountAction = useRequest(() =>getCurrentAccount(), {
    ready: true,
    refreshDeps: [],
    onSuccess: (res: any) => {
      if (isList) {
        run(res.address, hash)
      } else {
        getTransDetailByHashAfterTrans.run(res.address, hash)
      }
    }
  })

  const getTransDetailByHashAfterTrans = useRequest(getTransDetailAfterTrans, {
    manual: true,
    onSuccess: (res: any) => {
      if (res.code !== 200) {
        return message.error(res.msg)
      }

      setTransInfo(() => res.data)
    }
  })

  const {loading, run} = useRequest(getTransDetailByHash, {
    manual: true,
    onSuccess: (res: any) => {
      if (res.code !== 200) {
        return message.error(res.msg)
      }

      setTransInfo(() => res.data)
    }
  })

  return (
      <Layout title={'Transaction Detail'} loading={loading || getCurrentAccountAction.loading || getTransDetailByHashAfterTrans.loading}>
        <div className={styles.result}>
          <img src={transInfo.success ? success : failed}/>
        </div>
        <div className={styles.transInfo}>
          <div className={styles.transInfo_amount}>
            <span>{dealType(transInfo?.type)}</span>
            <p>{transInfo.amount ? `${formatCountByDenom(transInfo.amount?.denom, transInfo.amount.amount).amount} MEC` : ''}</p>
          </div>
          <Message type={transInfo.type ?? ''} detail={transInfo.extends ?? {}}/>
          <div className={styles.transInfo_item}>
            <p>Gas Fees</p>
            <span>{formatCountByDenom(transInfo?.fee?.amount?.[0]?.denom, transInfo?.fee?.amount?.[0]?.amount).amount} MEC</span>
          </div>
        </div>
      </Layout>
  )
}

export default TransactionDetail
