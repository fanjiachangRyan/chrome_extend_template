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
import {cutStr, storage} from "@/api/utils";
import {Button} from "antd";
import {useNavigate} from "react-router";

const Setting = () => {
  const navigator = useNavigate()
  const [currentAccount, setCurrentAccount] = useState<any>({address: ''})

  useRequest(() => getCurrentAccount(), {
    ready: true,
    onSuccess: (res: any) => {
      setCurrentAccount(() => ({...(res ?? {})}))
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
            <ShareAltOutlined/>
            <p>Share</p>
          </div>
          <div className={styles.settingItem_go}>
            <span>{cutStr(currentAccount.address ?? '')}</span>
            <RightOutlined/>
          </div>
        </div>
        <div className={styles.settingItem}>
          <div className={styles.settingItem_itemName}>
            <FormatPainterOutlined/>
            <p>Network</p>
          </div>
          <div className={styles.settingItem_go}>
            <span>{cutStr(currentAccount.address ?? '')}</span>
            <RightOutlined/>
          </div>
        </div>
        <div className={styles.settingItem}>
          <div className={styles.settingItem_itemName}>
            <LockOutlined/>
            <p>Auto-lock</p>
          </div>
          <div className={styles.settingItem_go}>
            <span>{cutStr(currentAccount.address ?? '')}</span>
            <RightOutlined/>
          </div>
        </div>
        <div className={styles.settingItem}>
          <div className={styles.settingItem_itemName}>
            <GlobalOutlined/>
            <p>Language</p>
          </div>
          <div className={styles.settingItem_go}>
            <span>{cutStr(currentAccount.address ?? '')}</span>
            <RightOutlined/>
          </div>
        </div>
        <Button className={styles.lockButton} onClick={() => navigator('/unlock')}>Lock Wallet</Button>
        <Button className={styles.lockButton} onClick={async () => {
          await storage.remove('currentAccount')

          navigator('/welcome')
        }}>Logout</Button>
      </Layout>
  )
}

export default Setting
