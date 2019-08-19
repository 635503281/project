import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'

Vue.use(Router);

//动态添加路由this.$router.addRoutes([]);
let router=new Router({
    mode:"hash",// hash / history
    routes:[
        {
            path:"/",
            redirect:"/login"
        },
        {
            path:'*',
            redirect:"/login"
        },
        {
            path:"/login",
            name:"login",
            component:()=>import("@/pages/login/login")
        },
        {
            path:"/index",
            name:"index",
            redirect:"/index/config",
            component:()=>import("@/pages/index/index"),
            children:[
                {
                    path:"config",
                    name:"config",
                    redirect:"/index/config/migu",
                    component:()=>import("@/pages/config/config"),
                    children:[
                        {
                            path:"migu",
                            name:"migu",
                            component:()=>import("@/pages/config/migu/migu")
                        },
                        {
                            path:"netConfig",
                            name:"netConfig",
                            component:()=>import("@/pages/config/netConfig/netConfigList"),
                            meta:{
                                keepAlive:false,//用多了会有是性能问题
                            },
                            beforeEnter:(to,from,next)=>{
                               if(from.name=="netConfigEdit"){
                                   to.meta.keepAlive=true;
                               }else{
                                   to.meta.keepAlive=false;
                               }
                               next();
                            },
                            beforeLeave:(to,from,next)=>{
                                if(to.name=="netConfigEdit"){
                                    from.meta.keepAlive=true;
                                }else{
                                    from.meta.keepAlive=false;
                                }
                                next();
                            }
                        },
                        {
                            path:"netConfig/Edit",
                            name:"netConfigEdit",
                            component:()=>import("@/pages/config/netConfig/netConfigEdit"),
                            meta:{
                                keepAlive:false
                            }
                        }
                    ]
                },
                {
                    path:"warn",
                    name:"warn",
                    component:()=>import("@/pages/warn/warn")
                }
            ]
        }
       
    ],
    scrollBehavior (to, from, savedPosition) {
        // return 期望滚动到哪个的位置
        if (savedPosition) {
            return savedPosition
        } else {
            return { x: 0, y: 0 }
        }
    }
    
});
router.beforeEach((to,from,next)=>{
    // console.log(from);
    next();
})
export default router;