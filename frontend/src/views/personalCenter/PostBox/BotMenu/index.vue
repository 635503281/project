<template>
<div class="bot-menu" @click.stop="void 0;">
  <div class="left-action-list">
    <a class="menu-item action-btn" v-if="hasEdit" @click.stop="jumpEdit()">
      <svg-icon class="action-icon" name="iconedit-light-icon"/>
      <span class="action-text active-text">编辑</span>
    </a>
    <a class="menu-item action-btn" v-else-if="hasApprove" @click="switchApprove()">
      <svg-icon class="action-icon" :name="isApprove ? 'iconapprove-arrow-active-icon' : 'iconapprove-arrow-icon'"/>
      <span :class="['action-text', isApprove ? 'active-text' : 'default-text']" v-text="isApprove ? '已支持' : '求解决'"></span>
    </a>
    <a class="menu-item action-btn" v-else-if="hasFollow" @click="switchFollow()">
      <svg-icon class="action-icon" :name="isFollow ? 'iconfollow-active-icon' : 'iconfollow-icon'"/>
      <span :class="['action-text', isFollow ? 'active-text' : 'default-text']" v-text="isFollow ? '取消关注' : '关注问题'"></span>
    </a>
    <count-list v-if="countPosition === 'left'" v-bind="$attrs"/>
  </div>
  <div class="right-action-list">
    <count-list v-if="countPosition === 'right'" v-bind="$attrs"/>
    <button class="menu-item" v-if="hasDel" @click.stop="switchDialog()">
      <svg-icon class="action-icon" name="icondelete-icon"/>
      <span class="action-text active-text">删除</span>
    </button>
  </div>
  <el-dialog
    title="删除"
    width="450px"
    :visible.sync="isShowDelDialog">
    <div class="dialog-content">
      确定删除帖子？删除后，帖子内容及相关评论和回复也会被删除，不可恢复。
    </div>
    <div class="dialog-footer" slot="footer">
      <button class="btn btn-cancel" @click.stop="switchDialog()">取消</button>
      <button class="btn btn-delete" @click.stop="delPost()">删除</button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import CountList from '../CountList/index'
export default {
  data () {
    return {
      isShowDelDialog: false,
      isApprove: true,
      isFollow: true,
      followReqLock: false,
      approveReqLock: false
    }
  },
  components: {
    CountList
  },
  props: {
    hasFollow: {
      type: Boolean
    },
    hasApprove: {
      type: Boolean
    },
    countPosition: {
      type: String
    },
    hasEdit: {
      type: Boolean
    },
    hasDel: {
      type: Boolean
    }
  },
  methods: {
    switchFollowReqlock () {
      this.followReqLock = !this.followReqLock;
    },
    switchApproveReqlock () {
      this.approveReqLock = !this.approveReqLock;
    },
    switchFollowState() {
      this.isFollow = !this.isFollow;
    },
    switchApproveState() {
      this.isApprove = !this.isApprove;
    },
    jumpEdit () {
      this.$router.push({path: '/edit-post', query: {id: this.$attrs.postId, type: 1}})
    },
    switchDialog () {
      this.isShowDelDialog = !this.isShowDelDialog;
    },
    async switchApprove () {
      if (this.approveReqLock) return;

      const params = {
        id: this.$attrs.postId
      }
      this.switchApproveReqlock();
      if (this.isApprove) {
        const res = await this.$store.dispatch('Post/CANCEL_APPROVE_POST', params);
        if (res.result === 'ok') {
          this.switchApproveState();
          //取消关注赞同后，删除数据，刷新个人统计
          this.$eventBus.emit('delLocalItem', this.$attrs.postId);
        }
      } else {
        const res = await this.$store.dispatch('Post/APPROVE_POST', params);
        if (res.result === 'ok') {
          this.switchApproveState();
        }
      }
      this.switchApproveReqlock();
    },
    async switchFollow () {
      if (this.followReqLock) return;

      const params = {
        id: this.$attrs.postId
      }
      this.switchFollowReqlock();
      if (this.isFollow) {
        const res = await this.$store.dispatch('Post/CANCEL_FOLLOW_POST', params);
        if (res.result === 'ok') {
          this.switchFollowState();
        }
      } else {
        const res = await this.$store.dispatch('Post/FOLLOW_POST', params);
        if (res.result === 'ok') {
          this.switchFollowState();
        }
      }
      await this.$store.dispatch('User/GET_USER_STATISTICS');
      this.switchFollowReqlock();
    },
    async delPost () {
      this.switchDialog();
      const params = {
        id: this.$attrs.postId
      }
      const res = await this.$store.dispatch('Post/DELETE_POST', params);
      if (res.result === 'ok') {
        this.$notify({
          title: '删除成功',
          type: 'success'
        });
        this.$eventBus.emit('delLocalItem', this.$attrs.postId);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import './style';
</style>