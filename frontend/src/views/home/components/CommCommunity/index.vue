<template>
  <div class="commnuity-wrapper">
    <div class="qa-inner-wrapper">
      <div class="tag-wrapper">
        <ul class="tag-list">
          <li :class="['tag-item', tag.id === activeTagId && 'active-tag']"
            v-for="tag in tag_list"
            v-text="tag.text"
            :key="tag.id"
            @click="selectTagMenu(tag.id)"></li>
        </ul>
      </div>
      <div class="action-wrapper">
         <!-- v-if="!isLoad" -->
        <div class="left-action">
          <span v-if="isSearchPage" class="total-count" v-text="`${total}条搜索结果`"></span>
          <div class="dropdown">
            <div class="dropdown-text" @click="switchFilterDialog">
              <span class="select-text" v-text="filterText"></span>
              <svg-icon name="iconarrow-icon"/>
            </div>
            <div class="dropdown-dialog" v-if="isFilterDialog">
              <template v-if="isSearchPage">
                <ul class="dropdown-list">
                  <li
                    :class="['dropdown-item', item.id === timeSelectedId && 'active-item']"
                    v-for="item in timeSelects"
                    :key="item.id"
                    @click="selectTimeRange(item.id)">
                    <svg-icon class="select-icon" name="icondropdown-select"></svg-icon>
                    <span class="select-text" v-text="item.text"></span>
                  </li>
                </ul>
              </template>
              <template v-else>
                <ul class="dropdown-list">
                  <li
                    :class="['dropdown-item', item.id === orderSelectedId && 'active-item']"
                    v-for="item in orderFilter"
                    :key="item.id"
                    @click="selectOrderType(item.id)">
                    <svg-icon class="select-icon" name="icondropdown-select"></svg-icon>
                    <span class="select-text" v-text="item.text"></span>
                  </li>
                </ul>
              </template>
            </div>
          </div>
        </div>
        <div class="right-action">
           <!-- v-if="postList.length > 0" -->
          <span class="prompt-text">没有想要的内容？</span>
          <button class="publish-btn" @click="jumpPublish">提问</button>
        </div>
      </div>
      <div class="community-container">
        <prompt-page v-if="postList.length <= 0" :promptType="isLoad ? 'search' : 'none-data'" @jumpPublish="jumpPublish"/>
        <ul class="card-list" v-else-if="postList.length > 0">
          <Card v-for="(post, idx) in postList" :key="idx" :isSearchPage="isSearchPage" :postData="post"/>
        </ul>
        <div :class="['pagination-wrapper', curPage <= 1 && 'hide-pre', curPage >= maxPage && 'hide-next']" v-if="postList.length > 0 && total > 20">
          <el-pagination
            :page-size="20"
            :pager-count="7"
            :current-page.sync="curPage"
            layout="prev, pager, next"
            @current-change="updateCurPage"
            :total="total">
          </el-pagination>
          <div class="jump-direction">
            <input
              class="jump-input"
              type="number"
              autocomplete="off"
              :max="maxPage"
              :min="1"
              v-model="toJumpPageNum"
              @keyup.enter="directJump"/>
            <span class="jump-text" @click="directJump">跳转</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Card from '../Card/index';
import PromptPage from '../PromptPage/index';
import {TAG_LIST} from '@/const/index';
import scrollPlugin from '@/plugin/scrollPlugin';

