<template>
  <div class="page-title-wrapper">
    <h1 class="title" v-text="titleText"></h1>
    <a class="back-link" @click="isEdited ? switchDialog() : goHome()">&lt; 返回首页</a>
    <el-dialog
      title="放弃编辑"
      width="450px"
      :visible.sync="isShowDialog">
      <div class="dialog-content">
        确定放弃当前编辑操作，并返回到首页？
      </div>
      <div class="dialog-footer" slot="footer">
        <button class="btn btn-cancel" @click.stop="switchDialog()">取消</button>
        <button class="btn btn-delete" @click.stop="goHome()">放弃</button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      isShowDialog: false
    }
  },
  props: {
    titleText: {
      type: String
    },
    isEdited: {
      type: Boolean
    }
  },
  methods: {
    goHome () {
      this.$router.push('/');
    },
    switchDialog () {
      this.isShowDialog = !this.isShowDialog;
    }
  }
}
</script>

<style lang="scss" scoped>
@import './style';
</style>