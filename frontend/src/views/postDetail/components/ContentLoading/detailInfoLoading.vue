<template>
  <content-loader
    :width="650"
    :height="160"
    :speed="2"
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
  >
    <rect x="0" y="10" rx="0" ry="0" width="250" height="20" /> 
    <rect x="0" y="45" rx="0" ry="0" width="200" height="15" /> 
    <rect x="0" y="75" rx="0" ry="0" width="600" height="50" /> 
    <rect x="0" y="140" rx="0" ry="0" width="115" height="15" />
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
