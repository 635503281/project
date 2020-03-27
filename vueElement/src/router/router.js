import Vue from 'vue'
import Router from 'vue-router'
import store from "../store/store"
import {getMenus} from "@/common/method"
import {isEqual} from "@/common/common"
import i18n from "../i18n/i18n"

Vue.use(Router);
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err =>err)
}
//()=>import("@/components/HelloWorld")异步引入组件

//默认路由
export const defaultRoute=[
    {
        path:'/',
        redirect:"/login"
    },
    {
        path:"/login",
        name:"login",
        component:require("@/pages/login/login").default,
    },
];

//首页路由
export const index= {
    path:"/index",
    name:"index",
    component:require("@/pages/index/index").default,
    children:[],
};

//动态添加路由
export const indexChildren=[
    {
        path:"home",
        name:"home",
        component:()=>import("@/pages/home/home"),
        meta:{
            openedMenu:[],
            activeMenu:"/index/home"
        }
    },
    {
        path:"user",
        name:"user",
        component:require("@/pages/system/user/user").default,
        meta:{
            openedMenu: ["system"],
            activeMenu:"/index/user"
        }
    },
    {
        path:"editUser",
        name:"editUser",
        component:require("@/pages/system/user/editUser").default,
        meta:{
            openedMenu: ["system"],
            activeMenu:"/index/user",
            defaultMenus:[{name:i18n.t('edit')}]
        }
    },
    {
        path:"role",
        name:"role",
        component:require("@/pages/system/role/role").default,
        meta:{
            openedMenu: ["system"],
            activeMenu:"/index/role"
        }
    },
    {
        path:"editRole",
        name:"editRole",
        component:require("@/pages/system/role/editRole").default,
        meta:{
            openedMenu: ["system"],
            activeMenu:"/index/role",
            defaultMenus:[{name:i18n.t('edit')}]
        }
    },
    {
        path:"menus",
        name:"menus",
        component:require("@/pages/system/menus/menus").default,
        meta:{
            openedMenu: ["system"],
            activeMenu:"/index/menus"
        }
    }, 
    {
        path:"editMenus",
        name:"editMenus",
        component:require("@/pages/system/menus/editMenus").default,
        meta:{
            openedMenu: ["system"],
            activeMenu:"/index/menus",
            defaultMenus:[{name:i18n.t('edit')}]
        }
    },
    {
        path:"group",
        name:"group",
        component:require("@/pages/system/group/group").default,
        meta:{
            openedMenu: ["system"],
            activeMenu:"/index/group"
        }
    },
    {
        path:"groupDetail",
        name:"groupDetail",
        component:require("@/pages/system/group/groupDetail").default,
        meta:{
            openedMenu: ["system"],
            activeMenu:"/index/group",
            defaultMenus:[{name:i18n.t('detail')}]
        }
    },
    {
        path:"log",
        name:"log",
        component:require("@/pages/system/log/log").default,
        meta:{
            openedMenu: ["system"],
            activeMenu:"/index/log"
        }
    },
    {
        path:"cron",
        name:"cron",
        component:require("@/pages/system/cron/cron").default,
        meta:{
            openedMenu: ["system"],
            activeMenu:"/index/cron"
        }
    },
    {
        path:"editCron",
        name:"editCron",
        component:require("@/pages/system/cron/editCron").default,
        meta:{
            openedMenu: ["system"],
            activeMenu:"/index/cron",
            defaultMenus:[{name:i18n.t('edit')}]
        }
    },

    {
        path:"systemParam",
        name:"systemParam",
        component:require("@/pages/config/systemParam/systemParam").default,
        meta:{
            openedMenu: ["config"],
            activeMenu:"/index/systemParam"
        }
    },
    {
        path:"editSystemParam",
        name:"editSystemParam",
        component:require("@/pages/config/systemParam/editSystemParam").default,
        meta:{
            openedMenu: ["config"],
            activeMenu:"/index/systemParam",
            defaultMenus:[{name:i18n.t('edit')}]
        }
    },
    {
        path:"serverManagement",
        name:"serverManagement",
        component:require("@/pages/config/serverManagement/serverManagement").default,
        meta:{
            openedMenu: ["config"],
            activeMenu:"/index/serverManagement"
        }
    },
    {
        path:"controlPlatform",
        name:"controlPlatform",
        component:require("@/pages/config/controlPlatform/controlPlatform").default,
        meta:{
            openedMenu: ["config"],
            activeMenu:"/index/controlPlatform"
        }
    },
    {
        path:"algorithm",
        name:"algorithm",
        component:require("@/pages/config/algorithm/algorithm").default,
        meta:{
            openedMenu:["config"],
            activeMenu:"/index/algorithm"
        }
    },
    {
        path:"editAlgorithm",
        name:"editAlgorithm",
        component:require("@/pages/config/algorithm/editAlgorithm").default,
        meta:{
            openedMenu:["config"],
            activeMenu:"/index/algorithm",
            defaultMenus:[{name:i18n.t('edit')}]
        }
    },

    {
        path:"featureData",
        name:"featureData",
        component:require("@/pages/controlDock/featureData/featureData").default,
        meta:{
            openedMenu: ["controlDock"],
            activeMenu:"/index/featureData"
        }
    },
    {
        path:"ratioInfo",
        name:"ratioInfo",
        component:require("@/pages/controlDock/ratioInfo/ratioInfo").default,
        meta:{
            openedMenu: ["controlDock"],
            activeMenu:"/index/ratioInfo"
        }
    },
    {
        path:"compareInfo",
        name:"compareInfo",
        component:require("@/pages/controlDock/compareInfo/compareInfo").default,
        meta:{
            openedMenu: ["controlDock"],
            activeMenu:"/index/compareInfo"
        }
    },
    {
        path:"ratiorBackground",
        name:"ratiorBackground",
        component:require("@/pages/controlDock/ratiorBackground/ratiorBackground").default,
        meta:{
            openedMenu: ["controlDock"],
            activeMenu:"/index/ratiorBackground"
        }
    },
    {
        path:"runStatus",
        name:"runStatus",
        component:require("@/pages/controlDock/runStatus/runStatus").default,
        meta:{
            openedMenu: ["controlDock"],
            activeMenu:"/index/runStatus"
        }
    },
    {
        path:"business",
        name:"business",
        component:require("@/pages/controlDock/business/business").default,
        meta:{
            openedMenu: ["controlDock"],
            activeMenu:"/index/business"
        }
    },
    {
        path:"imageAcquisition",
        name:"imageAcquisition",
        component:require("@/pages/controlDock/imageAcquisition/imageAcquisition").default,
        meta:{
            openedMenu: ["controlDock"],
            activeMenu:"/index/imageAcquisition"
        }
    },
    
    {
        path:"comparison",
        name:"comparison",
        component:require("@/pages/webServer/comparison/comparison").default,
        meta:{
            openedMenu: ["webServer"],
            activeMenu:"/index/comparison"
        }
    },
    {
        path:"greylist",
        name:"greylist",
        component:require("@/pages/webServer/greylist/greylist").default,
        meta:{
            openedMenu: [],
            activeMenu:"/index/greylist"
        }
    },
    {
        path:"equipmentRecord",
        name:"equipmentRecord",
        component:require("@/pages/webServer/equipmentRecord/equipmentRecord").default,
        meta:{
            openedMenu: ["webServer"],
            activeMenu:"/index/equipmentRecord"
        }
    },

    {
        path:"faceGroup",
        name:"faceGroup",
        component:require("@/pages/faceLib/faceGroup/faceGroup").default,
        meta:{
            openedMenu: ["faceLib"],
            activeMenu:"/index/faceGroup"
        }
        
    },
    {
        path:"customeGroup",
        name:"customeGroup",
        component:require("@/pages/faceLib/customeGroup/customeGroup").default,
        meta:{
            openedMenu: ["faceLib"],
            activeMenu:"/index/customeGroup"
        }
        
    },
    {
        path:"editCustomeGroup",
        name:"editCustomeGroup",
        component:require("@/pages/faceLib/customeGroup/editCustomeGroup").default,
        meta:{
            openedMenu: ["faceLib"],
            activeMenu:"/index/customeGroup",
            defaultMenus:[{name:i18n.t('edit')}]
        }
        
    },
    {
        path:"customeUser",
        name:"customeUser",
        component:require("@/pages/faceLib/customeUser/customeUser").default,
        meta:{
            openedMenu: ["faceLib"],
            activeMenu:"/index/customeUser"
        }
        
    },
    {
        path:"editCustomeUser",
        name:"editCustomeUser",
        component:require("@/pages/faceLib/customeUser/editCustomeUser").default,
        meta:{
            openedMenu: ["faceLib"],
            activeMenu:"/index/customeUser",
            defaultMenus:[{name:i18n.t('edit')}]
        }
        
    },

    {
        path: "deviceMap",
        name: "deviceMap",
        component: require("@/pages/deviceManagement/deviceMap/deviceMap").default,
        meta: {
            openedMenu: ["deviceManagement"],
            activeMenu: "/index/deviceMap"
        }
    },
    {
        path:"device",
        name:"device",
        component:require("@/pages/deviceManagement/device/device").default,
        meta:{
            openedMenu: ["deviceManagement"],
            activeMenu:"/index/device"
        }
    },
    {
        path:"editDevice",
        name:"editDevice",
        component:require("@/pages/deviceManagement/device/editDevice").default,
        meta:{
            openedMenu: ["deviceManagement"],
            activeMenu:"/index/device",
            defaultMenus:[{name:i18n.t('edit')}]
        }
    },
    {
        path:"deviceUser",
        name:"deviceUser",
        component:require("@/pages/deviceManagement/deviceUser/deviceUser").default,
        meta:{
            openedMenu: ["deviceManagement"],
            activeMenu:"/index/deviceUser"
        }
    },
    {
        path:"editDeviceUser",
        name:"editDeviceUser",
        component:require("@/pages/deviceManagement/deviceUser/editDeviceUser").default,
        meta:{
            openedMenu: ["deviceManagement"],
            activeMenu:"/index/deviceUser",
            defaultMenus:[{name:i18n.t('edit')}]
        }
    },
    {
        path:"imageCollect",
        name:"imageCollect",
        component:require("@/pages/deviceManagement/imageCollect/imageCollect").default,
        meta:{
            openedMenu: ["deviceManagement"],
            activeMenu:"/index/imageCollect"
        }
    },
    {
        path:"editImageCollect",
        name:"editImageCollect",
        component:require("@/pages/deviceManagement/imageCollect/editImageCollect").default,
        meta:{
            openedMenu: ["deviceManagement"],
            activeMenu:"/index/imageCollect",
            defaultMenus:[{name:i18n.t('edit')}]
        }
    },
    {
        path:"viewLib",
        name:"viewLib",
        component:require("@/pages/view/viewLib/viewLib").default,
        meta:{
            openedMenu: [],
            activeMenu:"/index/viewLib"
        }
    },
    {
        path:"editViewLib",
        name:"editViewLib",
        component:require("@/pages/view/viewLib/editViewLib").default,
        meta:{
            openedMenu: [],
            activeMenu:"/index/viewLib",
            defaultMenus:[{name:i18n.t('edit')}]
        }
    },


];

