<!-- login -->
<template>
    <el-container style="height: 100%; ">
        <el-header height="20%"> </el-header>
        <el-main >
            <div class="title"> {{$t("login.title")}}</div>
            <el-form :model="user" ref="userForm" label-width="42%" :rules="rule">
                <el-form-item :label="$t('login.userName')" prop="userName" :inline-message="true">
                    <el-input v-model="user.userName" :placeholder="$t('login.placeholder_userName')" clearable ></el-input>
                </el-form-item>
                <el-form-item :label="$t('login.password')"  prop="password" :inline-message="true">
                    <el-input type="password" v-model="user.password" :placeholder="$t('login.placeholder_password')" clearable ></el-input>
                </el-form-item>
                <el-form-item :label="$t('login.code')" prop="code" :inline-message="true" >
                    <el-input class="code" v-model="user.code" :placeholder="$t('login.placeholder_code')" clearable></el-input>
                    <el-col :span="5" >
                        <el-button type="success" class="italic" @click="getCode">{{code}}</el-button>
                    </el-col>
                </el-form-item>

                <el-form-item>
                    <el-button class="login_btn" :loading="loading" type="primary" size="medium" @click="login('userForm')">{{$t("login.enter")}}</el-button>
                </el-form-item>
                <el-form-item label-width="0%">
                    <el-radio-group v-model="lang" @change="changeLang(lang)">
                        <el-radio label="zh-cn">{{$t("zh")}}</el-radio>
                        <el-radio label="en-us">{{$t("en")}}</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>

            <div>{{Mcode}}</div>
            <div>
                <input type="text" v-model="message">
                <span>{{message}}</span>
            </div>
        </el-main>   
        <!-- <el-footer height="25%"></el-footer> -->
    </el-container>
        

</template>

<script>
import {checkUser,getLangList} from "@/http/getData";
import {mapState} from "vuex";

export default {
    data () {
        let checkCode=(rule,value,callback)=>{
            if(!value){
                callback(new Error("验证码不能为空"));
            }else if(value!==this.code){
                callback(new Error("验证码错误"));
            }else{
                callback();
            }

        }
        return {
            user:{
                userName:null,
                password:null,
                code:null
            },
            rule:{
                userName:[{required:true,message:'不能为空',trigger:'change'}],
                password:[{required:true,message:'密码不能为空',trigger:'change'}],
                code:[{validator:checkCode,trigger:'blur'}]
            },
            code:null,
            loading:false,
            lang:this.$store.state.lang
        };
    },

    props : {},

    components: {},

    computed: {
        message:{
            get(){
                return this.$store.state.message;
            },
            set(value){
                this.$store.commit("UPDATE_M",value);
            }
        },
        Mcode(){
            return this.code+"123";
        },

        ...mapState({
            message1:state=>state.message
        })

    },

    mounted:async function(){
        if(this.$store.state.login_flag){
            this.$router.push("/index");
        }

        this.getCode();

        document.onkeydown=function(event){
            let e=event||window.event;
            let keyCode=e.keyCode||e.which;
            if(keyCode==13){
                this.login('userForm');
            }     
        }.bind(this)
    },

    methods: {
        //登录
        login(formName){
            this.$refs[formName].validate((valid)=>{
                if(valid){
                    this.loading=true;

                    this.$store.commit("SET_LOGIN_FLAG",true);
                    this.$router.push('/index');
                    this.loading=false;
                    // checkUser({userName:this.user.userName,password:this.user.password}).then(response=>{
                    //     this.loading=false;
                    //     if(response.resultCode==0){
                    //         this.$store.commit("SET_LOGIN_FLAG",true);
                    //         this.$router.push('/index');
                    //     }else{
                            
                    //         this.$alert(response.message,this.$t("tip"),{
                    //             confirmButtonText:this.$t("confirm"),
                    //             type:"waring"
                    //         }).then(()=>{
                    //             this.getCode();
                    //         });
                    //     }

                    // })
                    // setTimeout(function(){
                    //     this.loading=false;

                    //     if(this.user.userName=="lisai"&&this.user.password=="111111"&&this.user.code==this.code){
                    //         this.$store.commit("SET_LOGIN_FLAG",true);
                    //         router.push('/index');
                            

                    //     }else{
                    //         this.$alert('登录失败',"提示",{
                    //             confirmButtonText:"确定",
                    //             type:"waring"
                    //         }).then(()=>{

                    //         })
                                
                    //     }
                    // }.bind(this),2000);

                }else{

                }
            })

            
            

        },

        //获取验证码
        getCode(num=4){
            let code="";
            for(let i=0;i<4;i++){
                code+=Math.round(Math.random()*9);
            }
            this.code=code;
            
        },

        //切换语言
        changeLang(lang){
            this.$store.commit("CHANGE_LANG",lang);
            this.$i18n.locale=lang;
        }
    }
}

</script>
<style>

</style>

<style lang='less' scoped>
header,footer{
    // background: #3681ba;
}

.title{
    line-height: 30px;
    color:#3681ba;
    font-size:26px;
    margin-bottom:30px;
}

.el-input{
    width:300px;
    float: left;
}
.el-input.code{
    width:160px;
}

.login_btn{
    width: 300px;
    float:left;
}

</style>