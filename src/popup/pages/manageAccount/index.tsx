import styles from './index.less'
import Layout from "@/popup/components/layout";
import {useState} from "react";
import {Form, Input} from "antd";
import {useRequest} from "ahooks";
import {getCurrentAccount} from "@/api";

const ManageAccount = () => {
  const [currentAccount, setCurrentAccount] = useState<any>({})

  useRequest(() => getCurrentAccount(), {
    ready: true,
    refreshDeps: [],
    onSuccess: (res: any) => {
      setCurrentAccount(() => res ?? {})
    }
  })

  return (
      <Layout title={'Manage Account'}>
        <div className={styles.form}>
          <p className={styles.form_label}>Private Key</p>
          <Input.Password className={styles.password} value={currentAccount.privKeyString}/>
          <p className={styles.form_label}>Public Key</p>
          <Input.Password className={styles.password} value={currentAccount.pubKeyAnyString}/>
        </div>
      </Layout>
  )
}

export default ManageAccount
