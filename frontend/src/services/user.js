import axios from 'axios';
import Method from '../util/method';
import {ACCOUNT_HOST} from '@/const/index';

// const getUserInfo = async () => await axios({ url: '/comm/api/login_info', method: Method.GET });
const getUserInfo = async () => await axios({ url: '/login_info', method: Method.GET });
const loginOut = async () => await axios({ url: 'https://account.wps.cn/p/logout', method: Method.POST, baseURL: ACCOUNT_HOST });
const getUserStatistics = async () => await axios({ url: '/user/statistics', method: Method.GET });

export {
  getUserInfo,
  loginOut,
  getUserStatistics
}