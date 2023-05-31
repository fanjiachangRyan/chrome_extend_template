import styles from './index.less'
import Layout from "@/popup/components/layout";
import {MediumOutlined, RightOutlined, EditOutlined} from "@ant-design/icons";
import {useState} from "react";
import {useRequest} from "ahooks";
import {getCurrentAccount} from "@/api";
import {cutStr, storage} from "@/api/utils";
import {useNavigate} from "react-router";
import {Form, Input, message, Modal} from "antd";

const Account = () => {
  const navigator = useNavigate()
  const [currentAccount, setCurrentAccount] = useState<any>({address: ''})
  const [password, setPassword] = useState<string>('')
  const [form] = Form.useForm()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [handleType, setHandleType] = useState<string>('manage')

  useRequest(() => getCurrentAccount(), {
    ready: true,
    onSuccess: (res: any) => {
      if (!res?.address) return

      setCurrentAccount(() => ({...res}))
    }
  })

  return (
      <Layout title={'Accounts'}>
        <div className={styles.accountHeader}>
          <MediumOutlined style={{color: 'white', fontSize: 40}}/>
          <div className={styles.accountHeader_info}>
            <p className={styles.accountHeader_info_accountName}>{currentAccount.accountName}<EditOutlined
                style={{cursor: "pointer"}} onClick={() => navigator('/changeAccountName')}/></p>
            <p className={styles.accountHeader_info_accountAddress}>{cutStr(currentAccount.address)}</p>
          </div>
        </div>
        <div className={styles.accountItem} onClick={() => navigator('/switchAccount')}>
          <p>Switch Account</p>
          <RightOutlined/>
        </div>
        <div className={styles.accountItem} onClick={() => navigator('/changePassword')}>
          <p>Change Password</p>
          <RightOutlined/>
        </div>
        <div className={styles.accountItem} onClick={() => {
          setHandleType('manage')
          setIsOpen(true)
        }}>
          <p>Manage account</p>
          <div/>
        </div>
        <div className={styles.accountItem} onClick={() => {
          setHandleType('remove')
          setIsOpen(true)
        }}>
          <p>Remove account</p>
          <div/>
        </div>
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
              onFinish={async (values: any) => {
                if (handleType === 'manage') {
                  navigator('/manageAccount')
                  return
                }

                const {pw} = await storage.get(['pw'])

                if (values.password !== pw) {
                  return message.error('Password error!')
                }

                storage.get(['accountList']).then(async ({accountList = []}: any) => {
                  const idx = accountList.find(({address}: any) => address === currentAccount.address)
                  accountList.splice(idx, 1)
                  if (accountList.length) {
                    accountList[0].isActive = true
                    await storage.set({currentAccount: {...accountList[0]}})
                    setCurrentAccount(() => accountList[0])
                    await storage.set({accountList: [...accountList]})
                    message.success('Remove success!')
                    setIsOpen(false)
                    navigator('/main/home')
                    return
                  }

                  await storage.set({pw: ''})
                  await storage.set({currentAccount: {}})
                  await storage.set({accountList: []})

                  setIsOpen(false)
                  setPassword('')
                  navigator('/welcome')
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

export default Account
