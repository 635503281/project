<!-- 编辑系统参数 -->
<template>
    <div>
        <el-breadcrumb class="myBreadcrumb">
            <el-breadcrumb-item v-for="(menu,i) in $route.meta.menus.filter((v,i)=>i!=0)" :key="i" :to="menu.path||null">{{menu.name}}</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="content main-form">
            <el-form class="form" ref="systemFrom" :model="system" :rules="rules" label-width="30%" :inline-message="true" autocomplete="off">
                <el-form-item :label="$t('configName')" prop="name">
                    <el-input v-model="system.name" :placeholder="$t('placeholder.input')" v-max="255" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('configValue')" prop="value">
                    <el-input v-model="system.value" :placeholder="$t('placeholder.input')" v-max="255" clearable></el-input>
                </el-form-item>
                <!-- <el-form-item :label="$t('type')" prop="type">
                    <el-input v-model="system.type" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item> -->
                <el-form-item :label="$t('status')" prop="isEnable">
                    <el-radio-group v-model="system.isEnable">
                        <el-radio :label="true">{{$t("enable")}}</el-radio>
                        <el-radio :label="false">{{$t("forbidden")}}</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item :label="$t('description')" prop="description">
                    <el-input type="textarea" v-model="system.description" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>

                <el-form-item class="form_btns">
                    <el-button type="primary" @click="submit('systemFrom')">{{$t("submit")}}</el-button>
                    <el-button @click="()=>this.$router.push({name:'systemParam'})">{{$t("cancel")}}</el-button>
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
            system:{
                name:null,//配置名称
                value:null,//配置值
                type:null,//类型
                isEnable:false,//是否启用
                description:null,
            },
            rules:{
                name:[{required:true,message:this.$t("noEmpty"),trigger:'change'}],
                value:[{required:true,message:this.$t("noEmpty"),trigger:'change'}],
            }
        };
    },

    props : {},

    components: {},

    computed: {},

    beforeMount(){
        this.id=parseInt(this.$route.query.id);
        if(this.id)this.getSystemParamById(this.id);
    },

    mounted(){},

    methods: {
        //获取系统参数
        async getSystemParamById(id){
            const {data}=await this.axios.get(`ui/config/${this.id}`);
            if(data.statusCode==0){
                this.system=data.data;
            } 
        },

        //提交
        submit(form){
            this.$refs[form].validate(async valid=>{
                if(valid){
                    let url="ui/config/add";
                    let tip=this.$t("add_S");
                    if(this.id!=0){
                        url="ui/config/update";
                        tip=this.$t("modify_S");
                    }
                    const {data}=await this.axios.post(url,this.system);
                    if(data.statusCode==0){
                        this.commonTip(tip).then(()=>{
                            this.$router.push({name:"systemParam"});
                        });
                    }
                }

            })
        },
    }
}

</script>
<style lang='less' scoped>
</style>