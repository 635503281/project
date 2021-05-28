import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store/index';
// page component;
import HomeEntry from '../views/homeEntry/index.vue';
import scrollPlugin from '@/plugin/scrollPlugin';

Vue.use(Router);
const router =  new Router({
  mode: 'history',
  base: '/comm',
  routes: [
    {
      path: '/',
      name: 'home-entry',
      component: HomeEntry
    },
    {
      path: '/qa/:tag_id',
      name: 'question-answer',
      component: () => import('../views/home/index')
    },
    {
      path: '/publish',
      name: 'publish',
      component: () => import('../views/publish/index.vue')
    },
    {
      path: '/post-detail/:id',
      name: 'post-detail',
      component: () => import('../views/postDetail/index.vue')
    },
    {
      path: '/edit-post',
      name: 'edit-post',
      component: () => import('../views/publish/index.vue')
    },
    {
      path: '/personal-center',
      name: 'personal-center',
      component: () => import('../views/personalCenter/index.vue')
    },
    {
      path: '/notice-list',
      name: 'notice-list',
      component: () => import('../views/noticeList/index.vue')
    }
  ]
})
/**
 * 滚动至顶部
 */
function scrollTop () {
  new scrollPlugin().scrollToTop();
}

router.beforeEach(async (to, from, next) => {
  const userInfo = store.state.User.userInfo;
  if (!(userInfo && userInfo.user_id)) {
    try {
      const res = await store.dispatch('User/GET_USER_INFO');
      if (res.result !== 'ok') {
        store.commit('JUMP_LOGIN', null , {root: true});
      }
      store.dispatch('User/GET_USER_STATISTICS');
    } catch (err) {
      store.commit('JUMP_LOGIN', null , {root: true});
      throw new Error(err);
    }
  }
  if (to.name === 'personal-center') {
    store.dispatch('User/GET_USER_STATISTICS');
  }
  scrollTop();
  next();
});

export default router;