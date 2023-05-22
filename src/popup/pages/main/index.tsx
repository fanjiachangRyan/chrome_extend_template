import styles from './index.less'
import {Button} from "antd";
import {useNavigate} from "react-router";
import {useState} from "react";
import Layout from "@/popup/components/layout";
import {getCurrentAccount} from "@/api";
import {useRequest} from "ahooks";
import {
  MediumOutlined,
  AppstoreOutlined,
  HomeOutlined,
  CreditCardOutlined,
  AppstoreAddOutlined,
  PicCenterOutlined
} from "@ant-design/icons";
import {cutStr} from "@/api/utils";
import {useLocation, Outlet} from 'react-router'

const routes: any[] = [
  {
    icon: <HomeOutlined/>,
    title: 'Coins',
    path: '/main/home'
  }, {
    icon: <CreditCardOutlined/>,
    title: 'Library',
    path: '/main/library'
  }, {
    icon: <AppstoreAddOutlined/>,
    title: 'Apps',
    path: '/main/apps'
  }, {
    icon: <PicCenterOutlined/>,
    title: 'Activitys',
    path: '/main/activitys'
  },
]

const Main = () => {
  const [currentAccount, setCurrentAccount] = useState<any>({address: ''})
  const location: any = useLocation()
  const {pathname = ''} = location
  const navigator = useNavigate()

  useRequest(() => getCurrentAccount(), {
    ready: true,
    refreshDeps: [],
    onSuccess: (res: any) => {
      console.log('res==>', res)
      setCurrentAccount(() => res)
    }
  })

  return (
      <Layout visibleBack>
        <div className={styles.body}>
          <div className={styles.body_header}>
            <div className={styles.body_header_logo}>
              <MediumOutlined style={{color: 'white', fontSize: 30}}/>
              <div className={styles.body_header_logo_info}>
                <p>{currentAccount.accountName}</p>
                <p>{cutStr(currentAccount.address)}</p>
              </div>
            </div>
            <Button style={{margin: '4px 0'}} type={"link"}><AppstoreOutlined style={{fontSize: 25, color: 'rgb(231, 83, 83)'}} onClick={() => navigator('/setting')}/></Button>
          </div>
          <div className={styles.body_container}>
            <Outlet />
          </div>
          <div className={styles.body_tabs}>
            {
              routes.map((route: any) => (
                  <div
                      key={route.title}
                      className={[styles.body_tabs_item, pathname.indexOf(route.path) > -1 ? styles.body_tabs_currentItem : ''].join(' ')}
                      onClick={() => {
                        navigator(route.path)
                      }}
                  >
                    {route.icon}
                    <p>{route.title}</p>
                  </div>
              ))
            }
          </div>
        </div>
      </Layout>
  )
}
export default Main
