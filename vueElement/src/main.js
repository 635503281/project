// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/router'
import store from "./store/store"
import i18n from "./i18n/i18n"
import "./http/axios"
import "lib-flexible"

import Element from "element-ui"
import "element-ui/lib/theme-chalk/index.css"
Vue.use(Element);

import "./common/common"


Vue.config.productionTip = false

/* eslint-disable no-new */
// new Vue({
//   // el: '#app',
//   router,
//   store,
//   i18n,
//   // components: { App },
//   // template: '<App/>',
//   render:h=>h(App)

// }).$mount('#app');

new Vue({
  el:"#app",
  router,
  store,
  i18n,
  components:{App},
  template:'<App/>',
})

// new Vue({
//   store,
//   router,
//   i18n,
//   render:h=>h(App)
// }).$mount("#app");