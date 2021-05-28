<template>
  <content-loader
    :width="260"
    :height="40"
    :speed="2"
    primaryColor="#f3f3f3"
    secondaryColor="#ecebeb"
  >
    <rect x="0" y="20" rx="0" ry="0" width="80" height="20" /> 
    <rect x="90" y="20" rx="0" ry="0" width="80" height="20" /> 
  </content-loader>
</template>

<script>
  import { ContentLoader } from "vue-content-loader";

  export default {
    components: {
      ContentLoader
    }
  }
</script>
