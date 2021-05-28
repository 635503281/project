import * as server from '../../../services/index';

const requestFns = {
  GET_MY_PUBLISH_IDS: async (_, param) => await server.getMyPublishIds(param),
  GET_MY_ANSWER_IDS: async (_, param) => await server.getMyAnswerIds(param),
//  GET_MY_FOLLOW_IDS: async (_, params) => await server.getMyFollowIds(params),
  GET_MY_APPROVE_IDS: async (_, params) => await server.getMyApproveIds(params),
}

const actions = {
  ...requestFns
}

export default actions;