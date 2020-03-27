<!-- 自建库管理 -->
<template>
    <div>
        <!-- <el-breadcrumb class="myBreadcrumb">
            <el-breadcrumb-item v-for="(menu,i) in $route.meta.menus" :key="i" :to="menu.path||null">{{menu.name}}</el-breadcrumb-item>
        </el-breadcrumb> -->

        <div class="content">
            <div class="main">
                <el-button-group class="main_btns">
                    <el-button type="primary" icon="el-icon-plus" @click="()=>this.$router.push({name:'editCustomeGroup',query:{id:0}})">{{$t("add")}}</el-button>
                </el-button-group>
                <div class="main-table">
                    <el-table max-height="100%" :data="items" style="width: 100%" :empty-text="$t('noData')" @selection-change="val=>this.selectItems=val">
                        <el-table-column prop="groupId" :label="$t('customeGroupId')" min-width="150" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="groupName" :label="$t('customeGroupName')" min-width="150" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="groupType" :label="$t('customeGroupType')" min-width="90"></el-table-column>
                        <el-table-column prop="description" :label="$t('description')" min-width="150" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="createTime" :label="$t('createTime')" width="140" sortable></el-table-column>
                        <el-table-column  :label="$t('operation')" width="80" fixed="right" align="center">
                            <template slot-scope="scope">
                                <router-link tag="button" class="icon_modify iconBtn" :title="$t('modify')" @click.native="saveItem('customeGroup')" :to="{name:'editCustomeGroup',query:{id:scope.row.id}}"></router-link>
                                <button class="icon_delete iconBtn" :title="$t('delete')" @click="del('ui/customeGroup/delete?ids='+scope.row.id)"></button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <Pagination :paginations="paginations" @changeDate='getPageData'/> 
            </div>
        </div>
    </div>
</template>

<script>
import {basicPage} from "@/common/mixin"

export default {
    mixins:[basicPage],
    data () {
        return {
            searchOption:{//搜索字段
            },
        };
    },

    props : {},

    components: {},

    mounted(){
        if(this.$store.state.pageInfo.name=='customeGroup'){
            this.paginations=this.$store.state.pageInfo.paginations;
            this.searchOption=this.$store.state.pageInfo.searchOption;
        }
        this.getPageData();

        this.$store.commit("SAVE_PAGEINFO");
    },

    methods: {
        //分页
        async getPageData(plugin={}){
            Object.assign(this.paginations,plugin);
            let obj={
                pageNum:this.paginations.currentPage,
                pageSize:this.paginations.pageSize,
               
            };

            const {data}=await this.axios.post("ui/customeGroup/list",obj);
            if(data.statusCode==0){
                this.paginations.total=data.data.total;
                this.items=data.data.result;
            }else {
                this.paginations.total=0;
                this.items=[];
            }
        },

    }
}

</script>
<style lang='less' scoped>
</style>