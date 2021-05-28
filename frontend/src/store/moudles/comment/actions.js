import * as server from '../../../services/index';

const requestFns = {
  GET_COMMENT_LIST: async (_, param) => await server.getCommentList(param),
  CREATE_COMMENT: async (_, param) => await server.createComment(param),
  APPROVE_COMMENT: async (_, params) => await server.approveComment(params),
  CANCEL_APPROVE_COMMENT: async (_, params) => await server.cancelApproveComment(params),
  DELETE_COMMENT: async (_, params) => await server.deleteComment(params)
}

const actions = {
  ...requestFns
}

export default actions;