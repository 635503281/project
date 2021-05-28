import * as server from '../../../services/index';

const requestFns = {
  GET_POST_LIST: async (_, params) => await server.getPostList(params),
  CREATE_POST: async (_, params) => await server.createPost(params),
  UPDATE_POST: async (_, params) => await server.updatePost(params),
  DELETE_POST: async (_, params) => await server.deletePost(params),
  GET_POST_DETAIL: async (_, params) => await server.getPostDetail(params),
  APPROVE_POST: async (_, params) => await server.approvePost(params),
  CANCEL_APPROVE_POST: async (_, params) => await server.cancelApprovePost(params),
  FOLLOW_POST: async (_, params) => await server.followPost(params),
  CANCEL_FOLLOW_POST: async (_, params) => await server.cancelFollowPost(params),
  GET_POSTS_ACC_IDS: async (_, params) => await server.getPostsAccIds(params),
  GET_POSTS_ACC_COMMENTIDS: async (_, params) => await server.getPostsAccCommentIds(params) 
}

const actions = {
  ...requestFns
}

export default actions;