<template>
  <li class="comment-item">
    <user-info :userInfo="comment.creator" :replyToInfo="comment.replied_user" :isTopComment="true">
      <span class="time" slot="time">{{comment.created_at | parseSpacingTime}}</span>
    </user-info>
    <p class="comment-content" v-html="commentContent"></p>
    <div class="bot-menu">
      <div class="menu-item" @click.stop="switchApproveComment()" v-if="true">
        <template v-if="!isApprove">
          <svg-icon class="icon" name="iconapprove-icon"/>
          <span class="text limit-w">赞</span>
        </template>
        <template v-else>
          <svg-icon class="icon" name="iconapproved-icon"/>
          <span class="count-text limit-w" v-text="approveCount"></span>
        </template>
      </div>
      <div class="menu-item" @click.stop="switchIsReply()" v-if="true">
        <svg-icon class="icon" name="iconcomment-icon"/>
        <span class="text limit-w">回复</span>
      </div>
      <div class="menu-item" @click.stop="switchDelDialog()" v-if="comment.creator.user_id === userId">
        <svg-icon class="icon" name="icondelete-icon"/>
        <span class="text limit-w">删除</span>
      </div>
    </div>
    <reply-input
      ref="replyComp"
      :replyToId="comment.id"
      :replyToUser="comment.creator"
      v-bind="$attrs"
      v-show="isReply"
      @insertReplyItem="emitReplyItem"
      @switchReply="switchIsReply()"/>
    <el-dialog
      title="删除"
      width="450px"
      :visible.sync="isShowDelDialog">
      <div class="dialog-content">
        确定删除评论？删除后将不可恢复。
      </div>
      <div class="dialog-footer" slot="footer">
        <button class="btn btn-cancel" @click.stop="switchDelDialog()">取消</button>
        <button class="btn btn-delete" @click.stop="delComment()">删除</button>
      </div>
    </el-dialog>
  </li>
</template>

<script>
import UserInfo from '../UserInfo/index';
import ReplyInput from '../ReplyInput/index';
import Helpers from '@/plugin/helpers';
export default {
  data ()  {
    return {
      isReply: false,
      isShowDelDialog: false,
      inner_approve_state: false,
      inner_approve_count: null,
      reqLock: false
    }
  },
  props: {
    comment: {
      type: Object
    },
    isReplyArea: {
      type: Boolean,
      default: false
    }
  },
  components: {
    UserInfo,
    ReplyInput
  },
  computed: {
    approveCount: {
      get () {
        return this.inner_approve_count;
      },
      set (approve_count) {
        this.inner_approve_count = approve_count;
      }
    },
    commentContent () {
      if (this.isReplyArea) return Helpers.xssFilter(this.comment.content);
      else return this.comment.content;
    },
    isApprove: {
      get () {
        return this.inner_approve_state;
      },
      set (approve_state) {
        this.inner_approve_state = approve_state;
      }
    },
    userId () {
      return this.$store.getters['User/userInfo'].user_id;
    }
  },
  mounted () {
    this.initData();
  },
  methods: {
    initData () {
      this.inner_approve_state = this.comment.is_approved;
      this.inner_approve_count = parseInt(this.comment.approve_count);
    },
    switchReqlock () {
      this.reqLock = !this.reqLock;
    },
    emitReplyItem (item) {
      this.$emit('insertReplyItem', item)
    },
    switchApproveState () {
      this.isApprove = !this.isApprove;
    },
    switchApproveComment () {
      if (this.isApprove) {
        this.cancelApproveComment();
      } else {
        this.approveComment();
      }
    },
    async approveComment () {
      if (this.reqLock) return;

      const param = {
        comment_id: this.comment.id
      }
      this.switchReqlock();
      const res = await this.$store.dispatch('Comment/APPROVE_COMMENT', param);
      if (res && res.result === 'ok') {
        this.switchApproveState();
        this.approveCount++;
        this.switchReqlock();
      }
    },
    async cancelApproveComment () {
      if (this.reqLock) return;

      const param = {
        comment_id: this.comment.id
      }
      this.switchReqlock();
      const res = await this.$store.dispatch('Comment/CANCEL_APPROVE_COMMENT', param);
      if (res && res.result === 'ok') {
        this.switchApproveState();
        this.approveCount--;
        this.switchReqlock();
      }
    },
    switchIsReply () {
      this.isReply = !this.isReply;
      // set focus when reply input is visibility;
      if (this.isReply) {
        this.$refs['replyComp'].focusInput();
      }
    },
    switchDelDialog () {
      this.isShowDelDialog = !this.isShowDelDialog;
    },
    async delComment () {
      const params = {
        comment_id: this.comment.id
      }
      const res = await this.$store.dispatch('Comment/DELETE_COMMENT', params);
      if (res && res.result === 'ok') {
        this.switchDelDialog();
        this.$notify({
          title: '删除成功',
          type: 'success'
        });
        this.$emit('delCommentItem', params.comment_id);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import './style';
</style>
