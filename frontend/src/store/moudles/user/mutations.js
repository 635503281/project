import Vue from 'vue';
import {USER_CENTER_URL} from '@/const/index';

export default {
  SET_USER_INFO (state, payload) {
    Vue.set(state, 'userInfo', payload);
  },
  CLEAR_USER_INFO (state) {
    Vue.set(state, 'userInfo', void 0);
  },
  JUMP_USER_CENTER () {
    self.location.href = USER_CENTER_URL;
  },
  SET_USER_STATISTICS (state, payload) {
    Vue.set(state, 'userStats', payload);
  }
}