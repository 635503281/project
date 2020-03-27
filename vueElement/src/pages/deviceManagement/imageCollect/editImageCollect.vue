<!-- 编辑图像采集系统管理 -->
<template>
    <div>
        <el-breadcrumb class="myBreadcrumb">
            <el-breadcrumb-item v-for="(menu,i) in $route.meta.menus.filter((v,i)=>i!=0)" :key="i" :to="menu.path||null">{{menu.name}}</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="content main-form">
            <el-form class="form" ref="imageCollect" :model="imageCollect" :rules="rules" label-width="30%" :inline-message="true" autocomplete="off">
                <el-form-item label="服务名称" prop="name">
                    <el-input v-model="imageCollect.name" :placeholder="$t('placeholder.input')" v-max="255" clearable></el-input>
                </el-form-item>
                <el-form-item label="接口地址" prop="url">
                    <el-input v-model="imageCollect.url" :placeholder="$t('placeholder.input')" v-max="255" clearable></el-input>
                </el-form-item>
                <el-form-item class="form_btns">
                    <el-button type="primary" @click="submit('imageCollect')">{{$t("submit")}}</el-button>
                    <el-button @click="()=>this.$router.push({name:'imageCollect'})">{{$t("cancel")}}</el-button>
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
            imageCollect:{
                name:null,
                url:null,
            },
            rules:{
                name:[{required:true,message:this.$t("noEmpty"),trigger:'change'}],
                url:[{required:true,message:this.$t("noEmpty"),trigger:'change'}],
            },

        };
    },

    props : {},

    components: {},

    computed: {},

    beforeMount(){
        this.id=parseInt(this.$route.query.id);
        if(this.id)this.getImageCollectById();
    },

    mounted(){},

    methods: {
        //获取
        async getImageCollectById(){
            const {data} = await this.axios.get("ui/imageAcquisitionSystem/get/"+this.id);
            if(data.statusCode == 0){
                this.imageCollect = data.data;
            }
        },

        //提交
        submit(form){
            this.$refs[form].validate(async valid=>{
                if(valid){
                    const {data}=await this.axios.post("ui/imageAcquisitionSystem/addOrUpdate",this.imageCollect);
                    if(data.statusCode==0){
                        let tip=this.$t("add_S");
                        if(this.id!=0)tip=this.$t("modify_S");
                        this.commonTip(tip).then(()=>this.$router.push({name:"imageCollect"}));
                    }
                }

            })
        },
        
    }
}

</script>
<style lang='less' scoped>
</style>