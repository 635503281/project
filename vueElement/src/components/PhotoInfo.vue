<template>
    <el-drawer custom-class="myDrawer" title="比中信息" :visible.sync="showDrawer" direction="rtl" size="60%" :before-close="beforeClose">
        <div class="drawer_content">
            <div class="drawer_box">
                <div class="drawer_wraper">
                    <div class="drawer_image" >
                        <template v-if="row.faceHitBackgroundRecordPo">
                            <el-popover popper-class="img_pop" placement="left-start" trigger="hover">
                                <el-image :class="{'null':imgNull(row.faceHitBackgroundRecordPo.personPhoto)}" :src="row.faceHitBackgroundRecordPo.personPhoto|baseToImg"></el-image>
                                <el-image slot="reference" :class="{'null':imgNull(row.faceHitBackgroundRecordPo.personPhoto)}" :src="row.faceHitBackgroundRecordPo.personPhoto|baseToImg"></el-image>
                            </el-popover>
                            
                        </template>
                        <template v-else>
                            <el-image class="null" src=""></el-image>
                        </template>
                    </div>
                    
                    <div class="drawer_details moreline" style="max-height:270px;">
                        <pTip><template v-slot:c><span>{{$t("similarity")}}:</span><span>{{row.similarity|toPercentage}}</span></template></pTip>
                        <pTip><template v-slot:c><span>{{$t("featureID")}}:</span><span>{{row.featureID||"--"}}</span></template></pTip>
                        <pTip><template v-slot:c><span>{{$t("earlyWarningSign")}}:</span>
                            <el-tag v-for="val in filterArr(warnFlagList,row.earlyWarningSign)" :key="val.id" size="small" :type="val.type">{{val.name}}</el-tag>
                        </template></pTip>

                        <template v-if="row.faceHitBackgroundRecordPo">
                            <!-- <pTip>
                                <template v-slot:c><span>关注人员类型:</span><span v-for="val in filterArr(warnTypeList,row.faceHitBackgroundRecordPo.warningType)" :key="val.id">{{val.name}}</span></template>
                            </pTip> -->
                            <pTip><template v-slot:c><span>{{$t("managementCateGory")}}:</span><span>{{row.faceHitBackgroundRecordPo.managementCategoryName||'--'}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("controllingMatter")}}:</span><span>{{row.faceHitBackgroundRecordPo.controllingMatter||'--'}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("suggestedDisposalMeasure")}}:</span><span>{{row.faceHitBackgroundRecordPo.suggestedDisposalMeasure||'--'}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("policeName")}}:</span><span>{{row.faceHitBackgroundRecordPo.policeName||'--'}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("controllingUnitPoliceName")}}:</span><span>{{row.faceHitBackgroundRecordPo.controllingUnitPoliceName||'--'}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("registerUnitPoliceName")}}:</span><span>{{row.faceHitBackgroundRecordPo.registerUnitPoliceName||'--'}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("registerPeopleName")}}:</span><span>{{row.faceHitBackgroundRecordPo.registerPeopleName||'--'}}</span></template></pTip>
                            <pTip><template v-slot:c><span></span><span></span></template></pTip>

                            <pTip><template v-slot:c><span>{{$t("personName")}}:</span><span>{{row.faceHitBackgroundRecordPo.personName||'--'}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("personSex")}}:</span>
                                <span v-if="row.faceHitBackgroundRecordPo.personSex=='1'">男</span>
                                <span v-else-if="row.faceHitBackgroundRecordPo.personSex=='2'">女</span>
                                <span v-else>{{row.faceHitBackgroundRecordPo.personSex||'--'}}</span>
                            </template></pTip>
                            <pTip><template v-slot:c><span>{{$t("identificationCard")}}:</span><span>{{row.faceHitBackgroundRecordPo.identityNumber||'--'}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("personBirth")}}:</span><span>{{row.faceHitBackgroundRecordPo.personBirth|timeFormat("yyyy-MM-dd")}}</span></template></pTip>
                            <pTip><template v-slot:c><span>户籍区县名称:</span><span>{{row.faceHitBackgroundRecordPo.ResidenceNoName||'--'}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("residenceAddress")}}:</span><span>{{row.faceHitBackgroundRecordPo.residenceAddress||'--'}}</span></template></pTip>
                            <pTip><template v-slot:c><span>居住区县名称::</span><span>{{row.faceHitBackgroundRecordPo.AddressNoName||'--'}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("address1")}}:</span><span>{{row.faceHitBackgroundRecordPo.address||'--'}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("responsiblePoliceName")}}:</span><span>{{row.faceHitBackgroundRecordPo.responsiblePoliceName||'--'}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("responsiblePolicePhoneNumber")}}:</span><span>{{row.faceHitBackgroundRecordPo.responsiblePolicePhoneNumber||'--'}}</span></template></pTip>   
                            <pTip><template v-slot:c><span>{{$t("registerTime")}}:</span><span>{{row.faceHitBackgroundRecordPo.registerTime|timeFormat}}</span></template></pTip>
                        </template>
                    </div>
                </div>
            </div>
            
            <template v-if="row.imagePo">
                <div class="drawer_box">
                    <h4 class="title">图片信息</h4>
                    <div class="drawer_wraper">
                        <div class="drawer_image">
                            <el-popover popper-class="img_pop" placement="left-start" trigger="hover">
                                <el-image :class="{'null':imgNull(row.imagePo.Data)}" :src="row.imagePo.Data|baseToImg"></el-image>
                                <el-image slot="reference" :class="{'null':imgNull(row.imagePo.Data)}" :src="row.imagePo.Data|baseToImg"></el-image>
                            </el-popover>
                        </div>
                        <div class="drawer_details moreline" style="max-height:230px;">
                            <pTip><template v-slot:c><span>采集时间:</span><span>{{row.imagePo.ShotTime|timeFormat}}</span></template></pTip>
                            <pTip><template v-slot:c><span>上报时间:</span><span>{{row.imagePo.reportTime|timeFormat}}</span></template></pTip>
                            <pTip><template v-slot:c><span>请求时间:</span><span>{{row.imagePo.RequestTime|toTime}}</span></template></pTip>
                            <pTip><template v-slot:c><span>比对时间:</span><span>{{row.imagePo.retrieveRspTime|timeFormat}}</span></template></pTip>
                            <pTip><template v-slot:c><span>预警时间:</span><span>{{row.imagePo.warnTime|timeFormat}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("deviceID")}}:</span><span>{{row.imagePo.DeviceID||"--"}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("shotPlaceFullAdress")}}:</span><span>{{row.imagePo.ShotPlaceFullAdress||"--"}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("collector")}}:</span><span>{{row.imagePo.CollectorName||"--"}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("collectorOrg")}}:</span><span>{{row.imagePo.CollectorOrg||"--"}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("description")}}:</span><span>{{row.imagePo.ContentDescription||"--"}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("title")}}:</span><span>{{row.imagePo.Title||"--"}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("addrCode")}}:</span><span>{{row.imagePo.AddrCode||"--"}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("addrDetail")}}:</span><span>{{row.imagePo.AddrDetail||"--"}}</span></template></pTip>
                            <pTip><template v-slot:c><span>图片ID:</span><span>{{row.imagePo.ImageID}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("imgSource")}}:</span><span>{{row.imagePo.ImageSource||"--"}}</span></template></pTip>
                            <p v-if="row.imagePo.FaceList&&row.imagePo.FaceList.length"><span class="textBtn" @click="isMore=!isMore">{{isMore?"收起":"更多..."}}</span></p>
                        </div>
                        
                    </div>
                </div>
                <template v-if="isMore&&row.imagePo.FaceList&&row.imagePo.FaceList.length">
                    <h4 class="title">附加图片及人脸信息</h4>
                    <div class="drawer_box morewraper">
                        <div class="drawer_wraper" v-for="(v,i) in row.imagePo.FaceList" :key="i">
                            <template v-if="v.SubImageList&&v.SubImageList.length">
                                <el-carousel class="drawer_image" :interval="5000"  indicator-position="none" :arrow="v.SubImageList.length>1?'hover':'never'">
                                    <el-carousel-item v-for="(val,k) in v.SubImageList" :key="k">
                                        <el-popover popper-class="img_pop" placement="left-start" trigger="hover">
                                            <el-image :class="{'null':imgNull(val.dada)}" :src="val.data|baseToImg"></el-image>
                                            <el-image slot="reference" :class="{'null':imgNull(val.dada)}" :src="val.data|baseToImg"></el-image>
                                        </el-popover>
                                    </el-carousel-item>
                                </el-carousel>
                            </template>
                            <div v-else class="drawer_image"><el-image class="null" src=""></el-image></div>
                            <div class="drawer_details"><!-- moreline -->
                                <pTip><template v-slot:c><span>{{$t("name1")}}:</span><span>{{v.Name||"--"}}</span></template></pTip>
                                <pTip><template v-slot:c><span>{{$t("gender")}}:</span>
                                    <span v-if="v.GenderCode=='1'">{{$t("man")}}</span>
                                    <span v-else-if="v.GenderCode=='2'">{{$t("woman")}}</span>
                                    <span v-else-if="v.GenderCode">未知</span>
                                    <span v-else>--</span>
                                </template></pTip>
                                <pTip><template v-slot:c><span>{{$t("ethic")}}:</span><span>{{v.EthicCode||"--"}}</span></template></pTip>
                                <pTip><template v-slot:c><span>{{$t("faceID")}}:</span><span>{{v.FaceID||"--"}}</span></template></pTip>
                                <pTip><template v-slot:c><span>{{$t("deviceID")}}:</span><span>{{v.DeviceID||"--"}}</span></template></pTip>
                                <pTip><template v-slot:c><span>{{$t("sourceID")}}:</span><span>{{v.SourceID||"--"}}</span></template></pTip>
                                <pTip><template v-slot:c><span>{{$t("locationMarkTime")}}:</span><span>{{v.LocationMarkTime|toTime}}</span></template></pTip>
                                <pTip><template v-slot:c><span>{{$t("faceAppearTime")}}:</span><span>{{v.FaceAppearTime|toTime}}</span></template></pTip>
                                <pTip><template v-slot:c><span>{{$t("faceDisAppearTime")}}:</span><span>{{v.FaceDisAppearTime|toTime}}</span></template></pTip>
                            </div>
                        </div>
                    </div>
                </template>

            </template>
        </div>
    </el-drawer>
