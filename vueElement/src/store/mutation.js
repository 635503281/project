export const CHANGE_LANG="CHANGE_LANG"
export const SET_LOGIN_FLAG="SET_LOGIN_FLAG"
export const UPDATE_M="UPDATE_M"
export const EXIT="EXIT"
export const CHANGE_MENU="CHANGE_MENU"


export default {

    //设置语言
    [CHANGE_LANG](state,lang){
        state.lang=lang;
    },

    //设置登录标记
    [SET_LOGIN_FLAG](state,flag){
        state.login_flag=flag;
    },

    //退出
    [EXIT](state){
        state.login_flag=false;
        sessionStorage.removeItem("state");
    },

    //改变message
    [UPDATE_M](state,value){
        state.message=value;
    },

    //切换菜单
    [CHANGE_MENU](state,[open,active]){
        state.currentMenu.open=open;
        state.currentMenu.active=active;
    }


}