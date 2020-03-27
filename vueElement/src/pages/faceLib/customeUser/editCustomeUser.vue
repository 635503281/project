<!-- 编辑设备用户 -->
<template>
    <div>
        <el-breadcrumb class="myBreadcrumb">
            <el-breadcrumb-item v-for="(menu,i) in $route.meta.menus.filter((v,i)=>i!=0)" :key="i" :to="menu.path||null">{{menu.name}}</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="content main-form">
            <el-form class="form" ref="customeUser" :model="customeUser" :rules="rules" label-width="30%" :inline-message="true" autocomplete="off">
                <el-form-item :label="$t('personName')" prop="personName">
                    <el-input v-model="customeUser.personName" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('personSex')" prop="personSex">
                    <el-select v-model="customeUser.personSex" :placeholder="$t('placeholder.choose')" clearable>
                        <el-option :value="$t('man')"></el-option>
                        <el-option :value="$t('woman')"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('faceImage')" prop="personPhoto">
                    <el-upload class="avatar-uploader" :show-file-list="false" :multiple="false" :drag="true" :auto-upload="false" :on-change="changeImg">
                        <el-image v-if="customeUser.personPhoto" :src="customeUser.personPhoto|baseToImg" class="avatar"></el-image>
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload> 
                </el-form-item>
                <el-form-item :label="$t('personBirth')" prop="personBirth">
                    <el-date-picker type="date" v-model="customeUser.personBirth" value-format="timestamp" :placeholder="$t('placeholder.choose')" clearable></el-date-picker>
                </el-form-item>
                <el-form-item :label="$t('identificationCard')" prop="identityNumber">
                    <el-input v-model="customeUser.identityNumber" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('residenceNo')" prop="residenceNo">
                    <el-input v-model="customeUser.residenceNo" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('residenceAddress')" prop="residenceAddress">
                    <el-input v-model="customeUser.residenceAddress" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                <!-- <el-form-item :label="$t('featureID')" prop="featId">
                    <el-select v-model="customeUser.featId" :placeholder="$t('placeholder.choose')" filterable clearable>
                        <el-option v-for="(val,index) in featureDataList" :key="index" :value="val.featureId"></el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item :label="$t('customeGroup')" prop="customGroup">
                    <el-select v-model="customeUser.customGroup" :placeholder="$t('placeholder.choose')" filterable clearable>
                        <el-option v-for="(val,index) in customeGroupList" :key="index" :label="val.groupName" :value="val.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('deviceID')" prop="deviceId">
                    <el-input v-model="customeUser.deviceId" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('compareTime')" prop="comparingTime">
                    <el-date-picker type="datetime" v-model="customeUser.comparingTime" value-format="timestamp" :placeholder="$t('placeholder.choose')" clearable></el-date-picker>
                </el-form-item>
                <el-form-item :label="$t('policeCode')" prop="policeCode">
                    <el-input v-model="customeUser.policeCode" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('policeName')" prop="policeName">
                    <el-input v-model="customeUser.policeName" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('earlyWarningSign')" prop="warningSign">
                    <el-select v-model="customeUser.warningSign" :placeholder="$t('placeholder.choose')" clearable>
                        <el-option v-for="(val,index) in warnFlagList" :key="index" :label="val.name" :value="val.id"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item :label="$t('addressNo')" prop="addressNo">
                    <el-input v-model="customeUser.addressNo" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('address1')" prop="address">
                    <el-input v-model="customeUser.address" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('managementCateGory')" prop="managementCateGory">
                    <el-input type="number" v-model="customeUser.managementCateGory" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('suggestedDisposalMeasure')" prop="suggestedDisposalMeasure">
                    <el-input v-model="customeUser.suggestedDisposalMeasure" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('controllingMatter')" prop="controllingMatter">
                    <el-input v-model="customeUser.controllingMatter" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('controllingUnitPoliceCode')" prop="controllingUnitPoliceCode">
                    <el-input v-model="customeUser.controllingUnitPoliceCode" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('controllingUnitPoliceName')" prop="controllingUnitPoliceName">
                    <el-input v-model="customeUser.controllingUnitPoliceName" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('responsiblePoliceName')" prop="responsiblePoliceName">
                    <el-input v-model="customeUser.responsiblePoliceName" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('responsiblePolicePhoneNumber')" prop="responsiblePolicePhoneNumber">
                    <el-input type="number" v-model="customeUser.responsiblePolicePhoneNumber" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('registerPeopleName')" prop="registerPeopleName">
                    <el-input v-model="customeUser.registerPeopleName" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('registerUnitPoliceCode')" prop="registerUnitPoliceCode">
                    <el-input v-model="customeUser.registerUnitPoliceCode" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('registerUnitPoliceName')" prop="registerUnitPoliceName">
                    <el-input v-model="customeUser.registerUnitPoliceName" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('registerTime')" prop="registerTime">
                    <el-date-picker type="datetime" v-model="customeUser.registerTime" value-format="timestamp" :placeholder="$t('placeholder.choose')" clearable></el-date-picker>
                </el-form-item>

                <el-form-item class="form_btns">
                    <el-button type="primary" @click="submit('customeUser')">{{$t("submit")}}</el-button>
                    <el-button @click="()=>this.$router.push({name:'customeUser'})">{{$t("cancel")}}</el-button>
                </el-form-item>
            </el-form> 
        </div>

    </div>
</template>

<script>
import base64 from "@/common/base64"
import {imgToBase64} from "@/common/method"

