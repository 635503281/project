<!-- login -->
<template>
    <el-container style="height: 100%; ">
        <el-header height="20%"> </el-header>
        <!-- <el-main >
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
        </el-main>    -->
        <div>
            <el-button  @click="login">haha</el-button>
        </div>
        <div>
            <canvas id="can" width=800 height=600></canvas>
        </div>
        <!-- <el-footer height="25%"></el-footer> -->
    </el-container>
        

</template>

<script>
import {checkUser,getLangList} from "@/http/getData";
import {mapState} from "vuex";
import Hello from "@/components/HelloWorld";

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
            lang:this.$store.state.lang,
            canvas:null
        };
    },

    props : {},

    components: {
        Hello
    },

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
    beforeCreate(){
        console.time();
    },
    beforeMount(){
        
    },

    mounted:async function(){
        console.timeEnd();
        if(this.$store.state.login_flag){
            this.$router.push("/index");
        }

        this.getCode();

        this.event.listen("haha",function(event,a){
            console.log(a);
        });

        document.onkeydown=function(event){
            let e=event||window.event;
            let keyCode=e.keyCode||e.which;
            if(keyCode==13){
                this.login('userForm');
            }     
        }.bind(this);

        this.canvas=document.getElementById("can").getContext("2d");
        // this.canvas.moveTo(0,0);
        // this.canvas.lineTo(10,20);
        // this.canvas.stroke();

        // this.canvas.rect(50,50,100,50);
        // this.canvas.strokeStyle="red";
        // this.canvas.stroke();
        // this.canvas.fillStyle="red";
        // this.canvas.fill();

        // this.canvas.font="bold 10px/40px microsoft yehei";
        // this.canvas.fillText("李赛",50,50)
        //  for (var i=0;i<6;i++){
        //     for (var j=0;j<6;j++){
        //         this.canvas.strokeStyle = 'rgb(0,' + Math.floor(255-42.5*i) + ',' + Math.floor(255-42.5*j) + ')';
        //         this.canvas.beginPath();
        //         this.canvas.arc(25+j*50,25+i*50,20,0,Math.PI*2,true);
        //         this.canvas.stroke();
        //     }
        // }
        
        // this.canvas.save();
        // this.canvas.beginPath();
        // this.canvas.setLineDash([4,2]);
        // this.canvas.strokeRect(10,10, 100, 100);

        // this.canvas.restore();
        // this.canvas.beginPath();
        // this.canvas.moveTo(200,200);
        // this.canvas.lineTo(250,200);
        // this.canvas.lineTo(250,250);
        // this.canvas.closePath();
        // this.canvas.stroke();


        
        function init(){
            var ctx = document.getElementById('can').getContext('2d');
            var sun = new Image();
            var moon = new Image();
            var earth = new Image();
            sun.src = 'https://mdn.mozillademos.org/files/1456/Canvas_sun.png';
            moon.src = 'https://mdn.mozillademos.org/files/1443/Canvas_moon.png';
            earth.src = 'https://mdn.mozillademos.org/files/1429/Canvas_earth.png';
            window.requestAnimationFrame(function(){draw(ctx,sun,moon,earth)});
        }

        function draw(ctx,sun,moon,earth) {

            ctx.globalCompositeOperation = 'destination-over';
            ctx.clearRect(0,0,300,300); // clear canvas

            ctx.fillStyle = 'rgba(0,0,0,0.4)';
            ctx.strokeStyle = 'rgba(0,153,255,0.4)';
            ctx.save();
            ctx.translate(150,150);

            // Earth
            var time = new Date();
            ctx.rotate( ((2*Math.PI)/60)*time.getSeconds() + ((2*Math.PI)/60000)*time.getMilliseconds() );
            ctx.translate(105,0);
            ctx.fillRect(0,-12,50,24); // Shadow
            ctx.beginPath();
            ctx.arc(0,0,28.5,0,2*Math.PI);
            ctx.stroke();
            ctx.drawImage(earth,-12,-12);

            // Moon
            ctx.save();
            ctx.rotate( ((2*Math.PI)/6)*time.getSeconds() + ((2*Math.PI)/6000)*time.getMilliseconds() );
            ctx.translate(0,28.5);
            ctx.drawImage(moon,-3.5,-3.5);
            ctx.restore();

            ctx.restore();
            
            ctx.beginPath();
            ctx.arc(150,150,105,0,Math.PI*2,false); // Earth orbit
            ctx.stroke();
            
            ctx.drawImage(sun,0,0,300,300);

            window.requestAnimationFrame(function(){draw(ctx,sun,moon,earth)});
        }

        // init();


    },

    methods: {
        // drowYellowMan(x,y,r){
        //     this.canvas.
        // },
        haha($event,a){
            this.event.emit("haha",$event,a);
            // console.log(a);
            
        },


        //登录
        login(formName){
            // this.$refs[formName].validate((valid)=>{
            //     if(valid){
            //         this.loading=true;

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

            //     }else{

            //     }
            // })

            
            

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

#can{
    // width:800px;
    // height:600px;
    display: flex;
    margin:0 auto;
    background:#ccc;
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