<template>
  <content-loader
    :width="500"
    :height="100"
    :speed="2"
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
  >
    <rect x="15" y="20" rx="0" ry="0" width="250" height="15" /> 
    <rect x="15" y="45" rx="0" ry="0" width="350" height="15" /> 
    <rect x="15" y="70" rx="0" ry="0" width="450" height="15" />
  </content-loader>
</template>

<script>
import { ContentLoader } from "vue-content-loader"

export default {
  components: {
    ContentLoader
  }
}
</script>

<style lang="scss" scoped>
@import './style';
</style>