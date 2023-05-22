import styles from './index.less'
import Navigator from "@/popup/components/navigator";

interface LayoutProps {
  children: any;
  visibleBack?: boolean;
  title?: string,
  onBack?: () => void
}

const Layout = ({children, visibleBack = false, title = '', onBack}: LayoutProps) => {
  return (
      <div className={styles.layout}>
        {!visibleBack && <Navigator title={title} onBack={() => onBack?.()}/>}
        <div className={styles.layout_container}>
          {children}
        </div>
      </div>
  )
}

export default Layout
