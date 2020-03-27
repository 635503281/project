<!-- 定时任务 -->
<template>
    <div>
        <!-- <el-breadcrumb class="myBreadcrumb">
            <el-breadcrumb-item v-for="(menu,i) in $route.meta.menus" :key="i" :to="menu.path||null">{{menu.name}}</el-breadcrumb-item>
        </el-breadcrumb> -->

        <div class="content">

            <div class="main">
                <el-button-group class="main_btns">
                    <el-button type="primary" icon="el-icon-plus" @click="()=>this.$router.push({name:'editCron',query:{id:0}})">{{$t("add")}}</el-button>
                </el-button-group>
                <div class="main-table">
                    <el-table max-height="100%" :data="items" style="width: 100%" :empty-text="$t('noData')" @selection-change="val=>this.selectItems=val">
                        <el-table-column prop="jobName" :label="$t('jobName')" min-width="180"></el-table-column>
                        <el-table-column prop="cronExpression" :label="$t('cronExpression')" min-width="150"></el-table-column>
                        <el-table-column prop="targetObject" :label="$t('timerName')" min-width="260"></el-table-column>
                        <el-table-column prop="description" :label="$t('description')" min-width="230" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="createTime" :label="$t('createTime')" width="140" sortable></el-table-column>
                        <el-table-column prop="status" :label="$t('status')" width="80" fixed="right" align="center">
                            <template slot-scope="scope">
                                <el-switch :value="scope.row.status" @click.native="startORstop(scope.row)"></el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column  :label="$t('operation')" width="80" fixed="right" align="center">
                            <template slot-scope="scope">
                                <router-link tag="button" class="icon_modify iconBtn" :title="$t('modify')" @click.native="saveItem('cron')" :to="{name:'editCron',query:{id:scope.row.id}}"></router-link>
                                <button class="icon_delete iconBtn" :title="$t('delete')" @click="del('ui/scheduler/delete?id='+scope.row.id)"></button>
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
        this.getPageData();
    },

    methods: {
        async getPageData(pugin={}){
           Object.assign(this.paginations,pugin);
          
           const {data}=await this.axios.post("ui/scheduler/list",{});
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
            if(obj.status){//原状态为启用
                isTitle=this.$t("isForbidden");
                tip=this.$t("forbidden_S")
            }
            this.commonConfirm({title:isTitle}).then(async ()=>{
                let newObj={...this.copy(obj),status:!obj.status};
                const {data}=await this.axios.post("ui/scheduler/update",newObj);
                if(data.statusCode==0){
                    this.commonTip(tip);
                    obj.status=!obj.status;
                }
            });

        },
    }
}

</script>
<style lang='less' scoped>
</style>