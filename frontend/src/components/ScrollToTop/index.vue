<template>
<div class="scroll-to-top" @click="scrollToTop()" v-show="isShow">
  <svg-icon name="iconscroll-top-icon"></svg-icon>
</div>
</template>

<script>
import scrollPlugin from '@/plugin/scrollPlugin';
const scrollObj = new scrollPlugin();
export default {
  data () {
    return {
      isShow: false
    }
  },
  mounted () {
    this.listenScroll();
  },
  methods: {
    scrollToTop () {
      scrollObj.scrollToTop('smooth');
    },
    listenScroll () {
      scrollObj.scrollCTN.addEventListener('scroll', this.handleIsShow)
    },
    handleIsShow () {
      if (scrollObj.scrollCTN.scrollTop > scrollObj.scrollCTN.offsetHeight) {
        this.isShow = true;
      } else {
        this.isShow = false;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.scroll-to-top {
  position: fixed;
  bottom: 30px;
  right: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 100%;
  z-index: 10;
  box-shadow:0px 2px 12px 0px rgba(98,107,132,0.2);
  background: #fff;
  cursor: pointer;
}
</style>
