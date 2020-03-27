<!-- menu -->
<template>
    <el-menu ref="menu" class="menu" mode="horizontal" :default-openeds="openedMenu" :default-active="activeMenu"  @select="selectMenu" :collapse="isCollapse" router
             unique-opened="true" menu-trigger="click" @close="close" @open="open"> 
        <!-- text-color="#C1C5E6" active-text-color="#fff"> -->
        <Map :menus="menus"></Map> 
    </el-menu>
</template>

<script>
import Map from "./map"

export default {
    props : {
        isCollapse:{
            type:Boolean,
            default:false,
        },
        privileges:{
            type:Array,
            required:true,
        }
    },

    components: {Map},

    computed: {
        menus(){
            //type 0--目录 1--菜单 2--按钮
            const arr=Array.arrayTransTree(this.copy(this.privileges),"parentId","children",{sortby:"priority",desc:1});
            return arr
        },
        activeMenu(){
            return this.$store.state.currentMenu.activeMenu; 
        },
        openedMenu(){
            return this.$store.state.currentMenu.openedMenu;
        },
        
    },

    methods: {
        //选择菜单
        selectMenu(index,indexPath){
            let length=indexPath.length;
            this.$store.commit("CHANGE_MENU",{openedMenu:indexPath.slice(0,length-1),activeMenu:indexPath[length-1]});
        },

        //不让点击关闭一级菜单
        close(index){
            this.$store.commit("CHANGE_MENU",{openedMenu:[index],activeMenu:this.$store.state.currentMenu.activeMenu});
            this.$refs.menu.open(index);
        },

        //打开一级菜单并跳到第一个子菜单
        open(index,indexPath){
            let active = '';
            for(let item of this.menus){
                if(item.url == index){
                    active = item.children[0].url;
                    break
                }
            }
            let length=indexPath.length;
            this.$store.commit("CHANGE_MENU",{openedMenu:[index],activeMenu:active});
            this.$router.push({path:active});
        }
    }
}

</script>
<style lang='less' scoped>
// .menu:not(.el-menu--horizontal){
//     min-height:calc(~"100% - 60px") ;
//     height: auto;
//     border-right:0;  
//     background-color: #324064;
// }
</style>
