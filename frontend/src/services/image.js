import axios from '@/util/axios';
import Method from '@/util/method';

// const uploadImg = async (params) => await axios({url: `/comm/api/picture`, data: params, method: Method.POST});
const uploadImg = async (params) => await axios({url: `/picture`, data: params, method: Method.POST});

export {
  uploadImg
}