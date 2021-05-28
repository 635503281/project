<template>
  <div class="user-info-wrapper">
    <div class="user-info">
      <image-loading class="avatar" :src="userInfo.avatar" alt="avatar"/>
      <div class="text-content">
        <span class="nickname" v-text="userInfo.nickname"></span>
        <span class="position" v-if="false">技术中台产品</span>
      </div>
    </div>
    <button class="edit-btn" @click="jumpEdit">编辑资料</button>
  </div>
</template>

<script>
import {USER_CENTER_URL} from '@/const/index';
export default {
  name: 'User-Info',
  computed: {
    userInfo () {
      return this.$store.getters['User/userInfo'];
    }
  },
  methods: {
    jumpEdit () {
      window.open(USER_CENTER_URL);
    }
  }
}
</script>

<style lang="scss" scoped>
@import './style';
</style>
