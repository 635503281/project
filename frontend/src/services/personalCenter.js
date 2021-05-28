import axios from '@/util/axios';
import Method from '@/util/method';

const getMyPublishIds = async (params) => await axios({ url: '/user/topic/ids', method: Method.GET, params});
const getMyAnswerIds = async (params) => await axios({ url: '/user/comment/topic/ids', method: Method.GET, params});
// const getMyFollowIds = async () => await axios({url: '/comm/api/my/topicids/followed', method: Method.GET});
const getMyApproveIds = async (params) => await axios({url: '/user/approval/topic/ids', method: Method.GET, params});

export {
  getMyPublishIds,
// getMyFollowIds,
  getMyAnswerIds,
  getMyApproveIds
}