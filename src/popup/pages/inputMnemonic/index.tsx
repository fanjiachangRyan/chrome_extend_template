import Layout from "@/popup/components/layout";
import Steps from "@/popup/components/steps";
import styles from './index.less'
import {useState} from "react";
import {useRequest} from "ahooks";
import {addAccount, connect, ME} from "@/api";
import {Button, Input, message} from "antd";
import {useNavigate} from "react-router";

const Prefix = ({number = 1}: any) => (
    <p style={{width: 15}}>{number}.</p>
)
const tempArr = new Array(12).fill('')

const Mnemonic = () => {
  const navigator = useNavigate()
  const [mnemonic, setMnemonic] = useState<string[]>(tempArr)

  const {run, loading} = useRequest(addAccount, {
    manual: true,
    onSuccess:async (account: any) => {
      if (!account?.address) {
        return message.error('create error!')
      }

      await connect()
      message.success('success', 2)

      navigator('/main/home')
    },
    onError: (error: any) => {
      message.error(error?.message ?? 'add account error')
    }
  })

  return (
      <Layout>
        <div className={styles.steps}>
          <Steps current={2}/>
        </div>
        <p className={styles.subject}>Secret recovery phrase</p>
        <p className={styles.description}>This 12-word phrase allows you to recover your wallet and access to the coin
          inside.</p>
        <div className={styles.mnemonics}>
          {
            mnemonic.map((item: any, index: number) => (
                <Input
                    className={styles.mnemonics_item}
                    key={index}
                    prefix={<Prefix number={index + 1}/>}
                    value={item}
                    onChange={(e: any) => {
                      setMnemonic((prev: any[]) => {
                        prev[index] = e.target.value

                        return [...prev]
                      })
                    }}
                />
            ))
          }
        </div>

        <Button loading={loading} className={styles.confirm} onClick={() => {
            const _mnemonic = mnemonic.join(' ')

            run({mnemonic: _mnemonic})
        }}>Continue</Button>
      </Layout>
  )
}

export default Mnemonic
