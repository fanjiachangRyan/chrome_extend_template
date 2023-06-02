import Layout from "@/popup/components/layout";
import styles from './index.less'
import {CheckCircleFilled} from "@ant-design/icons";
import {message} from "antd";
import {ClientAddrInfoList, getClientAddrType, setClientAddrType} from "@/config/define";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router";


const NetType = () => {
  const navigator = useNavigate()
  const [netType, setNetType] = useState<number>(0)

  useEffect(() => {
    getClientAddrType().then((res: number) => setNetType(res))
  }, [])

  return (
      <Layout title={'Network'}>
        {
          ClientAddrInfoList.map((netItem: any) => (
              <div
                  className={styles.accountItem}
                  key={netItem.value}
                  onClick={async () => {
                    await setClientAddrType(netItem.value)
                    message.success('Success!')

                    navigator(-1)
                  }}>
                <div
                    className={styles.accountItem_info}
                >
                  <p className={styles.accountItem_info_name}>{netItem.subject}</p>
                </div>
                <div className={styles.accountItem_status}>
                  {(netType === netItem.value) ? <CheckCircleFilled/> : ''}
                </div>
              </div>
          ))
        }
      </Layout>
  )
}

export default NetType
