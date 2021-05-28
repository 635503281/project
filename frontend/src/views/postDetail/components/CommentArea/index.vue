<template>
<ul class="comment-area" v-if="commentList.length > 0">
  <li class="comment-item-wrapper" v-for="(comment, index) in commentList" :key="comment.id">
    <div class="comment-item-container">
      <comment-card
        :comment="comment"
        v-bind="$attrs"
        :topCommentId="comment.id"
        @insertReplyItem="insertReplyItem"
        @delCommentItem="delCommentItem(index)"/>
      <reply-area
        :topCommentId="comment.id"
        v-bind="$attrs"
        v-if="true"
        :ref="`reply-area_${comment.id}`"/>
    </div>
  </li>
  <load-more
    @loadNextPage="loadNextPage"
    :reqLock="reqLock"
    :canLoadList="canLoadList"/>
</ul>
</template>

<script>
import CommentCard from '../CommentCard/index';
import ReplyArea from '../ReplyArea/index';
import LoadMore from '../LoadMore/index';
export default {
  data () {
    return {
      page: 1,
      commentList: [],
      reqLock: false,
      canLoadList: true
    }
  },
  components: {
    CommentCard,
    ReplyArea,
    LoadMore
  },
  mounted () {
    this.getCommentList();
  },
  methods: {
    /**
    * 根据评论区索引更新评论区列表
    * @param {Number} areaIdx 评论区索引 
    */
    updateReplyList(areaIdx) {
      this.$refs['reply-area'][areaIdx].updateReplyList();
    },
    /**
    * 插入评论信息，插入头部
    * @param {Object} commentInfo 评论信息
    */
    insertCommentItem (commentInfo) {
      this.commentList.unshift(commentInfo);
    },
    /**
    * 插入回复信息，插入尾部
    * @param {Object} {replyInfo} 回复信息
    */
    insertReplyItem (replyInfo) {
      this.$refs[`reply-area_${replyInfo.parent_id}`][0].insertReplyItem(replyInfo);
    },
    /**
    * 删除评论条目
    * @param {Number} idx 评论索引
    */
    delCommentItem (idx) {
      this.commentList.splice(idx, 1);
    },
    switchReqLock () {
      this.reqLock = !this.reqLock;
    },
    loadNextPage () {
      if (!this.reqLock) {
        this.page++;
        this.getCommentList();
      }
    },
    /**
    * 获取评论列表
    */
    async getCommentList() {
      const param = {
        id: this.$attrs.postId,
        parent_id: 0,
        page: this.page,
        limit: 6,
        order: 'desc'
      }
      this.switchReqLock();
      const res = await this.$store.dispatch('Comment/GET_COMMENT_LIST', param);
      if (res.result === 'ok') {
        this.switchReqLock();
        this.commentList.push(...res.rows);
        const commLen = this.commentList.length;
        if (res.count > commLen) {
          this.canLoadList = true;
        } else if (this.page > 1 && commLen >= res.count) {
          this.canLoadList = false;
        } else if (res.count <= param.limit) {
          this.canLoadList = false;
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import './style';
</style>