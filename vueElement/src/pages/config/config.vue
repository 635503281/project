<!-- config -->
<template>
     <el-container>      
        <el-aside width="25%">
            <el-menu class="el-menu-vertical-demo"  :default-openeds="[openedMenu]" :default-active="activeMenu"  text-color="#fff" active-text-color="#ffd04b" 
                        background-color="#283339" router @select="selectMenu">
                <el-submenu index="migu">
                    <template slot="title"><i class="el-icon-menu"></i>咪咕</template>
                    <el-menu-item index="/index/config/migu">咪咕日志</el-menu-item>
                </el-submenu>   
                <el-submenu index="netConfig">
                    <template slot="title"><i class="el-icon-message"></i>网络参数</template>
                    <el-menu-item index="/index/config/netConfig" >网络参数配置</el-menu-item>
                </el-submenu>
                <el-submenu index="2">
                    <template slot="title"><i class="el-icon-menu"></i>全网服务配置</template>
                    <el-menu-item index="2.1">改变配置模式</el-menu-item>
                    <el-menu-item index="2.2">配置下发查询</el-menu-item>
                    <el-menu-item index="2.3">NTP时钟配置</el-menu-item>
                    <el-menu-item index="2.4">RRS子网默认节点配置</el-menu-item>
                    <el-menu-item index="2.5">机顶盒子网拓扑配置</el-menu-item>
                    <el-menu-item index="2.6">CDN服务配置</el-menu-item>
                    <el-menu-item index="2.7">CDN接入配置</el-menu-item>
                    <el-menu-item index="2.8">防盗链接口配置</el-menu-item>
                    <el-menu-item index="2.9">SP配置</el-menu-item>
                    <el-menu-item index="2.10">SA配置</el-menu-item>
                    <el-menu-item index="2.11">DASS配置</el-menu-item>
                </el-submenu>
                <el-submenu index="3">
                    <template slot="title"><i class="el-icon-menu"></i>软件安装升级</template>
                    <el-menu-item index="3.1">软件上传</el-menu-item>
                    <el-menu-item index="3.2">软件安装升级</el-menu-item>
                    <el-menu-item index="3.3">软件版本</el-menu-item>
                    <el-menu-item index="3.4">软件操作日志</el-menu-item>
                </el-submenu>
                

            </el-menu>

        </el-aside>
        
        <router-view style="overflow-y: scroll;width:100%;"></router-view>
        
        
    </el-container>
</template>

<script>
export default {
    data () {
        return {
            openedMenu: this.$store.state.currentMenu.open||"migu",
            activeMenu:this.$store.state.currentMenu.active||"/index/config/migu",
        }
           
    },

    props : {},

    components: {},

    computed: {},

    created(){
        console.log(this.$store.state.currentMenu)
    },

    mounted(){

    },

    methods: {
        selectMenu(index,indexPath){
            this.openedMenu=indexPath[0];
            this.activeMenu=indexPath[1];
            this.$store.commit("CHANGE_MENU",indexPath);
        }
    },
    destroyed(){
        
    }
}

</script>
<style lang='less' scoped>
.el-aside{
    background-color:#283339;
    min-width:220px;
    max-width: 300px;
}

.el-menu{
    border-right:none;
}
.el-menu-item{
    padding-left:50px!important;
}
.el-menu-vertical-demo{
    text-align: left;
}

</style>