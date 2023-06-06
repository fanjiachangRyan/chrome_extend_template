import axios from 'axios';
import {CHAIN_END_PORT, RequestAddrList} from "@/config/define";
import {storage} from "@/api/utils";

const instance = axios.create({
  baseURL: `http://118.175.0.246:1317`,
  timeout: 100000,
});

storage.get(['clientAddrType']).then(({clientAddrType}) => {
// @ts-ignore
  instance.defaults.clientAddrType = clientAddrType ?? 1
})

export const setChainEndNetType = (clientAddrType: number) => {
  console.log('setChainEndNetType-->clientAddrType', clientAddrType)
  // @ts-ignore
  instance.defaults.clientAddrType = clientAddrType
}
instance.interceptors.request.use(async (config: any) => {

  config.baseURL = `${RequestAddrList[config.clientAddrType]}:${CHAIN_END_PORT}`
  console.log('setChainEndNetType-->', config.baseURL)
  return {
    ...config
  }
});

instance.interceptors.response.use((response: any) => {
  if (response.status !== 200) {
    // todo error tips
    return Promise.reject();
  }

  return response.data;
});

export default instance;
