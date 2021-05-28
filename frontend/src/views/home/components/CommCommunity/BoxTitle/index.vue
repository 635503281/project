<template>
  <div class="title-wrapper">
    <h1 class="title">
      <slot/>
    </h1>
    <slot name="btn"/>
  </div>
</template>

<script>
export default {
  name: 'Box-Title'
}
</script>

<style lang="scss" scoped>
@import './style';
</style>
