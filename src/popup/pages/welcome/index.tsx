import styles from './index.less'
import {Button} from "antd";
import {MediumOutlined} from '@ant-design/icons'
import {useNavigate} from "react-router";
import Layout from "@/popup/components/layout";
import {ADD_WALLET_TYPE} from "@/popup/define";
import {useEffect} from "react";
import {storage} from "@/api/utils";
import {ClientAddrType, RequestAddrList} from "@/config/define";
import {setUrl} from "@/api";

const Welcome = (props: any) => {
  const navigator = useNavigate()

  useEffect(() => {
    storage.get(['clientAddrType']).then(({clientAddrType = ClientAddrType.Test}: any) => {
      const url = RequestAddrList[clientAddrType]

      setUrl(url)
    })
  }, [])

  return (
      <Layout visibleBack>
        <div className={styles.logo}>
          <MediumOutlined/>
        </div>
        <p className={styles.welcome}>Welcome to ME</p>
        <div className={styles.buttons}>
          <Button
              className={styles.buttons_create}
              onClick={() => navigator(`/createPassword`, {state: {type: ADD_WALLET_TYPE.CREATE_WALLET}})}
          >
            Create New Wallet
          </Button>
          <Button
              className={styles.buttons_import}
              type={"link"}
              onClick={() => navigator(`/createPassword`, {state: {type: ADD_WALLET_TYPE.IMPORT_WALLET}})}
          >
            Import Wallet
          </Button>
        </div>
      </Layout>
  )
}

export default Welcome
