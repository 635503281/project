<!-- 比中人员背景信息 -->
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
                    <span>{{$t("personName")}}:</span>
                    <el-input v-model="searchOption.personName" :placeholder="$t('placeholder.input')" clearable></el-input>
                </div>
                <div class="search_btns">
                    <el-button type="primary" @click="search">{{$t("search")}}</el-button>
                </div>
            </div>

            <div class="main">
                <div class="main-table">
                    <el-table max-height="100%" ref="compareInfo_table" :data="items" style="width: 100%" :empty-text="$t('noData')" @selection-change="val=>this.selectItems=val" 
                        @row-click="row=>this.$refs['compareInfo_table'].toggleRowExpansion(row)">
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <div class="expand">
                                    <img v-if="scope.row.personPhoto" :src="scope.row.personPhoto|baseToImg">
                                    <div class="info">
                                        <p><span>{{$t("personName")}}:</span><span>{{scope.row.personName||'--'}}</span></p>
                                        <p><span>{{$t("personSex")}}:</span><span>{{scope.row.personSex||'--'}}</span></p>
                                        <p><span>{{$t("identificationCard")}}:</span><span>{{scope.row.identityNumber||'--'}}</span></p>
                                        <p><span>{{$t("personBirth")}}:</span><span>{{scope.row.personBirth|timeFormat("yyyy-MM-dd")}}</span></p>
                                        <p><span>{{$t("residenceNo")}}:</span><span>{{scope.row.residenceNo||'--'}}</span></p>
                                        <p><span>{{$t("residenceAddress")}}:</span><span>{{scope.row.residenceAddress||'--'}}</span></p>
                                        <p><span>{{$t("addressNo")}}:</span><span>{{scope.row.addressNo||'--'}}</span></p>
                                        <p><span>{{$t("address1")}}:</span><span>{{scope.row.address||'--'}}</span></p>
                                        <p><span>{{$t("featureID")}}:</span><span>{{scope.row.featId||'--'}}</span></p>
                                        <p><span>{{$t("warnFlag")}}:</span>
                                            <el-Tag v-if="scope.row.warningSign=='1'" type="red">{{$t("warn_red")}}</el-Tag>
                                            <el-Tag v-else-if="scope.row.warningSign=='2'" size="small" type="orange">{{$t("warn_orange")}}</el-Tag>
                                            <el-Tag v-else-if="scope.row.warningSign=='3'" size="small" type="yellow">{{$t("warn_yellow")}}</el-Tag>
                                            <el-Tag v-else-if="scope.row.warningSign=='4'" type="no" size="small">{{$t("warn_no")}}</el-Tag>
                                            <el-Tag v-else type="no" size="small">--</el-Tag>
                                        </p>
                                        <!-- <p><span>关注人员类型:</span><span v-for="val in filterArr(warnTypeList,scope.row.warningType)" :key="val.id">{{val.name}}</span></p> -->
                                        <p><span>{{$t("suggestedDisposalMeasure")}}:</span><span>{{scope.row.suggestedDisposalMeasure||'--'}}</span></p>
                                        <p><span>{{$t("compareTime")}}:</span><span>{{scope.row.comparingTime|timeFormat}}</span></p>
                                    </div>

                                    <div class="info">
                                        <p><span>{{$t("deviceID")}}:</span><span>{{scope.row.deviceId||'--'}}</span></p>
                                        <p><span>{{$t("policeCode")}}:</span><span>{{scope.row.policeCode||"--"}}</span></p>
                                        <p><span>{{$t("managementCateGory")}}:</span><span>{{scope.row.managementCategoryName||'--'}}</span></p>
                                        <p><span>{{$t("controllingMatter")}}:</span><span>{{scope.row.controllingMatter||'--'}}</span></p>
                                        <p><span>{{$t("controllingUnitPoliceCode")}}:</span><span>{{scope.row.controllingUnitPoliceCode||'--'}}</span></p>
                                        <p><span>{{$t("controllingUnitPoliceName")}}:</span><span>{{scope.row.controllingUnitPoliceName||'--'}}</span></p>
                                        <p><span>{{$t("responsiblePoliceName")}}:</span><span>{{scope.row.responsiblePoliceName||'--'}}</span></p>
                                        <p><span>{{$t("responsiblePolicePhoneNumber")}}:</span><span>{{scope.row.responsiblePolicePhoneNumber||'--'}}</span></p>
                                        <p><span>{{$t("registerUnitPoliceCode")}}:</span><span>{{scope.row.registerUnitPoliceCode||'--'}}</span></p>
                                        <p><span>{{$t("registerUnitPoliceName")}}:</span><span>{{scope.row.registerUnitPoliceName||'--'}}</span></p>
                                        <p><span>{{$t("registerPeopleName")}}:</span><span>{{scope.row.registerPeopleName||'--'}}</span></p>
                                        <p><span>{{$t("registerTime")}}:</span><span>{{scope.row.registerTime|timeFormat}}</span></p>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="personName" :label="$t('personName')" min-width="150" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="head.dwdm" :label="$t('dwdm')" min-width="150" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="head.dwmc" :label="$t('dwmc')" min-width="150" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="head.fssj" :label="$t('fssj')" min-width="160" :formatter="(r,c,value)=>new Date(value).format('yyyy-MM-dd HH:mm:ss')||'--'"></el-table-column>
                        <el-table-column prop="policeName" :label="$t('policeName')" min-width="180" :formatter="(r,c,value)=>String(value==null?'--':value)"></el-table-column>
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
                id:this.$route.params.id?parseFloat(this.$route.params.id):null,
                personName:null,
            },
            warnTypeList:[
                {id:"1",name:"全国在逃"},{id:"2",name:"全国布控"},{id:"3",name:"全国治安重点人"},{id:"4",name:"本地布控"},{id:"5",name:"地方治安重点人"}
            ]
        };
    },

    props : {},

    components: {},

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
                searchBy:"personName",
                keyword:this.searchOption.personName,
                search:{
                    startTime:this.searchOption.times?this.searchOption.times[0]:null,
                    endTime:this.searchOption.times?this.searchOption.times[1]:null,
                    id:this.searchOption.id,
                }
            }
            const {data}=await this.axios.post("ui/facehit/background/list",obj);
            if(data.statusCode==0){
                this.paginations.total=data.data.total;
                this.items=data.data.result;
            }else{
                this.paginations.total=0;
                this.items=[];
            }
        },

        //展开子table
        expendSon(index,row){
            this.$refs['info_table'+index].toggleRowExpansion(row);
        }

    }
}

</script>
<style lang='less' scoped>
.expand{
    margin-left: 50px;
    display: flex;

    img{
        margin-right:10px;
        max-width: 30%;
    }
    .info{
        flex:1;
        max-width: 500px;
        min-height: 275px;
        &:not(:last-of-type){
            margin-right:20px;
        }

        p{
            margin:5px 0;

            .el-tag{
                line-height: 24px;
                height: 24px;;
            }
            span:nth-of-type(1){
                margin-right: 3px;
                color:#909399;
            }
            span:nth-of-type(2){
                word-break: break-all;
            }
        }
    }
    
}
</style>

