import styles from '../index.less'
import {Tooltip} from "antd";
import {cutStr, formatCountByDenom} from "@/api/utils";

const MsgUndelegate = ({detail = {}}: any) => {

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
        {
          !detail.is_kyc && <div className={styles.transInfo_item}>
            <p>Reward</p>
            <span>{formatCountByDenom(detail.rewards?.denom, detail.rewards?.amount).amount} MEC</span>
          </div>
        }
      </>
  )
}

export default MsgUndelegate
