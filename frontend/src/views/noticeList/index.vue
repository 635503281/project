<template>
  <div class="notice-detail">
    <div class="notice-list-wrapper">
      <box-title>官方公告</box-title>
      <content-loading v-if="noticeList && noticeList.length <= 0"></content-loading>
      <ul class="notice-list" v-else>
        <notice-card v-for="notice in noticeList"
          :notice="notice"
          :key="notice.id"/>
      </ul>
    </div>
  </div>
</template>

<script>
import BoxTitle from './BoxTitle/index';
import NoticeCard from './NoticeCard/index';
import ContentLoading from './ContentLoading/index';

export default {
  name: 'notice-list',
  data () {
    return {
      noticeList: []
    }
  },
  components: {
    BoxTitle,
    NoticeCard,
    ContentLoading
  },
  mounted () {
    this.getNoticeList();
  },
  methods: {
    async getNoticeList () {
      const params = {
        page: 1,
        limit: 20
      };
      const res = await this.$store.dispatch('Notice/GET_NOTICE_LIST', params);
      if (res.result === 'ok') {
        this.noticeList = res.rows;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import './style.scss';
</style>