<!-- 编辑设备 -->
<template>
    <div>
        <el-breadcrumb class="myBreadcrumb">
            <el-breadcrumb-item v-for="(menu,i) in $route.meta.menus.filter((v,i)=>i!=0)" :key="i" :to="menu.path||null">{{menu.name}}</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="content main-form">
            <el-form class="form" ref="device" :model="device" :rules="rules" label-width="30%" :inline-message="true" autocomplete="off">
                <el-form-item :label="$t('deviceID')" prop="deviceId">
                    <el-input v-model="device.deviceId" :placeholder="$t('placeholder.input')" :disabled="id!=0" v-max="20"></el-input>
                    <!-- <el-button class="marginL-10" v-if="id==0" @click="makeDeviceId">{{$t("make")}}</el-button> -->
                </el-form-item>
                <el-form-item :label="$t('deviceName')" prop="name">
                    <el-input v-model="device.name" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('uid')" prop="uid">
                    <el-input :disabled="id!=0" v-model="device.uid" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('password')" prop="pwd">
                    <input class="password_clear"><input class="password_clear" type="password" name="password">
                    <el-input :disabled="id!=0" type="password" v-model="device.pwd" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('orgCode')" prop="orgCode">
                    <el-input v-model="device.orgCode" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('orgName')" prop="orgName">
                    <el-input v-model="device.orgName" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('placeCode')" prop="placeCode">
                    <el-input v-model="device.placeCode" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('address')" prop="address">
                    <el-input v-model="device.address" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('longitude')" prop="longitude">
                    <el-input v-model="device.longitude" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('latitude')" prop="latitude">
                    <el-input v-model="device.latitude" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('company')" prop="groupId" class="treePlugin">
                    <Tree ref="groupTree" id="group" :plugin="group_plugin" :datas="groupList"  @treeClick="selectGroup"></Tree>
                </el-form-item>
                <!-- <el-form-item :label="$t('status')" prop="enable">
                    <el-radio-group v-model="device.enable">
                        <el-radio :label="true">{{$t("enable")}}</el-radio>
                        <el-radio :label="false">{{$t("forbidden")}}</el-radio>
                    </el-radio-group>
                </el-form-item> -->
                <el-form-item class="form_btns">
                    <el-button type="primary" @click="submit('device')">{{$t("submit")}}</el-button>
                    <el-button @click="()=>this.$router.push({name:'device'})">{{$t("cancel")}}</el-button>
                </el-form-item>
              
            </el-form> 
        </div>

    </div>
</template>

<script>
import {guid, Reg} from "@/common/method"

export default {
    data () {
        return {
            id:0,
            device:{
                deviceId:null,//设备ID
                uid:null,//用户帐号
                pwd:null,//登录密码

                name:null,//设备名称
                orgCode:null,//公安机关机构代码
                orgName:null,//公安机关机构名称
                placeCode:null,//省市县
                address:null,//详细地址
                longitude:null,//经度
                latitude:null,//纬度
                enable:false,
                groupId:null,//单位
            },
            rules:{
                deviceId:[{required:true,message:this.$t("noEmpty"),trigger:'change'}],
                // uid:[{required:true,message:this.$t("noEmpty"),trigger:'change'}],
                // pwd:[{required:true,message:this.$t("noEmpty"),trigger:'change'}],
                longitude: [{
                    validator: (rule,value,callback)=>{
                        if(value && !Reg.lonReg.test(value) ){
                            callback(new Error("经度格式不正确"));
                            return
                        }
                        callback();
                    },
                    trigger:'change',  
                }],
                latitude: [{
                    validator: (rule,value,callback)=>{
                        if(value && !Reg.latReg.test(value) ){
                            callback(new Error("纬度格式不正确"));
                            return
                        }
                        callback();
                    },
                    trigger:'change',  
                }],
            },

            group_plugin:{
                name:"name",
                title:"name",
                isSimpleData:true,
            },
            groupList:[],
        };
    },

    props : {},

    components: {
        Tree:()=>import("@/components/Tree"),
    },

    computed: {},

    beforeMount(){
        this.id=parseInt(this.$route.query.id);
        if(this.id){
            this.$store.commit("CHANGE_LOADING",true);
            Promise.all([this.getDeviceById(),this.getAllGroup({noLoading:true})]).then(()=>{
                this.$nextTick(()=>this.initTree(this.$refs.groupTree.zTreeObj));
                this.$store.commit("CHANGE_LOADING",false);
            });

        }else this.getAllGroup({noLoading:false});
    },

    mounted(){},

    methods: {
        //获取device
        async getDeviceById(){
            const {data}=await this.axios.get("ui/terminalInfo/detail?id="+this.id,{headers: {noLoading:true}});
            if(data.statusCode==0){
                this.device=data.data;
            }
        },

        //生成deviceID
        makeDeviceId(){
            this.device.deviceId=guid();
        },

        //提交
        submit(form){
            this.$refs[form].validate(async valid=>{
                if(valid){
                    const {data}=await this.axios.post("ui/terminalInfo/saveOrupdate",this.device);
                    if(data.statusCode==0){
                        let tip=this.$t("add_S");
                        if(this.id!=0)tip=this.$t("modify_S");
                        this.commonTip(tip).then(()=>{
                            this.$router.push({name:"device"});
                        });
                    }
                }

            })
        },

        //获取全部单位
        async getAllGroup(headers={}){
            const {data} =await this.axios.post("ui/group/list",{pageNum:-1,pageSize:-1,orderType:"asc"},{headers:headers});
            if(data.statusCode == 0&&data.data){
                data.data.open=true;
                this.groupList = Array.treeTransArray([data.data], "childGroups");
            }
        },

        //初始化填充选中
        initTree(zTreeObj){
            if(this.device.groupId){
                let seletedNode= zTreeObj.transformToArray(zTreeObj.getNodes()).filter(node=>node.id==this.device.groupId)[0];
                zTreeObj.selectNode(seletedNode);
            }
            
        },

        //选择单位
        selectGroup(treeNode,treeId){
            this.device.groupId=treeNode.id;
        },
    }
}

</script>
<style lang='less' scoped>
.marginL-10{
    margin-left: 10px;
}
</style>