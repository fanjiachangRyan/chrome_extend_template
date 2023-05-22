import styles from './index.less'
import {LoadingOutlined} from "@ant-design/icons";
import {Spin} from "antd";

const antIcon = <LoadingOutlined style={{fontSize: 50, color: '#e75353'}} spin/>;


const LoadingView = () => {

  return (
      <div className={styles.loadingView}>
        <Spin indicator={antIcon}/>
      </div>
  )
}

export default LoadingView
