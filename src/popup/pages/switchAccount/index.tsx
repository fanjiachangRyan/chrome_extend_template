import styles from './index.less'
import Layout from "@/popup/components/layout";
import {useRequest} from "ahooks";
import {getAccountList} from "@/api";
import {useState} from "react";
import LoadingView from "@/popup/components/loadingView";
import {cutStr, storage} from "@/api/utils";
import {Button, message} from "antd";
import {useNavigate} from "react-router";
import {CheckCircleFilled} from '@ant-design/icons'

const SwitchAccount = () => {
  const [accountList, setAccountList] = useState<any[]>([])
  const [selectAccount, setSelectAccount] = useState<any>({})
  const navigator = useNavigate()

  const {loading} = useRequest(() => getAccountList(), {
    ready: true,
    refreshDeps: [],
    onSuccess: (res: any) => {
      setAccountList(() => res ?? [])
    }
  })


  return (
      <Layout title={'Switch Account'}>
        {
          loading ? <LoadingView/> : accountList.map((account: any) => (
              <div
                  className={styles.accountItem}
                  key={account.address}
                  onClick={() => {
                    if (account.isActive) return

                    storage.get(['accountList']).then(async ({accountList = []}) => {
                      const _newAccountList = accountList.map((_account: any) => ({
                        address: _account.address,
                        mnemonic: _account.mnemonic,
                        mnemonicArr: _account.mnemonicArr,
                        pw: _account.pw,
                        accountName: _account.accountName,
                        priv: _account.priv,
                        isActive: _account.address === account.address
                      }))

                      await storage.set({accountList: [..._newAccountList]})
                      await storage.set({currentAccount: _newAccountList.find(({isActive}: any) => isActive)})

                      message.success('Switch successfully!')
                      navigator('/main/home')
                    })
                  }}>
                <div
                    className={styles.accountItem_info}
                >
                  <p className={styles.accountItem_info_name}>{account.accountName}</p>
                  <p className={styles.accountItem_info_address}>{cutStr(account.address)}</p>
                </div>
                <div className={styles.accountItem_status}>
                  {account.isActive ? <CheckCircleFilled/> : ''}
                </div>
              </div>
          ))
        }
        <Button
            className={styles.addAccount}
            onClick={() => navigator('/addAccount')}>
          Add Account
        </Button>
      </Layout>
  )
}

export default SwitchAccount
