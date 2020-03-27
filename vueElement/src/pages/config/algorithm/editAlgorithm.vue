<!-- 编辑比对算法管理 -->
<template>
    <div>
        <el-breadcrumb class="myBreadcrumb">
            <el-breadcrumb-item v-for="(menu,i) in $route.meta.menus.filter((v,i)=>i!=0)" :key="i" :to="menu.path||null">{{menu.name}}</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="content main-form">
            <el-form class="form" ref="algorithmFrom" :model="algorithm" :rules="rules" label-width="30%" :inline-message="true" autocomplete="off">
                <el-form-item :label="$t('algorithmName')" prop="name">
                    <!-- <el-input v-model="algorithm.name" :placeholder="$t('placeholder.input')" clearable></el-input> -->
                    <el-select v-model="algorithm.name">
                        <el-option v-for="(v,i) in nameList" :key="i" :value="v"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('algorithmUrl')" prop="url">
                    <el-input v-model="algorithm.url" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('limitScore')" prop="limitScore">
                    <el-input v-model="algorithm.limitScore" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('topN')" prop="topN">
                    <el-input v-model="algorithm.topN" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('status')" prop="status">
                    <el-radio-group v-model="algorithm.status">
                        <el-radio :label="true">{{$t("enable")}}</el-radio>
                        <el-radio :label="false">{{$t("forbidden")}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('forceUpdate')" prop="forceUpdate">
                    <el-switch v-model="algorithm.forceUpdate"></el-switch>
                </el-form-item>
                <el-form-item :label="$t('forceExtract')" prop="forceExtract">
                    <el-switch v-model="algorithm.forceExtract"></el-switch>
                </el-form-item>

                <el-form-item :label="$t('remarks')" prop="remarks">
                    <el-input type="textarea" v-model="algorithm.remarks" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>

                <el-form-item class="form_btns">
                    <el-button type="primary" @click="submit('algorithmFrom')">{{$t("submit")}}</el-button>
                    <el-button @click="()=>this.$router.push({name:'algorithm'})">{{$t("cancel")}}</el-button>
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
            nameList:[],
            algorithm:{
                name:null,
                url:null,
                limitScore:null,
                topN:null,
                status:false,
                remarks:null,
                forceUpdate:false,
                forceExtract:false,
            },
            rules:{
                name:[{required:true,message:this.$t("noEmpty"),trigger:'change'}],
                url:[{required:true,message:this.$t("noEmpty"),trigger:'change'}],
                limitScore:[{required:true,message:this.$t("noEmpty"),trigger:'change'},
                        {
                        validator:(rule,value,callback)=>{
                            if(!value)callback();

                            const reg=/^[+-]?(0|([1-9]\d*))(\.\d+)?$/;
                            if(!reg.test(value)){
                                callback("输入数字");
                                return
                            }
                            callback();
                        },
                        trigger:"change"
                     } 
                ],
                topN:[{required:true,message:this.$t("noEmpty"),trigger:'change'},
                     {
                        validator:(rule,value,callback)=>{
                            if(!value)callback();

                            const reg=/^[0-9]*$/;
                            if(!reg.test(value)){
                                callback("输入整数");
                                return
                            }
                            callback();
                        },
                        trigger:"change"
                     } 
                ],
            }
        };
    },

    props : {},

    components: {},

    computed: {},

    beforeMount(){
        this.getName();
        this.id=parseInt(this.$route.query.id);
        if(this.id)this.getAlgorithm(this.id);
    },

    mounted(){},

    methods: {
        //获取系统参数
        async getAlgorithm(id){
            const {data}=await this.axios.post('ui/ai/algorithm/list',{search:{id}});
            if(data.statusCode==0){
                this.algorithm=data.data.result[0];
            } 
        },

        //获取比对算法名称
        async getName(){
            const {data} = await this.axios.get("ui/ai/algorithm/aiNames",{headers:{noLoading:true}});
            if(data.statusCode == 0){
                this.nameList = data.data||[];
            }
        },

        //提交
        submit(form){
            this.$refs[form].validate(async valid=>{
                if(valid){
                    let tip=this.$t("add_S");
                    if(this.id!=0){
                        tip=this.$t("modify_S");
                    }
                    const {data}=await this.axios.post('ui/ai/algorithm/add',this.algorithm);
                    if(data.statusCode==0){
                        this.commonTip(tip).then(()=>{
                            this.$router.push({name:"algorithm"});
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