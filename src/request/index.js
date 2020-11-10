import axios from 'axios';

import {getToken} from "@/utils/auth";

axios.interceptors.request.use(config => {
  config.baseURL = process.env.VUE_APP_BASE_URL;
  config.timeout = 5000;
  let token = getToken()
  if (token) {
    config.headers['Authorization'] = 'Bearer '+token
  }

  return config
});


export default axios
