import styles from '../index.less'
import {Tooltip} from "antd";
import {cutStr} from "@/api/utils";

const MsgDelegate = ({detail = {}}: any) => {
  return (
      <>
        <div className={styles.transInfo_item}>
          <p>Delegator Address</p>
          <Tooltip title={detail.delegator_address || ' '}>
            <span>{cutStr(detail.delegator_address || ' ')}</span>
          </Tooltip>
        </div>
        <div className={styles.transInfo_item}>
          <p>Validator Address</p>
          <Tooltip title={detail.validator_address || ' '}>
            <span>{cutStr(detail.validator_address || ' ')}</span>
          </Tooltip>
        </div>
      </>
  )
}

export default MsgDelegate
