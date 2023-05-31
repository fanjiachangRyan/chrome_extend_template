import axios from 'axios';
import {BACKEND_PORT} from "@/config/define";


const instance = axios.create({
  baseURL: `http://192.168.0.207:${BACKEND_PORT}`,
  timeout: 100000,
});

instance.interceptors.request.use((config: any) => config);

instance.interceptors.response.use((response: any) => {
  if (response.status !== 200) {
    // todo error tips
    return Promise.reject();
  }

  return response.data;
});

export default instance;
