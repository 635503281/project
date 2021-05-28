<template>
  <header class="app-header">
    <div class="header-content">
      <div class="header-left" @click="jumpHome()">
        <!-- <image-loading class="logo" alt="logo" :src="LogoIcon"/> -->
        <h1 class="title">Weboffice 问答社区</h1>
      </div>
      <div class="header-right" @click="openPersonalCenter()">
        <image-loading class="avatar" :src="userInfo && userInfo.avatar" alt="avatar"/>
      </div>
    </div>
  </header>
</template>

<script>
// import LogoIcon from '@/assets/img/logo.svg';
export default {
  data () {
    return {
      // LogoIcon
    }
  },
  computed: {
    isLogin () {
      return this.$store.getters['User/isLogin'];
    },
    userInfo () {
      return this.$store.getters['User/userInfo'];
    }
  },
  methods: {
    jumpHome () {
      if (this.$route.name !== 'home-entry') {
        this.$router.push({name: 'home-entry'});
      }
    },
    openPersonalCenter () {
      this.$router.push({name: 'personal-center', params: {CacheControl: 'no-store'}});
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./style";
</style>