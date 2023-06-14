import styles from './index.less'
import Layout from "@/popup/components/layout";
import {
  UserOutlined,
  RightOutlined,
  ShareAltOutlined,
  FormatPainterOutlined,
  LockOutlined,
  GlobalOutlined
} from '@ant-design/icons'
import {useState} from "react";
import {useRequest} from "ahooks";
import {getCurrentAccount} from "@/api";
import {cutStr, disconnect, storage} from "@/api/utils";
import {Button} from "antd";
import {useNavigate} from "react-router";
import {ClientAddrInfoList,  getClientAddrType} from "@/config/define";
import moment from "moment/moment";

const Setting = () => {
  const navigator = useNavigate()
  const [currentAccount, setCurrentAccount] = useState<any>({address: ''})
  const [netType, setNetType] = useState<string>('Dev')

  useRequest(() => getCurrentAccount(), {
    ready: true,
    onSuccess: (res: any) => {
      setCurrentAccount(() => ({...(res ?? {})}))
    }
  })

  useRequest(() => getClientAddrType(), {
    ready: true,
    refreshDeps: [],
    onSuccess: (res: any) => {
      console.log('getClientAddrType==>', res)
      const netObject = ClientAddrInfoList.find((item: any) => item.value == res) ?? {}
      setNetType(netObject.subject)
    }
  })

  return (
      <Layout title={'Wallet Settings'}>
        <div className={styles.settingItem}>
          <div className={styles.settingItem_itemName}>
            <UserOutlined/>
            <p>Accounts</p>
          </div>
          <div className={styles.settingItem_go} onClick={() => navigator('/account')}>
            <span>{cutStr(currentAccount.address ?? '')}</span>
            <RightOutlined/>
          </div>
        </div>
        <div className={styles.settingItem}>
          <div className={styles.settingItem_itemName}>
            <FormatPainterOutlined/>
            <p>Network</p>
          </div>
          <div className={styles.settingItem_go} onClick={() => navigator('/netType')}>
            <span>{netType}</span>
            <RightOutlined/>
          </div>
        </div>
        <div className={styles.settingItem}>
          <div className={styles.settingItem_itemName}>
            <GlobalOutlined/>
            <p>Language</p>
          </div>
          <div className={styles.settingItem_go}>
            {/*<span>{cutStr(currentAccount.address ?? '')}</span>*/}
            {/*<RightOutlined/>*/}
          </div>
        </div>
        <Button className={styles.lockButton} onClick={async () => {
          await disconnect()
          await storage.set({lockTime: moment(new Date()).unix() - 60 * 15 })
          navigator('/unlock')
        }}>Lock Wallet</Button>
      </Layout>
  )
}

export default Setting
