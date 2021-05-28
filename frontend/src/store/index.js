import Vue from 'vue';
import Vuex from 'vuex';
// vuex modules
import User from './moudles/user/index';
import Post from './moudles/post/index';
import Comment from './moudles/comment/index';
import PersonalCenter from './moudles/personalCenter/index';
import Notice from './moudles/notice/index';
import Image from './moudles/image/index';
// root mutation
import mutations from './mutations';

Vue.use(Vuex);

const globalStore = {
  mutations
}

const store = {
  modules: {
    User,
    Post,
    Comment,
    PersonalCenter,
    Notice,
    Image
  },
  ...globalStore
};

export default new Vuex.Store(store);