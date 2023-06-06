import axios from 'axios';
import {BACKEND_PORT} from "@/config/define";


const instance = axios.create({
  baseURL: `http://118.175.0.246:8081`,
  timeout: 100000,
});

instance.defaults.baseURL = `http://118.175.0.246:${BACKEND_PORT}`
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
