<template>
<div class="detail-info">
  <content-loading v-if="!postDetailData"/>
  <template v-else>
    <h1 class="post-title" v-html="detailTitle"></h1>
    <div class="post-info">
      <span class="info-item creator" v-if="postDetailData.creator">{{postDetailData.creator.nickname}}</span>
      <span class="info-item">{{postDetailData.updated_at | parseSpacingTime}}</span>
      <span class="info-item">{{postDetailData.read_count}}浏览</span>
    </div>
    <p class="post-content" v-html="postDetailData.content"></p>
    <div class="menu-wrapper sticky-menu" ref="bot-menu">
      <div class="left-menu">
        <button class="btn-reply" @click="scrollToEditor()">回答</button>
        <button class="btn-approve" @click="switchApprove()">
          <svg-icon class="btn-icon" name="iconwhite-approve-arrow-icon"/>
          <span class="btn-text desc" v-text="isApprove ? '已支持' : '求解决'"></span>
          <span class="btn-text" v-if="isApprove" v-text="inner_approve_count"></span>
        </button>
      </div>
      <div class="right-menu">
        <button v-if="isOwner" class="btn" @click="jumpEditPost">
          <svg-icon class="icon edit-icon" name="iconedit-icon"/>
          <span>修改问题</span>
        </button>
      </div>
    </div>
  </template>
</div>
</template>

<script>
import ContentLoading from '../ContentLoading/detailInfoLoading';
import scrollPlugin from '@/plugin/scrollPlugin';
import Helpers from '@/plugin/helpers';
export default {
  data () {
    return {
      approveReqLock: false,
      followReqLock: false,
      inner_follow_state: false,
      inner_approve_state: false,
      inner_approve_count: 0,
      inner_follow_count: 0
    }
  },
  props: {
    postDetailData: {
      type: Object
    }
  },
  components: {
    ContentLoading
  },
  watch: {
    postDetailData (detailData) {
      if (detailData) {
        this.inner_approve_state = detailData.is_approved || 0;
        this.inner_follow_state = detailData.is_attentioned || 0;
        this.inner_approve_count = detailData.approval_count || 0;
        this.inner_follow_count = detailData.follow_count || 0;
      }
    }
  },
  computed: {
    detailTitle () {
      return Helpers.xssFilter(this.postDetailData.title);
    },
    isFollow: {
      get () {
        return this.inner_follow_state;
      },
      set (follow_state) {
        if (follow_state) this.inner_follow_count++;
        else if (!follow_state) this.inner_follow_count--;
        this.inner_follow_state = follow_state;
      }
    },
    isApprove: {
      get () {
        return this.inner_approve_state;
      },
      set (approve_state) {
        if (approve_state) this.inner_approve_count++;
        else if (!approve_state) this.inner_approve_count--;
        this.inner_approve_state = approve_state;
      }
    },
    userInfo () {
      return this.$store.getters['User/userInfo'];
    },
    isOwner () {
      return this.userInfo.user_id === this.postDetailData.creator.user_id
    }
  },
  methods: {
    switchFollowReqlock () {
      this.followReqLock = !this.followReqLock;
    },
    switchApproveReqlock () {
      this.approveReqLock = !this.approveReqLock;
    },
    scrollToEditor () {
      new scrollPlugin().scrollToBottom();
      this.$emit('focusEditor');
    },
    jumpEditPost () {
      this.$router.push({path: '/edit-post', query: {id: this.postDetailData.id, type: 1}});
    },
    switchApprove () {
      if (this.approveReqLock) return;

      const reqAcionMap = {
        approve: 'Post/APPROVE_POST',
        cancel_approve: 'Post/CANCEL_APPROVE_POST'
      }
      this.switchApproveReqlock();
      if (this.isApprove) {
        this.requestSwitchApprove(reqAcionMap.cancel_approve);
      } else {
        this.requestSwitchApprove(reqAcionMap.approve);
      }
    },
    switchApproveState () {
      this.isApprove = !this.isApprove;
    },
    async requestSwitchApprove (action) {
      const res = await this.$store.dispatch(action, {id: this.postDetailData.id});
      if (res && res.result === 'ok') {
        this.switchApproveState();
        this.switchApproveReqlock();
      }
    },
    switchFollow() {
      if (this.followReqLock) return;

      const reqAcionMap = {
        follow: 'Post/FOLLOW_POST',
        unfollow: 'Post/CANCEL_FOLLOW_POST'
      }
      this.switchFollowReqlock();
      if (this.isFollow) {
        this.requestSwitchFollow(reqAcionMap.unfollow);
      } else {
        this.requestSwitchFollow(reqAcionMap.follow);
      }
    },
    switchFollowState () {
      this.isFollow = !this.isFollow;
    },
    async requestSwitchFollow (action) {
      const res = await this.$store.dispatch(action, {id: this.postDetailData.id});
      if (res && res.result === 'ok') {
        this.switchFollowState();
        this.switchFollowReqlock();
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import './style';
</style>