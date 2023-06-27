import styles from '../index.less'
import {Tooltip} from "antd";
import {cutStr} from "@/api/utils";

const MsgNewRegion = ({detail = {}}: any) => {
  return (
      <>
        <div className={styles.transInfo_item}>
          <p>Creator</p>
          <Tooltip title={detail.creator || ' '}>
            <span>{cutStr(detail.creator || ' ')}</span>
          </Tooltip>
        </div>
        <div className={styles.transInfo_item}>
          <p>Region Name</p>
          <span>{['TWN', "HKG", "MAC"].includes(detail.name) ? `${detail.name}(CHN)`: detail.name}</span>
        </div>
        <div className={styles.transInfo_item}>
          <p>RegionId</p>
          <span>{detail.regionId}</span>
        </div>
      </>
  )
}

export default MsgNewRegion
