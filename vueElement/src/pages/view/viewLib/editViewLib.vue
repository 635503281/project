<!-- 编辑视图库 -->
<template>
    <div>
        <el-breadcrumb class="myBreadcrumb">
            <el-breadcrumb-item v-for="(menu,i) in $route.meta.menus.filter((v,i)=>i!=0)" :key="i" :to="menu.path||null">{{menu.name}}</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="content main-form">
            <el-form class="form" ref="viewLib" :model="viewLib" :rules="rules" label-width="30%" :inline-message="true" autocomplete="off">
                <el-form-item label="名称" prop="name">
                    <el-input v-model="viewLib.name" :placeholder="$t('placeholder.input')" v-max="255" clearable></el-input>
                </el-form-item>
                <el-form-item label="接口地址" prop="endpoint">
                    <el-input v-model="viewLib.endpoint" :placeholder="$t('placeholder.input')" v-max="255" clearable></el-input>
                </el-form-item>
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="viewLib.username" :placeholder="$t('placeholder.input')" v-max="255" clearable></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <input class="password_clear"><input class="password_clear" type="password" name="password">
                    <el-input type="password" v-model="viewLib.password" :placeholder="$t('placeholder.input')" v-max="255" clearable></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remarks">
                    <el-input type="textarea" v-model="viewLib.remarks" :placeholder="$t('placeholder.input')" v-max="255" clearable></el-input>
                </el-form-item>
                <el-form-item class="form_btns">
                    <el-button type="primary" @click="submit('viewLib')">{{$t("submit")}}</el-button>
                    <el-button @click="()=>this.$router.push({name:'viewLib'})">{{$t("cancel")}}</el-button>
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
            viewLib:{
                name:null,
                endpoint:null,
                username:null,
                password:null,
                remarks:null,
            },
            rules:{
                name:[{required:true,message:this.$t("noEmpty"),trigger:'change'}],
                endpoint:[{required:true,message:this.$t("noEmpty"),trigger:'change'}],
            },

        };
    },

    props : {},

    components: {},

    computed: {},

    beforeMount(){
        this.id=parseInt(this.$route.query.id);
        if(this.id)this.getViewLibById();
    },

    mounted(){},

    methods: {
        //获取
        async getViewLibById(){
            const {data} = await this.axios.post("ui/viewlib/list",{search:{id:this.id}});
            if(data.statusCode == 0){
                this.viewLib = data.data.result[0];
            }
        },

        //提交
        submit(form){
            this.$refs[form].validate(async valid=>{
                if(valid){
                    const {data}=await this.axios.post("ui/viewlib/add",this.viewLib);
                    if(data.statusCode==0){
                        let tip=this.$t("add_S");
                        if(this.id!=0)tip=this.$t("modify_S");
                        this.commonTip(tip).then(()=>this.$router.push({name:"viewLib"}));
                    }
                }

            })
        },
        
    }
}

</script>
<style lang='less' scoped>
</style>