import styles from './index.less'
import Navigator from "@/popup/components/navigator";
import {Spin} from "antd";
import {LoadingOutlined} from "@ant-design/icons";

interface LayoutProps {
  children: any;
  visibleBack?: boolean;
  title?: string,
  onBack?: () => void,
  loading?: boolean
}

const antIcon = <LoadingOutlined style={{fontSize: 50, color: '#e75353'}} spin/>;

const Layout = ({children, visibleBack = false, title = '', onBack, loading = false}: LayoutProps) => {
  return (
      <div className={styles.layout}>
        {!visibleBack && <Navigator title={title} onBack={() => onBack?.()}/>}
        <div className={styles.layout_container}>
          {
            loading ? <div className={styles.spin}>
              <Spin indicator={antIcon}/>
            </div> : children
          }
        </div>
      </div>
  )
}

export default Layout
