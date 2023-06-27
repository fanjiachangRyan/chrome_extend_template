import styles from '../index.less'
import {Tooltip} from "antd";
import {cutStr, math} from "@/api/utils";

const MsgSetFixedDepositInterestRate = ({detail = {}}: any) => {
  return (
      <>
        <div className={styles.transInfo_item}>
          <p>Admin</p>
          <Tooltip title={detail.admin || ' '}>
            <span>{cutStr(detail.admin || ' ')}</span>
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

export default MsgSetFixedDepositInterestRate
