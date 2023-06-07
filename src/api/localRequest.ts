import axios from 'axios';

const instance = axios.create({
  baseURL: `http://118.175.0.246:8081`,
  timeout: 100000,
});

instance.interceptors.request.use((config: any) => config, error => console.log('requestErr->', error));

instance.interceptors.response.use((response: any) => {
  if (response.status !== 200) {
    // todo error tips
    return Promise.reject();
  }

  return response.data;
});

export default instance;
