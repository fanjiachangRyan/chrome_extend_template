import styles from './index.less'
import Layout from "@/popup/components/layout";
import {useRequest} from "ahooks";
import {getAccountList} from "@/api";
import {useState} from "react";
import LoadingView from "@/popup/components/loadingView";
import {cutStr, storage} from "@/api/utils";
import {Button, Form, Input, message, Modal} from "antd";
import {useNavigate} from "react-router";
import {CheckCircleFilled} from '@ant-design/icons'

const SwitchAccount = () => {
  const [accountList, setAccountList] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [password, setPassword] = useState<string>('')
  const [selectAccount, setSelectAccount] = useState<any>({})
  const navigator = useNavigate()
  const [form] = Form.useForm()

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

                    setSelectAccount(() => ({...account}))
                    setIsOpen(true)
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
        <Modal
            wrapClassName={styles.modal}
            centered
            title={'Enter Password'}
            open={isOpen}
            onOk={() => form.submit()}
            onCancel={() => setIsOpen(false)}
        >
          <Form
              form={form}
              onFinish={(values: any) => {
                if (values.password !== selectAccount.pw) {
                  return message.error('Password error!')
                }

                storage.get(['accountList']).then(async ({accountList = []}) => {
                  const _newAccountList = accountList.map((account: any) => ({
                    address: account.address,
                    mnemonic: account.mnemonic,
                    mnemonicArr: account.mnemonicArr,
                    pw: account.pw,
                    accountName: account.accountName,
                    priv: account.priv,
                    isActive: account.address === selectAccount.address
                  }))

                  await storage.set({accountList: [..._newAccountList]})
                  await storage.set({currentAccount: _newAccountList.find(({isActive}: any) => isActive)})

                  setIsOpen(false)
                  navigator('/main/home')
                })
              }}
          >
            <Form.Item
                name={'password'}
                rules={[{
                  required: true, validator: (rule: any, value: any) => {
                    if (!value) return Promise.reject('Password can not be empty!')

                    return Promise.resolve()
                  }
                }]}
            >
              <Input.Password
                  className={styles.password}
                  placeholder={'Please enter the password'}
                  value={password}
                  onChange={(e: any) => setPassword(e.target.value)}
              />
            </Form.Item>
          </Form>
        </Modal>
      </Layout>
  )
}

export default SwitchAccount
