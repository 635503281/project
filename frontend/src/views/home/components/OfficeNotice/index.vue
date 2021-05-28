<template>
  <div class="office-notice">
    <div class="notice-wrapper">
      <div class="notice-container">
        <span class="notice-text">官方公告：</span>
        <ul class="notice-list">
          <li class="list-item"
            v-for="notice in noticeList"
            :key="notice.id">
            <span class="desc" v-text="notice.title" @click.stop="jumpNoticeLink(notice.url)"></span>
          </li>
        </ul>
      </div>
      <div class="more" @click="jumpNoticeDetail()">
        <span class="more-text">查看更多</span>
        <svg-icon class="arrow-icon" name="iconwhite-right-arrow"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Office-Notice',
  computed: {
    noticeList () {
      return this.$store.getters['Notice/noticeList'];
    }
  },
  methods: {
    jumpNoticeDetail () {
      this.$router.push({path: '/notice-list'})
    },
    jumpNoticeLink (link) {
      window.open(link);
    }
  }
}
</script>

<style lang="scss" scoped>
@import './style';
</style>