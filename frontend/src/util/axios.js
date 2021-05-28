/**
 * axios 请求拦截器
 * 请求前生成 csrf token
 */

import axios from 'axios'
import cookie from 'cookie'
import qs from 'qs'
import {Notification} from 'element-ui';
import { API_BASE_URL } from '../const';

class CSRFToken {
  token;
  isCreate;
  constructor (cookie) {
    this.token = cookie.csrf || ''
    this.isCreate = true

    if (!this.token) {
      let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
      let maxPos = $chars.length

      for (let i = 0; i < 32; i++) {
        this.token += $chars.charAt(Math.floor(Math.random() * maxPos))
      }
      this.isCreate = false
    }
  }
}

axios.interceptors.request.use(config => {
  if (config.method === 'post' && config.headers['Content-Type'] && config.headers['Content-Type'].includes('multipart/form-data')) {
    return config
  }

  let data = qs.parse(config.data)

  let { token, isCreate } = new CSRFToken(cookie.parse(document.cookie))

  // data.csrfmiddlewaretoken = token

  if (!isCreate) {
    document.cookie = cookie.serialize('csrf', token, {
      path: '/',
      domain: '.wps.cn'
    })
  }

  // 跨域的GET请求需要带上csrftoken
  if (
    config.baseURL && config.baseURL.indexOf(window.location.host) === -1 &&
    config.method === 'get'
  ) {
    config.transformRequest = [
      (data) => JSON.stringify(data)
    ]
  }
  config.data = data
  return config
});

axios.interceptors.response.use(function (response) {
  return response.data;
}, function (error) {
  Notification({
    title: error.response?.data?.message || error.toString(),
    type: 'error'
  });
  return Promise.reject(error);
});

axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;

export default axios;
