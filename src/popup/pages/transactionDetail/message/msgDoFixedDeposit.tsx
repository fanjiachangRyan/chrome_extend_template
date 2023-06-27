import styles from '../index.less'
import {Tooltip} from "antd";
import {cutStr, math} from "@/api/utils";

const MsgDoDepositFixed = ({detail = {}}: any) => {
  return (
      <>
        <div className={styles.transInfo_item}>
          <p>Account</p>
          <Tooltip title={detail.account || ' '}>
            <span>{cutStr(detail.account || ' ')}</span>
          </Tooltip>
        </div>
        <div className={styles.transInfo_item}>
          <p>Treasury Address</p>
          <Tooltip title={detail.treasury_address || ' '}>
            <span>{cutStr(detail.treasury_address || ' ')}</span>
          </Tooltip>
        </div>
        <div className={styles.transInfo_item}>
          <p>Term</p>
          <span>{detail.term}</span>
        </div>
        <div className={styles.transInfo_item}>
          <p>Rate</p>
          <span>{math.multiply(detail.rate, 100)}%</span>
        </div>
      </>
  )
}

export default MsgDoDepositFixed
