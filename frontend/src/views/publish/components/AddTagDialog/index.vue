<template>
  <el-dialog
    title="添加问题标签"
    :visible.sync="inner_val"
    width="450px">
    <p class="selected-desc">请选择需要添加的标签 (最多支持选择3个)</p>
    <el-checkbox-group v-model="checkedList" :max="3">
      <el-checkbox v-for="(tag, idx) in tagList" :key="idx" :label="tag"></el-checkbox>
    </el-checkbox-group>
    <div slot="footer" class="dialog-footer">
      <button class="btn btn-cancel" @click="inner_val = false">取消</button>
      <button :class="['btn', 'btn-submit' , checkedList.length <= 0 && 'btn-disabled-submit']" @click="selectedTag()">确定</button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      inner_val: false,
      tagList: [
        '消息',
        '文档',
        '日历',
        '会议',
        'WPS Office',
        'WPS Mac',
        '账号、云、协作',
        '会员增值',
        '稻壳'
      ],
      checkedList: []
    }
  },
  props: {
    value: {
      type: Boolean
    }
  },
  watch: {
    value (val) {
      this.inner_val = val;
    },
    inner_val (val) {
      this.$emit('input', val);
    }
  },
  methods: {
    selectedTag () {
      this.inner_val = false;
      this.$emit('selectedTag', this.checkedList);
    },
    initCheckList (initChecked) {
      this.checkedList = initChecked;
      // manual emit checked list for parent component
      this.$emit('selectedTag', this.checkedList);
    }
  }
}
</script>

<style lang="scss">
@import './style';
</style>