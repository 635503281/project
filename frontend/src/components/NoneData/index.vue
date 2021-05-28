<template>
<div class="none-data">
  <image-loading class="none-data-img" :src="NoneDataImg" alt="none-data"/>
  <h2 class="title">无{{text}}内容</h2>
  <button class="publish-btn" @click="jumpPublish" v-if="isBtn">发布</button>
</div>
</template>

<script>
import NoneDataImg from '@/assets/img/none-data.svg';
export default {
  data () {
    return {
      NoneDataImg
    }
  },
  props: {
    text: String,
    isBtn: Boolean
  },
  methods: {
    jumpPublish () {
      this.$router.push({path: '/publish'});
    }
  }
}
</script>

<style lang="scss" scoped>
@import './style';
</style>