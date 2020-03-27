<!-- 灰名单身份识别 -->
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
                      value-format="yyyy-MM-dd HH:mm:ss" :picker-options="defaultTime.day_pickerOptions()" :clearable="false" popper-class="defaultTime_range">
                    </el-date-picker>
                </div>
                <div class="search_item">
                    <span>{{$t("deviceID")}}:</span>
                    <el-input v-model="searchOption.deviceID" :placeholder="$t('placeholder.input')" clearable></el-input>
                </div>
                <div class="search_item">
                    <span>{{$t("faceImageID")}}:</span>
                    <el-input v-model="searchOption.faceImageID" :placeholder="$t('placeholder.input')" clearable></el-input>
                </div>
                <!-- <div class="search_item">
                    <span>{{$t("servicePointID")}}:</span>
                    <el-input v-model="searchOption.servicePointID" :placeholder="$t('placeholder.input')" clearable></el-input>
                </div> -->
                <div class="search_item">
                    <span>是否返回结果:</span>
                    <el-select v-model="searchOption.isReturnResult" :placeholder="$t('placeholder.choose')" clearable>
                        <el-option :label="$t('yes')" value="grayListRowListIsNotEmpty"></el-option>
                        <el-option :label="$t('no')" value="grayListRowListIsEmpty"></el-option>
                    </el-select>
                </div>
                <div class="search_btns">
                    <el-button type="primary" @click="search">{{$t("search")}}</el-button>
                </div>
            </div>

            <div class="main">
                <!-- <div class="main-table">
                    <el-table max-height="100%" ref="greyList_table" :data="items" style="width: 100%" :empty-text="$t('noData')" @selection-change="val=>this.selectItems=val" 
                        @row-click="row=>this.$refs['greyList_table'].toggleRowExpansion(row)">
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <div class="expand">
                                    <img v-if="scope.row.Data" :src="scope.row.Data|baseToImg">
                                    <div class="info">
                                        <p><span>{{$t("shotTime")}}:</span><span>{{scope.row.ShotTime||"--"}}</span></p>
                                        <p><span>{{$t("returnRecordNum")}}:</span><span>{{scope.row.ReturnRecordNum||"--"}}</span></p>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="FaceImageID" :label="$t('faceImageID')" min-width="180" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="DeviceID" :label="$t('deviceID')" min-width="180" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="ServicePointID" :label="$t('servicePointID')" min-width="150" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="IsReturnPhoto" :label="$t('isReturnPhoto')" min-width="110" :formatter="(r,c,value)=>value?this.$t('yes'):this.$t('no')"></el-table-column>
                        <el-table-column prop="createTime" :label="$t('createTime')" width="140" sortable></el-table-column>
                    </el-table>
                    <Pagination :paginations="paginations" @changeDate='getPageData'/>  
                </div> -->
                <div class="main-table">
                    <div v-if="!items.length" class="empty_text">{{$t("noData")}}</div>
                    <el-row :gutter="20">
                        <el-col :xs="8" :sm="6" :md="4"  :lg="3" :xl="2" v-for="(row,k) in items" :key="k">
                            <el-card shadow="hover" :class="card_style(row)">
                                <el-image :class="{'null':imgNull(row.Data)}" :src="row.Data|baseToImg" :alt="$t('image')" @click.native="showBox(row)">
                                    <template slot="placeholder"><img :src="row.Data|baseToImg"></template>
                                </el-image>
                                <div class="cardInfo">
                                    <pTip :content="row.createTime|timeFormat('MM-dd HH:mm:ss')"></pTip>
                                    <template v-if="row.checkStatus==1">
                                        <pTip :content="row.unqualifiedReason"></pTip>
                                    </template>
                                    <template v-else-if="row.grayListRowList&&row.grayListRowList.length">
                                        <pTip><template v-slot:c><span>{{keySort(row.grayListRowList,'RXXSD')[0].XM||"--"}}</span></template></pTip>
                                    </template>
                                </div>
                            </el-card>      
                        </el-col>
                    </el-row>
                </div>
                <Pagination :paginations="paginations" @changeDate='getPageData' :resize="true"/>
            </div>
        </div>
        <el-drawer custom-class="myDrawer" :title="$t('details')" :visible.sync="showDrawer" direction="rtl" size="60%" :before-close="()=>{this.showDrawer=false;setTimeout(()=>this.row={})}">
            <div class="drawer_content">
                <div class="drawer_box">
                    <div class="drawer_wraper">
                        <div class="drawer_image">
                            <el-popover popper-class="img_pop" placement="left-start" trigger="hover">
                                <el-image :class="{'null':imgNull(row.Data)}" :src="row.Data|baseToImg"></el-image> 
                                <el-image slot="reference" :class="{'null':imgNull(row.Data)}" :src="row.Data|baseToImg"></el-image> 
                            </el-popover>
                        </div>
                        <div class="drawer_details">
                            <pTip><template v-slot:c><span>{{$t("faceImageID")}}:</span><span>{{row.FaceImageID||"--"}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("deviceID")}}:</span><span>{{row.DeviceID||"--"}}</span></template></pTip>
                            <!-- <pTip><template v-slot:c><span>{{$t("servicePointID")}}:</span><span>{{row.ServicePointID||"--"}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("isReturnPhoto")}}:</span><span>{{row.IsReturnPhoto?$t("yes"):$t("no")}}</span></template></pTip> -->
                            <pTip><template v-slot:c><span>{{$t("returnRecordNum")}}:</span><span>{{row.ReturnRecordNum||"--"}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("shotTime")}}:</span><span>{{row.ShotTime||"--"}}</span></template></pTip>
                        </div>
                    </div>
                </div>
                <h4 class="title" v-if="row.grayListRowList&&row.grayListRowList.length">识别结果</h4>
                <div class="result" v-if="row.grayListRowList&&row.grayListRowList.length">
                    <div class="drawer_box" v-for="(sigle,index) in keySort(row.grayListRowList,'RXXSD')" :key="index">
                        <div class="drawer_wraper">
                            <div class="drawer_image">
                                <el-popover popper-class="img_pop" placement="left-start" trigger="hover">
                                    <el-image :class="{'null':imgNull(sigle.XP)}" :src="sigle.XP|baseToImg"></el-image>
                                    <el-image slot="reference" :class="{'null':imgNull(sigle.XP)}" :src="sigle.XP|baseToImg"></el-image>  
                                </el-popover>
                            </div>
                            <div class="drawer_details">
                                <pTip><template v-slot:c><span>{{$t("name1")}}:</span><span>{{sigle.XM||"--"}}</span></template></pTip>
                                <pTip><template v-slot:c><span>{{$t("similarity")}}:</span><span>{{sigle.RXXSD|toPercentage}}</span></template></pTip>
                                <pTip><template v-slot:c><span>{{$t("faceImageID")}}:</span><span>{{sigle.RXXPID||"--"}}</span></template></pTip>
                                <pTip><template v-slot:c><span>{{$t("gender")}}:</span>
                                    <span v-if="sigle.XBDM=='1'">{{$t("man")}}</span>
                                    <span v-else-if="sigle.XBDM=='2'">{{$t("woman")}}</span>
                                    <span v-else-if="sigle.XBDM">未知</span>
                                    <span v-else>--</span>
                                </template></pTip>
                                <pTip><template v-slot:c><span>{{$t("ethic")}}:</span><span>{{sigle.MZDM||"--"}}</span></template></pTip>
                                <pTip><template v-slot:c><span>{{$t("identificationCard")}}:</span><span>{{sigle.GMSFHM||"--"}}</span></template></pTip>
                                <pTip><template v-slot:c><span>{{$t("personBirth")}}:</span><span>{{sigle.CSRQ||"--"}}</span></template></pTip>
                                <pTip><template v-slot:c><span>户籍区县名称:</span><span>{{sigle.HJDZ_SSXQMC||"--"}}</span></template></pTip>
                                <pTip><template v-slot:c><span>{{$t("residenceAddress")}}:</span><span>{{sigle.HJDZ_QHNXXDZ||"--"}}</span></template></pTip>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </el-drawer>
    </div>
