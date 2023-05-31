import {AES} from 'crypto-js'
import {storage} from "@/api/utils";
import {
  DEV_NET,
  INetwork,
  Network,
  ParseNetworkResult,
  S_CURRENT_NETWORK,
  BROWSER_PATH,
  BACKEND_PORT,
  CHAIN_END_PORT,
  WALLET_END_PORT,
  S_NETWORK_LIST, PREFIX
} from "@/config/define";

/**
 * 根据网络名称获取网络
 * @param networkName
 */
export const getNetwork = async (networkName: string) => {
  const networkList = await getNetworkList()
  const rs: any = networkList.find((item: any) => item.name === networkName) ?? {}

  return rs
}

/**
 * 获取网络列表
 */
export const getNetworkList = async () => {
  const network: { [key: string]: INetwork[] } = await storage.get([S_NETWORK_LIST])
  const list = network[S_NETWORK_LIST] || []

  const net = list.find((item: any) => item.name === DEV_NET.name)

  // 默认包含开发环境
  if (!net || list.length === 0) {
    list.push({...DEV_NET})
  }
  return list
}

export const getParseNetwork = async (networkName?: string) => {
  let network: INetwork
  if (networkName) {
    network = await getNetwork(networkName)
  } else {
    network = await getCurrentNetwork()
  }
  return parseNetwork(network)
}

/**
 * 获取当前网络
 */
export const getCurrentNetwork = async () => {
  const nameArr: { [key: string]: string } = await storage.get([S_CURRENT_NETWORK])
  const name = nameArr[S_CURRENT_NETWORK] || ''
  const currentNetwork = await getNetwork(name)
  return currentNetwork || DEV_NET
}

/**
 * 解析生成相关网络地址
 * @param name { string }
 * @param url { string }
 */
export const parseNetwork = ({name, url}: Network): ParseNetworkResult => {
  url = AES.encrypt(url, PREFIX).toString()
  return {
    name,
    url,
    browser_url: `${url}/${BROWSER_PATH}`,
    backend_url: `${url}:${BACKEND_PORT}`,
    chain_end_url: `${url}:${CHAIN_END_PORT}`,
    wallet_end_url: `${url}:${WALLET_END_PORT}`,
  }
}

