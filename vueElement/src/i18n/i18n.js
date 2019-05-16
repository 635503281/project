import Vue from "vue"
import locale from "element-ui/lib/locale"
import store from "@/store/store"
import VueI18n from "vue-i18n"
import zh_cn from "./langs/zh-cn"
import en_us from "./langs/en-us"

Vue.use(VueI18n);

let i18n=new VueI18n({
    locale:store.state.lang,
    messages:{
        "zh-cn":zh_cn,
        "en-us":en_us
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

