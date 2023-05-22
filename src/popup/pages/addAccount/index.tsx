import styles from './index.less'
import Layout from "@/popup/components/layout";
import {Button} from "antd";
import {useNavigate} from "react-router";

const AddAccount = () => {
  const navigator = useNavigate()

  return (
      <Layout title={'Add Account'}>
        <div className={styles.buttons}>
          <Button className={styles.buttons_item} onClick={() => {
            navigator('/mnemonic')
          }}>Create New Wallet</Button>
          <Button className={styles.buttons_item} onClick={() => {
            navigator('/privateKey')
          }}>Import private key</Button>
          <Button className={styles.buttons_item} onClick={() => {
            navigator('/inputMnemonic')
          }}>Import mnemonic</Button>
        </div>
      </Layout>
  )
}

export default AddAccount
