<template>
  <div class="reply-area">
    <ul class="reply-wrapper" v-show="replyList.length > 0">
      <div class="reply-wrapper-container" v-for="(comment, index) in replyList" :key="comment.id">
        <comment-card
          class="reply-item"
          :comment="comment"
          :isReplyArea="true"
          v-bind="$attrs"
          @insertReplyItem="insertReplyItem($event, 'children')"
          @delCommentItem="delCommentItem(index)"
        />
        <reply-area
          :parentId="comment.id"
          v-bind="$attrs"
          v-if="true"
          :ref="`reply-area_${comment.id}`"/>
      </div>
      
      <load-more
        @loadNextPage="loadNextPage"
        :reqLock="reqLock"
        :canLoadList="canLoadList"/>
    </ul>
  </div>
</template>

<script>
import CommentCard from '../CommentCard/index';
import LoadMore from '../LoadMore/index';
export default {
  name: 'ReplyArea',
  data () {
    return {
      replyList: [],
      page: 1,
      reqLock: false,
      canLoadList: true
    }
  },
  components: {
    CommentCard,
    LoadMore
  },
  props: {
    replyToId: {
      type: [Number, String]
    }
  },
  mounted () {
    this.getReplyList();
  },
  methods: {
    loadNextPage () {
      if (!this.reqLock) {
        this.page++;
        this.getReplyList();
      }
    },
    switchReqLock () {
      this.reqLock = !this.reqLock;
    },
    delCommentItem (idx) {
      this.replyList.splice(idx, 1);
    },
    insertReplyItem (replyInfo, type) {
      //type === children 让其插到他的子回复区中
      if(!type){
        !this.canLoadList && this.replyList.push(replyInfo);
      }else{
        this.$refs[`reply-area_${replyInfo.replied_comment_id}`][0].insertReplyItem(replyInfo);
      }
      
      
    },
    /**
    * 获取回复列表
    */
    async getReplyList() {
      const param = {
        id: this.$attrs.postId,
        parent_id: this.$attrs.topCommentId,
        replied_comment_id: this.$attrs.parentId,//comment的直属parent
        page: this.page,
        limit: 2,
        order: 'asc'
      }
      this.switchReqLock();
      const res = await this.$store.dispatch('Comment/GET_COMMENT_LIST', param);
      if (res.result === 'ok') {
        this.switchReqLock();
        this.replyList.push(...res.rows);
        const replyLen = this.replyList.length;
        if (res.count > replyLen) {
          this.canLoadList = true;
        } else if (this.page > 1 &&  replyLen >= res.count) {
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
@import './style.scss';
</style>