<template>
<div class="bg-wrapper">
  <div class="main-bg" :style="`background-image: url(${require('@/assets/img/home_bg.svg')})`"></div>
</div>
</template>

<style lang="scss" scoped>
.bg-wrapper {
  position: relative;
  padding-top: 218px;
  .main-bg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 366px;
    background: #417FF9;
    z-index: -100;
    background-size: auto 366px;
    background-position: center 3px;
    background-repeat: no-repeat;
  }
}
</style>