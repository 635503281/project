<template>
<div class="user-wrapper">
  <div class="user-info" v-if="isTopComment">
    <image-loading class="avatar" :src="userInfo && userInfo.avatar" alt="avatar"/>
    <span class="nickname" v-text="userInfo && userInfo.nickname"></span>
  </div>
  <div class="reply-owner-info" v-else>
    <image-loading class="reply-owner-avatar" :src="userInfo && userInfo.avatar" alt="reply-owner-avatar"/>
    <span class="reply-to-info">
      <span class="nickname" v-text="userInfo && userInfo.nickname"></span>
      <span class="reply-tag">回复</span>
      <span class="to-nickname" v-text="replyToInfo && replyToInfo.nickname"></span>
    </span>
  </div>
  <slot name="time"/>
</div>
</template>

<script>
export default {
  props: {
    userInfo: {
      type: Object
    },
    replyToInfo: {
      type: Object
    },
    isTopComment: {
      type: Boolean
    }
  }
}
</script>

<style lang="scss" scoped>
@import './style';
</style>
