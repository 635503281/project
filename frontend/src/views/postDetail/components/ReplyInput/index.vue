<template>
  <div class="reply-input-wrapper" >
    <input ref="reply-input" type="text" class="reply-input" @blur="hiddenReplyInput()" :placeholder="`回复 ${replyToName}`" v-model="replyText"/>
    <button :class="['reply-btn', {'btn-default': !replyText}]" @click="replyComment">回复</button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      replyText: ''
    }
  },
  props: {
    replyToId: {
      type: [Number, String]
    },
    replyToUser: {
      type: Object
    }
  },
  computed: {
    replyToName () {
      return this.replyToUser.nickname
    },
    userInfo () {
      return this.$store.getters['User/userInfo'];
    }
  },
  methods: {
    async replyComment () {
      if (!this.replyText) return;
      if (this.replyText.length > 1e3 ) {
        this.$notify({
          title: '内容最多为1000字',
          type: 'warning'
        });
        return;
      }
      const params = {
        // id: this.$attrs.postId,
        topic_id: parseInt(this.$attrs.postId),
        parent_id: this.$attrs.topCommentId,
        replied_comment_id: this.replyToId,
        content: this.replyText
      }
      const res = await this.$store.dispatch('Comment/CREATE_COMMENT', params);
      if (res.result === 'ok') {
        this.$notify({
          title: '评论成功',
          type: 'success'
        });
        // set reply information for insert list
        res.object.creator = this.userInfo;
        res.object.replied_user = this.replyToUser;
        this.$emit('insertReplyItem', res.object);
        this.clearReplyText();
      }
    },
    clearReplyText () {
      this.replyText = '';
    },
    hiddenReplyInput () {
      setTimeout(() => {
        this.$emit('switchReply');
      }, 200);
    },
    focusInput() {
      setTimeout(() => {
        this.$refs['reply-input'].focus();
      }, 100);
    }
  }
}
</script>

<style lang="scss" scoped>
@import './style';
</style>
