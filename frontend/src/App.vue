<template>
  <div id="app" v-infinite-scroll="loadMore" :infinite-scroll-immediate="false" :infinite-scroll-distance="20">
    <div id="app-container">
      <app-header/>
      <main class="app-main">
        <div class="main-content">
          <keep-alive include="personal-center,home">
            <router-view/>
          </keep-alive>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import AppHeader from '@/components/AppHeader/index';
export default {
  name: 'App',
  components: {
    AppHeader
  },
  mounted () {
    this.$store.dispatch('Notice/GET_NEW_NOTICE_LIST');
  },
  methods: {
    loadMore () {
      if (this.$router.currentRoute.name === 'personal-center') {
        this.$eventBus.emit('loadmore');
      }
    }
  }
}
</script>

<style lang="scss">
@import '@/styles/global';
@import '@/styles/variable';
#app {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  em {
    color: var(--blueColor);
    font-weight: normal;
    font-style: normal;
  }
  .app-main {
    .main-content {
      margin: 0 auto;
    }
  }
}
</style>
