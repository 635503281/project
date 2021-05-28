<template>
  <div class="detail-wrapper">
    <template v-if="!isRequested || (isRequested && postDetailData)">
      <div class="top-bar">
        <a class="back-btn"  @click="jumpBack()">
          <svg-icon name="iconleft-arrow-icon-copy"></svg-icon>
          <span>返回</span>
        </a>
      </div>
      <div class="detail-container">
        <div class="left-content">
          <detail-info
            :postDetailData="postDetailData"
            @focusEditor="focusEditor()"
            @updateDetail="getPostDetail()"/>
          <comment-area v-if="postDetailData" ref="comment-area" :postId="postId"/>
          <comment-editor
            v-if="postDetailData"
            ref="comment-editor"
            :postId="postId"
            @insertCommentItem="insertCommentItem"/>
        </div>
        <div class="tag-info">
          <h1 class="tag-title">问题标签</h1>
          <tag-content-loading v-if="!postDetailData"/>
          <template v-else>
            <ul class="tag-list" v-if="postDetailData.tag">
              <li class="tag-item" v-for="(tag, idx) in postDetailData.tag" v-text="tag" :key="idx"></li>
            </ul>
          </template>
        </div>
      </div>
    </template>
    <none-data v-else-if="isRequested && !postDetailData" :isBtn="true"/>
  </div>
</template>

<script>
import DetailInfo from './components/DetailInfo/index';
import CommentArea from './components/CommentArea/index';
import CommentEditor from './components/CommentEditor/index';
import TagContentLoading from './components/ContentLoading/tagsLoading';
import NoneData from '@/components/NoneData/index';

export default {
  name: 'post-detail',
  data () {
    return {
      postId: this.$route.params.id,
      postDetailData: null,
      isRequested: false
    }
  },
  components: {
    CommentArea,
    CommentEditor,
    DetailInfo,
    TagContentLoading,
    NoneData
  },
  mounted () {
    this.getPostDetail();
  },
  methods: {
    async getPostDetail () {
      const params = {
        postId: this.postId,
      }
      try {
        const res = await this.$store.dispatch('Post/GET_POST_DETAIL', params);
        this.postDetailData = res.object;
        //将tag变为数组
        this.postDetailData.tag = res.object.tag.split(",");
      } finally {
        this.isRequested = true;
      }
    },
    insertCommentItem (commentInfo) {
      this.$refs['comment-area'].insertCommentItem(commentInfo);
    },
    focusEditor () {
      this.$refs['comment-editor'].focusEditor();
    },
    jumpBack () {
      this.$router.go(-1);
    }
  }
}
</script>

<style lang="scss" scoped>
@import './style';
</style>