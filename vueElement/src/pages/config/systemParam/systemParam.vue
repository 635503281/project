<!-- 系统参数配置 -->
<template>
    <div>
        <!-- <el-breadcrumb class="myBreadcrumb">
            <el-breadcrumb-item v-for="(menu,i) in $route.meta.menus" :key="i" :to="menu.path||null">{{menu.name}}</el-breadcrumb-item>
        </el-breadcrumb> -->

        <div class="content">
            <div class="main">
                <el-button-group class="main_btns">
                    <el-button type="primary" icon="el-icon-plus" @click="()=>this.$router.push({name:'editSystemParam',query:{id:0}})">{{$t("add")}}</el-button>
                </el-button-group>
                <div class="main-table">
                    <el-table max-height="100%" :data="items" style="width: 100%" :empty-text="$t('noData')" @selection-change="val=>this.selectItems=val">
                        <el-table-column prop="name" :label="$t('configName')" min-width="130"></el-table-column>
                        <el-table-column prop="value" :label="$t('configValue')" min-width="130" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <!-- <el-table-column prop="type" :label="$t('type')" min-width="130" :formatter="(r,c,value)=>value||'--'"></el-table-column> -->
                        <el-table-column prop="description" :label="$t('description')" min-width="200" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="updateTime" :label="$t('updateTime')" width="140" ></el-table-column>
                        <el-table-column prop="createTime" :label="$t('createTime')" width="140" sortable></el-table-column>
                        <el-table-column prop="isEnable" :label="$t('status')" width="80" fixed="right" align="center">
                            <template slot-scope="scope">
                                <el-switch :value="scope.row.isEnable" @click.native="startORstop(scope.row)"></el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column  :label="$t('operation')" width="80" fixed="right" align="center">
                            <template slot-scope="scope">
                                <router-link tag="button" class="icon_modify iconBtn" :title="$t('modify')" @click.native="saveItem('systemParam')" :to="{name:'editSystemParam',query:{id:scope.row.id}}"></router-link>
                                <button class="icon_delete iconBtn" :title="$t('delete')" @click="del('ui/config/del?id='+scope.row.id)"></button>
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

            const {data}=await this.axios.post("ui/config/list",obj);
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
            if(obj.isEnable){//原状态为启用
                isTitle=this.$t("isForbidden");
                tip=this.$t("forbidden_S");
            }
            this.commonConfirm({title:isTitle}).then(async ()=>{
                let newObj={...this.copy(obj),isEnable:!obj.isEnable};
                const {data}=await this.axios.post('ui/config/update',newObj);
                if(data.statusCode==0){
                    this.commonTip(tip);
                    obj.isEnable=!obj.isEnable;
                }
            });

        },
    }
}

</script>
<style lang='less' scoped>
</style>