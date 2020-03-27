<!-- login -->
<template>
    <div id="login">
        <div id="login_content" :class="{licenseFile:fileList.length}">
            <!-- 图标 -->
            <div class="login_icon"></div>

            <div v-if="isOverdue" class="login_form login_license">
                <h3>{{$t("license")}}</h3>
                <div class="licenseContent">
                    <el-button type="primary" @click="makeCode">{{$t("makeCode")}}</el-button><div class="machineCode" :class="{'bai':machineCode!=($t('example')+'：xxxxxxxx')}">{{machineCode}}</div>
                    <el-upload class="upload" ref="upload" :multiple="false" :auto-upload="true" :file-list="fileList" :before-upload="file=>this.fileList=[file]" :on-remove="file=>this.fileList=[]"
                        :on-error="file=>this.fileList=[]" action="ui/license/upload" :http-request="upload">
                        <el-button class="uploadBtn" type="primary">{{$t("upload")}}</el-button>
                        <div slot="tip" v-if="!fileList.length" class="tip">{{$t("example")}}：xxxxxxx.license</div>
                    </el-upload>
                </div>
            </div>

            <el-form v-else  class="login_form" :model="user" ref="login_form" :rules="rule" autocomplete="off">
                <h3>{{$t("skTitle")}}</h3>
                <!-- 用户名 -->
                <el-form-item  prop="userName">
                    <el-input v-model="user.userName" :placeholder="$t('userName')" :autofocus="true" clearable>
                        <template slot="prepend"><img src="../../img/login/ic_user@2x.png"></template>
                    </el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item  prop="password">
                    <el-input ref="password" type="password" v-model="user.password" :placeholder="$t('password')" clearable autocomplete="off">
                        <template slot="prepend"><img src="../../img/login/ic_lock@2x.png"></template>
                    </el-input>
                </el-form-item>
                <!-- 验证码 -->
                <el-form-item class="codeBox" prop="code">
                    <el-input ref="code" class="code" v-model="user.code" :placeholder="$t('code')" clearable>
                        <template slot="prepend"><img src="../../img/login/ic_safety@2x.png"></template>
                    </el-input>
                    <img class="codeImg" :src="code" @click="getCode">
                </el-form-item>

                <el-form-item>
                    <el-button class="login_btn" type="primary" size="medium" :loading="loading" @click="login('login_form')">{{$t("login")}}</el-button>
                </el-form-item>
                <el-form-item class="center">
                    <!-- <el-radio-group v-model="lang" @change="changeLang(lang)">
                        <el-radio label="zh-cn">{{$t("zh")}}</el-radio>
                        <el-radio label="en-us">{{$t("en")}}</el-radio>
                    </el-radio-group> -->
                </el-form-item>
            </el-form>

            <!-- 版权 -->
            <div class="login_copyright">
                <p v-if="overdueTime" class="overdueTime">{{$t("overdueTime")}}：<span>{{overdueTime}}</span></p>
                © {{$t("fiberhome_copyright")}} &nbsp;all rights reserved
            </div>
        </div>
    </div>
</template>

<script>
import {changeTitle,getMenus,RSA} from "@/common/method"
import store from "@/store/store"

