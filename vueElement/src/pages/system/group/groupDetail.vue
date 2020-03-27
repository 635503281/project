<!-- 单位详情 -->
<template>
    <div>
        <el-breadcrumb class="myBreadcrumb">
            <el-breadcrumb-item v-for="(menu,i) in $route.meta.menus.filter((v,i)=>i!=0)" :key="i" :to="menu.path||null">{{menu.name}}</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="content">
            <div class="groupInfo">
                <span>{{$t('companyName')}}：<i>{{group.name}}</i></span>
                <span>{{$t('companyCode')}}：<i>{{group.code}}</i></span>
            </div>
            
            <div class="main">
                <el-button-group class="main_btns">
                    <h4 class="configTitle">{{$t("pushConfig")}}：</h4>
                    <el-button type="primary" icon="el-icon-plus" @click="edit('add')">{{$t("add")}}</el-button>
                </el-button-group>
                <div class="main-table">
                    <el-table max-height="380" :data="pushconfigList" style="width: 100%" :empty-text="$t('noData')">
                        <el-table-column prop="url" :label="$t('url')" min-width="150"></el-table-column>
                        <el-table-column prop="pushType" :label="$t('pushType')" min-width="150">
                            <template slot-scope="scope">
                                <span v-for="(v,i) in filterArr(pushTypeList,'pushType',scope.row.pushType)" :key="i">{{v.desc}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="enable" :label="$t('status')" min-width="90">
                            <template slot-scope="scope">{{scope.row.enable?$t("enable"):$t("forbidden")}}</template>
                        </el-table-column>
                        <el-table-column prop="warningLevel" :label="$t('warningLevel')" min-width="100"></el-table-column>
                        <el-table-column prop="createTime" :label="$t('createTime')" width="140" sortable></el-table-column>
                        <el-table-column  :label="$t('operation')" width="80" fixed="right" align="center">
                            <template slot-scope="scope">
                                <button class="icon_modify iconBtn" :title="$t('modify')" @click="edit('modify',scope.row)" ></button>
                                <button class="icon_delete iconBtn" :title="$t('delete')" @click="del('ui/pushconfig/delete?ids='+scope.row.id)"></button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <Pagination :paginations="paginations" @changeDate='getPushConfig'/>  
                </div>
            </div>
        </div>

        <el-dialog custom-class="content pushConfig" :visible.sync="isConfigDialog" :title="pushconfig.id?$t('modify'):$t('add')" width="50%" :close-on-click-modal="false">
            <el-form class="form" ref="pushconfigform" :model="pushconfig" :rules="rules" label-width="30%" :inline-message="true" autocomplete="off">
                <el-form-item :label="$t('url')" prop="url">
                    <el-input v-model="pushconfig.url" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('pushType')" prop="pushType">
                    <el-select v-model="pushconfig.pushType" :placeholder="$t('placeholder.choose')" clearable>
                        <el-option v-for="(v,i) in pushTypeList" :key="i" :label="v.desc" :value="v.pushType"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('status')" prop="enable">
                    <el-radio-group v-model="pushconfig.enable">
                        <el-radio :label="true">{{$t("enable")}}</el-radio>
                        <el-radio :label="false">{{$t("forbidden")}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('warningLevel')" prop="warningLevel">
                    <el-input-number v-model="pushconfig.warningLevel" :min="0"></el-input-number>
                </el-form-item>

                <el-form-item class="form_btns">
                    <el-button type="primary" @click="submit('pushconfigform')">{{$t("submit")}}</el-button>
                    <el-button @click="isConfigDialog=false">{{$t("cancel")}}</el-button>
                </el-form-item>
              
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import {basicPage} from "@/common/mixin"

export default {
    mixins:[basicPage],

    data () {
        return {
            id:null,
            paginations:{
                total:0,
                currentPage:1,
                pageSize:10,
                pageSizes:[10,20,30,50,100],
            },
            isConfigDialog:false,//是否显示dialog

            group:{},//单位

            pushconfigList:[],
            pushconfig:{
                groupId : parseInt(this.$route.query.id),
                url : null,
                enable : false,
                pushType : null,
                warningLevel : null,
            },
            rules:{
                url:[{required:true,message:this.$t("noEmpty"),trigger:'change'}],
                pushType:[{required:true,message:this.$t("noEmpty"),trigger:'change'}],
                warningLevel:[{required:true,message:this.$t("noEmpty"),trigger:'change'}],
            },

            pushTypeList:[],
        };
    },

    props : {},

    components: {},

    computed: {
        //过滤数据循环
        filterArr(){
            return function(list,key,value){
                let arr=list.filter(val=>val[key]==value);
                if(!arr.length)arr=[{desc:value,[key]:value}]
                return arr
            }
        },
    },

    beforeMount(){
        this.id=parseInt(this.$route.query.id);
        this.getGroup(this.id);

        this.getPushTypeList();
    },

    mounted(){
        this.getPushConfig();
    },

    methods: {
        //获取推送配置枚举
        async getPushTypeList(){
            const {data} = await this.axios.get("ui/enum/pushconfiglist",{headers:{noLoading:true}});
            if(data.statusCode == 0){
                this.pushTypeList = data.data;
            }
        },

        //获取单位信息
        async getGroup(id){
            const {data} = await this.axios.get(`ui/group/${id}`,{headers:{noLoading:true}});
            if(data.statusCode == 0){
                this.group = data.data;
            }
        },

        //获取推送配置
        async getPushConfig(plugin={}){
            Object.assign(this.paginations,plugin);
            let obj={
                pageNum:this.paginations.currentPage,
                pageSize:this.paginations.pageSize,
            };
            const {data} = await this.axios.post("ui/pushconfig/list?id="+this.id,obj);
            if(data.statusCode == 0){
                this.paginations.total = data.data.total;
                this.pushconfigList = data.data.result;
            }else {
                this.paginations.total = 0;
                this.pushconfigList = [];
            } 
        },

        //编辑
        edit(type,obj){
            switch(type){
                case "add":
                    this.pushconfig = {
                        groupId : parseInt(this.$route.query.id),
                        url : null,
                        enable : false,
                        pushType : null,
                        warningLevel : null,
                    };
                    try{
                        this.$nextTick(this.$refs.pushconfigform.clearValidate);
                    }catch(e){}
                    
                break;
                case "modify":
                    this.pushconfig = obj;
                    
                break;
            }
            this.isConfigDialog = true;
        },

        //提交推送配置
        submit(form){
            this.$refs[form].validate(async valid=>{
                if(valid){
                    let url="ui/pushconfig/save";
                    let tip=this.$t("add_S");
                    if(this.pushconfig.id){
                        url="ui/pushconfig/saveOrupdate";
                        tip=this.$t("modify_S");
                    }
                   
                    const {data}=await this.axios.post(url,this.pushconfig,{headers:{noLoading:true}});
                    if(data.statusCode==0){
                        this.isConfigDialog = false;
                        this.commonTip(tip).then(()=>{
                            this.getPushConfig();
                        });
                    }
                }

            })
        },

        //删除
        del(url){
             this.commonConfirm({title:this.$t("isDelete")}).then(async ()=>{
                const {data}=await this.axios.get(url);
                if(data.statusCode==0){
                    this.commonTip(this.$t("delete_S"));
                    this.getPushConfig();
                }
            });
        },
    }
}

</script>
<style lang='less' scoped>
@import url("../../../css/base.less");

.content {
    .groupInfo{
        text-align: center;
        span{
            margin-right:40px;
            color:@color_text;
            i{
                font-style: normal;
                color:#fff;
            }
        }
    }
    .configTitle{
        float: left;
        margin:5px 0;
        color:@color_text;
    }
}

/deep/.pushConfig{
    margin:0 auto ;
    padding:0;
    height: auto;
    .el-dialog__header{
        text-align: center;
        .el-dialog__title{
            color:@color_text;
        }
    }
    .el-dialog__body{
        padding:10px 0 0;
    }

    .form{
        margin:0;
        .el-input-number {
            span[role="button"]{
                height:26px;
            }
            .el-input input{
                padding-left:35px;
            }
        }
    }
}
</style>