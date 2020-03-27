<!-- 自建库人员 -->
<template>
    <div>
        <!-- <el-breadcrumb class="myBreadcrumb">
            <el-breadcrumb-item v-for="(menu,i) in $route.meta.menus" :key="i" :to="menu.path||null">{{menu.name}}</el-breadcrumb-item>
        </el-breadcrumb> -->

        <div class="content">
            <div class="search">
                <!-- <div class="search_item">
                    <span>{{$t("customeGroup")}}:</span>
                    <el-select v-model="searchOption.customGroup" :placeholder="$t('placeholder.choose')" filterable clearable>
                        <el-option v-for="(val,index) in customeGroupList" :key="index" :label="val.groupName" :value="val.id"></el-option>
                    </el-select>
                </div> -->
                <div class="search_item">
                    <span>{{$t("personName")}}:</span>
                    <el-input v-model="searchOption.personName" :placeholder="$t('placeholder.input')" clearable></el-input>
                </div>
                <div class="search_item">
                    <span>{{$t("identificationCard")}}:</span>
                    <el-input v-model="searchOption.identityNumber" :placeholder="$t('placeholder.input')" clearable></el-input>
                </div>
                <div class="search_btns">
                    <el-button type="primary" @click="search">{{$t("search")}}</el-button>
                    <el-button type="primary" icon="el-icon-plus" @click="()=>this.$router.push({name:'editCustomeUser',query:{id:0}})">{{$t("add")}}</el-button>
                </div>
            </div>

            <div class="main">
                <div class="main-table">
                    <el-table max-height="100%" ref="customeUser_table" :data="items" style="width: 100%" :empty-text="$t('noData')" @row-click="row=>this.$refs['customeUser_table'].toggleRowExpansion(row)">
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <div class="expand">
                                    <img v-if="scope.row.personPhoto" :src="scope.row.personPhoto">
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
                                            <el-Tag v-if="scope.row.warningSign=='1'" type="danger">{{$t("warn_red")}}</el-Tag>
                                            <el-Tag v-else-if="scope.row.warningSign=='2'" size="small" type="orange">{{$t("warn_orange")}}</el-Tag>
                                            <el-Tag v-else-if="scope.row.warningSign=='3'" size="small" type="yellow">{{$t("warn_yellow")}}</el-Tag>
                                            <el-Tag v-else-if="scope.row.warningSign=='4'" size="small">{{$t("warn_no")}}</el-Tag>
                                            <el-Tag v-else type="no" size="small">--</el-Tag>
                                        </p>
                                        <p><span>{{$t("suggestedDisposalMeasure")}}:</span><span>{{scope.row.suggestedDisposalMeasure||'--'}}</span></p>
                                        <p><span>{{$t("compareTime")}}:</span><span>{{scope.row.comparingTime|timeFormat}}</span></p>
                                    </div>

                                    <div class="info">
                                        <p><span>{{$t("featureValid")}}:</span><span>{{scope.row.featureValid?$t("yes"):$t("no")}}</span></p>
                                        <p><span>{{$t("deviceID")}}:</span><span>{{scope.row.deviceId||'--'}}</span></p>
                                        <p><span>{{$t("policeCode")}}:</span><span>{{scope.row.policeCode||"--"}}</span></p>
                                        <p><span>{{$t("managementCateGory")}}:</span><span>{{scope.row.managementCateGory||'--'}}</span></p>
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
                        <el-table-column prop="personName" :label="$t('personName')" min-width="90" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="customGroup" :label="$t('customeGroup')" min-width="140">
                            <template slot-scope="scope">{{scope.row.customGroup?scope.row.customGroup.groupName||"--":"--"}}</template>
                        </el-table-column>
                        <el-table-column prop="featId" :label="$t('featureID')" min-width="160" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="personSex" :label="$t('personSex')" min-width="60" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="identityNumber" :label="$t('identificationCard')" min-width="170" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="featureValid" :label="$t('featureValid')" width="120">
                            <template slot-scope="scope">{{scope.row.featureValid?$t("yes"):$t("no")}}</template>    
                        </el-table-column>
                        <el-table-column prop="createTime" :label="$t('createTime')" width="140" sortable></el-table-column>
                        <el-table-column  :label="$t('operation')" width="80" fixed="right" align="center">
                            <template slot-scope="scope">
                                <router-link tag="button" class="icon_modify iconBtn" :title="$t('modify')" @click.native="saveItem('customeUser')" :to="{name:'editCustomeUser',query:{id:scope.row.id}}"></router-link>
                                <button class="icon_delete iconBtn" :title="$t('delete')" @click="del('ui/customeUser/delete?ids='+scope.row.id)"></button>
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
                customGroup:null,//id
                personName:null,
                identityNumber:null,
            },
            customeGroupList:[],
        };
    },

    computed : {},

    components: {},

    beforeMount(){
        this.getCustomeGroup();
    },

    mounted(){
        if(this.$store.state.pageInfo.name=='customeUser'){
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
                // searchBy:"customGroup",
                // keyword:this.searchOption.customGroup,
                search:{
                    personName:this.searchOption.personName,
                    identityNumber:this.searchOption.identityNumber,
                }
            };

            const {data}=await this.axios.post("ui/customeUser/list",obj);
            if(data.statusCode==0){
                this.paginations.total=data.data.total;
                this.items=data.data.result;
            }else {
                this.paginations.total=0;
                this.items=[];
            }
        },

        //获取自建库
        async getCustomeGroup(){
            const {data} = await this.axios.post('ui/customeGroup/list',{},{headers:{noLoading:true}});
            if(data.statusCode==0){
                this.customeGroupList=data.data.result||[];
            }
        },

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