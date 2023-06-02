import Layout from "@/popup/components/layout";
import {Button, Input, message} from "antd";
import styles from './index.less'
import {useState} from "react";
import {useRequest} from "ahooks";
import {addAccount, connect} from "@/api";
import {useNavigate} from "react-router";

const PrivateKey = () => {
  const navigator = useNavigate()
  const [privateKey, setPrivateKey] = useState<string>('')

  const {run, loading} = useRequest(addAccount, {
    manual: true,
    onSuccess: async () => {
      message.success('success', 2)
      await connect()
      navigator('/main/home')
    },
    onError: (error: any) => {
      // console.log(error)
      message.error(error.msg)
    }
  })

  return (
      <Layout title={'Import private key'}>
        <p className={styles.subject}>Access an existing wallet with your private key</p>
        <Input.Password className={styles.password} value={privateKey}
                        onChange={(e: any) => setPrivateKey(e.target.value)} placeholder={'Enter private key here'}/>
        <Button loading={loading} className={styles.submit} onClick={() => {
          let _priv = privateKey
          if (!/^0x/.test(_priv)) {
            _priv = `0x${privateKey}`
          }
          run({priv: _priv})
        }}>Submit</Button>
      </Layout>
  )
}

export default PrivateKey
