<template>
  <div class="post-box" @click="jumpDetail()">
    <h1 class="post-title" v-text="article.title"></h1>
    <p class="post-article">{{article.content | parseHTMLToText}}</p>
    <span class="update-time">保存于&nbsp;{{article.updated_at | parseSpacingTime}}</span>
    <bot-menu
      :hasApprove="$attrs.type === 'approve'"
      :hasFollow="$attrs.type === 'follow'"
      :hasEdit="$attrs.type === 'publish'"
      :hasDel="$attrs.type === 'publish'"
      :countPosition="$attrs.type === 'publish' ? 'left' : 'right'"
      :postId="article.id"
      :counts="{
        read_count: article.read_count,
        approve_count: article.approval_count,
        reply_count: article.reply_count
      }"/>
  </div>
</template>

<script>
import BotMenu from './BotMenu/index';
import scrollPlugin from '@/plugin/scrollPlugin';
export default {
  name: 'Post-Box',
  props: {
    article: Object
  },
  components: {
    BotMenu
  },
  methods: {
    jumpDetail () {
      new scrollPlugin().saveScrollYPos();
      this.$router.push({name: 'post-detail', params: {id: this.article.id}});
    }
  }
}
</script>

<style lang="scss" scoped>
@import './style';
</style>