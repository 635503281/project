<template>
  <div class="search-wrapper">
    <div class="search-bar">
      <div class="input-wrapper">
        <input ref="searchInput"
          class="input"
          v-model="search_keyword"
          placeholder="请描述你的问题"
          @input="searchDebounce(false)"
          @blur="hideResBox()"
          @keydown.enter="searchDebounce(true)"
          maxlength="50"/>
        <svg-icon
          v-show="!isEmpty"
          class="search-clear-icon"
          name="iconsearch-clear-icon"
          @click.native="clearSearchText()"/>
      </div>
      <div class="icon-wrapper" @click="searchDebounce(true)">
        <svg-icon class="search-icon" name="iconicon-search"/>
      </div>
    </div>
    <div class="search-result" v-show="isShowRes">
      <ul class="result-list">
        <li
          class="result-item"
          v-for="item in resList"
          :key="item.id"
          v-html="item.highlight && item.highlight.title ? item.highlight.title.join('') : item.title"
          @click.stop="jumpPostDetail(item.id)"></li>
      </ul>
    </div>
  </div>
</template>

<script>
import {TAG_LIST} from '@/const/index';
export default {
  data () {
    return {
      search_keyword: this.$route.params.search_keyword || '',
      activeTagId: this.$route.params.tag_id || 'all',
      tag_list: TAG_LIST,
      isShowRes: false,
      resList: [],
      curPage: 1,
      limit: 6,
      searchTimer: null
    }
  },
  computed: {
    activeTag () {
      return this.tag_list.find(tag => tag.id === this.activeTagId);
    },
    isEmpty () {
      return !this.search_keyword.trim()
    }
  },
  watch: {
    search_keyword () {
      this.$emit('updateKeyword', this.search_keyword);
    },
    $route (route) {
      this.activeTagId = route.params.tag_id;
    }
  },
  methods: {
    clearSearchText () {
      this.hideResBox();
      this.search_keyword = '';
    },
    jumpPostDetail (postId) {
      this.$router.push({name: 'post-detail', params: {id: postId}});
    },
    hideResBox () {
      setTimeout(() => {
        this.isShowRes = false;
      }, 300);
    },
    showResBox () {
      this.isShowRes = true;
    },
    searchDebounce (isJumpPage) {
      if (this.searchTimer !== null) clearTimeout(this.searchTimer);
      this.searchTimer = setTimeout(() => {
        this.searchWord(isJumpPage);
      }, 200);
    },
    updateKeyword (keyword) {
      this.search_keyword = keyword;
    },
    async searchWord (isJumpPage) {
      if (this.isEmpty) {
        this.hideResBox();
        if (isJumpPage) this.$emit('updatePostList');
        return;
      }
      if (isJumpPage && this.$route.name !== 'question-answer') {
        this.$router.push({name: 'question-answer', params: {tag_id: 'all', search_keyword: this.search_keyword, CacheControl: 'no-store'}});
        return;
      } else if (isJumpPage && this.$route.name === 'question-answer') {
        this.$emit('updatePostList');
        this.hideResBox();
        return;
      }
      const params = {
        page: this.curPage,
        limit: this.limit,
        keyword: this.search_keyword
      }
      if (this.activeTag.id !== 'all') params.tag = this.activeTag.text;

      const res = await this.$store.dispatch('Post/GET_POST_LIST', params);
      if (res.result === 'ok' && res.rows.length > 0) {
        this.resList = res.rows;
        this.total = res.count;
        if (!isJumpPage) this.showResBox();
      } else {
        this.hideResBox();
      }
    }
  }
}
</script>

<style lang="scss">
@import './style';
</style>
