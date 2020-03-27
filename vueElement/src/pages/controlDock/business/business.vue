<!-- 业务对账上报 -->
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
                    <span>{{$t("bdzzsbSl")}}:</span>
                    <el-input v-model="searchOption.bdzzsbSl" :placeholder="$t('placeholder.input')" clearable></el-input>
                </div>
                <div class="search_item">
                    <span>{{$t("bzxssdHsyjsl")}}:</span>
                    <el-input v-model="searchOption.bzxssdHsyjsl" :placeholder="$t('placeholder.input')" clearable></el-input>
                </div>
                <div class="search_item">
                    <span>{{$t("bzxssbCstxsl")}}:</span>
                    <el-input v-model="searchOption.bzxssbCstxsl" :placeholder="$t('placeholder.input')" clearable></el-input>
                </div>
                <div class="search_item">
                    <span>{{$t("bzsxxbHstxsl")}}:</span>
                    <el-input v-model="searchOption.bzsxxbHstxsl" :placeholder="$t('placeholder.input')" clearable></el-input>
                </div>
                <div class="search_btns">
                    <el-button type="primary" @click="search">{{$t("search")}}</el-button>
                </div>
            </div>

            <div class="main">
                <div class="main-table">
                    <el-table max-height="100%" :data="items" style="width: 100%" :empty-text="$t('noData')" @selection-change="val=>this.selectItems=val">
                        <el-table-column prop="currentDay" :label="$t('businessTime')" min-width="100">
                            <template slot-scope="scope">
                                {{scope.row.currentDay|toTime}}
                            </template>
                        </el-table-column>
                        <el-table-column :label="$t('tzxfsl')" align="center">
                            <el-table-column prop="tzxfXzsl" :label="$t('add1')"  min-width="70"></el-table-column>
                            <el-table-column prop="tzxfGxsl" :label="$t('update1')"  min-width="70"></el-table-column>
                            <el-table-column prop="tzxfZxsl" :label="$t('cancel1')"  min-width="70"></el-table-column>
                            <el-table-column prop="tzxfGkdjbgsl" :label="$t('levelChange')"  min-width="110"></el-table-column>
                        </el-table-column>
                        <el-table-column :label="$t('bzxssbsl')" align="center">
                            <el-table-column prop="bzxssdHsyjsl" :label="$t('warn_red')" min-width="80"></el-table-column>
                            <el-table-column prop="bzxssbCstxsl" :label="$t('warn_orange')" min-width="80"></el-table-column>
                            <el-table-column prop="bzsxxbHstxsl" :label="$t('warn_yellow')" min-width="80"></el-table-column>
                            <el-table-column prop="bzxssbQtsl" :label="$t('warn_no')" min-width="80"></el-table-column>
                        </el-table-column>
                        <el-table-column prop="bdzzsbSl" :label="$t('bdzzsbSl')" min-width="80"></el-table-column>
                        <el-table-column :label="$t('txcjzdsbsl')"  align="center">
                            <el-table-column prop="txcjzdsbYxzsl" :label="$t('effective')" min-width="70"></el-table-column>
                            <el-table-column prop="txcjzdsbXzsl" :label="$t('add1')" min-width="70"></el-table-column>
                            <el-table-column prop="txcjzdsbGxsl" :label="$t('update1')" min-width="70"></el-table-column>
                            <el-table-column prop="txcjzdsbZxsl" :label="$t('cancel1')" min-width="70"></el-table-column>
                        </el-table-column>
                        <el-table-column :label="$t('hmdsfsbfwsl')"  align="center">
                            <el-table-column prop="hmdsfsbfwQqsl" :label="$t('request')" min-width="80"></el-table-column>
                            <el-table-column prop="hmdsfsbfwQqjssl" :label="$t('resolve')" min-width="80"></el-table-column>
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
            searchOption:{
                times:null,
                bdzzsbSl:null,
                bzxssdHsyjsl:null,
                bzxssbCstxsl:null,
                bzsxxbHstxsl:null,
            },
        };
    },

    props : {},

    components: {},

    filters:{
        toTime(val){
            return val.slice(0,4)+"-"+val.slice(4,6)+"-"+val.slice(6,8)
        }
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
                search:{
                    startTime:this.searchOption.times?this.searchOption.times[0]:null,
                    endTime:this.searchOption.times?this.searchOption.times[1]:null,
                    bdzzsbSl:this.searchOption.bdzzsbSl,
                    bzxssdHsyjsl:this.searchOption.bzxssdHsyjsl,
                    bzxssbCstxsl:this.searchOption.bzxssbCstxsl,
                    bzsxxbHstxsl:this.searchOption.bzsxxbHstxsl,
                }
            };

            const {data}=await this.axios.post("ui/reconciliation/listInfo",obj);
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
/deep/ .el-table--border{
    border:none!important;
    &::after{
        width:0!important;
    }

    tr th:nth-last-of-type(2),tr td{
        border-right:none!important;
    }
}
</style>