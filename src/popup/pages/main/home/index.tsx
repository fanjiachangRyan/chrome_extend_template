import styles from './index.less'
import {useState} from "react";
import {useRequest} from "ahooks";
import {getBalanceByAddress, getCurrentAccount} from "@/api";
import {formatCountByDenom} from "@/api/utils";
import scan from '@/assets/images/scan.png'
import send from '@/assets/images/send.png'
import stake from '@/assets/images/stake.png'
import {InboxOutlined} from '@ant-design/icons'
import delegate from '@/assets/images/scan.png'
import Define from "@/popup/define";
import LoadingView from "@/popup/components/loadingView";

const HomeSubject = ({subject = ''}: any) => <p className={styles.homeSubject}>{subject}</p>

const Home = () => {
  const [currentAccount, setCurrentAccount] = useState<any>({})
  const [coin, setCoin] = useState<Record<string, any>>({})
  const getCurrentAccountAction = useRequest(() => getCurrentAccount(), {
    ready: true,
    refreshDeps: [],
    onSuccess: (res: any) => {
      setCurrentAccount(() => res)
      getBalanceByAddressAction.run(res.address || '')
    }
  })


  const getBalanceByAddressAction = useRequest(getBalanceByAddress, {
    manual: true,
    onSuccess: (res: any) => {

      const {balances = []} = res

      const _coins: any[] = balances.map((item: any) => formatCountByDenom(item.denom, item.amount))
      console.log('_coins==>', _coins)
      const mec = _coins.find((item: any) => item.denom === 'MEC') ?? {}

      setCoin(() => ({...mec}))
      console.log('getBalanceByAddressAction==>', _coins)
    }
  })

  if (getCurrentAccountAction.loading || getBalanceByAddressAction.loading) {
    return (
        <div className={styles.home}>
          <LoadingView />
        </div>
    )
  }


  return (
      <div className={styles.home}>
        <div className={styles.coins}>
          <div className={styles.coins_count}>
            <p>{coin.amount}</p>
            <span>{coin.denom}</span>
          </div>
          <p className={styles.coins_description}>Net assets value</p>
        </div>
        <div className={styles.handle}>
          <div className={styles.handle_button}>
            <img src={scan} alt=""/>
            <p>Deposit</p>
          </div>
          <div className={styles.handle_button}>
            <img src={send} alt=""/>
            <p>Send</p>
          </div>
        </div>
        <HomeSubject subject={'MEC STAKE'}/>
        <div className={[styles.wrap, styles.stake].join(' ')}>
          <img src={stake} alt=""/>
          <div className={styles.stake_content}>
            <p className={styles.stake_content_title}>Stake & Earn</p>
            <p className={styles.stake_content_detail}>200% <span>MAX APY</span></p>
          </div>
        </div>
        <HomeSubject subject={'MY DELEGATE'}/>
        <div className={[styles.wrap, styles.delegate].join(' ')}>
          <div className={styles.delegate_coinName}>
            <InboxOutlined/>
            <p>{Define.COIN}</p>
          </div>
          <p className={styles.delegate_count}>
            <span>5.20</span>
            <span className={styles.delegate_count_coin}>{Define.COIN_NAME}</span>
          </p>
        </div>
      </div>
  )
}

export default Home
