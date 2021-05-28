<template>
  <div class="home">
    <div class="main-cards">
      <div class="main-container">
        <office-notice/>
        <bg-box/>
        <search-bar
          ref="search-bar"
          @updatePostList="updatePostList"
          @updateKeyword="updateKeyword"/>
        <comm-community ref="community"/>
      </div>
    </div>
    <scroll-to-top/>
  </div>
</template>

<script>
import OfficeNotice from './components/OfficeNotice/index';
import CommCommunity from './components/CommCommunity/index';
import SearchBar from '@/components/SearchBar/index';
import BgBox from '@/components/BgBox';
import ScrollToTop from '@/components/ScrollToTop';
import scrollPlugin from '@/plugin/scrollPlugin';

export default {
  name: 'home',
  components: {
    OfficeNotice,
    CommCommunity,
    SearchBar,
    BgBox,
    ScrollToTop
  },
  computed: {
    isLogin () {
      return this.$store.getters['User/isLogin'];
    }
  },
  activated () {
    const routeParams = this.$route.params;
    const keyword = routeParams.search_keyword || '';
    if (routeParams.CacheControl === 'no-store') {
      this.$refs['search-bar'].updateKeyword(keyword);
      this.$refs['community'].updateKeyword(keyword);
      this.initQaData();
    } else {
      new scrollPlugin().setScrollYPos();
    }
  },
  mounted () {
    this.$refs['search-bar'].updateKeyword('');
    this.initQaData();
  },
  methods: {
    initQaData () {
      this.$refs['community'].initData();
    },
    updatePostList () {
      this.$refs['community'].updatePostList();
    },
    updateKeyword (keyword) {
      this.$refs['community'].updateKeyword(keyword);
    }
  }
}
</script>

<style lang="scss" scoped>
@import './style';
</style>