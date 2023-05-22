

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
]
// 网络列表
export const S_NETWORK_LIST = 'network-list'

// 当前网络
export const S_CURRENT_NETWORK = 'network-current'

export const CHAIN_ID: string = 'me-chain'

export const PREFIX:string = 'cosmos'

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
export const BACKEND_PORT = '8080'

// 链端端口
export const CHAIN_END_PORT = '1317'

// 钱包端口
export const WALLET_END_PORT = '26657'

// 开发环境
export const DEV_NET: Network = {
  name: 'Devnet',
  url: 'http://192.168.0.207',
}

