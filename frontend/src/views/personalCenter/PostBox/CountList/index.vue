<template>
<ul class="menu-list">
  <li class="menu-item">
    <svg-icon class="action-icon" name="iconapprove-arrow-icon"/>
    <span class="action-text default-text" v-text="$attrs.counts.approve_count"></span>
  </li>
  <!-- <li class="menu-item">
    <svg-icon class="action-icon" name="iconunapprove-icon"/>
    <span class="action-text default-text">0</span>
  </li> -->
  <li class="menu-item">
    <svg-icon class="action-icon" name="iconcomment-icon"/>
    <span class="action-text default-text" v-text="$attrs.counts.reply_count"></span>
  </li>
  <li class="menu-item">
    <svg-icon class="action-icon" name="iconbrowse-icon"/>
    <span class="action-text default-text" v-text="$attrs.counts.read_count"></span>
  </li>
</ul>
</template>

<style lang="scss" scoped>
@import './style';
</style>
