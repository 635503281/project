import {copy} from "@/common/common"

const default_state={
    lang:"zh-cn",//语言
    loading:false,//是否显示加载层
    login_flag:false,//登录标记
    token:null,//token
    axiosCancel:[],//取消axios
    license:{//过期信息
        type:null,
        time:null,
    },
    isLock:false,//是否锁屏
    isCollapse:false,//是否展开菜单
    currentMenu:{
        openedMenu:[],//展开的菜单
        activeMenu:null,//选中的菜单
    },
    user:{//用户信息
        userName:null,
        nickname:null,
        password:null,
        privileges:[],//权限及菜单
    },
    pageInfo:{//页面信息
        name:null,
        paginations:null,
        searchOption:null,
    }
}
const state=copy(default_state);
export default state
export {default_state}
