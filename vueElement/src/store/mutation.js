export const CHANGE_LANG="CHANGE_LANG"
export const SET_LOGIN_FLAG="SET_LOGIN_FLAG"
export const CHANGE_TOKEN="CHANGE_TOKEN"
export const CHANGE_LOADING="CHANGE_LOADING"
export const SET_AXIOSCANCEL="SET_AXIOSCANCEL"
export const SET_USER="SET_USER"
export const EXIT="EXIT"
export const CHANGE_MENU="CHANGE_MENU"
export const SAVE_PAGEINFO="SAVE_PAGEINFO"
export const SET_COLLAPSE = "SET_COLLAPSE"
export const SET_LICENSE = "SET_LICENSE"
export const SET_ISLOCK = "SET_ISLOCK"

//初始配置
const sta=require("./state").default_state;

export default {

    //设置语言
    [CHANGE_LANG](state,lang){
        state.lang=lang;
        sessionStorage.setItem("lang",lang);
    },

    //设置登录标记
    [SET_LOGIN_FLAG](state,flag){
        state.login_flag=flag;
    },

    //设置Token
    [CHANGE_TOKEN](state,value){
        state.token=value;
    },

    //取消axios的list
    [SET_AXIOSCANCEL](state,arr=[]){
        state.axiosCancel=arr;
    },

    //保存license信息
    [SET_LICENSE](state,obj){
        state.license=obj;
        localStorage.setItem(`myLicense${window.location.host}`,JSON.stringify(obj));
    },

    //设置锁屏
    [SET_ISLOCK](state,flag = false){
        state.isLock = flag;
    },

    //设置菜单展开
    [SET_COLLAPSE](state,flag=false){
        state.isCollapse=flag;
    },

    //退出
    [EXIT](state){
        //vuex恢复默认值
        for(let key in sta){
            if(key!='lang'&&key!='license')state[key]=sta[key];
        }
        for(let key in sessionStorage){
            if(key!="lang")sessionStorage.removeItem(key);
        }
    },

    //全局显示加载层
    [CHANGE_LOADING](state,flag){
        state.loading=flag;
    },

    //切换菜单
    [CHANGE_MENU](state,{openedMenu=[],activeMenu=null}){
        state.currentMenu.openedMenu=openedMenu;
        state.currentMenu.activeMenu=activeMenu;   
    },

    //设置权限及菜单
    [SET_USER](state,obj){
        state.user=obj;
    },

    //保存页面信息
    [SAVE_PAGEINFO](state,obj={name:null,paginations:null,searchOption:null}){
        let {name,paginations,searchOption}=obj;
        state.pageInfo={name:name||null,paginations:paginations||null,searchOption:searchOption||null};
    }

}