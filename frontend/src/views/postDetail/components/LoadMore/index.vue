<template>
<div class="load-more" v-if="canLoadList" @click="$emit('loadNextPage')">
  <template v-if="!reqLock">
    <span class="load-text">查看更多</span>
    <svg-icon class="load-icon" name="iconload-more"/>
  </template>
  <span class="load-text" v-else>加载中...</span>
</div>
</template>

<script>
export default {
  props: {
    canLoadList: Boolean,
    reqLock: Boolean
  }
}
</script>

<style lang="scss" scoped>
@import './style';
</style>
