<!-- map -->
<template>
    <div>
        <template v-for="(menu,i) in menus">
            <!-- 目录 -->
            <template v-if="menu.type==0">
                <el-submenu popper-class="childrenMenu" :key="i" :index="menu.url||String(menus.id)">
                    <template slot="title">
                        <!-- <i :class="menu.icon"></i> -->
                        <span>{{menu.name}}</span>
                    </template>
                    <tree-map v-if="menu.children" :menus="menu.children"></tree-map>
                </el-submenu>
            </template>
            <!-- 菜单 -->
            <template v-if="menu.type==1">
                <el-menu-item  :key="i" :index="menu.url">{{menu.name}}</el-menu-item>
            </template>
        </template>
    </div>
</template>

<script>
export default {
    name:"treeMap",
    data () {
        return {
        };
    },

    props : {
        menus:{
            type:Array,
            required:true,
        }
    },

    components: {},

    computed: {
    },
    mounted(){},

    methods: {}
}

</script>
<style lang='less'>
@import url("../../css/base.less");

.childrenMenu{
    position: absolute;
    top:60px!important;
    left:0!important;
    width:100%;
    transition: none!important;
    background-color: @block;
    >ul.el-menu {
        margin:0;
        padding:0;
        box-shadow: none;
        background-color: @block;
        >div{
            width:100%;
            display: flex;
            
            .el-menu-item{
                background-color:@block;
                min-width: auto;
                transition:none;
                &:hover{
                    color:#fff;
                }
                &.is-active{
                    // border-bottom:2px solid #409EFF;
                    color:#fff;
                }
            }
        }
    }
}




//垂直菜单
// .menu:not(.el-menu--horizontal){
//     @menu_titleH:40px;
//     @menu_itemH:36px;
//     @menu_indent:10px;

//     //收缩时菜单样式
//     &.el-menu--collapse{
//         .el-submenu.is-active .el-submenu__title{
//             background-color: #409EFF;
//             >span,i{
//                 color:#fff;
//             }
//         } 
//     }

//     .el-submenu__title{
//         height: @menu_titleH;
//         line-height: @menu_titleH;
//         i{
//            color:#C1C5E6; 
//         }
//         i:first-child[class^="el-"]{
//             width: 16px;
//             height: 16px;
//             margin-right:14px;
//             &::before{
//                 width: 16px;
//                 height: 16px;
//                 margin-left: -2px;
//             }
//         }

//         &:focus, &:hover{
//             background-color: transparent;

//             >i,>span{
//                 color:#fff;
//             }
            
//         }
//     }
//     .el-submenu  .el-menu-item{
//         height: @menu_itemH;
//         line-height: @menu_itemH;
//         text-indent:@menu_indent;
//         margin:1px 0;

//         &.is-active{
//             background-color: #409EFF!important;
//         }
//         &:focus,&:hover{
//             color:#fff!important;
//             background-color:transparent;
//         }
//     }

//     .el-submenu{
//         &.is-opened>.el-submenu__title{
//             >i,>span{
//                 color:#fff;
//             }
//         }
//         .el-menu{
//             background-color: #26304c;
//         }

//         .el-submenu .el-submenu__title{
//             text-indent: @menu_indent;
//             .el-submenu__icon-arrow{
//                 text-indent: 0;
//             }
//         }
//     }

//     //箭头
//     .el-submenu__icon-arrow{
//         font-weight: 600;
//     }

//     .el-menu--vertical{
//         .el-menu{
//             background: #324064;
//         }
    
//         .el-menu-item,.el-submenu .el-submenu__title{
//             line-height: @menu_itemH;
//             height: @menu_itemH;

//             &.is-active{
//                 background-color: #409EFF!important;
//                 color:#fff;
//             }
//             &:focus,&:hover{
//                 color:#fff!important;
//                 background-color: transparent;
//                 i{
//                     color:#fff!important;
//                 }
//             }
//         }
//         .el-submenu{
//             .el-submenu__title{
//                 .el-submenu__icon-arrow{
//                     margin-top:-4px;
//                 }
//             }
        
//             &.is-active{
//                 .el-submenu__title{
//                     color:#fff!important;
//                     i{
//                         color:#fff!important;
//                     }
//                 }
//             }
//         }
//     }
// }

</style>