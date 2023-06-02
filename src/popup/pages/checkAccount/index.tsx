import styles from './index.less'
import {MediumOutlined} from '@ant-design/icons'
import {useNavigate} from "react-router";
import Layout from "@/popup/components/layout";
import {EXISTLOCALACCOUNT} from "@/popup/define";
import {useRequest} from "ahooks";
import {checkAccount} from "./utils";
import {Spin} from 'antd';
import {LoadingOutlined} from '@ant-design/icons'
import logo from '@/assets/images/app.png'

const antIcon = <LoadingOutlined style={{fontSize: 50, color: '#e75353'}} spin/>;

const CheckAccount = () => {
  const navigator = useNavigate()


  useRequest(() => checkAccount(), {
    ready: true,
    onSuccess: (res: any) => navigator(res.type === EXISTLOCALACCOUNT.EXIST ? '/unlock' : '/welcome')
  })

  return (
      <Layout visibleBack>
        <div className={styles.logo}>
          <img src={logo} alt=""/>
        </div>
        <div className={styles.spin}>
          <Spin indicator={antIcon}/>
        </div>
      </Layout>
  )
}

export default CheckAccount
