<!-- 设备备案 -->
<template>
    <div>
        <!-- <el-breadcrumb class="myBreadcrumb">
            <el-breadcrumb-item v-for="(menu,i) in $route.meta.menus" :key="i" :to="menu.path||null">{{menu.name}}</el-breadcrumb-item>
        </el-breadcrumb> -->

        <div class="content">
            <div class="main">
                <div class="main-table">
                    <el-table max-height="100%" :data="items" style="width: 100%" :empty-text="$t('noData')" @selection-change="val=>this.selectItems=val">
                        <el-table-column prop="name" :label="$t('serverName')" min-width="200"></el-table-column>
                        <el-table-column prop="url" :label="$t('url')" min-width="150" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="type" :label="$t('type')" min-width="120" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="remarks" :label="$t('remarks')" min-width="200" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="createTime" :label="$t('createTime')" width="140" sortable></el-table-column>
                        <el-table-column prop="enable" :label="$t('status')" width="80" fixed="right" align="center"> 
                            <template slot-scope="scope">
                                <!-- <el-tag v-if="scope.row.enable" class="pointer" size="small" @click="startORstop(scope.row)">{{$t("enable")}}</el-tag>
                                <el-tag v-else size="small" class="pointer"  type="danger" @click="startORstop(scope.row)">{{$t("stop")}}</el-tag> -->
                                <el-switch :value="scope.row.enable" @click.native="startORstop(scope.row)"></el-switch>
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
        //分页
        async getPageData(plugin={}){
            Object.assign(this.paginations,plugin);
            let obj={
                pageNum:this.paginations.currentPage,
                pageSize:this.paginations.pageSize,
            };

            const {data}=await this.axios.post("ui/access/engine/list",obj);
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
            let url=`ui/access/engine/start/${obj.id}`;
            if(obj.enable){//原状态为启用
                isTitle=this.$t("isStop");
                tip=this.$t("stop_S")
                url=`ui/access/engine/stop/${obj.id}`;
            }
            this.commonConfirm({title:isTitle}).then(async ()=>{
                const {data}=await this.axios.get(url);
                if(data.statusCode==0){
                    this.commonTip(tip);
                    obj.enable=!obj.enable;
                }
            });

        },
    }
}

</script>
<style lang='less' scoped>
</style>
