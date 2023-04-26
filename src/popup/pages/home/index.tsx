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

    </div>
}
export default Home
