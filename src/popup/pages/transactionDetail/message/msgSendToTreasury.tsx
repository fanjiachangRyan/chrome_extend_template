import styles from '../index.less'
import {Tooltip} from "antd";
import {cutStr} from "@/api/utils";

const MsgSendToTreasury = ({detail = {}}: any) => {
  return (
      <>
        <div className={styles.transInfo_item}>
          <p>From Address</p>
          <Tooltip title={detail.from_address || ' '}>
            <span>{cutStr(detail.from_address || ' ')}</span>
          </Tooltip>
        </div>
      </>
  )
}

export default MsgSendToTreasury
