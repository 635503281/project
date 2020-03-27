<!-- editRole -->
<template>
    <div>
        <el-breadcrumb class="myBreadcrumb">
            <el-breadcrumb-item v-for="(menu,i) in $route.meta.menus.filter((v,i)=>i!=0)" :key="i" :to="menu.path||null">{{menu.name}}</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="content main-form">
            <el-form class="form" ref="roleform" :model="role" :rules="rules" label-width="30%" :inline-message="true" autocomplete="off">
                <el-form-item :label="$t('roleName')" prop="name">
                    <el-input v-model="role.name" :placeholder="$t('placeholder.roleName')" clearable v-max="32"></el-input>
                </el-form-item>
                <el-form-item :label="$t('description')" prop="description">
                    <el-input type="textarea" v-model="role.description" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('privileges')" prop="privileges">
                    <Tree ref="privilegesTree" id="roleTree" :plugin="tree_plugin" :datas="privilegeList" 
                          @treeClick="(treeNode,treeId)=>this.$refs.privilegesTree.zTreeObj.checkNode(treeNode,!treeNode.checked,true)">
                    </Tree>
                </el-form-item>

                <el-form-item class="form_btns">
                    <el-button type="primary" @click="submit('roleform')">{{$t("submit")}}</el-button>
                    <el-button @click="()=>this.$router.push({name:'role'})">{{$t("cancel")}}</el-button>
                </el-form-item>
              
            </el-form>
            
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            id:0,
            role:{
                name:null,
                description:null,
                privileges:[],//权限
            },
            rules:{
                name:[{required:true,message:this.$t("noEmpty"),trigger:'change'}],   
            },
            tree_plugin:{
                name:"name",
                title:"name",
                isSimpleData:true,
                checkbox:true,
                checked:"checked",
            },
            privilegeList:[]
        };
    },

    props : {},

    components: {
        Tree:()=>import("@/components/Tree"),
    },

    computed: {},

    async beforeMount(){
        this.$store.commit("CHANGE_LOADING",true);
        this.id=parseInt(this.$route.query.id);
        if(this.id){
            Promise.all([this.getRoleById(this.id),this.getPrivilege()]).then(([tree_selected=[],tree_all=[]])=>{
                //填充选中的权限
                tree_selected.forEach(selected=>{
                    for(let all of tree_all){
                        if(selected.id==all.id){
                            all.checked=true;
                            break
                        }
                    }
                });
                this.privilegeList=tree_all;
                this.$store.commit("CHANGE_LOADING",false);
            })

        }else{
            this.privilegeList=await this.getPrivilege();
            this.$store.commit("CHANGE_LOADING",false);
        }
    },

    methods: {
        //提交
        submit(form){
            this.$refs[form].validate(async valid=>{
                if(valid){
                    let url="ui/role/add";
                    let tip=this.$t("add_S");
                    if(this.id!=0){
                        url="ui/role/edit";
                        tip=this.$t("modify_S");
                    }
                    let seletedPrivileges=this.$refs.privilegesTree.zTreeObj.getCheckedNodes(true);
                    this.role.privileges=seletedPrivileges;
                    const {data}=await this.axios.post(url,this.role);
                    if(data.statusCode==0){
                        this.commonTip(tip).then(()=>{
                            this.$router.push({name:"role"});
                        });
                    }
                }

            })
        },

        //获取role
        async getRoleById(id){
            const {data}=await this.axios.get(`ui/role/${this.id}`,{headers:{noLoading:true}});
            if(data.statusCode==0){
                this.role=data.data;
                return data.data.privileges
            } 
        },

        //获取权限
        async getPrivilege(){
            const {data}=await this.axios.post("ui/privilege/all",{},{headers:{noLoading:true}});
            if(data.statusCode==0){
                // this.privilegeList=data.data;
                return data.data
            }
            
        },

    }
}

</script>
<style lang='less' scoped>
</style>