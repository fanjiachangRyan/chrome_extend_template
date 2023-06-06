import axios from 'axios';
import {CHAIN_END_PORT} from "@/config/define";

const instance = axios.create({
  baseURL: `http://118.175.0.246:1317`,
  timeout: 100000,
});

instance.defaults.baseURL = `http://118.175.0.246:${CHAIN_END_PORT}`

export const setHttpBaseUrl = (url) => {
  instance.defaults.baseURL = `${url}:${CHAIN_END_PORT}`
}

instance.interceptors.request.use((config: any) => config);

instance.interceptors.response.use((response: any) => {
  if (response.status !== 200) {
    // todo error tips
    return Promise.reject();
  }

  return response.data;
});

export default instance;
