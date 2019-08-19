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
        <el-upload class="upload-demo" ref="upload" action="/test" :http-request="upload"
            
            :file-list="fileList" :auto-upload="false" multiple>
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
    </div>
</template>

<script>
import {insertUser,getUserById,updateUser} from "@/http/getData"
export default {
    // beforeRouteLeave(to,form,next){
    //     if(to.name=="netConfig")to.meta.keepAlive=true;
    //     next();
    // },
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
            id:parseInt(this.$route.query.id),
            fileList:[]

        };
    },

    props : {},

    components: {},

    computed: {
        
    },
    created(){
        let arr=[
                {id:1,name:1,child:
                    [
                        {id:11,name:11,child:"asds"}
                    ]
                },
                {id:2,name:2,child:[{id:22,name:22}]},
                {id:3,name:3,child:[{id:33,name:33,child:[{id:333,name:333,child:[{id:3333,name:3333}]}]},{id:34,name:34,child:[{id:344,name:344}]}]},
                {id:1},
                {id:3}
            ];

        // arr.forEach(function mapp(value){
        //     value.isRead=true;
        //     if(Array.isArray(value.child))value.child.forEach(mapp);

        // });
        // console.log(arr);

        
        // console.log(arr.filterSame("id"))
        console.log([1,2,{id:1},3,2,1,5,6,7,{id:2},{id:1},1,2].filterSame("id"));
        console.log([1,2,1,2].filterSame())
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
            this.$router.push({name:"netConfig"})
        },
        // 清空asyncMessage
        clearMessage(){
            this.asyncMessage={ userName:null,password:null,age:null,gao:null};
        },
        upload(value){
            this.axios.post(value.action,value.file).then(()=>{

            },()=>{});
        },
        submitUpload(){
            this.$refs.upload.submit();
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