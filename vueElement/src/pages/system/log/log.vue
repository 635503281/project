<!-- 日志管理 -->
<template>
    <div>
        <!-- <el-breadcrumb class="myBreadcrumb">
            <el-breadcrumb-item v-for="(menu,i) in $route.meta.menus" :key="i" :to="menu.path||null">{{menu.name}}</el-breadcrumb-item>
        </el-breadcrumb> -->

        <div class="content">
            <div class="search">
                <div class="search_item">
                    <span>{{$t("selectTime")}}:</span>
                    <el-date-picker type="datetimerange" v-model="searchOption.times" range-separator="~" :start-placeholder="$t('startTime')" :end-placeholder="$t('endTime')"
                      value-format="yyyy-MM-dd HH:mm:ss" clearable>
                    </el-date-picker>
                </div>
                <div class="search_item">
                    <span>{{$t("type")}}:</span>
                    <el-select v-model="searchOption.logCategory" >
                        <el-option value="operateLog" label="操作日志"></el-option>
                        <el-option value="sysLog" label="系统日志"></el-option>
                    </el-select>
                </div>
                <div class="search_item">
                    <span>{{$t("logType")}}:</span>
                    <el-select v-model="searchOption.logType" :placeholder="$t('placeholder.choose')">
                        <el-option v-for="(val,i) in logTypeList" :key="i" :value="val.id" :label="val.name"></el-option>
                    </el-select>
                </div>
                <div class="search_item">
                    <span>{{$t("operator")}}:</span>
                    <el-input v-model="searchOption.operator" :placeholder="$t('placeholder.input')" clearable></el-input>
                </div>
                <div class="search_item">
                    <span>{{$t("address")}}:</span>
                    <el-input v-model="searchOption.address" :placeholder="$t('placeholder.input')" clearable></el-input>
                </div>
                <div class="search_btns">
                    <el-button type="primary" @click="search">{{$t("search")}}</el-button>
                    <el-button @click="exportExcel">{{$t("export")}}</el-button>
                </div>
            </div>

            <div class="main">
                <div class="main-table" ref="main-table">
                    <el-table max-height="100%" :data="items" style="width: 100%" :empty-text="$t('noData')" @selection-change="val=>this.selectItems=val">
                        <el-table-column prop="operationType" :label="$t('operateType')" min-width="80" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="description" :label="$t('description')" min-width="120" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="createBy" :label="$t('operator')" min-width="100" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="params" :label="$t('params')" min-width="100">
                            <template slot-scope="scope">
                                <el-popover trigger="hover" popper-class="log_popover">
                                    <Json-viewer :value="scope.row.params|toJson"></Json-viewer>
                                    <span slot="reference" class="textBtn">{{$t("watch")}}</span>
                                </el-popover>
                            </template>
                        </el-table-column>
                        <el-table-column prop="requestIp" :label="$t('address')" min-width="120" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="logType" :label="$t('logType')" min-width="80">
                            <template slot-scope="scope">
                                <el-tag v-if="scope.row.logType==0" size="small">{{$t("normal")}}</el-tag>
                                <el-tag v-else type="danger" size="small">{{$t("abnormal")}}</el-tag>    
                            </template>
                        </el-table-column>
                        <el-table-column prop="createTime" :label="$t('createTime')" width="140" sortable></el-table-column>
                    </el-table>
                </div>
                <Pagination :paginations="paginations" @changeDate='getPageData'/>
            </div>
        </div>
    </div>
</template>

<script>
import {basicPage} from "@/common/mixin"
import {getLogType} from "@/common/method"

export default {
    mixins:[basicPage],

    data () {
        return {
            searchOption:{
                logCategory:"operateLog",//operateLog--操作日志   sysLog--系统日志
                logType:null,//日志类型
                operator:null,//操作用户
                times:null,//时间
                description:null,//描述
                address:null,//地址
            },
            logTypeList:[{id:null,name:this.$t('all')},{id:0,name:this.$t("normal")},{id:1,name:this.$t("abnormal")}],//日志类型
        };
    },

    props : {},

    components: {
        JsonViewer:()=>import("vue-json-viewer"),
    },

    computed: {},

    mounted(){
        this.getPageData();
    },

    methods: {
        async getPageData(plugin={}){
            Object.assign(this.paginations,plugin);
            let obj={
                pageNum:this.paginations.currentPage,
                pageSize:this.paginations.pageSize,
                searchBy:"createBy",
                keyword:this.searchOption.operator,
                search:{
                    logType:this.searchOption.logType,
                    logCategory:this.searchOption.logCategory,
                    requestIp:this.searchOption.address,
                    startTime:this.searchOption.times?this.searchOption.times[0]:null,
                    endTime:this.searchOption.times?this.searchOption.times[1]:null
                }
            };
            const {data}=await this.axios.post("ui/log/list",obj);
            if(data.statusCode==0){
                this.paginations.total=data.data.total;
                this.items=data.data.result;
            }else {
                this.paginations.total=0;
                this.items=[];
            }

        },

        //导出excel
        async exportExcel(){
            let obj={
                pageNum:this.paginations.currentPage,
                pageSize:this.paginations.pageSize,
                searchBy:"createBy",
                keyword:this.searchOption.operator,
                search:{
                    logType:this.searchOption.logType,
                    logCategory:this.searchOption.logCategory,
                    requestIp:this.searchOption.address,
                    startTime:this.searchOption.times?this.searchOption.times[0]:null,
                    endTime:this.searchOption.times?this.searchOption.times[1]:null
                }
            };
            const {data} = await this.axios.post("ui/log/prepare", obj);
            if(data.statusCode == 0){
                const excelUrl = data.statusMsg;
                if(!excelUrl){
                    this.commonTip("导出失败", "tip_error");
                    return 
                }
                window.location.href = "ui/log/export/"+excelUrl;
            }
        }
    }
}

</script>
<style lang='less'>
.log_popover{
    .jv-container{
        max-height: 300px;
        max-width:500px;
        overflow:auto; 
    }
}
</style>