<!-- 设备备案 -->
<template>
    <div>
        <!-- <el-breadcrumb class="myBreadcrumb">
            <el-breadcrumb-item v-for="(menu,i) in $route.meta.menus" :key="i" :to="menu.path||null">{{menu.name}}</el-breadcrumb-item>
        </el-breadcrumb> -->

        <div class="content">
            <div class="search">
                <div class="search_item">
                    <span>{{$t("deviceName")}}:</span>
                    <el-input v-model="searchOption.deviceName" :placeholder="$t('placeholder.input')" clearable></el-input>
                </div>
                <div class="search_item">
                    <span>{{$t("uid")}}:</span>
                    <el-input v-model="searchOption.uid" :placeholder="$t('placeholder.input')" clearable></el-input>
                </div>
                <div class="search_item">
                    <span>{{$t("orgName")}}:</span>
                    <el-input v-model="searchOption.orgName" :placeholder="$t('placeholder.input')" clearable></el-input>
                </div>
                <div class="search_item">
                    <span>{{$t("status")}}:</span>
                    <el-select v-model="searchOption.status" :placeholder="$t('placeholder.choose')" clearable>
                        <el-option :label="$t('online')" value="1"></el-option>
                        <el-option :label="$t('noline')" value="0"></el-option>
                        <el-option :label="$t('cancel1')" value="2"></el-option>
                    </el-select>
                </div>
                <div class="search_item">
                    <span>{{$t("enableStatus")}}:</span>
                    <el-select v-model="searchOption.enable" :placeholder="$t('placeholder.choose')" clearable>
                        <el-option :label="$t('enable')" :value="true"></el-option>
                        <el-option :label="$t('forbidden')" :value="false"></el-option>
                    </el-select>
                </div>
                <div class="search_item">
                    <span>{{$t("address")}}:</span>
                    <el-input v-model="searchOption.address" :placeholder="$t('placeholder.input')" clearable></el-input>
                </div>
                <div class="search_item">
                    <span>是否地图标记:</span>
                    <el-select v-model="searchOption.markType" :placeholder="$t('placeholder.choose')" clearable>
                        <el-option label="全部" value=""></el-option>
                        <el-option label="已标记" :value="1"></el-option>
                        <el-option label="未标记" :value="2"></el-option>
                    </el-select>
                </div>
                <div class="search_btns">
                    <el-button type="primary" @click="search">{{$t("search")}}</el-button>
                    <el-button type="primary" icon="el-icon-plus" @click="()=>this.$router.push({name:'editDevice',query:{id:0}})">{{$t("add")}}</el-button>
                    <el-button :disabled="!selectItems.length" type="primary" @click="report">{{$t("report")}}</el-button>
                    <el-button @click="importDialog=!importDialog">{{$t("import")}}</el-button>
                    <el-button @click="exportExcel">{{$t("export")}}</el-button>
                </div>
            </div>

            <div class="main">
                <div class="main-table">
                    <el-table max-height="100%" :data="items" style="width: 100%" :empty-text="$t('noData')" @selection-change="val=>this.selectItems=val">
                        <el-table-column type="selection"></el-table-column>
                        <el-table-column prop="deviceId" :label="$t('deviceID')" min-width="180"></el-table-column>
                        <el-table-column prop="name" :label="$t('deviceName')" min-width="130" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="uid" :label="$t('uid')" min-width="130" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="ipAddress" :label="$t('ipAddress')" min-width="130" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="status" :label="$t('status')" min-width="90">
                            <template slot-scope="scope">
                                <el-tag v-if="scope.row.status==1" size="small">{{$t("online")}}</el-tag>
                                <el-tag v-else-if="scope.row.status==0" type="grey" size="small">{{$t("noline")}}</el-tag>
                                <el-tag v-else-if="scope.row.status==2" type="danger" size="small">{{$t("cancel1")}}</el-tag>
                                <span v-else>--</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="设备请求记录" width="100">
                            <template slot-scope="scope">
                                <el-button class="textBtn" @click="watchDetail(scope.row)">详情</el-button>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column prop="orgCode" :label="$t('orgCode')" min-width="120" :formatter="(r,c,value)=>value||'--'"></el-table-column> -->
                        <el-table-column prop="orgName" :label="$t('orgName')" min-width="170" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="group" :label="$t('company')" min-width="170">
                            <template slot-scope="scope">{{getGroupName(scope.row.groupId)}}</template>
                        </el-table-column>
                        <el-table-column prop="placeCode" :label="$t('placeCode')" min-width="120" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="address" :label="$t('address')" min-width="150" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="longitude" :label="$t('longitude')" min-width="100" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="latitude" :label="$t('latitude')" min-width="100" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column label="备案记录" width="80">
                            <template slot-scope="scope">
                                <el-button class="textBtn" @click="watch(scope.row)">查看</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column prop="updateTime" :label="$t('updateTime')" width="140" sortable></el-table-column>
                        <el-table-column prop="checkStatus" :label="$t('checkStatus')" width="80" fixed="right" align="center">
                            <template slot-scope="scope">
                                <el-switch :value="scope.row.checkStatus" @click.native="startORstop('checkStatus',scope.row)"></el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column prop="enable" :label="$t('enableStatus')" width="80" fixed="right" align="center">
                            <template slot-scope="scope">
                                <el-switch :value="scope.row.enable" @click.native="startORstop('enable',scope.row)"></el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column  :label="$t('operation')" width="80" fixed="right" align="center">
                            <template slot-scope="scope">
                                <router-link tag="button" class="icon_modify iconBtn" :title="$t('modify')" @click.native="saveItem('device')" :to="{name:'editDevice',query:{id:scope.row.id}}"></router-link>
                                <!-- <button class="icon_delete iconBtn" :title="$t('delete')" @click="del('ui/terminalInfo/delete?id='+scope.row.id)"></button> -->
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <Pagination :paginations="paginations" @changeDate='getPageData'/>  
            </div>
        </div>

        <el-dialog custom-class="content watchItems" :visible.sync="isDialog" title="备案记录" center width="80%" :close-on-click-modal="false">
            <div class="main">
                <div class="title">
                    <span>{{$t('deviceID')}}：<i>{{watchObj.deviceId}}</i></span>
                    <span>{{$t('deviceName')}}：<i>{{watchObj.deviceName||"--"}}</i></span>
                </div>
                <div class="main-table">
                    <el-table max-height="100%" :data="watchObj.items" style="width: 100%" :empty-text="$t('noData')">
                        <el-table-column prop="ipAddress" :label="$t('ipAddress')" min-width="120" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="port" :label="$t('port')" min-width="80" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="Uid" :label="$t('uid')" min-width="120" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="type" :label="$t('type')" min-width="90">
                            <template slot-scope="scope">
                                <span v-if="scope.row.type==0">{{$t("equipmentType_0")}}</span>
                                <span v-else-if="scope.row.type==1">{{$t("equipmentType_1")}}</span>
                                <span v-else-if="scope.row.type==2">{{$t("equipmentType_2")}}</span>
                                <span v-else>--</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="OrgName" :label="$t('orgName')" min-width="150" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="PlaceCode" :label="$t('placeCode')" min-width="120" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="Address" :label="$t('address')" min-width="150" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="createTime" :label="$t('createTime')" width="140" sortable></el-table-column>
                    </el-table>
                </div>
                <Pagination :paginations="watchObj.paginations" @changeDate='watchObj.getPageData'/>
            </div>
        </el-dialog>

        <UploadFile :title="$t('import')" :visible.sync="importDialog" url="ui/uploadTerminalExcel" templateUrl="static/assets/file/fms_res_camera.xls" @uploadSuccess="getPageData"
            :format="['.xls','.xlsx','.csv']" formatTip="请上传excel文件"></UploadFile>

        <el-dialog custom-class="content watchItems" :visible.sync="detailObj.isDialog" title="设备请求记录" center width="80%" :close-on-click-modal="false">
            <div class="main">
                <div class="title">
                    <span>{{$t('deviceID')}}：<i>{{detailObj.deviceId}}</i></span>
                    <span>{{$t('deviceName')}}：<i>{{detailObj.deviceName||"--"}}</i></span>
                </div>
                <div class="main-table">
                    <el-table max-height="100%" :data="detailObj.items" style="width: 100%" :empty-text="$t('noData')">
                        <el-table-column prop="createTime" :label="$t('createTime')" width="140" sortable></el-table-column>
                        <el-table-column prop="onDayImageReq" label="今日请求总数" min-width="120" :formatter="(r,c,value)=>value||0"></el-table-column>
                        <el-table-column prop="onDayValidImageReq" label="今日有效请求数" min-width="120" :formatter="(r,c,value)=>value||0"></el-table-column>
                        <el-table-column prop="averImageReq" label="日均请求数" min-width="120" :formatter="(r,c,value)=>value||0"></el-table-column>
                        <el-table-column prop="averValidImageReq" label="日均有效请求数" min-width="120" :formatter="(r,c,value)=>value||0"></el-table-column>
                        <el-table-column prop="totalImageReq" label="历史请求总数" min-width="120" :formatter="(r,c,value)=>value||0"></el-table-column>
                        <el-table-column prop="totalValidImageReq" label="历史有效请求数" min-width="120" :formatter="(r,c,value)=>value||0"></el-table-column>
                    </el-table>
                </div>
                <Pagination :paginations="detailObj.paginations" @changeDate='detailObj.getPageData'/>
            </div>
        </el-dialog>

    </div>
