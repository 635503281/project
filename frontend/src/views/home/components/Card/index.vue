<template>
  <li class="card-wrapper" @click="jumpPage()">
    <div class="title-wrapper">
      <h4 class="msg-title" v-html="getPostTitle"></h4>
    </div>
    <p class="msg-content" v-html="getPostContent"></p>
    <div :class="['bottom-info', !isSearchPage && 'show-read']">
      <ul class="post-count">
        <li class="count-item">
          <svg-icon name="iconapprove-arrow-icon"/>
          <span class="num">{{postData.approval_count | countFilter}}</span>
        </li>
        <li class="count-item">
          <svg-icon name="iconcomment-icon"/>
          <span class="num">{{postData.reply_count | countFilter}}</span>
        </li>
        <li class="count-item" v-if="!isSearchPage">
          <svg-icon name="iconbrowse-icon"/>
          <span class="num">{{postData.read_count | countFilter}}</span>
        </li>
      </ul>
      <span class="card-time">{{postData.created_at | parseSpacingTime}}</span>
    </div>
  </li>
</template>

<script>
import Helpers from '@/plugin/helpers';
import scrollPlugin from '@/plugin/scrollPlugin';
export default {
  name: 'Qa-Card',
  data () {
    return {
      tag_id: this.$route.params.tag_id
    }
  },
  props: {
    postData: {
      type: Object
    },
    isSearchPage: {
      type: Boolean
    }
  },
  computed: {
    getPostTitle () {
      const hlObj = this.postData.highlight;
      if (hlObj && hlObj.title) {
        return Helpers.parseHTML(hlObj.title.join(''));
      } else {
        return Helpers.parseHTML(this.postData.title);
      }
    },
    getPostContent () {
      const hlObj = this.postData.highlight;
      if (hlObj && hlObj.content) {
        return Helpers.parseHTML(hlObj.content.join(''));
      } else {
        return Helpers.parseHTML(this.postData.content);
      }
    }
  },
  methods: {
    jumpPage () {
      // save position of scroll
      new scrollPlugin().saveScrollYPos();
      this.$router.push({name: 'post-detail', params: {id: this.postData.id}});
    }
  }
}
</script>

<style lang="scss" scoped>
@import './style';
</style>