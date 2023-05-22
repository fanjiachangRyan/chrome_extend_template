import Layout from "@/popup/components/layout";
import Steps from "@/popup/components/steps";
import styles from './index.less'
import {useState} from "react";
import {useRequest} from "ahooks";
import {ME} from "@/api";
import {Button} from "antd";
import {useNavigate} from "react-router";

const Mnemonic = () => {
  const navigator = useNavigate()
  const [showMnemonic, setShowMnemonic] = useState<boolean>(false)
  const [mnemonic, setMnemonic] = useState<string[]>([])


  useRequest(() => ME(), {
    ready: true,
    onSuccess: (me) => {
      const _mnemonic: any = me.getRandomMnemonic(128)?.split(' ') ?? []

      setMnemonic(() => [..._mnemonic])
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
              !showMnemonic && (
                  <div className={styles.mnemonics_mask} onClick={() => setShowMnemonic(true)}>
                    <p className={styles.mnemonics_mask_title}>Click to reveal phrase</p>
                    <p className={styles.mnemonics_tips}>Make sure that nobody can see your screen</p>
                  </div>
              )
          }
          <div className={styles.mnemonics_wrap}>
            {
              mnemonic.map((item: any, index: number) => (
                  <div className={styles.mnemonics_wrap_item} key={item}>
                    {index + 1}. {item}
                  </div>
              ))
            }
          </div>
        </div>

        <Button className={styles.confirm}
                onClick={() => navigator('/inputMnemonic')}>Continue</Button>
      </Layout>
  )
}

export default Mnemonic
