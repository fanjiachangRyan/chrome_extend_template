import styles from './index.less'
import Steps from '@/popup/components/steps'
import {Button, Checkbox, Form, Input, message} from "antd";
import {useNavigate} from "react-router";
import {useLocation} from "react-router-dom";
import Layout from "@/popup/components/layout";
import {ADD_WALLET_TYPE} from "@/popup/define";
import {storage} from "@/api/utils";

const CreatePassword = () => {
  const navigator = useNavigate()
  const {state = {}} = useLocation()
  const type = state.type || ADD_WALLET_TYPE.CREATE_WALLET
  const [form] = Form.useForm()


  return (
      <Layout>
        <div className={styles.steps}>
          <Steps current={1} steps={[{}, {}, {}]}/>
        </div>
        <p className={styles.createText}>Create a password</p>
        <p className={styles.createDescription}>You'll use this to unlock your wallet</p>
        <Form
            form={form}
            initialValues={{pw: '', pwConfirm: '', isAgree: false}}
            onValuesChange={(val: any, values: any) => {
              console.log(val, values)
            }}
            onFinish={(values: any) => {
              console.log(values)
              if (!values.isAgree) {
                message.warning('Need to agree to the terms of service')

                return
              }

              storage.set({ pw: values.pw })

              navigator(type === ADD_WALLET_TYPE.IMPORT_WALLET ? '/importWalletType' : '/mnemonic', {state})
            }}
        >
          <Form.Item name={'pw'} rules={[{
            required: true, validator: (rules, value) => {
              if (!value) return Promise.reject('can not be empty')

              if (value.length < 6) return Promise.reject('password must be at least 6 characters')

              return Promise.resolve()
            }
          }]}>
            <Input.Password placeholder={'Enter Password'} className={styles.password}/>
          </Form.Item>
          <Form.Item name={'pwConfirm'} rules={[{
            required: true, validator: (rules, value) => {
              if (!value) return Promise.reject('can not be empty')
              const pw = form.getFieldValue('pw')

              if (pw !== value) return Promise.reject('Please confirm your password')

              return Promise.resolve()
            }
          }]}>
            <Input.Password placeholder={'Confirm Password'} className={styles.confirmPassword}/>
          </Form.Item>
          <div className={styles.agreeTerms}>
            <Form.Item name={'isAgree'} noStyle valuePropName={'checked'}>
              <Checkbox/>
            </Form.Item>
            <p className={styles.agreeTerms_text}>I agree to the <a href="">Terms of Service</a></p>
          </div>
          <Button className={styles.confirm} onClick={() => form.submit()}>Continue</Button>
        </Form>
      </Layout>
  )
}

export default CreatePassword
