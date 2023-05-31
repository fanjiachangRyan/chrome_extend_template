import Layout from "@/popup/components/layout";
import {useLocation} from "react-router-dom";
import {useRequest} from "ahooks";
import {getTransInfoByHash} from "@/api";
import styles from './index.less'
import success from '@/assets/images/success.png'
import failed from '@/assets/images/failed.png'
import {useState} from "react";
import {cutStr, dealType, formatCountByDenom} from "@/api/utils";
import {Tooltip} from "antd";

const TransactionDetail = () => {
  const {state = {}} = useLocation()
  const hash = state.hash
  const [transInfo, setTransInfo] = useState<any>({})

  useRequest(() => getTransInfoByHash(hash), {
    ready: !!hash,
    refreshDeps: [hash],
    onSuccess: (res: any) => {
      setTransInfo(() => res ?? {})
    }
  })

  return (
      <Layout title={'Transaction Detail'}>
        <div className={styles.result}>
          <img src={transInfo.tx_response?.code === 0 ? success: failed}/>
        </div>
        <div className={styles.transInfo}>
          <div className={styles.transInfo_amount}>
            <span>{dealType(transInfo?.tx?.body?.messages?.[0]?.['@type'])}</span>
            <p>{transInfo?.tx?.body?.messages?.[0]?.amount?.[0]?.amount ? `${formatCountByDenom(transInfo?.tx?.body?.messages?.[0]?.amount?.[0]?.denom ?? 'mec', transInfo?.tx?.body?.messages?.[0]?.amount?.[0]?.amount).amount} ${formatCountByDenom(transInfo?.tx?.body?.messages?.[0]?.amount?.[0]?.denom ?? 'mec', transInfo?.tx?.body?.messages?.[0]?.amount?.[0]?.amount).denom}` : ' '}</p>
          </div>
          <div className={styles.transInfo_item}>
            <p>From</p>
            <Tooltip title={transInfo?.tx?.body?.messages?.[0]?.from_address|| ' '}>
              <span>{cutStr(transInfo?.tx?.body?.messages?.[0]?.from_address|| ' ')}</span>
            </Tooltip>
          </div>
          <div className={styles.transInfo_item}>
            <p>To</p>
            <Tooltip title={transInfo?.tx?.body?.messages?.[0]?.to_address || ' '}>
              <span>{cutStr(transInfo?.tx?.body?.messages?.[0]?.to_address || ' ')}</span>
            </Tooltip>
          </div>
          <div className={styles.transInfo_item}>
            <p>Gas Fees</p>
            <span>{formatCountByDenom(transInfo?.tx?.auth_info?.fee?.amount?.[0]?.denom, transInfo?.tx?.auth_info?.fee?.amount?.[0]?.amount).amount} {formatCountByDenom(transInfo?.tx?.auth_info?.fee?.amount?.[0]?.denom, transInfo?.tx?.auth_info?.fee?.amount?.[0]?.amount).denom}</span>
          </div>
        </div>
      </Layout>
  )
}

export default TransactionDetail
