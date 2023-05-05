import styles from './index.less'
import {Button, message} from "antd";
import {useNavigate} from "react-router";
import {useEffect} from "react";

const Home = () => {

    useEffect(() => {
        if (chrome?.runtime) {
            chrome.runtime.connect()
        }
    }, [])
    // const navigate = useNavigate()
    return <div className={styles.home}>
        <Button onClick={async () => {
            const tabs = await chrome.tabs.query({active: true, currentWindow: true})
            tabs.forEach((tab: any) => {
                chrome.tabs.sendMessage(tab.id, {key: 'connect', account: '铁柱'}, (res: any) => {
                    console.log('receive:::>', res)
                })
            })
        }}>
            open tab options
        </Button>
    </div>
}
export default Home
