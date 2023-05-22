import styles from './index.less'
import Layout from "@/popup/components/layout";
import {Button, Form, Input, message} from "antd";
import {storage} from "@/api/utils";
import {useNavigate} from "react-router";

const ChangePassword = () => {
  const [form] = Form.useForm()
  const navigator = useNavigate()

  return (
      <Layout title={'Change Password'}>
        <Form
            className={styles.form}
            form={form}
            onFinish={async (values: any) => {
              try {
                storage.get(['currentAccount']).then(async (res: any) => {
                  if (!res?.address) return message.error('Update failed')

                  const pw = values.password

                  await storage.set({pw})
                  await storage.set({currentAccount: {...res, pw}})

                  const {accountList = []} = await storage.get(['accountList'])
                  const _accountList = accountList.map((account: any) => {
                    if (account.address === res.address) {
                      account.pw = pw
                    }

                    return {...account}
                  })

                  await storage.set({accountList: [..._accountList]})

                  message.success('Update password success!')
                  navigator(-1)
                })
              } catch (e) {
                message.error('Update failed')
              }
            }}
        >
          <Form.Item name={'pw'} rules={[{
            required: true, validator: async (rule: any, value: any) => {
              if (!value) return Promise.reject('can not be empty!')
              try {
                const store = await storage.get(['pw'])
                const pw = store.pw ?? ''
                if (value !== pw) return Promise.reject('invalid password')


                return Promise.resolve()
              } catch (e) {
                return Promise.reject('get current password error')
              }
            }
          }]}>
            <Input.Password className={styles.password} placeholder={'Current Password'}/>
          </Form.Item>
          <Form.Item name={'password'} rules={[{
            required: true, validator: async (rule: any, value: any) => {
              if (!value) return Promise.reject('can not be empty')

              if (value.length < 6) return Promise.reject('password must be at least 6 characters')

              return Promise.resolve()
            }
          }]}>
            <Input.Password className={styles.password} placeholder={'New Password'}/>
          </Form.Item>
          <Form.Item name={'confirm'} rules={[{
            required: true, validator: async (rule: any, value: any) => {
              if (!value) return Promise.reject('can not be empty')

              const pw = form.getFieldValue('password')

              if (pw !== value) return Promise.reject('Please confirm your password')

              return Promise.resolve()
            }
          }]}>
            <Input.Password className={styles.password} placeholder={'Confirm New Password'}/>
          </Form.Item>
          <Button className={styles.confirm} onClick={() => form.submit()}>Continue</Button>
        </Form>
      </Layout>
  )
}

export default ChangePassword
