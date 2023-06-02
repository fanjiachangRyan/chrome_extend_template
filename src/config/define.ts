import {storage} from "@/api/utils";
import {setHttpBaseUrl} from "@/api/request";
import {setLocalHttpBaseUrl} from "@/api/localRequest";

export interface Network {
  name: Readonly<string> // 网络名称
  url: Readonly<string> // 浏览器访问地址
}

export interface INetwork {
  name: string
  url: string
}

export const DOMAINS: string[] = [
  'http://localhost:8000',
  'http://192.168.0.207',
  'http://118.175.0.246'
]
// 网络列表
export const S_NETWORK_LIST = 'network-list'

// 当前网络
export const S_CURRENT_NETWORK = 'network-current'

export const CHAIN_ID: string = 'me-chain'

export const PREFIX: string = 'me'

export interface ParseNetworkResult {
  name: string,
  url: string,
  browser_url: string
  backend_url: string,
  chain_end_url: string,
  wallet_end_url: string
}

export const BROWSER_PATH = 'explorer'

// 后端端口
export const BACKEND_PORT = '8081'

// 链端端口
export const CHAIN_END_PORT = '1317'

// 钱包端口
export const WALLET_END_PORT = '26657'

// 开发环境
export const DEV_NET: Network = {
  name: 'Devnet',
  url: 'http://192.168.0.207',
}

export const TEST_NET: Network = {
  name: 'TestNet',
  url: "http://118.175.0.246"
}

export const MAIN_NET: Network = {
  name: 'MainNet',
  url: ""
}

export const addr = `http://192.168.0.207:26657`

// export const addr = {
//   dev: `http://192.168.0.207:26657`,
//   test: 'http://118.175.0.246:26657'
// }

export const clientAddrList = {
  0: `http://192.168.0.207:26657`,
  1: 'http://118.175.0.246:26657',
  2: ''
}

export const ClientAddrInfoList: any[] = [
  {
    subject: 'Dev',
    url: 'http://192.168.0.207:26657',
    value: 0
  },{
    subject: 'Test',
    url: 'http://118.175.0.246:26657',
    value: 1
  },{
    subject: 'Main',
    url: '',
    value: 2
  }
]

export const RequestAddrList: any = {
  0: 'http://192.168.0.207',
  1: 'http://118.175.0.246',
  2: ''
}

export const ClientAddrType: any = {
  Dev: 0,
  Test: 1,
  Main: 2
}

export const setClientAddrType = (type = ClientAddrType.Dev) => {
  setHttpBaseUrl(RequestAddrList[type])
  setLocalHttpBaseUrl(RequestAddrList[type])
  storage.set({clientAddrType: type})
}

export const getClientAddrType = async () => {
  const {clientAddrType = ClientAddrType.Dev}: any = await storage.get(['clientAddrType'])

  return clientAddrType
}

export const gas_limit = 200000 // 2e5
export const gas_price = 0.0005

export const gas_fee = gas_limit * gas_price

