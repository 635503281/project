import axios from '@/util/axios';
import Method from '@/util/method';

const createComment = async (params) => await axios({ url: '/comment', method: Method.POST, data: params});
const getCommentList = async (params) => await axios({ url: '/comment/list', method: Method.GET, params});
const approveComment = async (params) => await axios({url: `/comment/${params.comment_id}/approve`, method: Method.POST});
const cancelApproveComment = async (params) => await axios({url: `/comment/${params.comment_id}/approve`, method: Method.DELETE});
const deleteComment = async (params) => await axios({url: `/comment/${params.comment_id}`, method: Method.DELETE});

export {
  createComment,
  getCommentList,
  approveComment,
  cancelApproveComment,
  deleteComment
}