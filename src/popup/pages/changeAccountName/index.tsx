import styles from './index.less'
import Layout from "@/popup/components/layout";
import {useEffect, useState} from "react";
import {storage} from "@/api/utils";
import {Button, Input, message} from "antd";
import {useNavigate} from "react-router";
import {useRequest} from "ahooks";
import {getCurrentAccount} from "@/api";

const ChangeAccountName = () => {
  const [currentAccount, setCurrentAccount] = useState<any>({})
  const [accountName, setAccountName] = useState<string>('')
  const navigator = useNavigate()

  useRequest(() => getCurrentAccount(), {
    ready: true,
    refreshDeps: [],
    onSuccess: (res: any) => {
      setCurrentAccount(() => res)
    }
  })

  return (
      <Layout title={'Change Account Name'}>
        <div
            className={styles.accountName}
        >
          <Input
              value={accountName}
              placeholder={currentAccount.accountName || 'Please input new account name'}
              onChange={(e: any) => setAccountName(() => e.target.value)}
          />
        </div>
        <Button
            className={styles.submit}
            onClick={() => {
              if (!accountName) return message.warning('Account name cant not be empty!')

              storage.get(['accountList']).then(async ({accountList = []}: any) => {
                const accountIndex = accountList.findIndex(({address = ''}: any) => address === currentAccount.address)

                if (accountIndex > -1) {
                  await storage.set({currentAccount: {...accountList[accountIndex], accountName}})

                  const accountInfo = accountList[accountIndex] ?? {}

                  accountList[accountIndex] = {...accountInfo, accountName}
                  await storage.set({accountList: [...accountList]})
                  message.success('Modify account name success!')
                  navigator(-1)
                }
              })
            }}
        >
          Submit
        </Button>
      </Layout>
  )
}

export default ChangeAccountName
