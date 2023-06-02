import axios from 'axios';
import {CHAIN_END_PORT} from "@/config/define";

const instance = axios.create({
  baseURL: `http://192.168.0.207:1317`,
  timeout: 100000,
});

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
