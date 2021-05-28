<template>
<div class="editor-wrapper">
  <user-info class="user-info" :userInfo="userInfo" :isTopComment="true"/>
  <app-editor ref="editor" @updateEditorVal="updateEditorVal"/>
  <div class="btn-publish">
    <button :class="['btn', canPulish ? 'btn-submit' : 'btn-default']" @click="publishComment">发表</button>
  </div>
</div>
</template>

<script>
import AppEditor from '@/components/AppEditor';
import UserInfo from '../UserInfo/index';
export default {
  data () {
    return {
      editorValue: '',
    }
  },
  props: {
    postId: {
      type: [String, Number]
    }
  },
  components: {
    AppEditor,
    UserInfo
  },
  computed: {
    userInfo () {
      return this.$store.getters['User/userInfo'];
    },
    canPulish () {
      return !!this.editorValue;
    }
  },
  methods: {
    focusEditor () {
      this.$refs['editor'].focusEditor();
    },
    clearEditorVal () {
      this.$refs.editor.clearEditorVal();
    },
    updateEditorVal (val) {
      this.editorValue = val;
    },
    async publishComment () {
      if (!this.editorValue) {
        return;
      }
      if (this.editorValue.length > 4e3 ) {
        this.$notify({
          title: '内容最多为4000字',
          type: 'warning'
        });
        return;
      }
      let param = {
        // id: this.postId,
        topic_id: parseInt(this.postId),
        replied_user_id: this.userInfo.user_id,
        content: this.editorValue
      }
      const res = await this.$store.dispatch('Comment/CREATE_COMMENT', param);
      if (res && res.result === 'ok') {
        this.$notify({
          title: '发表成功',
          type: 'success'
        });
        this.clearEditorVal();
        // insert comment info
        const commentInfo = {
          created_at: Date.now(),
          updated_at: Date.now(),
          id: res.comment_id||res.id,
          creator: this.userInfo,
          content: this.editorValue,
          replied_user_id: this.userInfo.user_id,
          approve_count: res.object?.approve_count||0
        };
        this.$emit('insertCommentItem', commentInfo);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import './style';
</style>