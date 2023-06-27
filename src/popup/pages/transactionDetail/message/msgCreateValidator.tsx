import styles from '../index.less'
import {Tooltip} from "antd";
import {cutStr} from "@/api/utils";

const MsgCreateValidator = ({detail = {}}: any) => {
  return (
      <>
        <div className={styles.transInfo_item}>
          <p>Validator Address</p>
          <Tooltip title={detail.validator_address || ' '}>
            <span>{cutStr(detail.validator_address || ' ')}</span>
          </Tooltip>
        </div>
        <div className={styles.transInfo_item}>
          <p>Staker Address</p>
          <Tooltip title={detail.staker_address || ' '}>
            <span>{cutStr(detail.staker_address || ' ')}</span>
          </Tooltip>
        </div>
      </>
  )
}

export default MsgCreateValidator
