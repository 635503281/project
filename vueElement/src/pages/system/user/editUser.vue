<!-- editUser -->
<template>
    <div>
        <el-breadcrumb class="myBreadcrumb">
            <el-breadcrumb-item v-for="(menu,i) in $route.meta.menus.filter((v,i)=>i!=0)" :key="i" :to="menu.path||null">{{menu.name}}</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="content main-form">
            <el-form class="form" ref="userform" :model="user" :rules="rules" label-width="30%" :inline-message="true" autocomplete="off">
                <el-form-item :label="$t('userName')" prop="username">
                    <el-input v-model="user.username" :placeholder="$t('placeholder.userName')" clearable maxlength="16"></el-input>
                </el-form-item>
                <el-form-item :label="$t('nickName')" prop="nickname">
                    <el-input v-model="user.nickname" :placeholder="$t('placeholder.nickName')" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('password')" prop="password1">
                    <input class="password_clear"><input class="password_clear" type="password" name="password">
                    <el-input type="password" v-model="user.password1" :placeholder="$t('placeholder.password')" clearable minlength="6" maxlength="18"></el-input>
                </el-form-item>
                <el-form-item :label="$t('mail')" prop="mail">
                    <el-input v-model="user.mail" :placeholder="$t('placeholder.mail')" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('mobile')" prop="mobile">
                    <el-input type="number" v-model="user.mobile" :placeholder="$t('placeholder.mobile')" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('role')" prop="roles">
                    <el-checkbox-group v-model="user.roles">
                        <el-checkbox v-for="(val,i) in roleList" :key="i" :label="val.id">{{val.name}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item :label="$t('status')" prop="enable">
                    <el-radio-group v-model="user.enable" :disabled='id&&user.username==$store.state.user.userName'>
                        <el-radio :label="true">{{$t("activation")}}</el-radio>
                        <el-radio :label="false">{{$t("forbidden")}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('company')" prop="group" class="treePlugin">
                    <Tree ref="groupTree" id="group" :plugin="group_plugin" :datas="groupList"  @treeClick="selectGroup"></Tree>
                </el-form-item>
                <el-form-item class="form_btns">
                    <el-button type="primary" @click="submit('userform')">{{$t("submit")}}</el-button>
                    <el-button @click="()=>this.$router.push({name:'user'})">{{$t("cancel")}}</el-button>
                </el-form-item>
              
            </el-form>
            
        </div>
    </div>
</template>

<script>
import {hex_md5} from "@/common/md5"
import {RSA} from "@/common/method"

export default {
    data () {
       const validator_null={validator:(rule,value,callback)=>{callback();},trigger:"change"};
        return {
            id:0,
            user:{
                username:null,
                password:null,
                password1:null,//用作加密的密码
                nickname:null,//昵称
                mail:null,
                mobile:null,
                roles:[],//角色
                enable:true,//状态
                group:null,
            },
            oldUserName:null,
            rules:{
                username:[{required:true,message:this.$t("noEmpty"),trigger:'change'},
                    {validator:async(rule,value,callback)=>{
                        if(!value||value==this.oldUserName){callback();return}

                        const {data}=await this.axios.get("ui/user/findByUsername/"+value,{headers:{noLoading:true}});
                        if(data.statusCode==0&&data.data){callback(this.$t("userExist"));return}//用户名存在

                        callback();

                    },trigger:"blur"}
                ],
                password1:[{required:this.id?false:true,message:this.$t("noEmpty"),trigger:'change'},
                    {
                        validator:(rule,value,callback)=>{
                            if(!value)callback();

                            const reg=/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[~!@#$%^&.?])[\da-zA-Z~!@#$%^&.?]{6,18}$/;
                            if(!reg.test(value)){
                                callback("仅支持输入6-18位字符，必须包含大写字母、小写字母、数字和特殊字符（如：~!@#$%^&.?）");
                                return
                            }
                            callback();
                        },
                        trigger:"change"
                    }
                ],
                mail:[
                   { type: 'email', message: this.$t("placeholder.correctMail"), trigger: 'blur' },
                   validator_null
                ],
                mobile:[
                    {validator:(rule,value,callback)=>{
                        if(value&&(value.length>11||value.length<8)){
                            callback(this.$t("placeholder.correctPhone"));return
                        }
                       callback(); 
                    },trigger:"blur"},
                    validator_null,
                ],
                group:[{required:true,message:this.$t("noEmpty"),trigger:'change'}],
            },
            roleList:[],//角色list
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

    beforeCreate(){
        this.id=parseInt(this.$route.query.id);
    },

    beforeMount(){
        this.getRole();

        this.id=parseInt(this.$route.query.id);
        if(this.id){
            this.$store.commit("CHANGE_LOADING",true);
            Promise.all([this.getUerById(this.id),this.getAllGroup({noLoading:true})]).then(()=>{
                this.$nextTick(()=>this.initTree(this.$refs.groupTree.zTreeObj));
                this.$store.commit("CHANGE_LOADING",false);
            });

        }else this.getAllGroup({noLoading:false});
    },

    methods: {
        //提交
        submit(form){
            this.$refs[form].validate(async valid=>{
                if(valid){
                    let url="ui/user/add";
                    let tip=this.$t("add_S");
                    if(this.id!=0){
                        url="ui/user/edit";
                        tip=this.$t("modify_S");
                    }

                    //处理角色roles
                    let obj=this.copy(this.user);
                    obj.roles=this.roleList.filter(val=>{
                        for(let id of obj.roles){
                            if(val.id==id)return true
                        }
                        return false
                    });
                    
                    //处理密码
                    const publickey=await RSA.getPublicKey(this.user.username);
                    if(obj.password1){
                        obj.password=RSA.encodeRSA(publickey,hex_md5(obj.password1));
                    }else{
                        obj.password=RSA.encodeRSA(publickey,obj.password);
                    }
                    delete obj.password1;

                    const {data}=await this.axios.post(url,obj);
                    if(data.statusCode==0){
                        await this.commonTip(tip);
                        this.$router.push({name:"user"});   
                    }
                }

            })
        },

        //获取user
        async getUerById(id){
            const {data}=await this.axios.get(`ui/user/${this.id}`,{headers:{noLoading:true}});
            if(data.statusCode==0){
                this.oldUserName=data.data.username,
                this.user={...data.data,password1:null};
                if(!this.user.roles||!this.user.roles.length)this.$set(this.user,"roles",[]);
                else this.user.roles=this.user.roles.map(val=>val.id);
            } 
        },

        //获取角色
        async getRole(){
            const {data}=await this.axios.post("ui/role/list",{},{headers:{noLoading:true}});
            if(data.statusCode==0){
                this.roleList=data.data.result;
            }
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
            if(this.user.group&&this.user.group.id){
                let seletedNode= zTreeObj.transformToArray(zTreeObj.getNodes()).filter(node=>node.id==this.user.group.id)[0];
                zTreeObj.selectNode(seletedNode);
            }
            
        },

        //选择单位
        selectGroup(treeNode,treeId){
            this.user.group=treeNode;
        },

    }
}

</script>
<style lang='less' scoped>
</style>