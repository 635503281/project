<!-- index -->
<template>
    <el-container class="index">
        <!-- 左侧菜单 -->
        <!-- <el-aside class="menuBox" width="auto"></el-aside> -->
        <el-container class="container">
            <!-- 头部 -->
            <el-header class="header">
                <div class="header-box">
                    <div class="logo" :class="{close:isCollapse}">
                        <img src="../../img/head/logo.png" alt="">
                        <span>{{$t("skTitle")}}</span>
                    </div>
                    
                    <Menu :privileges="privileges"  :isCollapse="isCollapse"></Menu>

                    <el-dropdown class="header_dropdown">
                        <div class="userInfo">
                            <img src="../../img/head/user.png" alt="">
                            <span class="userName" :title="userName">{{userName}}</span>
                            <i class="arrow el-icon-arrow-down el-icon--right"></i>
                        </div>
                        <el-dropdown-menu slot="dropdown">
                            <!-- <el-dropdown-item @click.native="changeLang('zh-cn')">{{$t("zh")}}</el-dropdown-item>
                            <el-dropdown-item @click.native="changeLang('en-us')">{{$t("en")}}</el-dropdown-item> -->
                            <el-dropdown-item @click.native="isLock=true">锁屏</el-dropdown-item>
                            <el-dropdown-item @click.native="exit">{{$t("exit")}}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>  
                </div>
                <div :class="['header-childrenMenu',{'hasChildrenMenu':hasChildrenMenu}]"></div>
            </el-header>

            <!-- 主体部分 -->
            <div class="middle">
                <!-- <el-main> -->
                <router-view v-if='isShow'></router-view>
                <!-- </el-main> -->
                <Loading></Loading>
            </div>
            
        </el-container>

        <!-- 锁屏 -->
        <el-dialog custom-class="lock" :visible.sync="isLock" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
            <input class="password_clear"><input class="password_clear" type="password" name="password">
            <el-input type="password" placeholder="请输入密码" v-model="lock_password" show-password></el-input>
            <el-button type="primary" @click="openLock">解锁</el-button>
            <span v-show="lock_error" class="error">{{lock_error}}</span>
        </el-dialog>
    </el-container>
</template>

<script>
import {changeTitle} from "@/common/method"
import Loading from "@/components/Loading"
import Menu from "./menu"
import {createWebSocket, closeWebSocket} from "@/common/websocket"

export default {
    provide(){
        return{
            refresh:this.refresh
        };
    }, 
    data () {
        return {
            isShow:true,//刷新用
            
            privileges:this.$store.state.user.privileges,//菜单权限

            lock_password:null,//解锁密码
            lock_error:null,//错误提示
        };
    },
    
    props : {},

    components: {Loading,Menu},

    computed: {
        userName(){
            return this.$store.state.user.nickname||this.$store.state.user.userName
        },
        isCollapse:{//是否展开
            get(){
                return this.$store.state.isCollapse
            },
            set(flag){
                this.$store.commit("SET_COLLAPSE",flag);
            },   
        },
        hasChildrenMenu(){//是否有子菜单
            let openedMenu = this.$store.state.currentMenu.openedMenu;
            if(openedMenu&&openedMenu.length)return true
            else return false
        },

        isLock:{//是否锁屏
            get(){
                return this.$store.state.isLock
            },
            set(flag){
                this.$store.commit("SET_ISLOCK", flag);
            }
        },
    },

    beforeCreate(){
        changeTitle();
    },

    mounted(){
        createWebSocket();
    },

    watch:{
        '$route.path':{
            immediate:true,
            handler:function(ne,old){
                if(ne=='/index'||ne=="/index/")this.$router.replace(this.firstMenu()); 
            }
        } 
    },

    methods: {
        //刷新
        refresh(){
            this.isShow=false;
            this.$nextTick(()=>this.isShow=true);
        },

        //退出
        exit(){
            this.$store.commit("EXIT");
            this.$router.push("/login");
        },

        //切换语言
        changeLang(lang){
            if(this.$i18n.locale!=lang){
                this.$store.commit("CHANGE_LANG",lang);
                this.$i18n.locale=lang;
                this.refresh();
                changeTitle();
            }
            
        },

        //获取第一有权限的菜单
        firstMenu(){
            function mapp(menus){
                // 有首页就进入首页
                if(menus.some(v=>v.url=='/index/home')){
                    return "/index/home"

                }else{
                    let maap1 = function(menus){
                        let url="";
                        for(let val of menus){
                            if(val.type==1){
                                url=val.url
                                break;
                            }else if(val.type==0){
                                return maap1(val.children);
                            }
                        }
                        return url
                    }
                    return maap1(menus);
                }
    
            }
            
            return mapp(Array.arrayTransTree(this.copy(this.privileges),"parentId","children",{sortby:"priority",desc:1}))
        },

        //解锁
        openLock(){
            const {password} = this.$store.state.user;
            if(this.lock_password == password){
                this.isLock = false;
                this.lock_error = null;
                this.lock_password = null;
            }else{
                this.lock_error = '密码错误';
            }
        },
    },

    destroyed(){
        closeWebSocket();
        this.isLock = false;
    },
}

