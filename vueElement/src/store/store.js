import Vue from "vue"
import Vuex from "vuex"
import mutations from "./mutation"
import actions from "./action"
import getters from "./getter"

Vue.use(Vuex);

let state={
    lang:"zh-cn",
    login_flag:false,
    refresh:true,//刷新index页面
    message:"test",
    currentMenu:{
        open:null,
        active:null
    }
};

//监听刷新事件    
window.onbeforeunload=function(){
    sessionStorage.setItem("state",JSON.stringify(state));
}
if(sessionStorage.getItem("state")){
    state=Object.assign({},state,JSON.parse(sessionStorage.getItem("state")) );
}

export default new Vuex.Store({
    state,
    mutations,
    getters,
    actions
})

