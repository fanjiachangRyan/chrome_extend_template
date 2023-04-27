import styles from './index.less'
import {Button, message} from "antd";
import {useNavigate} from "react-router";

const Home = () => {
    const navigate = useNavigate()

    return <div className={styles.home}>
        <Button onClick={() => message.info('hello world!')}>hello world!</Button>
        <Button onClick={() => {
            navigate('/account', {state: {name: '123'}})
        }}>
            navigation to Account page
        </Button>
        <Button onClick={() => {
           const a = document.createElement('a')
            a.href = '/options.html'
            a.innerHTML = '跳转'
            a.click()
        }}>
            open tab options
        </Button>
    </div>
}
export default Home
