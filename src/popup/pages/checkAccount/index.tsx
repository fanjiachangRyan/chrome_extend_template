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
import {storage} from "@/api/utils";
import moment from "moment";
import {useEffect} from "react";
import {ClientAddrType, RequestAddrList} from "@/config/define";
import {setUrl} from "@/api";

const antIcon = <LoadingOutlined style={{fontSize: 50, color: '#e75353'}} spin/>;

const CheckAccount = () => {
  const navigator = useNavigate()

  useRequest(() => checkAccount(), {
    ready: true,
    onSuccess: async (res: any) => {
      if (res.type === EXISTLOCALACCOUNT.NOTEXIST) {
        await storage.set({lockTime: moment(new Date()).unix()})

        return navigator('/welcome')
      }

      const {lockTime = ''} = await storage.get(['lockTime'])
      const current = moment(new Date()).unix()

      console.log(current, (lockTime + 60 * 15))
      if (current >= (lockTime + 60 * 15)) {
        return navigator('/unlock')
      }

      return navigator('/main/home')
    }
  })

  useEffect(() => {
    storage.get(['clientAddrType']).then(({clientAddrType = ClientAddrType.Test}: any) => {
      const url = RequestAddrList[clientAddrType]

      setUrl(url)
    })
  }, [])

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
