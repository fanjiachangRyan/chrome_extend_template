import axios from 'axios';
import {BACKEND_PORT} from "@/config/define";


const instance = axios.create({
  baseURL: `http://192.168.0.207:8081`,
  timeout: 100000,
});

export const setLocalHttpBaseUrl = (url) => {
  instance.defaults.baseURL = `${url}:${BACKEND_PORT}`
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
