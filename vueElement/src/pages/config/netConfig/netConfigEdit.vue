<!-- add -->
<template>
    <div id="wrapper">
        <el-form :model="user" ref="userForm" label-width="30%" :rules="rule" :inline-message="true">
            <el-form-item :label="$t('login.userName')" prop="userName" :error="asyncMessage.userName">
                <el-input v-model="user.userName" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('login.password')" prop="password" aria-autocomplete="off">
                <el-input  v-model="user.password" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('age')" prop="age">
                <el-input type="number" v-model="user.age" clearable></el-input>
            </el-form-item>
            <el-form-item :label="$t('gao')" prop="gao">
                <el-input type="number" v-model="user.gao" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button-group class="left">
                    <el-button type="primary" @click="confirm('userForm')" >{{$t("confirm")}}</el-button>
                    <el-button type="info" @click="goBack">{{$t("goBack")}}</el-button>
                </el-button-group>
            </el-form-item>
            
        </el-form>
    </div>
</template>

<script>
import {insertUser,getUserById,updateUser} from "@/http/getData"
export default {
    data () {
        return {
            user:{
                userName:null,
                password:null,
                age:null,
                gao:null
            },
            rule:{
                userName:[{required:true}],
                password:[{required:true}]
            },
            asyncMessage:{
                userName:null,
                password:null,
                age:null,
                gao:null
            },
            id:parseInt(this.$route.query.id)

        };
    },

    props : {},

    components: {},

    computed: {
        
    },

    mounted(){
        if(this.id==0){//添加

        }else{//修改
            getUserById(this.id).then(data=>{
                this.user=data.list[0]
            })
        }
        
    },

    methods: {
        //确认
        confirm(form){
            this.$refs[form].validate(valid=>{
                if(valid){//初始验证通过
                    this.clearMessage();
                    if(this.id==0){//添加
                        insertUser(this.user).then(data=>{
                            if(data.resultCode==0){
                                this.$alert(data.message,this.$t("tip"),{
                                    confirmButtonText:this.$t("confirm"),
                                    type:"waring"
                                }).then(()=>{
                                    history.go(-1);
                                })
                            }else if(data.resultCode==2){
                                this.asyncMessage.userName=data.message;
                            }else{
                                this.$alert(data.message,this.$t('tip'),{
                                    confirmButtonText:this.$t("confirm"),
                                    type:"waring"
                                })
                            }
                        })

                    }else{//修改
                        updateUser(this.user).then(data=>{
                            if(data.resultCode==0){
                                history.go(-1);
                            }else if(data.resultCode==2){
                                this.asyncMessage.userName=data.message;
                            }else{
                                this.$message({
                                    type:"info",
                                    message:data.message
                                })
                            }
                        })
                    }
                    
                    
                }else{

                }

            })
        },
        //返回
        goBack(){
            history.go(-1);
        },
        // 清空asyncMessage
        clearMessage(){
            this.asyncMessage={ userName:null,password:null,age:null,gao:null};
        }
    }
}

</script>
<style lang='less' scoped>
.el-input{
    float: left;
    width:30%;
}
</style>