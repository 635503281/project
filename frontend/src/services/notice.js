import axios from '@/util/axios';
import Method from '@/util/method';

const getNoticeList = async (params) => await axios({ url: '/notices', method: Method.GET, params});
const createNotice = async (params) => await axios({ url: '/notices', method: Method.POST, data: params});
const deleteNotice = async (params) => await axios({ url: `/notices/${params.notice_id}`, method: Method.DELETE})

export {
  getNoticeList,
  createNotice,
  deleteNotice
}