</template>

<script>
import pTip from "@/components/pTip"

export default {

    data(){
        return {
            warnFlagList: [
                {id:null,name:this.$t("all")},{id:1,name:this.$t("warn_red"),type:"red"},{id:2,name:this.$t("warn_orange"),type:"orange"},{id:3,name:this.$t("warn_yellow"),type:"yellow"},{id:4,name:this.$t("warn_no"),type:"no"},
            ],

            warnTypeList: [
                {id:"1",name:"全国在逃"},{id:"2",name:"全国布控"},{id:"3",name:"全国治安重点人"},{id:"4",name:"本地布控"},{id:"5",name:"地方治安重点人"}
            ],
            
            isMore: false,
        }   
    },
    props:{
        showDrawer: {
            type: Boolean,
            default: false,
        },
        row: {
            type: Object,
            required: true,
        }
    },
    components:{
        pTip, 
    },
    filters: {
        toTime(val){
            if(!val)return "--"
            val=val.toString();
            if(val.indexOf("-")!=-1)return val
            return val.slice(0,4)+"-"+val.slice(4,6)+"-"+val.slice(6,8)+" "+val.slice(8,10)+":"+val.slice(10,12)+":"+val.slice(12,14)
        }
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

    },
    methods: {
        beforeClose(){
            this.$emit('update:showDrawer', false);
            this.isMore = false;
        }
    }
}
</script>

<style lang="less" scoped>
.textBtn{
    color:#4181FF!important;
    cursor: pointer;
    bottom: 12px;
    left:0;
}
</style>


