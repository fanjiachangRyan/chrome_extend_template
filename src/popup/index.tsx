import {BrowserRouter, HashRouter, Navigate, Route, Routes} from "react-router-dom";
import Account from "@/popup/pages/account";
import styles from './index.less'
import {ConfigProvider} from "antd";
import Unlock from "@/popup/pages/unlock";
import Welcome from "@/popup/pages/welcome";
import CreatePassword from "@/popup/pages/createPassword";
import ImportWalletType from "@/popup/pages/importWalletType";
import PrivateKey from "@/popup/pages/privateKey";
import Mnemonic from "@/popup/pages/mnemonic";
import InputMnemonic from "@/popup/pages/inputMnemonic";
import NoMatch from "@/popup/pages/noMatch";
import CheckAccount from "@/popup/pages/checkAccount";
import Main from "@/popup/pages/main";
import Home from '@/popup/pages/main/home'
import Library from "@/popup/pages/main/library";
import Apps from "@/popup/pages/main/apps";
import Activitys from "@/popup/pages/main/activitys";
import Setting from "@/popup/pages/setting";
import ChangePassword from "@/popup/pages/changePassword";
import SwitchAccount from "@/popup/pages/switchAccount";
import AddAccount from "@/popup/pages/addAccount";
import ManageAccount from "@/popup/pages/manageAccount";
import ChangeAccountName from "@/popup/pages/changeAccountName";
import Stake from "@/popup/pages/stake";
import TransactionDetail from "@/popup/pages/transactionDetail";
import Send from "@/popup/pages/send";
import StakeDetail from "@/popup/pages/stakeDetail";
import StakeList from "@/popup/pages/stakeList";
import StakeFixed from "@/popup/pages/stakeFixed";
import StakeFlexible from "@/popup/pages/stakeFlexible";
import UnStakeFlexible from "@/popup/pages/unStakeFlexible";
import StakeResult from "@/popup/pages/stakeResult";
import UnStakeResult from "@/popup/pages/unStakeResult";
import {useEffect} from "react";
import {disconnect} from "@/api/utils";
import NetType from "@/popup/pages/netType";

const Router = () => {
  useEffect(() => {
    window.onerror = (e: any) => {
      console.log('windowerror', e)
    }
    return () => {
      disconnect()
    }
  }, [])
  return (
      <ConfigProvider theme={{
        token: {
          colorPrimary: 'rgb(23,32,49)',
        }
      }}>
        <div className={styles.container}>
          <HashRouter>
            <Routes>
              <Route path={'/'} element={<Navigate to={'/checkAccount'}/>}/>
              <Route path={'/checkAccount'} element={<CheckAccount/>}/>
              <Route path={'/welcome'} element={<Welcome/>}/>
              <Route path={'/createPassword'} element={<CreatePassword/>}/>
              <Route path={'/importWalletType'} element={<ImportWalletType/>}/>
              <Route path={'/privateKey'} element={<PrivateKey/>}/>
              <Route path={'/mnemonic'} element={<Mnemonic/>}/>
              <Route path={'/inputMnemonic'} element={<InputMnemonic/>}/>
              <Route path={'/unlock'} element={<Unlock/>}/>
              <Route path="/main" element={<Main/>}>
                <Route path="/main/home" element={<Home/>}/>
                <Route path="/main/library" element={<Library/>}/>
                <Route path="/main/apps" element={<Apps/>}/>
                <Route path="/main/activitys" element={<Activitys/>}/>
              </Route>
              <Route path="/setting" element={<Setting/>}/>
              <Route path="/account" element={<Account/>}/>
              <Route path="/changePassword" element={<ChangePassword/>}/>
              <Route path="/switchAccount" element={<SwitchAccount/>}/>
              <Route path="/addAccount" element={<AddAccount/>}/>
              <Route path="/manageAccount" element={<ManageAccount/>}/>
              <Route path="/changeAccountName" element={<ChangeAccountName/>}/>
              <Route path="/stake" element={<Stake/>}/>
              <Route path={'/transactionDetail'} element={<TransactionDetail/>}/>
              <Route path={'/send'} element={<Send/>}/>
              <Route path={'/stakeList'} element={<StakeList/>}/>
              <Route path={'/stakeFixed'} element={<StakeFixed/>}/>
              <Route path={'/stakeFlexible'} element={<StakeFlexible/>}/>
              <Route path={'/stakeDetail'} element={<StakeDetail/>}/>
              <Route path={'/unStakeFlexible'} element={<UnStakeFlexible/>}/>
              <Route path={'/stakeResult'} element={<StakeResult/>}/>
              <Route path={'/unStakeResult'} element={<UnStakeResult/>}/>
              <Route path={'/netType'} element={<NetType />}/>
              <Route path="*" element={<NoMatch/>}/>
            </Routes>
          </HashRouter>
        </div>
      </ConfigProvider>
  )
}

export default Router
