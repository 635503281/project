import Vue from "vue"
import locale from "element-ui/lib/locale"
import VueI18n from "vue-i18n"

Vue.use(VueI18n);

let i18n=new VueI18n({
    locale:sessionStorage.getItem("lang")||'zh-cn',
    messages:{
        "zh-cn":require("./langs/zh-cn").default,
        "en-us":require("./langs/en-us").default
    }

});

/**
 * 使用
 * 1-htnl中 {{$t("key")}}
 * 2-js中   this.$t('key')
 * 
 */

//同步element-ui中的多语言
locale.i18n((key,value)=>i18n.t(key,value));

export default i18n

