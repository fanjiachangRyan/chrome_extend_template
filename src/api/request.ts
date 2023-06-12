import axios from 'axios';
import {message} from "antd";


const instance = axios.create({
  baseURL: `http://118.175.0.246:1317`,
  timeout: 100000,
});


instance.interceptors.request.use( (config: any) => config, error => console.log('requestErr->', error));

instance.interceptors.response.use((response: any) => {
  if (response.status !== 200) {
    console.log('response-->', response)
    // todo error tips
    return Promise.reject();
  }

  return response.data;
}, (error: any) => {
  console.log('error-->', error)
});

export default instance;
