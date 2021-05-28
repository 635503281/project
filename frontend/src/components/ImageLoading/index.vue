<template>
  <img :class="['img-loading', {'gray-bg': !isSvg}]" :src="src || IMG_LOADING"/>
</template>

<script>
import {IMG_LOADING} from '@/const/index';
export default {
  name: 'image-loading',
  data() {
    return {
      IMG_LOADING
    }
  },
  props: {
    src: String,
    isSvg: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss" scoped>
@import './style';
</style>