import axios from '@/util/axios';
import Method from '@/util/method';

const getPostList = async (params) => await axios({ url: `/posts`, method: Method.GET, params});
const createPost = async (params) => await axios({ url: `/posts`, method: Method.POST, data: params});
const getPostDetail = async (params) => await axios({ url: `/posts/${params.postId}`, method: Method.GET});
const updatePost = async (params) => await axios({ url: `/posts/${params.id}`, method: Method.PUT, data: params});
const deletePost = async (params) => await axios({ url: `/posts/${params.id}`, method: Method.DELETE});
const approvePost = async (params) => await axios({url: `/posts/${params.id}/approval`, method: Method.POST});
const cancelApprovePost = async (params) => await axios({url: `/posts/${params.id}/approval`, method: Method.DELETE});
const followPost = async (params) => await axios({url: `/posts/${params.id}/follow`, method: Method.POST});
const cancelFollowPost = async (params) => await axios({url: `/posts/${params.id}/follow`, method: Method.DELETE});
const getPostsAccIds = async (params) => await axios({url: `/posts/batch?ids=${params.ids.join(',')}`, method: Method.GET});
const getPostsAccCommentIds = async (params) => await axios({url: `/comment/specific?comment_id=${params.comment_ids.join(',')}`, method: Method.GET})

export {
  getPostList,
  createPost,
  getPostDetail,
  updatePost,
  deletePost,
  approvePost,
  cancelApprovePost,
  followPost,
  cancelFollowPost,
  getPostsAccIds,
  getPostsAccCommentIds
}