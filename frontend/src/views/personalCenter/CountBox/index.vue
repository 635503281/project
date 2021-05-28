<template>
  <div class="post-count">
    <h2 class="count-title">个人统计</h2>
    <ul class="count-list">
      <li class="count-item">
        <svg-icon class="count-icon" name="iconcount-publish"/>
        <span class="count-text">共发布<span class="count-num">{{userStats.topic_total | countFilter}}</span>个问题</span>
      </li>
      <li class="count-item">
        <svg-icon class="count-icon" name="iconcount-approve"/>
        <span class="count-text">获得<span class="count-num">{{userStats.topic_approval_total | countFilter}}</span>个认同或支持</span>
      </li>
      <li class="count-item">
        <svg-icon class="count-icon" name="iconcount-follow"/>
        <span class="count-text">回答<span class="count-num">{{userStats.comment_topic_total | countFilter}}</span>个问题</span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  computed: {
    userStats () {
      return this.$store.getters['User/userStats'];
    }
  }
}
</script>

<style lang="scss" scoped>
@import './style';
</style>