</script>
<style lang='less' scoped>
@import url("../../css/base.less");
@color_head_border:#3a354a;

.index{
    height: 100%;
    font-size: 14px;

    .container{
        flex:1;
    }
}

@head_height:50px;//头部高度
@menu_w:260px;//菜单宽度
@menu_closeW:50px;//菜单收缩时的宽度
// .menuBox{
//     background-color: #324064;
//     overflow: hidden;
//     max-width: @menu_w;
//     &:hover{
//         overflow-y:auto; 
//     }
//     /deep/ .menu{
//         width:@menu_w;
//         &.el-menu--collapse{
//             width:@menu_closeW; 

//             .el-submenu__title{
//                 .el-submenu__icon-arrow{
//                     display: none;
//                 }
//             }
//         }
//     }
    
// }

.header{
    height: auto!important;
    min-height: @head_height;
    padding:0;
    box-sizing: content-box;
    background-color: @background_base;
    .header-box{
        display: flex;
        height: @head_height;
        border-bottom:1px solid @color_head_border;
        background-color: @block;
        color:#fff;
        
    }
    .header-childrenMenu{
        display: none;
        height: 36px;
        margin-bottom:10px;
        &.hasChildrenMenu{
            display: block;
        }
    }

    .logo{
        height: @head_height;
        line-height: @head_height;
        width: @menu_w;
        box-sizing: border-box;
        border-right:2px solid @color_head_border;
        transition: all 0.5s linear;
        white-space: nowrap;
        &.close{
            width:@menu_closeW; 
        }

        img{
            // width:30px!important;
            width:0;
            height: auto;
            vertical-align: middle;
            margin-top:-2px;
            margin-left: 15px;
        }
        span{
            color:#fff;
            font-size:14px;
            line-height: 16px;
            margin-left:5px;
            font-weight: 900;
        }
    }

    /deep/ .menu.el-menu--horizontal{
        flex:1;
        overflow: hidden;
        position: inherit;
        min-height: @head_height;
        box-sizing: border-box;
        border-bottom: none;
        background-color: @block;
        >div{
            display: flex;
            justify-content: flex-end;
            &::after{
                content:"";
                display: block;
                width: 0;
                clear: both;
            }
            &:focus{
                border:none;
                outline: none;
                box-shadow: none!important;
            }

            >.el-submenu{
                
                &.is-active .el-submenu__title{
                    // border-bottom:2px solid #409EFF;
                    color:#fff;
                    background-color: transparent;
                }

                .el-submenu__title{
                    &:hover{
                        background-color: transparent!important;
                    }
                    color:@color1;
                    padding:0 15px;
                    height: @head_height;
                    line-height: @head_height;
                    box-sizing: border-box;
                    white-space:normal;
                    .el-submenu__icon-arrow{
                        display: none;
                    }
                    span{
                        vertical-align: top;
                    }
                }

            
            }
            >.el-menu-item{
                padding:0 15px;
                height: @head_height;
                line-height: @head_height;
                white-space:normal;
                color:@color1;
                &:hover{
                    background-color: transparent!important;
                }
                &.is-active{
                    // border-bottom:2px solid #409EFF;
                    background-color: transparent;
                    color:#fff
                }
            }

        }
       

    }

    @media screen and (max-width:1300px){
        .logo{
            width :240px;
        } 
        /deep/ .menu.el-menu--horizontal >div{
            >.el-submenu .el-submenu__title,>.el-menu-item{
                padding:0 10px;
            } 
        }
        
    }
    @media screen and (max-width:1200px){
        .logo{
            width :220px;
        } 
        /deep/ .menu.el-menu--horizontal >div{
            >.el-submenu .el-submenu__title,>.el-menu-item{
                padding:0 6px;
            } 
        }
        
    }
    @media screen and (max-width:1100px){
        .logo{
            width :200px;
        } 
        /deep/ .menu.el-menu--horizontal >div{
            >.el-submenu .el-submenu__title,>.el-menu-item{
                padding:0 8px;
                font-size:12px;
            }
        } 
    }
    @media screen and (max-width:1040px){
        .logo{
            width :160px;
        } 
        /deep/ .menu.el-menu--horizontal >div{
            >.el-submenu .el-submenu__title,>.el-menu-item{
                padding:0 4px;
                font-size:12px;
            } 
        }
    }

    .collapse{
        font-size:18px;
        margin-top:(@head_height - 18px)/2;
        margin-left:12px;
        color:#666;
        cursor: pointer;  
        &.active{
            transform: rotate(180deg);
        }
    }
    .header_dropdown{
        width:auto;
        height:100%;
        height: @head_height;
        line-height: @head_height;
        color:#fff;
        text-align: center;
        border-left:2px solid @color_head_border;
        padding-left:20px;

        &:hover{
            .userInfo .arrow{
                transform: rotate(180deg);
            }  
        }
        
        .userInfo{
            
            line-height: @head_height;
            img{
                width:30px;
                height: auto;
                vertical-align: middle;
                margin-right:5px;
            }

            .userName{
               display: inline-block;
               text-align: left;
               vertical-align: middle;
               height:20px;
               line-height: 20px;
               max-width:90px;
               overflow: hidden;
               text-overflow:ellipsis;
               white-space: nowrap;
            }

            .arrow{
                margin:0 20px 0 5px;
                transition: 0.3s linear;
                font-weight: 600;
                font-size:12px;
                color:@color1;
            }
        }
    }
}

.middle{
    position: relative;
    padding:0;
    background:@background_base;
    flex:1;
    overflow-x: hidden;
    overflow-y: auto;
    padding:10px;
    >div{
        height: 100%;
        display: flex;
        flex-direction: column;
    }
    // .el-main{
    //     padding:0;
    //     height: 100%;
    //     overflow-y: auto;
    // }
}

/deep/ .lock{
    max-width:400px;
    width:30%;
    margin:0!important;
    position: absolute;
    top:40%;
    left:50%;
    transform: translate(-50%,-50%);

    .el-dialog__header{
        padding:0;
    }
    .el-dialog__body{
        &::after{
            content:"";
            display: block;
            width: 0;
            clear: both;
        }
        .el-input{
            float: left;
            width:60%;
        }
        .el-button{
            float:right
        }
        
        .error{
            position: absolute;
            left:35px;
            bottom:10px;
            color:#F56C6C;
            font-size:12px;
        }
        
    }
}
</style>