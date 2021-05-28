import Vue from 'vue';
import router from './router/index'
import store from './store/index';
import App from './App';
import '@/plugin/globalComp';
import '@/plugin/svgIcon';
import '@/plugin/filter';
import '@/plugin/eventBus';

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')
