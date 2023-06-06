import axios from 'axios';
import {BACKEND_PORT,  RequestAddrList} from "@/config/define";
import {storage} from "@/api/utils";

const instance = axios.create({
  baseURL: 'http://118.175.0.246:8081',
  timeout: 100000,
});

storage.get(['clientAddrType']).then(({clientAddrType}) => {
// @ts-ignore
  instance.defaults.clientAddrType = clientAddrType ?? 1
})

export const setBackEndNetType = (clientAddrType: number) => {
  // @ts-ignore
  instance.defaults.clientAddrType = clientAddrType
}

instance.interceptors.request.use(async (config: any) => {
  config.baseURL =  `${RequestAddrList[config.clientAddrType]}:${BACKEND_PORT}`

  console.log('setBackEndNetType-->', config.baseURL)
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
