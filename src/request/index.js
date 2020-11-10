import axios from 'axios';

axios.interceptors.request.use(config => {
  config.baseURL = process.env.VUE_APP_BASE_URL;
  config.timeout = 5000;

  return config
});


export default axios
