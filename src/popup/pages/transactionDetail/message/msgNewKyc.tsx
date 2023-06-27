import styles from '../index.less'
import {Tooltip} from "antd";
import {cutStr} from "@/api/utils";

const MsgNewKyc = ({detail = {}}: any) => {
  return (
      <>
        <div className={styles.transInfo_item}>
          <p>Creator</p>
          <Tooltip title={detail.creator || ' '}>
            <span>{cutStr(detail.creator || ' ')}</span>
          </Tooltip>
        </div>
        <div className={styles.transInfo_item}>
          <p>Account</p>
          <Tooltip title={detail.account || ' '}>
            <span>{cutStr(detail.account || ' ')}</span>
          </Tooltip>
        </div>
        <div className={styles.transInfo_item}>
          <p>Region</p>
          <span>{['TWN', "HKG", "MAC"].includes(detail.region_name) ? `${detail.region_name}(CHN)`: detail.region_name}</span>
        </div>
        <div className={styles.transInfo_item}>
          <p>RegionId</p>
          <span>{detail.regionId}</span>
        </div>
      </>
  )
}

export default MsgNewKyc
