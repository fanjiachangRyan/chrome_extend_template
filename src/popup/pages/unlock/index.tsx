import styles from './index.less'
import {Button, Input, message} from "antd";
import {MediumOutlined} from '@ant-design/icons'
import Layout from "@/popup/components/layout";
import {useState} from "react";
import {getPassword} from "@/api";
import {useNavigate} from "react-router";
import {useRequest} from "ahooks";

const Unlock = () => {
  const navigator = useNavigate()
  const [pw, setPw] = useState<string>('')

  const {run, loading} = useRequest(getPassword, {
    manual: true,
    onSuccess: (res: any) => {
      if (res !== pw) {
        message.error('The password is invalid', 3)
        return
      }

      message.success('unlock success!', 1)

      navigator('/main/home')
    },
    onError: (e: any) => {
      message.error(e)
    }
  })

  return (
      <Layout visibleBack>
        <div className={styles.logo}>
          <MediumOutlined/>
        </div>
        <p className={styles.welcome}>Welcome back</p>
        <div className={styles.input}>
          <div className={styles.input_label}>
            <p className={styles.input_label_subject}>Password</p>
            <p className={styles.input_label_reset} onClick={() => setPw('')}>Reset password</p>
          </div>
          <Input.Password className={styles.input_content} value={pw} onChange={(e: any) => setPw(e.target.value)}/>
          <Button loading={loading} className={styles.unlock} onClick={async () => run()}>Unlock</Button>
        </div>
      </Layout>
  )
}

export default Unlock