const router= new Router({
    mode:"hash",
    routes: [
        ...defaultRoute
    ]
});

router.beforeEach((to,from,next)=>{
    //每次跳转页面取消上页面的请求
    if(store.state.axiosCancel.length>0){
        store.state.axiosCancel.forEach(val=>{
            val&&!val.isCancel&&val.cancel instanceof Function &&val.cancel()
        });
        store.commit("SET_AXIOSCANCEL");
        store.commit("CHANGE_LOADING", false); 
    }

    if(to.path!="/login"){
        //判断是否登录
        if(!store.state.login_flag){
            store.commit("EXIT");
            next("/login");
            return
        }
        
        //动态添加权限路由
        if(!router.options.routes.some(val=>val.name=="index")){
            const menus=getMenus(store.state.user.privileges);
            router.options.routes=[...router.options.routes,...menus];
            router.addRoutes(menus);
            next({...to,replace:true});
            return
        }

    }else{
        //重定向回当前页面
        if(store.state.login_flag){
            next({path:store.state.currentMenu.activeMenu,replace: true});
            return
        }

        //跳回登录页面需重置默认路由
        router.matcher = new Router({routes: defaultRoute}).matcher;
    }

    //菜单选中
    if(to.meta&&to.meta.activeMenu){
        if(to.meta.activeMenu!=store.state.currentMenu.activeMenu||!isEqual(to.meta.openedMenu,store.state.currentMenu.openedMenu)){
            store.commit("CHANGE_MENU",{openedMenu:to.meta.openedMenu,activeMenu:to.meta.activeMenu});
        }
    }else{
        store.commit("CHANGE_MENU",{});
    }

    //修改面包屑 编辑==> 添加 / 修改
    if(to.meta&&to.meta.menus&&to.meta.defaultMenus){
        const length1 = to.meta.defaultMenus.length;
        const length2 = to.meta.menus.length;
        if(to.meta.defaultMenus[length1-1].name == i18n.t('edit')){
            if(to.query.id&&to.query.id != "0")to.meta.menus[length2-1].name = i18n.t('modify');
            else to.meta.menus[length2-1].name = i18n.t('add');
        }
    }
    
    next();   
})

export default router
