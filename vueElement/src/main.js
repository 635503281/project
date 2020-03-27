// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router/router'
import "./common/common"
import store from "./store/store"
import i18n from "./i18n/i18n"

import Element from "element-ui"
import "element-ui/lib/theme-chalk/index.css"

//重新定义table中的bodyHeight属性,适配max-height为百分比
Element.Table.computed.bodyHeight = function(){
  const { headerHeight = 0, bodyHeight, footerHeight = 0} = this.layout;
  if (this.height) {
    return {
      height: bodyHeight ? bodyHeight + 'px' : ''
    };
  } else if (this.maxHeight) {

    //处理max-height百分比高度
    if(/%$/.test(this.maxHeight)){
      if(this.$el){
        const parentH = this.$el.parentNode.offsetHeight;
        const height_reduce = (this.showHeader?headerHeight:0)+ footerHeight;
        const rate = parseFloat(this.maxHeight)/100;
        const max = rate*parentH - height_reduce + "px";
        return {
          'max-height':max
        }
      }else{
        return {}
      } 
    }

    function parseHeight(height) {
      if (typeof height === 'number') {
        return height;
      }
      if (typeof height === 'string') {
        if (/^\d+(?:px)?$/.test(height)) {
          return parseInt(height, 10);
        } else {
          return height;
        }
      }
      return null;
    };
    const maxHeight = parseHeight(this.maxHeight);
    if (typeof maxHeight === 'number') {
      return {
        'max-height': (maxHeight - footerHeight - (this.showHeader ? headerHeight : 0)) + 'px'
      };
    }
  }
  return {};
};
Element.Table.computed.fixedBodyHeight = function(){
  if (this.height) {
    return {
      height: this.layout.fixedBodyHeight ? this.layout.fixedBodyHeight + 'px' : ''
    };
  } else if (this.maxHeight) {
    //处理max-height百分比高度
    if(/%$/.test(this.maxHeight)){
      if(this.$el){
        const parentH = this.$el.parentNode.offsetHeight;
        const rate = parseFloat(this.maxHeight)/100;
        let maxH = rate*parentH;
        maxH = this.layout.scrollX ? maxH - this.layout.gutterWidth : maxH;
        const height_reduce = (this.showHeader?this.layout.headerHeight:0)+ this.layout.footerHeight;
        const max = maxH - height_reduce + "px";
        return {
          'max-height':max
        }
      }else{
        return {}
      } 
    }

    function parseHeight(height) {
      if (typeof height === 'number') {
        return height;
      }
      if (typeof height === 'string') {
        if (/^\d+(?:px)?$/.test(height)) {
          return parseInt(height, 10);
        } else {
          return height;
        }
      }
      return null;
    };

    let maxHeight = parseHeight(this.maxHeight);
    if (typeof maxHeight === 'number') {
      maxHeight = this.layout.scrollX ? maxHeight - this.layout.gutterWidth : maxHeight;
      if (this.showHeader) {
        maxHeight -= this.layout.headerHeight;
      }
      maxHeight -= this.layout.footerHeight;
      return {
        'max-height': maxHeight + 'px'
      };
    }
  }
  return {};
};
Element.Table.computed.fixedHeight = function(){
  if (this.maxHeight) {
    if (this.showSummary) {
      return {
        bottom: 0
      };
    }
    return {
      bottom: this.layout.scrollX ? this.layout.gutterWidth + 'px' : ''
    };
  } else {
    if (this.showSummary) {
      return {
        height: this.layout.tableHeight ? this.layout.scrollX ? this.layout.tableHeight - this.layout.gutterWidth + 'px':this.layout.tableHeight+"px": ''
      };
    }
    return {
      height: this.layout.viewportHeight ? this.layout.scrollX ? this.layout.viewportHeight - this.layout.gutterWidth + 'px':this.layout.viewportHeight+"px":''
    };
  }
};

//全局设置showOverflowTooltip
Element.TableColumn.props.showOverflowTooltip={type: Boolean, default: true};
//全局去掉Tag的动画
Element.Tag.props.disableTransitions={type: Boolean, default: true};
Vue.use(Element,{size: 'mini'});

import "./http/axios"
import "lib-flexible"
import "./common/filter"
import "./common/directive"
import "./css/index.less"

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  components: { App },
  template: '<App/>'
})
