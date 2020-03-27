<!-- role -->
<template>
    <div>
        <!-- <el-breadcrumb class="myBreadcrumb">
            <el-breadcrumb-item v-for="(menu,i) in $route.meta.menus" :key="i" :to="menu.path||null">{{menu.name}}</el-breadcrumb-item>
        </el-breadcrumb> -->

        <div class="content">
            <div class="search">
                <div class="search_item">
                    <span>{{$t("roleName")}}:</span>
                    <el-input v-model="searchOption.roleName" :placeholder="$t('placeholder.roleName')" clearable></el-input>
                </div>
                <div class="search_btns">
                    <el-button type="primary" @click="search">{{$t("search")}}</el-button>
                    <el-button type="primary" icon="el-icon-plus" @click="()=>this.$router.push({name:'editRole',query:{id:0}})">{{$t("add")}}</el-button>
                </div>
            </div>

            <div class="main">
                <!-- <el-button-group class="main_btns">
                    <el-button type="primary" icon="el-icon-plus" @click="()=>this.$router.push({name:'editRole',query:{id:0}})">{{$t("add")}}</el-button>
                </el-button-group> -->
                <div class="main-table">
                    <el-table max-height="100%" :data="items" style="width: 100%" :empty-text="$t('noData')" @selection-change="val=>this.selectItems=val">
                        <el-table-column prop="name" :label="$t('roleName')" min-width="150"></el-table-column>
                        <el-table-column prop="description" :label="$t('description')" min-width="150" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="createTime" :label="$t('createTime')" width="140" sortable></el-table-column>
                        <el-table-column  :label="$t('operation')" width="80" fixed="right" align="center">
                            <template slot-scope="scope">
                                <router-link tag="button" class="icon_modify iconBtn" :title="$t('modify')" @click.native="saveItem('role')" :to="{name:'editRole',query:{id:scope.row.id}}"></router-link>
                                <button class="icon_delete iconBtn" :title="$t('delete')" :disabled='scope.row.name=="admin"' @click="del('ui/role/del/'+scope.row.id)"></button>
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
                roleName:null,
            },
         
        };
    },

    props : {},

    components: {},

    computed: {},

    mounted(){
        if(this.$store.state.pageInfo.name=='role'){
            this.paginations=this.$store.state.pageInfo.paginations;
            this.searchOption=this.$store.state.pageInfo.searchOption;
        }
        this.getPageData();

        this.$store.commit("SAVE_PAGEINFO");
    },

    methods: {
        async getPageData(pugin={}){
           Object.assign(this.paginations,pugin);
           let obj={
                pageNum:this.paginations.currentPage,
                pageSize:this.paginations.pageSize,
                searchBy:"name",
                keyword:this.searchOption.roleName,
                // search:{
                //     name:this.searchOption.roleName
                // }
           };
           const {data}=await this.axios.post("ui/role/list",obj);
           if(data.statusCode==0){
                this.paginations.total=data.data.total;
                this.items=data.data.result;
           }else {
                this.paginations.total=0;
                this.items=[];
            } 

        }
    }
}

</script>
<style lang='less' scoped>
</style>