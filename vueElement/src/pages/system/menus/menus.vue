<!-- menus -->
<template>
    <div>
        <!-- <el-breadcrumb class="myBreadcrumb">
            <el-breadcrumb-item v-for="(menu,i) in $route.meta.menus" :key="i" :to="menu.path||null">{{menu.name}}</el-breadcrumb-item>
        </el-breadcrumb> -->

        <div class="content">
            <div class="main">
                <!-- <el-button-group class="main_btns">
                    <el-button type="primary" icon="el-icon-plus" @click="()=>this.$router.push({name:'editMenus',query:{id:0}})">{{$t("add")}}</el-button>
                </el-button-group> -->
                <div class="main-table">
                    <el-table max-height="100%" :data="items" style="width: 100%" :empty-text="$t('noData')" @selection-change="val=>this.selectItems=val"
                        row-key="id" :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                        <!-- <el-table-column type="selection" fixed="left"></el-table-column> -->
                        <el-table-column prop="name" :label="$t('name')" min-width="160"></el-table-column>
                        <el-table-column prop="type" :label="$t('type')" min-width="100">
                            <template slot-scope="scope">
                                <el-tag v-if="scope.row.type === 0" size="small">{{$t('catalogue')}}</el-tag>
                                <el-tag v-else-if="scope.row.type === 1" size="small" type="success">{{$t('menu')}}</el-tag>
                                <el-tag v-else-if="scope.row.type === 2" size="small" type="warning">{{$t('button')}}</el-tag>
                                <span v-else>--</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="url" :label="$t('url')" min-width="230" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="priority" :label="$t('priority')" min-width="90" :formatter="(r,c,value)=>value==null?'--':value"></el-table-column>
                        <el-table-column  :label="$t('operation')" width="80" fixed="right" align="center">
                            <template slot-scope="scope">
                                <router-link tag="button" class="icon_modify iconBtn" :title="$t('modify')" :to="{name:'editMenus',query:{id:scope.row.id}}"></router-link>
                                <!-- <button class="icon_delete iconBtn" :title="$t('delete')" @click="del('ui/privilege/del/'+scope.row.id)"></button> -->
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

            </div>
            
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
          menuList:[] 
        }
    },

    props : {},

    components: {},

    computed: {
        items(){
            return Array.arrayTransTree(this.copy(this.menuList),"parentId","children",{sortby:"priority",desc:1});
        }
    },

    mounted(){
        this.getMenus();
    },

    methods: {
        //获取菜单
        async getMenus(){
            const {data}=await this.axios.post("ui/privilege/all");
            if(data.statusCode==0)this.menuList=data.data;
        },

        //删除
        del(url){
            this.commonConfirm({title:this.$t("isDelete")}).then(async ()=>{
                const {data}=await this.axios.get(url);
                if(data.statusCode==0){
                    this.commonTip(this.$t("delete_S"));
                    this.getMenus();
                }
            });
              
        },
    }
}

</script>
<style lang='less' scoped>
</style>