</template>

<script>
import {basicPage} from "@/common/mixin"
import UploadFile from "@/components/UploadFile"

export default {
    mixins:[basicPage],
    data () {
        return {
            searchOption:{//搜索字段
                deviceName:null,
                uid:null,
                orgName:null,
                status:null,
                enable:null,
                address:null,
                markType:this.$route.params.markType||"",//是否标记
            },
            groupList:[],
            importDialog:false,

            isDialog: false,
            watchObj:{
                deviceId:null,
                deviceName:null,
                items:[],

                paginations:{//分页字段
                    total:0,
                    currentPage:1,
                    pageSize:10,
                    pageSizes:[10,20,30,50,100],
                },

                getPageData:async function(plugin={},headers = {noLoading:true}){
                    Object.assign(this.watchObj.paginations,plugin);
                    let obj={
                            pageNum:this.watchObj.paginations.currentPage,
                            pageSize:this.watchObj.paginations.pageSize,
                            search:{
                                deviceID:this.watchObj.deviceId
                            }
                        };
                    const {data} = await this.axios.post("ui/Register/list",obj,{headers:headers});
                    if(data.statusCode==0){
                        this.watchObj.paginations.total=data.data.total;
                        this.watchObj.items=data.data.result;
                    }else {
                        this.watchObj.paginations.total=0;
                        this.watchObj.items=[];
                    }

                }.bind(this),

            },

            detailObj: {
                isDialog: false,
                deviceId: null,
                deviceName: null,
                paginations: {//分页字段
                    total:0,
                    currentPage:1,
                    pageSize:10,
                    pageSizes:[10,20,30,50,100],
                },
                getPageData: async function(plugin={},headers = {noLoading:true}){
                    Object.assign(this.detailObj.paginations, plugin);
                    let obj = {
                            pageNum:this.detailObj.paginations.currentPage,
                            pageSize:this.detailObj.paginations.pageSize,
                            search:{
                                deviceId:this.detailObj.deviceId
                            }
                    };
                    const {data} = await this.axios.post(`ui/terminalImageReq/list`, obj, {headers: headers});
                    if(data.statusCode==0&&data.data){
                        this.detailObj.paginations.total = data.data.total;
                        this.detailObj.items = data.data.result;
                    }else {
                        this.detailObj.paginations.total = 0;
                        this.detailObj.items = [];
                    }

                }.bind(this),

            }
        };
    },

    props : {},

    components: {
        UploadFile,
    },

    computed: {
        getGroupName(){//根据单位id获取单位名称
            return function(id){
                for(let item of this.groupList){
                    if(item.id==id)return item.name
                }
                return id||'--'
            }      
        }
    },

    mounted(){
        if(this.$route.params.userName)this.searchOption.uid=this.$route.params.userName;

        if(this.$store.state.pageInfo.name=='device'){
            this.paginations=this.$store.state.pageInfo.paginations;
            this.searchOption=this.$store.state.pageInfo.searchOption;
        }
        this.getAllGroup();
        this.getPageData();

        this.$store.commit("SAVE_PAGEINFO");
    },

    methods: {
        //禁用启用或审核
        startORstop(key,obj){
            let isTitle=this.$t("isEnable");
            let tip=this.$t("enable_S");
            if(key=="checkStatus"){//审核
                isTitle=this.$t("isCheck_P");
                tip=this.$t("check_P");
            }

            if(obj[key]){//原状态为启用
                isTitle=this.$t("isForbidden");
                tip=this.$t("forbidden_S");
                if(key=="checkStatus"){
                    isTitle=this.$t("isCheck_N");
                    tip=this.$t("check_N");
                }
            }
            this.commonConfirm({title:isTitle}).then(async ()=>{
                let newObj={...this.copy(obj),[key]:!obj[key]}; 
                const {data}=await this.axios.post('ui/terminalInfo/saveOrupdate',newObj);
                if(data.statusCode==0){
                    this.commonTip(tip);
                    obj[key]=!obj[key];
                }
            });
        },

        //分页
        async getPageData(plugin={}){
            this.selectItems=[];
            Object.assign(this.paginations,plugin);
            let obj={
                pageNum:this.paginations.currentPage,
                pageSize:this.paginations.pageSize,
                orderby:"updateTime",
                searchBy:"name",
                keyword:this.searchOption.deviceName,
                search:{
                    uid:this.searchOption.uid,
                    orgName:this.searchOption.orgName,
                    status:this.searchOption.status,
                    enable:this.searchOption.enable,
                    address:this.searchOption.address,
                    markType: this.searchOption.markType,
                }
            };

            const {data}=await this.axios.post("ui/terminalInfo/list",obj);
            if(data.statusCode==0){
                this.paginations.total=data.data.total;
                this.items=data.data.result;
            }else {
                this.paginations.total=0;
                this.items=[];
            }
        },

        //获取全部单位
        async getAllGroup(){
            const {data} =await this.axios.post("ui/group/list",{pageNum:-1,pageSize:-1,orderType:"asc"},{headers:{noLoading:true}});
            if(data.statusCode == 0&&data.data){
                this.groupList = Array.treeTransArray([data.data], "childGroups");
            }
        },

        //上报
        async report(){
            const ids=this.selectItems.map(v=>v.id);
            const {data} = await this.axios.get("ui/terminal/report?ids="+ids);
            if(data.statusCode == 0){
                this.commonTip(this.$t("report_S"));
                this.getPageData();
            }
        },

        //查看备案记录
        async watch(obj){
            const {deviceId, name} = obj;

            this.watchObj.deviceId = deviceId;
            this.watchObj.deviceName = name;
            this.watchObj.paginations = {
                total:0,
                currentPage:1,
                pageSize:10,
                pageSizes:[10,20,30,50,100],
            };
            this.watchObj.items = [];

            try{
                await this.watchObj.getPageData({},{noLoading:false});
                this.isDialog = true;
            }catch(e){
                this.isDialog = true;
            }

        },

        //导出excel
        async exportExcel(){
            let obj={
                pageNum:this.paginations.currentPage,
                pageSize:this.paginations.pageSize,
                orderby:"updateTime",
                searchBy:"name",
                keyword:this.searchOption.deviceName,
                search:{
                    uid:this.searchOption.uid,
                    orgName:this.searchOption.orgName,
                    status:this.searchOption.status,
                    enable:this.searchOption.enable,
                    address:this.searchOption.address,
                    markType: this.searchOption.markType,
                }
            };
            const {data} = await this.axios.post("ui/terminalInfo/prepare", obj);
            if(data.statusCode == 0){
                const excelUrl = data.statusMsg;
                if(!excelUrl){
                    this.commonTip("导出失败", "tip_error");
                    return 
                }
                window.location.href = "ui/terminalInfo/export/"+excelUrl;
            }
        },

        //设备请求详情
        async watchDetail(row){
            const {deviceId, name} = row;
            this.detailObj.deviceId = deviceId;
            this.detailObj.deviceName = name;
            this.detailObj.paginations = {
                total:0,
                currentPage:1,
                pageSize:10,
                pageSizes:[10,20,30,50,100],
            };
            this.detailObj.items = [];
            try{
                await this.detailObj.getPageData({}, {noLoading:false});
                this.detailObj.isDialog = true;
            }catch(e){
                this.detailObj.isDialog = true;
            }

        },
    }
}

</script>
<style lang='less' scoped>
@import url("../../../css/base.less");
/deep/ .watchItems{
    height: 60%;
    box-sizing: border-box;
    margin:5% auto 0!important;
    .el-dialog__header{
        .el-dialog__title{
            color:rgba(255,255,255,0.8);
        }
    }

    .el-dialog__body{
        padding-top:0;
        flex:1;
        overflow: hidden;
        .main{
            height: 100%;
        }
    }

    .title{
        text-align: center;
        margin-bottom:10px;
        span{
            margin-right:40px;
            color:@color_text;
            i{
                font-style: normal;
                color:#fff;
            }
        }
    }
}
</style>