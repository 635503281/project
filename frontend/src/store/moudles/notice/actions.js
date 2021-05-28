import * as server from '../../../services/index';
import Vue from 'vue';

const requestFns = {
  GET_NEW_NOTICE_LIST: async ({state}) => {
    const res = await server.getNoticeList({page: 1,limit: 3});
    if (res.result === 'ok') {
      Vue.set(state, 'noticeList', res.rows);
    }
  },
  GET_NOTICE_LIST: async (_, params) => await server.getNoticeList(params),
  CREATE_NOTICE: async (_, params) => await server.createNotice(params),
  DELETE_NOTICE: async (_, params) => await server.deleteNotice(params)
}

const actions = {
  ...requestFns
}

export default actions;