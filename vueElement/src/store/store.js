import Vue from "vue"
import Vuex from "vuex"
import mutations from "./mutation"
import actions from "./action"
import getters from "./getter"

Vue.use(Vuex);

let state=require("./state").default;

const host=window.location.host;
//监听刷新事件    
window.onbeforeunload=function(){
    if(sessionStorage.length)sessionStorage.setItem(`state${host}`,JSON.stringify(state));
    
}
if(sessionStorage.getItem(`state${host}`)){
    state=Object.assign({},state,JSON.parse(sessionStorage.getItem(`state${host}`)) );
    state.lang=sessionStorage.getItem("lang")||'zh-cn';
}
if(localStorage.getItem(`myLicense${host}`)){
    state.license=JSON.parse(localStorage.getItem(`myLicense${host}`));
}

export default new Vuex.Store({
    state,
    mutations,
    getters,
    actions
})