export default {
    async beforeRouteEnter(to,from,next){
        //先获取数据
        await store.dispatch("getLicense");
        next();
    },
     
    data () {
        return {
            user:{//用户信息
                userName:null,
                password:null,
                code:null,
            },
            lang:this.$store.state.lang,//语言
            code:"generate/captcha?rad="+Math.random(),//验证码
            loading:false,//是否加载状态

            fileList:[],//文件
            machineCode:this.$t("example")+'：xxxxxxxx',//机器码
        };
    },

    props : {},

    components: {},

    computed: {
        rule(){
            const rule={//验证规则
                userName:[{required:true,message:this.$t("noEmpty"),trigger:'change'}],
                password:[{required:true,message:this.$t("noEmpty"),trigger:'change'}],
                code:[{validator:(rule,value,callback)=>{
                    if(!value)callback(new Error(this.$t("noEmpty")));
                    else callback();

                },trigger:'change'}]
            };
            return rule
        },

        isOverdue(){//是否到期
            let time=this.$store.state.license.time;
            if(time&&time>=(new Date()).getTime())return false
            else return true
        },
        
        overdueTime(){//到期时间
            let time=this.$store.state.license.time;
            if(!time)return null
            else if(time<(new Date()).getTime()) return this.$t("overdued")
            else return (new Date(time)).format("yyyy-MM-dd HH:mm:ss")
            
        }
    },

    beforeCreate(){
        changeTitle();
    },

    mounted(){
        this.$store.commit("CHANGE_LANG",this.lang);


        //监听键盘事件
        document.onkeydown=function(event){
            let e=event||window.event;
            let code=e.keyCode||e.which;
            if(code==13)this.login("login_form");
     
        }.bind(this);

    },

    methods: {
        //切换语言
        changeLang(lang){
            this.$store.commit("CHANGE_LANG",lang);
            this.$i18n.locale=lang;
            changeTitle();
        },

        //获取验证码
        getCode(){
            this.code="generate/captcha?rad="+Math.random();
        },

        //登录
        login(formName){
            this.loading=true;
            this.$refs[formName].validate(async (valid) => {   
                if(valid){
                    try{
                        const publickey=await RSA.getPublicKey(this.user.userName);
                        let obj={
                            username:this.user.userName,
                            password:RSA.encodeRSA(publickey,this.user.password),
                            captcha:this.user.code
                        };

                        const {data}=await this.axios.post("login",obj,{headers:{page:"login"}});
                        this.loading=false;
                        if(data.statusCode==0){
                            const {data:info}=data;
                            let privileges=[];
                            info.roles.forEach(role=>{
                                if(role.privileges instanceof Array)privileges=[...privileges,...role.privileges]; 
                            });
                            privileges=privileges.filterSame("id");
                            if(privileges.length==0){
                                this.commonTip(this.$t("noPrivilege"),"tip_notice");
                                return
                            }
                            
                            const menus=getMenus(privileges);
                            const [index]=menus;
                            //检验是否有正确的子菜单
                            if(index.children.length==0){
                                this.commonTip(this.$t("privilegeError"),"tip_notice");
                                return
                            }
                            this.$router.options.routes=[...this.$router.options.routes,...menus];
                            this.$router.addRoutes(menus);

                            this.$store.commit("SET_USER",{userName:info.username,nickname:info.nickname,password:this.user.password,privileges:privileges});
                            this.$store.commit("SET_LOGIN_FLAG",true);
                            this.$router.push("/index");

                        }else{
                            switch(data.statusCode){
                                case 20001:
                                case 20002:
                                case 20006:
                                    this.$refs["password"].focus();
                                break;
                                case 20003:
                                case 20004:
                                    this.$refs["code"].focus();
                                break;
                            }
                            this.getCode();
                        }    
     
                    }catch(e){
                        this.loading=false;
                    }
                    
                }else{
                   this.loading=false; 
                }

            })

        },

        //生成机器码
        async makeCode(){
            const {data}=await this.axios.get("ui/license/getMachineCode",{headers:{page:"login"}});
            if(data.statusCode==0){
                this.machineCode=data.data;
            }
        },

        //上传
        async upload(value){
            try{
                const {data}=await this.axios.post(value.action,value.file,
                    {   headers : { noLoading : true },
                        onUploadProgress : progressEvent => {
                            let percent=(progressEvent.loaded / progressEvent.total * 100) | 0;
                            value.onProgress({percent});
                        }
                    }
                );
                if(data.statusCode==0){
                    const endDate=new Date(data.data.endDate).getTime();
                    this.$store.commit("SET_LICENSE",{time:endDate,type:data.data.enPay});
                    if(endDate<(new Date()).getTime())this.commonTip("License"+this.$t("overdued"),"tip_notice");
                    else{
                        this.fileList=[];
                        this.commonTip(this.$t("upload_S"));
                    } 

                    value.onSuccess(this.$t("upload_S"));
                }else{
                    value.onError(this.$t("upload_F"));
                }

            }catch(e){
                value.onError(this.$t("upload_F"));
            }
            
        },
    },

    destroyed(){
        document.onkeydown=null;
    }
}

