<!-- 比对算法管理 -->
<template>
    <div>
        <!-- <el-breadcrumb class="myBreadcrumb">
            <el-breadcrumb-item v-for="(menu,i) in $route.meta.menus" :key="i" :to="menu.path||null">{{menu.name}}</el-breadcrumb-item>
        </el-breadcrumb> -->

        <div class="content">
            <div class="main">
                <el-button-group class="main_btns">
                    <el-button type="primary" icon="el-icon-plus" @click="()=>this.$router.push({name:'editAlgorithm',query:{id:0}})">{{$t("add")}}</el-button>
                </el-button-group>
                <div class="main-table">
                    <el-table max-height="100%" :data="items" style="width: 100%" :empty-text="$t('noData')">
                        <el-table-column prop="name" :label="$t('algorithmName')" min-width="130"></el-table-column>
                        <el-table-column prop="url" :label="$t('algorithmUrl')" min-width="150" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="limitScore" :label="$t('limitScore')" min-width="100" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="topN" :label="$t('topN')" min-width="100" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="remarks" :label="$t('remarks')" min-width="200" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="forceUpdate" :label="$t('forceUpdate')" min-width="110">
                            <template slot-scope="scope">{{scope.row.forceUpdate?$t("yes"):$t("no")}}</template>
                        </el-table-column>
                        <el-table-column prop="forceExtract" :label="$t('forceExtract')" min-width="110">
                            <template slot-scope="scope">{{scope.row.forceExtract?$t("yes"):$t("no")}}</template>
                        </el-table-column>
                        <el-table-column prop="expireDate" label="过期时间" width="140" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="createTime" :label="$t('createTime')" width="140" sortable></el-table-column>
                        <el-table-column prop="status" :label="$t('status')" width="80" fixed="right" align="center">
                            <template slot-scope="scope">
                                <el-switch :value="scope.row.status" @click.native="startORstop(scope.row)"></el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column  :label="$t('operation')" width="80" fixed="right" align="center">
                            <template slot-scope="scope">
                                <router-link tag="button" class="icon_modify iconBtn" :title="$t('modify')" @click.native="saveItem('algorithm')" :to="{name:'editAlgorithm',query:{id:scope.row.id}}"></router-link>
                                <button class="icon_delete iconBtn" :title="$t('delete')" :disabled="scope.row.status" @click="del('ui/ai/algorithm/del/'+scope.row.id)"></button>
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
        };
    },

    props : {},

    components: {},

    computed: {},

    mounted(){
        if(this.$store.state.pageInfo.name=='algorithm'){
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

            const {data}=await this.axios.post("ui/ai/algorithm/list",obj);
            if(data.statusCode==0){
                this.paginations.total=data.data.total;
                this.items=data.data.result;
            }else {
                this.paginations.total=0;
                this.items=[];
            }
        },

        //启停
        startORstop(obj){
            let isTitle=this.$t("isEnable");
            let tip=this.$t("enable_S");
            let url="ui/ai/algorithm/start/"+obj.id;
            if(obj.status){//原状态为启用
                isTitle=this.$t("isForbidden");
                tip=this.$t("forbidden_S");
                url="ui/ai/algorithm/stop/"+obj.id;
            }
            
            this.commonConfirm({title:isTitle}).then(async ()=>{
                const {data}=await this.axios.get(url);
                if(data.statusCode==0){
                    if(obj.status&&data.statusMsg)tip=data.statusMsg;
                    this.commonTip(tip);
                    this.getPageData();
                }
            });

        },

    }
}

</script>
<style lang='less' scoped>
</style>