<!-- 编辑设备用户 -->
<template>
    <div>
        <el-breadcrumb class="myBreadcrumb">
            <el-breadcrumb-item v-for="(menu,i) in $route.meta.menus.filter((v,i)=>i!=0)" :key="i" :to="menu.path||null">{{menu.name}}</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="content main-form">
            <el-form class="form" ref="deviceUser" :model="deviceUser" :rules="rules" label-width="30%" :inline-message="true" autocomplete="off">
                <el-form-item :label="$t('uid')" prop="username">
                    <el-input v-model="deviceUser.username" :placeholder="$t('placeholder.input')" clearable :disabled="deviceUser.hasTerminal" v-max="20"></el-input>
                </el-form-item>
                <el-form-item :label="$t('password')" prop="password">
                    <input class="password_clear"><input class="password_clear" type="password" name="password">
                    <el-input type="password" v-model="deviceUser.password" :placeholder="$t('placeholder.input')" clearable v-max="20"></el-input>
                </el-form-item>
                <el-form-item :label="$t('terminalNum')" prop="terminalNum">
                    <el-input v-model="deviceUser.terminalNum" type="number" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('remarks')" prop="remark">
                    <el-input v-model="deviceUser.remark" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('status')" prop="enable">
                    <el-radio-group v-model="deviceUser.enable">
                        <el-radio :label="true">{{$t("enable")}}</el-radio>
                        <el-radio :label="false">{{$t("forbidden")}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item class="form_btns">
                    <el-button type="primary" @click="submit('deviceUser')">{{$t("submit")}}</el-button>
                    <el-button @click="()=>this.$router.push({name:'deviceUser'})">{{$t("cancel")}}</el-button>
                </el-form-item>
              
            </el-form> 
        </div>

    </div>
</template>

<script>
import base64 from "@/common/base64"

export default {
    data () {
        return {
            id:0,
            deviceUser:{
                username:null,//用户名
                password:null,//密码
                terminalNum:null,//设备数量
                enable:false,
                remark:null,//备注
                hasTerminal:false,//是否有设备  
            },
            rules:{
                username:[{required:true,message:this.$t("noEmpty"),trigger:'change'}],
                password:[{required:true,message:this.$t("noEmpty"),trigger:'change'}],
                terminalNum:[{required:true,message:this.$t("noEmpty"),trigger:'change'}],
            },

        };
    },

    props : {},

    components: {},

    computed: {},

    beforeMount(){
        this.id=parseInt(this.$route.query.id);
        if(this.id)this.getDeviceUserById();
    },

    mounted(){},

    methods: {
        //获取deviceUser
        async getDeviceUserById(){
            const {data}=await this.axios.get("ui/terminalUserInfo/detail?id="+this.id);
            if(data.statusCode==0&&data.data){
                data.data.password=data.data.password?base64.decode(data.data.password):data.data.password;
                this.deviceUser=data.data;
            }
        },

        //提交
        submit(form){
            this.$refs[form].validate(async valid=>{
                if(valid){
                    const obj=this.copy(this.deviceUser);
                    obj.password=base64.encode(obj.password);
                    const {data}=await this.axios.post("ui/terminalUserInfo/saveOrupdate",obj);
                    if(data.statusCode==0){
                        let tip=this.$t("add_S");
                        if(this.id!=0)tip=this.$t("modify_S");
                        this.commonTip(tip).then(()=>this.$router.push({name:"deviceUser"}));
                    }
                }

            })
        },
        
    }
}

</script>
<style lang='less' scoped>
</style>