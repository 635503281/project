import {getUserInfo, loginOut, getUserStatistics} from './user';
import {
  getPostsAccIds,
  createPost,
  deletePost,
  getPostDetail,
  getPostList,
  updatePost,
  approvePost,
  cancelApprovePost,
  followPost,
  cancelFollowPost,
  getPostsAccCommentIds
} from './post';
import {createComment, getCommentList, approveComment, cancelApproveComment, deleteComment} from './comment';
import {getMyPublishIds, getMyAnswerIds, getMyApproveIds} from './personalCenter';
import {getNoticeList, createNotice, deleteNotice} from './notice';
import {uploadImg} from './image';

export {
  getUserInfo,
  loginOut,
  createPost,
  updatePost,
  deletePost,
  getPostDetail,
  getPostList,
  createComment,
  deleteComment,
  getCommentList,
  approvePost,
  cancelApprovePost,
  followPost,
  cancelFollowPost,
  approveComment,
  cancelApproveComment,
  getMyPublishIds,
  getMyAnswerIds,
  getMyApproveIds,
  getPostsAccIds,
  getPostsAccCommentIds,
  getNoticeList,
  createNotice,
  deleteNotice,
  getUserStatistics,
  uploadImg
}