</script>
<style lang='less' scoped>
#login{
    @color1:#4181FF;

    height: 100%;
    width:100%;
    background: url("../../img/login/background.jpg");
    background-size: cover;

    #login_content{
        width: 440px;
        position: fixed;
        top:50%;
        left:50%;
        transform: translate(-50%,-50%);
        font-size:16px;
        &.licenseFile{
            min-width:440px;
            width:auto;
        }

        .login_icon{
            // background: url("../../img/login/logo@2x.png") no-repeat 50% 0;
            // background-size: auto 100%;
            width:100%;
            height:38px;
            margin-bottom:50px;
        }

        .login_form{
            @ipt_h:40px;

            background-color:rgba(255,255,255,0.2);
            border-radius: 2px;
            box-shadow:0 13px 37px 0 rgba(13,68,173,0.28); 
            padding:50px 50px 20px;

            h3{
                text-align: center;
                margin-top:0;
                margin-bottom: 40px;
                font-size:24px;
                line-height: 26px;
                color:#fff;      
            }


            .login_btn{
                width: 100%;
                height:  @ipt_h;
                &:hover{
                    opacity: 1;
                }
                &:focus:hover{
                    background: #66b1ff
                }
            }

            /deep/ .el-form-item{
                margin-bottom:20px;
            }
            /deep/ .el-input{
                input{
                    height: @ipt_h;
                    line-height: @ipt_h;
                    font-size:14px;
                }
                .el-input-group__prepend{
                    padding:0 15px!important;
                    img{
                        vertical-align: middle;
                        width:16px;
                        height: 16px;
                    }
                }

            }

            /deep/ .el-form-item__content{
                .el-form-item__error{
                    margin-top:2px;
                    left: 60px;
                }
            }

            /deep/ .codeBox .el-form-item__content{
                display: flex;
                .code{
                    width:60%;
                    
                }
                .codeImg{
                    cursor: pointer;
                    vertical-align: top;
                    height: 40px;
                    margin-left: 10px;
                    border-radius: 4px;
                    width:calc(40% - 10px);
                }

            }
    
        }

        //license上传
        .login_license{
            min-height: 220px;
            .el-button{
                outline: none;
                width: 100%;
                height: 40px;
                font-size:14px;
                &:hover{
                    opacity: 1;
                }
                &:focus:hover{
                    background: #66b1ff;
                    border-color: #66b1ff;
                }
            }
            .machineCode{
                line-height: 25px;
                height: 25px;
                margin:10px 0 25px;
                text-indent: 4px;
                color:#babec2;
                &.bai{
                    color:#fff;
                }
            }
            /deep/ .upload{
                width:100%;
                .el-upload{
                    width:100%;
                }
                .el-upload-list{
                    height: 25px;
                    margin-bottom:25px;
                }
                .uploadBtn{
                    margin-bottom:10px;
                }
             
                .el-upload-list__item{
                    outline: none!important;
                    transition:none;
                    &:hover{
                        background-color: transparent;
                        .el-icon-close{
                            color:#fff;
                        }
                    }
                    .el-upload-list__item-name{
                        color:#fff;
                        .el-icon-document{
                            color:#fff;
                        }
                    }
                }
                .el-upload-list__item:first-child{
                    margin-top:0; 
                }
                
                .tip{
                    position: absolute;
                    line-height: 25px;
                    height: 25px;
                    text-indent: 4px;
                    text-align: left;
                    color:#babec2;
                }

                .el-icon-circle-check:before{
                    content:"";
                    display: inline-block;
                    width:14px;
                    height: 14px;
                    background-image: url("../../img/login/ic_correct.png");
                    background-size:cover; 
                    vertical-align: middle;
                    margin-top:-4px;
                }
            }

        }

        //到期时间
        .overdueTime{
            position: absolute;
            bottom:10px;
            width:100%;
            text-align: center;
            span{
                color:#ec5151;
            }
        }

        .login_copyright{
            font-size: 10px;
            color: #fff;
            letter-spacing: 0;
            text-align: center;
            margin-top: 32px;
            line-height: 16px;
        }
    }
}

</style>
