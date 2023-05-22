import styles from './index.less'
import Steps from "@/popup/components/steps";
import {Button} from "antd";
import {useNavigate} from "react-router";
import Layout from "@/popup/components/layout";
import {ADD_WALLET_TYPE} from "@/popup/define";

const ImportWalletType = () => {
    const navigator = useNavigate()

    return (
        <Layout>
            <div className={styles.steps}>
                <Steps current={2}/>
            </div>
            <div className={styles.buttons}>
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

export default ImportWalletType