export default {
  name: 'qa-commnuity',
  data () {
    return {
      isSearchPage: false,
      isLoad: false,
      curPage: 1,
      toJumpPageNum: null,
      limit: 20,
      postList: [],
      total: 0,
      search_keyword: this.$route.params.search_keyword,
      isFilterDialog: false,
      tag_list: TAG_LIST,
      activeTagId: this.$route.params.tag_id,
      timeSelectedId: 'NOT_LIMIT',
      orderSelectedId: 'TIME',
      timeSelects: [
        {
          id: 'NOT_LIMIT',
          text: '时间不限'
        },
        {
          id: 'ONE_DAY',
          text: '一天内',
          value: 1
        },
        {
          id: 'ONE_WEEK',
          text: '一周内',
          value: 7
        },
        {
          id: 'THREE_MONTH',
          text: '三个月内',
          value: 90
        }
      ],
      orderFilter: [
        {
          id: 'TIME',
          text: '按时间排序',
          value: 'time'
        },
        {
          id: 'REPLAY',
          text: '按回答数排序',
          value: 'reply',
        },
        {
          id: 'READ',
          text: '按浏览数排序',
          value: 'read'
        }
      ]
    }
  },
  components: {
    Card,
    PromptPage
  },
  computed: {
    filterText () {
      if (!this.isSearchPage) return this.activeOrder.text;
      else return this.activeTime.text;
    },
    activeTag () {
      return this.tag_list.find(tag => tag.id === this.activeTagId);
    },
    activeTime () {
      return this.timeSelects.find(time => time.id === this.timeSelectedId);
    },
    activeOrder () {
      return this.orderFilter.find(time => time.id === this.orderSelectedId);
    },
    maxPage () {
      return this.total % 20 ? parseInt(this.total / 20) + 1 : parseInt(this.total / 20);
    }
  },
  watch: {
    $route (route) {
      this.activeTagId = route.params.tag_id;
      // the action that exclude select tab don't fetch data
      if (route.params.is_change_tag && this.activeTagId) {
        this.isLoad = true;
        this.initPage();
        this.getCurPageData();
      }
    },
    toJumpPageNum (val) {
      const intVal = parseInt(val);
      if (intVal > this.maxPage) this.toJumpPageNum = this.maxPage;
      else if (intVal < 1) this.toJumpPageNum = 1;
    }
  },
  methods: {
    initData () {
      this.initPage();
      this.isLoad = true;
      this.getCurPageData();
    },
    initPage () {
      this.total = 0;
      this.curPage = 1;
      this.postList = [];
    },
    scrollToTop () {
      new scrollPlugin().scrollToTop();
    },
    directJump () {
      this.scrollToTop();
      this.curPage = parseInt(this.toJumpPageNum);
      this.getCurPageData();
      this.toJumpPageNum = '';
    },
    switchFilterDialog () {
      this.isFilterDialog = !this.isFilterDialog;
    },
    selectTimeRange (timeId) {
      this.isLoad = true;
      this.initPage();
      this.timeSelectedId = timeId;
      this.switchFilterDialog();
      this.getCurPageData();
    },
    selectOrderType (orderId) {
      this.isLoad = true;
      this.initPage();
      this.orderSelectedId = orderId;
      this.switchFilterDialog();
      this.getCurPageData();
    },
    selectTagMenu (tag_id) {
      this.$router.replace({name: 'question-answer', params: {tag_id, is_change_tag: true}})
    },
    updatePostList () {
      this.initPage();
      this.getCurPageData();
    },
    updateKeyword (keyword) {
      this.search_keyword = keyword;
    },
    updateCurPage (page) {
      this.scrollToTop();
      this.curPage = page;
      this.getCurPageData();
    },
    getPostList (order) {
      this.$store.dispatch('Post/GET_POST_LIST', order);
    },
    handleCommand (command) {
      this.timeCommand = command;
    },
    setIsSearchPage () {
      if (!this.search_keyword) this.isSearchPage = false;
      else this.isSearchPage = true;
    },
    async getCurPageData () {
      this.setIsSearchPage();

      const params = {
        page: this.curPage,
        limit: this.limit,
        keyword: this.search_keyword
      }

      if (this.activeTag && this.activeTag.id !== 'all') params.tag = this.activeTag.text;
      if (this.isSearchPage && this.activeTime.value) params.recent = this.activeTime.value;
      else if (!this.isSearchPage && this.activeOrder.value) params.order = this.activeOrder.value;

      const res = await this.$store.dispatch('Post/GET_POST_LIST', params);
      if (res.result === 'ok') {
        this.postList = res.rows;
        this.total = res.count;
        this.isLoad = false;
      }
    },
    jumpPublish () {
      this.$router.push({path: '/publish'});
    }
  }
}
</script>

<style lang="scss" scoped>
@import './style';
</style>
