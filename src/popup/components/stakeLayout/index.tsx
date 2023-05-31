import styles from './index.less'

interface StakeLayoutProps {
  title?: string,
  children?: any,
  footer?: any
}

const StakeLayout = (props: StakeLayoutProps) => {

  return (
      <div className={styles.stakeLayout}>
        {!!props.title && <p className={styles.stakeLayout_title}>{props.title}</p>}
        <div className={styles.stakeLayout_container}>
          {props.children}
        </div>
        {!!props.footer && (
            <div className={styles.stakeLayout_footer}>
              {props.footer}
            </div>
        )}
      </div>
  )
}

export default StakeLayout
