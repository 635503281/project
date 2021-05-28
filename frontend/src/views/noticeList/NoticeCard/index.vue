<template>
  <li class="notice-card" @click.stop="jumpNoticeLink()">
    <div class="notice-container">
      <h3 class="notice-title" v-text="notice.title"></h3>
      <div class="bot-info">
        <span class="notice-time">{{notice.created_at | parseSpacingTime}}</span>
      </div>
    </div>
  </li>
</template>

<script>
export default {
  props: {
    notice: {
      type: Object
    }
  },
  methods: {
    jumpNoticeLink () {
      window.open(this.notice.url);
    }
  }
}
</script>

<style lang="scss" scoped>
@import './style';
</style>