export default {
    data () {
        return {
            id:0,
            customeUser:{
                personName:null,
                personSex:null,
                personBirth:null,
                identityNumber:null,
                residenceNo:null,
                residenceAddress:null,
                customGroup:null,
                personPhoto:null,//base64格式图片
                featId:null,
                deviceId:null,
                comparingTime:null,
                policeCode:null,
                policeName:null,
                warningSign:null,

                addressNo:null,
                address:null,
                managementCateGory:null,
                suggestedDisposalMeasure:null,
                controllingMatter:null,
                controllingUnitPoliceCode:null,
                controllingUnitPoliceName:null,
                responsiblePoliceName:null,
                responsiblePolicePhoneNumber:null,
                registerUnitPoliceCode:null,
                registerUnitPoliceName:null,
                registerPeopleName:null,
                registerTime:null,
            },
            rules:{
                personName:[{required:true,message:this.$t("noEmpty"),trigger:'change'}],
                personSex:[{required:true,message:this.$t("noEmpty"),trigger:'change'}],
                personBirth:[{required:true,message:this.$t("noEmpty"),trigger:'change'}],
                identityNumber:[{required:true,message:this.$t("noEmpty"),trigger:'change'}],
                customGroup:[{required:true,message:this.$t("noEmpty"),trigger:'change'}],
                personPhoto:[{required:true,message:this.$t("noEmpty"),trigger:'change'}],
                // featId:[{required:true,message:this.$t("noEmpty"),trigger:'change'}],
                residenceNo:[{required:true,message:this.$t("noEmpty"),trigger:'change'}],
                residenceAddress:[{required:true,message:this.$t("noEmpty"),trigger:'change'}],
                deviceId:[{required:true,message:this.$t("noEmpty"),trigger:'change'}],
                comparingTime:[{required:true,message:this.$t("noEmpty"),trigger:'change'}],
                policeCode:[{required:true,message:this.$t("noEmpty"),trigger:'change'}],
                policeName:[{required:true,message:this.$t("noEmpty"),trigger:'change'}],
                warningSign:[{required:true,message:this.$t("noEmpty"),trigger:'change'}],

                responsiblePolicePhoneNumber:[
                    {validator:(rule,value,callback)=>{
                        if(value&&(value.length>11||value.length<8)){
                            callback(this.$t("placeholder.correctPhone"));return
                        }
                       callback(); 
                    },trigger:"change"},
                ],
            },
            customeGroupList:[],
            warnFlagList:[
                {id:"1",name:this.$t("warn_red"),type:"danger"},{id:"2",name:this.$t("warn_orange"),type:"orange"},{id:"3",name:this.$t("warn_yellow"),type:"yellow"},{id:"4",name:this.$t("warn_no"),type:"success"},
            ],
            featureDataList:[],
        };
    },

    props : {},

    components: {},

    computed: {},

    beforeMount(){
        this.getCustomeGroup();
        // this.getAllFeatureData();
        this.id=parseInt(this.$route.query.id);
        if(this.id)this.getCustomeUserById();
    },

    mounted(){},

    methods: {
        //获取
        async getCustomeUserById(){
            const {data}=await this.axios.post("ui/customeUser/list",{search:{id:this.id}});
            if(data.statusCode==0&&data.data.result&&data.data.result.length){
                let item=data.data.result[0];
                item.customGroup=item.customGroup?item.customGroup.id:null;
                this.customeUser=item; 
            }
        },

        //获取自建库
        async getCustomeGroup(){
            const {data} = await this.axios.post('ui/customeGroup/list',{},{headers:{noLoading:true}});
            if(data.statusCode==0){
                this.customeGroupList=data.data.result||[];
            }
        },

        //选择图片
        async changeImg(file){
            // lastModified: 1573629460634
            // lastModifiedDate: Wed Nov 13 2019 15:17:40 GMT+0800 (中国标准时间) {}
            // name: "download.jpg"
            // size: 42762
            // type: "image/jpeg"
            // uid: 1573632196185
            // webkitRelativePath: ""
            const img=file.raw;
            if(!/\.(png|jpg|gif|jpeg|webp)$/.test(img.name)){
                this.commonTip(this.$t("pleaseChooseImg"),'tip_notice');
                return
            }
            const url=await imgToBase64(img);
            this.customeUser.personPhoto=url;
        },

        //获取所有特征数据
        async getAllFeatureData(){
            const {data} = await this.axios.post("ui/customFeatureData/list",{},{headers:{noLoading:true}});
            if(data.statusCode == 0){
                this.featureDataList = data.data.result;
            }
        },

        //提交
        submit(form){
            this.$refs[form].validate(async valid=>{
                if(valid){
                    let obj=this.copy(this.customeUser);
                    obj.customGroup={id:obj.customGroup};
                    const {data}=await this.axios.post("ui/customeUser/saveOrUpdate",obj);
                    if(data.statusCode==0){
                        let tip=this.$t("add_S");
                        if(this.id!=0)tip=this.$t("modify_S");
                        this.commonTip(tip).then(()=>this.$router.push({name:"customeUser"}));
                    }
                }

            })
        },
        
    }
}

</script>
<style lang='less' scoped>
@import url("../../../css/base.less");

.avatar-uploader{
    @img:100px;
    /deep/ .el-upload-dragger{
        width: @img;
        height: @img;
        background-color: transparent;
        border-color:@color_input_border;
    }
    /deep/ .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: @img;
        height: @img;
        line-height: @img;
        text-align: center;
    }
    /deep/ .avatar {
        width: @img;
        height: @img;
        display: block;
    }
}

</style>