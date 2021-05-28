<template>
  <content-loader
    :width="1140"
    :height="106"
    :speed="2"
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
  >
    <rect x="20" y="30" rx="0" ry="0" width="350" height="22" /> 
    <rect x="20" y="80" rx="0" ry="0" width="60" height="20" />
    <rect x="1030" y="80" rx="0" ry="0" width="110" height="17" />
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

