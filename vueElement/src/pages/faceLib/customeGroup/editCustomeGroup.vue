<!-- 编辑自建库 -->
<template>
    <div>
        <el-breadcrumb class="myBreadcrumb">
            <el-breadcrumb-item v-for="(menu,i) in $route.meta.menus.filter((v,i)=>i!=0)" :key="i" :to="menu.path||null">{{menu.name}}</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="content main-form">
            <el-form class="form" ref="customeGroup" :model="customeGroup" :rules="rules" label-width="30%" :inline-message="true" autocomplete="off">
                <el-form-item :label="$t('customeGroupId')" prop="groupId">
                    <el-input v-model="customeGroup.groupId" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('customeGroupName')" prop="groupName">
                    <el-input v-model="customeGroup.groupName" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('customeGroupType')" prop="groupType">
                    <el-input v-model="customeGroup.groupType" type="number" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('description')" prop="description">
                    <el-input v-model="customeGroup.description" type="textarea" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                <el-form-item class="form_btns">
                    <el-button type="primary" @click="submit('customeGroup')">{{$t("submit")}}</el-button>
                    <el-button @click="()=>this.$router.push({name:'customeGroup'})">{{$t("cancel")}}</el-button>
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
            customeGroup:{
                groupId:null,
                groupName:null,
                groupType:null,
                description:null,
            },
            rules:{
                groupId:[{required:true,message:this.$t("noEmpty"),trigger:'change'}],
                groupName:[{required:true,message:this.$t("noEmpty"),trigger:'change'}],
                groupType:[{required:true,message:this.$t("noEmpty"),trigger:'change'}],
            },

        };
    },

    props : {},

    components: {},

    computed: {},

    beforeMount(){
        this.id=parseInt(this.$route.query.id);
        if(this.id)this.getCustomeGroupById();
    },

    mounted(){},

    methods: {
        //获取
        async getCustomeGroupById(){
            const {data}=await this.axios.get("ui/customeGroup/"+this.id);
            if(data.statusCode==0&&data.data){
                this.customeGroup=data.data;
            }
        },

        //提交
        submit(form){
            this.$refs[form].validate(async valid=>{
                if(valid){
                    const {data}=await this.axios.post("ui/customeGroup/saveOrUpdate",this.customeGroup);
                    if(data.statusCode==0){
                        let tip=this.$t("add_S");
                        if(this.id!=0)tip=this.$t("modify_S");
                        this.commonTip(tip).then(()=>this.$router.push({name:"customeGroup"}));
                    }
                }

            })
        },
        
    }
}

</script>
<style lang='less' scoped>
</style>