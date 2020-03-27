<!-- 自建库特征数据 -->
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
                    <span>{{$t("featureID")}}:</span>
                    <el-input v-model="searchOption.featureId" :placeholder="$t('placeholder.input')" clearable></el-input>
                </div>
                <div class="search_item">
                    <span>{{$t("warnFlag")}}:</span>
                    <el-select v-model="searchOption.warnFlag" :placeholder="$t('placeholder.choose')" clearable>
                        <el-option v-for="(val,i) in warnFlagList" :key="i" :value="val.id" :label="val.name"></el-option>
                    </el-select>
                </div>
                <div class="search_item">
                    <span>{{$t("maintainFlag")}}:</span>
                    <el-select v-model="searchOption.maintainFlag" :placeholder="$t('placeholder.choose')" clearable>
                        <el-option v-for="(val,i) in maintainFlagList" :key="i" :value="val.id" :label="val.name"></el-option>
                    </el-select>
                </div>
                <div class="search_btns">
                    <el-button type="primary" @click="search">{{$t("search")}}</el-button>
                    <el-button @click="importDialog=!importDialog">{{$t("import")}}</el-button>
                    <el-button @click="exportExcel">{{$t("export")}}</el-button>
                </div>
            </div>

            <div class="main">
                <div class="main-table">
                    <el-table max-height="100%" :data="items" style="width: 100%" :empty-text="$t('noData')" @selection-change="val=>this.selectItems=val"> 
                        <el-table-column prop="featureId" :label="$t('featureID')" width="180"></el-table-column>
                        <el-table-column prop="featureData" :label="$t('featureData')" min-width="180"></el-table-column>
                        <el-table-column prop="earlyWarningSign" :label="$t('warnFlag')" width="120">
                            <template slot-scope="scope">
                                <el-tag v-for="val in filterArr(warnFlagList,scope.row.earlyWarningSign)" :key="val.id" size="small" :type="val.type">{{val.name}}</el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="maintainFlag" :label="$t('maintainFlag')" width="150">
                            <template slot-scope="scope">
                                <span v-for="val in filterArr(maintainFlagList,scope.row.maintainFlag)" :key="val.id">{{val.name}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="createTime" :label="$t('createTime')" width="140" sortable></el-table-column>
                    </el-table>
                </div>
                <Pagination :paginations="paginations" @changeDate='getPageData'/>
            </div>
        </div>

        <UploadFile :title="$t('import')" :visible.sync="importDialog" url="ui/customFeatureData/importFeatureData" templateUrl="ui/customFeatureData/downTemplate" @uploadSuccess="getPageData"></UploadFile>
    </div>
</template>

<script>
import {basicPage} from "@/common/mixin"
import UploadFile from "@/components/UploadFile"

export default {
    mixins:[basicPage],

    data () {
        return {
            searchOption:{
                warnFlag:null,//预警标记
                times:null,
                featureId:null,
                maintainFlag:null,
            },
            warnFlagList:[
                {id:1,name:this.$t("warn_red"),type:"danger"},{id:2,name:this.$t("warn_orange"),type:"orange"},{id:3,name:this.$t("warn_yellow"),type:"yellow"},{id:4,name:this.$t("warn_no"),type:"success"},
            ],
            maintainFlagList:[
                {id:1,name:this.$t("feature_add")},{id:2,name:this.$t("feature_update")},{id:3,name:this.$t("feature_cancel")},{id:4,name:this.$t("warnFlag_change")},
            ],
            excelUrl:null,
            importDialog:false,
        };
    },

    props : {},

    components: {
        UploadFile,
    },

    computed: {
        //过滤数据循环
        filterArr(){
            return function(list,id){
                let arr=list.filter(val=>val.id==id);
                if(!arr.length)arr=[{id,name:"--",type:"no"}];
                return arr
            }
        },
    },

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
                searchBy:"featureId",
                keyword:this.searchOption.featureId,
                search:{
                    startTime:this.searchOption.times?this.searchOption.times[0]:null,
                    endTime:this.searchOption.times?this.searchOption.times[1]:null,
                    earlyWarningSign:this.searchOption.warnFlag,
                    maintainFlag:this.searchOption.maintainFlag,
                }
            };
            this.excelUrl=null;
            const {data}=await this.axios.post("ui/customFeatureData/list",obj);
            if(data.statusCode==0){
                this.paginations.total=data.data.total;
                this.items=data.data.result;
                this.excelUrl=data.statusMsg;
            }else{
                this.paginations.total=0;
                this.items=[];
            }

        },

        //导出
        exportExcel(){
            if(this.excelUrl)window.location.href="ui/customFeatureData/downFeatureData/"+this.excelUrl;
        },

    }
}

</script>
<style lang='less'>
body .el-tooltip__popper {
    max-width: 400px;
    line-height: 180%;
}
</style>