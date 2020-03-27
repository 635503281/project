<!-- 编辑定时任务 -->
<template>
    <div>
        <el-breadcrumb class="myBreadcrumb">
            <el-breadcrumb-item v-for="(menu,i) in $route.meta.menus.filter((v,i)=>i!=0)" :key="i" :to="menu.path||null">{{menu.name}}</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="content main-form">
            <el-form class="form" ref="cronform" :model="cron" :rules="rules" label-width="30%" :inline-message="true" autocomplete="off">
                <el-form-item :label="$t('jobName')" prop="jobName">
                    <el-input v-model="cron.jobName" :placeholder="$t('placeholder.input')" clearable v-max="50"></el-input>
                </el-form-item>
                <el-form-item :label="$t('cronExpression')" prop="cronExpression">
                    <el-popover v-model="isShowCron" placement="bottom-start" popper-class="cron-popover">
                        <cron ref="cronPopover" @change="val=>this.cron.cronExpression=val" @close="isShowCron=false" :i18n="lang"></cron>
                        <el-input slot="reference" @click="isShowCron=true" v-model="cron.cronExpression" :placeholder="$t('placeholder.input')"  @change="changeCron" clearable></el-input>
                    </el-popover>
                </el-form-item>
                <el-form-item :label="$t('timerName')" prop="targetObject">
                    <el-input v-model="cron.targetObject" :placeholder="$t('placeholder.input')" clearable :disabled="id!=0"></el-input>
                </el-form-item>
                <el-form-item :label="$t('status')" prop="status">
                    <el-radio-group v-model="cron.status">
                        <el-radio :label="true">{{$t("enable")}}</el-radio>
                        <el-radio :label="false">{{$t("forbidden")}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('description')" prop="description">
                    <el-input type="textarea" v-model="cron.description" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                <el-form-item class="form_btns">
                    <el-button type="primary" @click="submit('cronform')">{{$t("submit")}}</el-button>
                    <el-button @click="()=>this.$router.push({name:'cron'})">{{$t("cancel")}}</el-button>
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
            cron:{
                jobName:null,//任务名称
                cronExpression:null,//定时任务表达式
                targetObject:null,//定时器全名
                status:false,
                description:null,
                triggerType:1,
                jobGroup:1,
            },
            rules:{
                jobName:[{required:true,message:this.$t("noEmpty"),trigger:'change'}],
                cronExpression:[{required:true,message:this.$t("noEmpty"),trigger:'change'}],
                targetObject:[{required:true,message:this.$t("noEmpty"),trigger:'change'}],
            },
            isShowCron:false,//是否显示cron组件
        };
    },

    props : {},

    components: {
        cron:async ()=>(await import("vue-cron")).cron,
    },

    computed: {
        lang(){
            let lang="cn"
            switch(this.$store.state.lang){
                case "zh-cn":lang="cn";break;
                case "en-us":lang="en";break;
            }
            return lang
        }
    },

    beforeMount(){
        this.id=parseInt(this.$route.query.id);
        if(this.id)this.getCron();
    },

    mounted(){},

    methods: {
        //获取定时任务
        async getCron(){
            const {data}=await this.axios.get(`ui/scheduler/${this.id}`);
            if(data.statusCode==0){
                this.cron=data.data;
            }
        },

        //改变icon表达式
        changeCron(val){
            if(!val)this.$refs['cronPopover'].rest(this.$refs['cronPopover'].$data);
        },

        //提交
        submit(form){
            this.$refs[form].validate(async valid=>{
                if(valid){
                    let url="ui/scheduler/add";
                    let tip=this.$t("add_S");
                    if(this.id!=0){
                        url="ui/scheduler/update";
                        tip=this.$t("modify_S");
                    }
                    const {data}=await this.axios.post(url,this.cron);
                    if(data.statusCode==0){
                        this.commonTip(tip).then(()=>{
                            this.$router.push({name:"cron"});
                        });
                    }
                }

            })
        },
        
    }
}

</script>
<style lang='less'>
//cron插件样式
.cron-popover{
    .value{
        display: block;
        margin-bottom:4px;
        font-size:14px!important;
    }

    .el-tabs__nav.is-top>div{
        cursor: pointer;
    }

    //语言切换按钮
    .language{
        display: none;
    }

    .el-tabs__content{
        max-height: 170px;
        overflow-y: auto!important;
        padding:10px 15px !important;

        .tabBody{
            .el-row{
                margin:5px 0!important;
            }
        }
    }
}
</style>