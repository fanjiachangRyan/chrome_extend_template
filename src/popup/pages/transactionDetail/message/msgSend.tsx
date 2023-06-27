import styles from '../index.less'
import {Tooltip} from "antd";
import {cutStr} from "@/api/utils";

const MsgSend = ({detail = {}}: any) => {
  return (
      <>
        <div className={styles.transInfo_item}>
          <p>From</p>
          <Tooltip title={detail.from_address || ' '}>
            <span>{cutStr(detail.from_address || ' ')}</span>
          </Tooltip>
        </div>
        <div className={styles.transInfo_item}>
          <p>To</p>
          <Tooltip title={detail.to_address || ' '}>
            <span>{cutStr(detail.to_address || ' ')}</span>
          </Tooltip>
        </div>
      </>
  )
}

export default MsgSend
