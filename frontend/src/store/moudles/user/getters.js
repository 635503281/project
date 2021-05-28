const getters = {
  isLogin (state) {
    return !!(state.userInfo && state.userInfo.user_id);
  },
  userInfo (state) {
    return state.userInfo;
  },
  userStats (state) {
    return state.userStats;
  }
}

export default getters;