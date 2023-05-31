import styles from './index.less'
import {LeftOutlined} from '@ant-design/icons'
import {Button} from "antd";
import {useNavigate} from "react-router";
import {storage} from "@/api/utils";

interface NavigatorProps {
  title?: string,
  onBack?: () => void
}

const Navigator = (props: NavigatorProps) => {
  const navigator = useNavigate()
  return (
      <div className={styles.navigator}>
        <Button type={"link"} className={styles.navigator_back} onClick={() => {
          props.onBack?.()
          navigator(-1)
        }}>
          <LeftOutlined/>
        </Button>
        <p className={styles.navigator_text}>{props.title}</p>
      </div>
  )
}

export default Navigator
