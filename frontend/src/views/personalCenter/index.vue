<template>
  <div class="personal-center">
    <top-user-info/>
    <div class="posts-info-wrapper">
      <div class="posts-container">
        <ul class="menu-list">
          <li :class="['menu-item', {'active': menu.id === activeId}]"
            v-for="menu in menuList"
            :key="menu.id"
            v-text="menu.text"
            @click="selectMenu(menu.id)"></li>
        </ul>
        <div class="list-container">
          <skeleton-loading v-if="isLoadingState"/>
          <none-data
            v-else-if="dataList && dataList.length <= 0"
            :text="activeMenu.text"
            :isBtn="activeMenu.id === 'publish'"/>
          <post-box
            v-else
            v-for="article in dataList"
            :key="article.id"
            :article="article"
            :type="activeId"/>
        </div>
      </div>
      <count-box/>
    </div>
  </div>
</template>

<script>
import TopUserInfo from './TopUserInfo/index';
import PostBox from './PostBox/index';
import CountBox from './CountBox/index';
import SkeletonLoading from '@/components/SkeletonLoading';
import NoneData from '@/components/NoneData/index';
import scrollPlugin from '@/plugin/scrollPlugin';

export default {
  name: 'personal-center',
  data () {
    return {
      page: 1,
      limit: 20,
      total: null,
      reqLock: false,
      limitLoad: false,
      curPageIds: [],
      activeId: '',
      menuList: [{
          id: 'publish',
          text: '发布',
        },
        {
          id: 'answer',
          text: '回答',
        },
        {
          id: 'approve',
          text: '求解决'
        }
      ],
      dataList: [],
      isLoadingState: true,
      isInitedPage: false
    }
  },
  components: {
    TopUserInfo,
    PostBox,
    CountBox,
    SkeletonLoading,
    NoneData
  },
  activated () {
    if (this.$route.params.CacheControl === 'no-store') {
      if (!this.isInitedPage) this.init();
    } else {
      new scrollPlugin().setScrollYPos();
    }
  },
  mounted () {
    if (!this.isInitedPage) this.init();
  },
  computed: {
    activeMenu () {
      return this.menuList.find(menu => menu.id === this.activeId);
    },
    activeAction () {
      const apiMapAction = {
        publish: 'PersonalCenter/GET_MY_PUBLISH_IDS',
        answer: 'PersonalCenter/GET_MY_ANSWER_IDS',
        approve: 'PersonalCenter/GET_MY_APPROVE_IDS'
      }
      return apiMapAction[this.activeId];
    }
  },
  methods: {
    init () {
      this.isInitedPage = true;
      this.initActiveId();
      this.initListen();
      this.selectMenu(this.activeId);
    },
    initActiveId () {
      this.activeId = 'publish';
    },
    initListen () {
      this.$eventBus.listen('delLocalItem', (postId) => {
        const delIdx = this.dataList.findIndex(post => post.id === postId);
        if (~delIdx) {
          this.dataList.splice(delIdx, 1);
          this.$store.dispatch('User/GET_USER_STATISTICS');
        }
      });
      // 分页处理
      this.$eventBus.listen('loadmore', () => {
        if (!this.reqLock && !this.limitLoad) {
          this.setNextPage();
        }
      });
    },
    initDataList () {
      // init paging data
      this.page = 1;
      this.reqLock = false;
      this.limitLoad = false;
      this.curPageIds = [];
      this.dataList = [];
    },
    switchReqlock () {
      this.reqLock = !this.reqLock;
    },
    selectMenu (id) {
      this.isLoadingState = true;
      this.activeId = id;
      this.initDataList();
      this.getListData();
    },
    async setNextPage () {
      this.page++;
      this.curPageIds = [];
      await this.setCurPageIds(this.activeAction);
    },
    async setCurPageIds (reqAction) {
      this.switchReqlock();
      const params = {
        page: this.page,
        limit: this.limit
      };
      const res = await this.$store.dispatch(reqAction, params);
      if (res.result === 'ok') {
        this.curPageIds = res.rows;
        this.total = res.count;
        await this.requestList();
        if (this.dataList.length >= this.total) {
          this.canRequest = false;
        }
      }
    },
    async requestList () {
      if (this.curPageIds.length > 0) {
        const listRes = await this.$store.dispatch('Post/GET_POSTS_ACC_IDS', {ids: this.curPageIds});
        if (listRes.result === 'ok' && listRes.rows.length > 0) {
          this.dataList.push(...listRes.rows);
          if (this.dataList.length >= this.total) this.limitLoad = true;
          this.switchReqlock();
        }
      }
      this.isLoadingState = false;
    },
    getListData () {
      this.setCurPageIds(this.activeAction);
    }
  }
}
</script>

<style lang="scss" scoped>
@import './style';
</style>
