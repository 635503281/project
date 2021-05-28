<template>
  <div class="prompt-page">
    <img :src="require('@/assets/img/loading-icon.svg')" alt="prompt-icon"/>
    <div class="prompt-box" v-if="promptType === 'none-data'">
      <span class="prompt-text">没有想要的内容？</span>
      <button class="publish-btn" @click="$emit('jumpPublish')">提问</button>
    </div>
    <span class="prompt-text" v-else>正在搜索，请稍后…</span>
  </div>
</template>

<script>
export default {
  name: 'Prompt-Page',
  props: {
    promptType: {
      type: String
    }
  }
}
</script>

<style lang="scss" scoped>
.prompt-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 366px;
  .prompt-text {
    margin-top: 4px;
    height: 20px;
    line-height: 20px;
    color: #767C85;
  }
  .prompt-box {
    .publish-btn {
      background: var(--blueColor);
      color: white;
      font-size: 12px;
      height: 24px;
      line-height: 24px;
      border-radius: 2px;
      padding: 0 16px;
      cursor: pointer;
    }
  }
}
</style>