</template>

<script>
import {basicPage} from "@/common/mixin"
import eVue from "@/common/event"
import pTip from "@/components/pTip"

export default {
    mixins:[basicPage],

    data () {
        return {
            searchOption:{
                faceImageID:null,
                times:this.defaultTime.day(),
                servicePointID:null,
                deviceID:null,
                isReturnResult:null,
            },
            deviceList:[{id:null,name:this.$t("all")}],
        };
    },

    props : {},

    components: {
       pTip 
    },

    computed: {
        keySort(){
            const {copy} = this;
            return function(list,key,type=false){
                const newList=copy(list);
                if(type)newList.sort((a,b)=>a[key]-b[key]);//升序
                else newList.sort((a,b)=>b[key]-a[key]);//降序
                return newList
            }
        },

        imgNull(){
            return function(val){
                if(val == null||val == "null")return true
                else{
                    if(!val)return false
                    let arr = val.split("/").reverse();
                    const newVal = arr[0];
                    if(newVal == null|| newVal == "null")return true
                    else return false
                }
                    
            }
        },

        card_style(){
            return function(row){
                let {isReturnResult = 'grayListRowListIsEmpty', pushWaring = null} = row;
                let arrClass = [];
                if(isReturnResult == 'grayListRowListIsNotEmpty')arrClass.push('hasResult');

                if(pushWaring == true)arrClass.push('pushWaringS');
                else if(pushWaring == false)arrClass.push('pushWaringF');

                return arrClass.join(" ")
            }
        }
        
    },

    mounted(){
        //监听socket推送
        eVue.$on("greyList", ()=>{
            this.getPageData({currentPage:1},{noLoading:true,responseError: true});
        });
    },

    methods: {
        //分页
        async getPageData(plugin={},headers={}){
            if(plugin.pageSizes){//处理显示的个数
                const height = document.documentElement.clientHeight;
                if(height>930)plugin.pageSize=plugin.pageSizes[1];
                else if(height>790){
                    plugin.pageSizes.splice(1,0,1.5*plugin.pageSizes[0]);
                    plugin.pageSizes.pop();
                    plugin.pageSize=plugin.pageSizes[1];
                }
            }
            Object.assign(this.paginations,plugin);
            let obj={
                pageNum:this.paginations.currentPage,
                pageSize:this.paginations.pageSize,
                searchBy:"deviceID",
                keyword:this.searchOption.deviceID,
                search:{
                    faceImageID:this.searchOption.faceImageID,
                    startTime:this.searchOption.times?this.searchOption.times[0]:null,
                    endTime:this.searchOption.times?this.searchOption.times[1]:null,
                    // servicePointID:this.searchOption.servicePointID,
                    isReturnResult:this.searchOption.isReturnResult,
                }
            }
            const {data} =await this.axios.post("ui/graylist/homelist",obj,{headers});
            if(data.statusCode==0){
                this.paginations.total=data.data.total;
                this.items=data.data.result;

            }else{
                this.paginations.total=0;
                this.items=[];
            }

        },

        //详情跟识别结果
        async showBox(row){
            const {id, partition} = row;
            this.row = row;
            try{
                const {data} = await this.axios.post(`ui/graylist/get/partition/${id}?partition=${partition}`);
                if(data.statusCode == 0){
                    this.showDrawer = true;
                    this.row.grayListRowList = data.data.grayListRowList||[];
                }

            }catch(e){
                this.showDrawer = true;
            }
           
        },
        
    },

    destroyed(){
        eVue.$off("greyList");
    },
}

</script>
<style lang='less' scoped>
.expand{
    margin-left: 50px;
    display: flex;
        img{
            margin-right:10px;
            max-height: 500px;
            max-width:40%;
        }
        .info{
            flex:1;
            max-width: 500px;
            &:not(:last-of-type){
                margin-right:20px;
            }

            p{
                margin:5px 0;
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