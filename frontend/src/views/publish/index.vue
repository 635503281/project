<template>
  <div class="publish-artical">
    <page-title :titleText="isEditPage ? '修改问题' : '发布问题'" :isEdited="isEdited"/>
    <div class="ques-title">
      <div class="desc-wrapper">
        <h3 class="input-desc">问题标题</h3>
        <div class="ques-icon">
          <svg-icon class="icon-wenhao" name="iconwenhao-icon"/>
          <ques-desc/>
        </div>
      </div>
      <div class="input-wrapper">
        <input class="title-input" maxlength="50" placeholder="标题不能为空且长度不能超过50个字" v-model="quesTitle"/>
        <span :class="['count', {'limited': quesTitle.length >= 50}]">{{`${quesTitle.length} / 50`}}</span>
      </div>
    </div>
    <app-editor class="publish-editor" ref="editor" @updateEditorVal="updateEditorVal"/>
    <div class="tag-wrapper">
       <div class="tag-desc">问题标签</div>
       <ul class="selected-list" v-show="checkedList.length > 0">
         <li class="tag-item" v-for="(item, idx) in checkedList" :key="idx">
           <span class="tag-text" v-text="item"></span>
           <svg-icon class="tag-del-icon" name="icondel-tag" @click.native="delTag(idx)"/>
         </li>
       </ul>
       <span class="add-tag" @click="showAddTagDialog()">
         <svg-icon name="iconadd-tag-icon"/>
         <span class="add-tag-text" v-text="`添加问题标签(${checkedList.length}/3)`"></span>
       </span>
    </div>
    <add-tag-dialog ref="tag-dialog" v-model="isShowAddTag" @selectedTag="selectedTag"/>
    <div class="btn-publish">
      <button :class="['btn', canPulish ? 'btn-submit' : 'btn-default']"
        @click="isEditPage ? editPost() : publishPost()" 
        v-text="isEditPage ? '修改并发布' : '发布'"></button>
    </div>
    <el-dialog
      title="修改问题"
      width="450px"
      :visible.sync="isShowEditDialog">
      <div class="dialog-content">
        确定修改为当前内容？修改后新内容会覆盖旧内容且不可恢复。
      </div>
      <div class="dialog-footer" slot="footer">
        <button class="btn btn-cancel" @click="switchEditDialog()">取消</button>
        <button class="btn btn-submit" @click="publishPost()">修改并发布</button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import QuesDesc from './components/QuesDesc/index';
import AddTagDialog from './components/AddTagDialog/index';
import AppEditor from '@/components/AppEditor';
import PageTitle from '@/components/PageTitle';

export default {
  name: 'publish',
  data () {
    return {
      quesTitle: '',
      isShowAddTag: false,
      isShowEditDialog: false,
      checkedList: [],
      editorValue: '',
      postId: this.$route.query.id,
      detailData: null,
      reqLock: false
    }
  },
  components: {
    QuesDesc,
    AddTagDialog,
    AppEditor,
    PageTitle
  },
  computed: {
    isEditPage () {
      // type = 1为编辑页
      return parseInt(this.$route.query.type) === 1;
    },
    canPulish () {
      return this.editorValue && this.quesTitle && this.checkedList.length > 0;
    },
    isEdited () {
      return !!this.editorValue || !!this.quesTitle || this.checkedList.length > 0;
    }
  },
  mounted () {
    if (this.isEditPage) {
      this.getPostDetail();
    }
  },
  methods: {
    showAddTagDialog () {
      this.isShowAddTag = true;
    },
    selectedTag (list) {
      this.checkedList = list;
    },
    updateEditorVal (val) {
      this.editorValue = val;
    },
    delTag (idx) {
      this.checkedList.splice(idx, 1);
    },
    switchEditDialog () {
      this.isShowEditDialog = !this.isShowEditDialog;
    },
    async getPostDetail () {
      const params = {
        postId: this.postId,
      }
      const res = await this.$store.dispatch('Post/GET_POST_DETAIL', params);
      this.detailData = res.object;
      //将tag变为数组
      this.detailData.tag = res.object.tag.split(",");
      this.quesTitle = this.detailData.title;
      this.$refs['tag-dialog'].initCheckList(this.detailData.tag);
      this.$refs['editor'].initEditorContent(this.detailData.content);
    },
    jumpPostDetail (postId) {
      this.$router.push({name: 'post-detail', params: {id: postId}});
    },
    editPost () {
      if (this.canPulish) {
        this.switchEditDialog();
      }
    },
    switchReqLock () {
      this.reqLock = !this.reqLock;
    },
    async publishPost () {
      if (this.reqLock || !this.canPulish) {
        return;
      }
      if (this.editorValue.length > 4e3 ) {
        this.$notify({
          title: '内容最多为4000字',
          type: 'warning'
        });
        return;
      }
      const param = {
        title: this.quesTitle,
        content: this.editorValue,
        tag: this.checkedList.join(',')
      }
      let actionName = 'Post/CREATE_POST';
      if (this.isEditPage) {
        param.id = parseInt(this.postId);
        actionName = 'Post/UPDATE_POST';
      }
      this.switchReqLock();
      const res = await this.$store.dispatch(actionName, param);
      let dialogMsgTag;
      if (!this.isEditPage) {
        dialogMsgTag = '发布';
      } else {
        dialogMsgTag = '修改';
      }
      if (res && res.result === 'ok') {
        this.$notify({
          title: `${dialogMsgTag}成功`,
          type: 'success'
        });
        this.isEditPage ? this.jumpPostDetail(this.detailData.id) : this.jumpPostDetail(res.id);
      } else {
        this.$notify({
          title: `${dialogMsgTag}失败`,
          type: 'error'
        });
      }
      this.switchReqLock();
    }
  }
}
</script>

<style lang="scss" scoped>
@import './style.scss';
</style>
