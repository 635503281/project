import * as server from '../../../services/index';

const requestFns = {
  async GET_USER_INFO ({commit}) {
    const res = await server.getUserInfo();
    commit('SET_USER_INFO', res.object);
    return res;
  },
  LOGIN_OUT ({commit}) {
    server.loginOut().finally(() => {
      commit('CLEAR_USER_INFO');
      commit('JUMP_LOGIN', null , {root: true});
    });
  },
  GET_USER_STATISTICS: async ({commit}) => {
    const res = await server.getUserStatistics();
    commit('SET_USER_STATISTICS', res);
  }
}

const actions = {
  ...requestFns
}

export default actions;