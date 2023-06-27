import styles from '../index.less'
import {Tooltip} from "antd";
import {cutStr, formatCountByDenom, math} from "@/api/utils";

const MsgDoFixedWithDraw = ({detail = {}}: any) => {
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
          <p>Settled Reward</p>
          <span>{formatCountByDenom(detail.settled_reward.denom, detail.settled_reward.amount).amount} MEC</span>
        </div>
      </>
  )
}

export default MsgDoFixedWithDraw
