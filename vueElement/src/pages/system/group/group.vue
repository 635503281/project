<!-- 单位管理 -->
<template>
    <div>
        <!-- <el-breadcrumb class="myBreadcrumb">
            <el-breadcrumb-item v-for="(menu,i) in $route.meta.menus" :key="i" :to="menu.path||null">{{menu.name}}</el-breadcrumb-item>
        </el-breadcrumb> -->

        <div class="content">
            <!-- <div class="search">
                <div class="search_item">
                    <span>{{$t("companyName")}}:</span>
                    <el-input v-model="searchOption.companyName" :placeholder="$t('placeholder.input')" clearable></el-input>
                </div>
                <div class="search_item">
                    <span>{{$t("address")}}:</span>
                    <el-input v-model="searchOption.address" :placeholder="$t('placeholder.input')" clearable></el-input>
                </div>
                <div class="search_btns">
                    <el-button type="primary" @click="search">{{$t("search")}}</el-button>
                </div>
            </div> -->

            <div class="main">
                <el-button-group class="main_btns">
                    <el-button type="primary" icon="el-icon-plus" @click="addGroup">{{$t("add")}}</el-button>
                </el-button-group>
                <div class="main-table">
                    <el-table max-height="100%" ref="groupTree" :data="items" style="width: 100%" :empty-text="$t('noData')" row-key="id" :expand-row-keys="[items.length?String(items[0].id):'']"
                        :tree-props="{children: 'childGroups', hasChildren: 'hasChildren'}">
                        <el-table-column prop="name" :label="$t('companyName')" min-width="150" :show-overflow-tooltip="false">
                            <template slot-scope="scope">
                                <el-input type="text" v-max="255" v-model="scope.row.name" size="small" required></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="code" :label="$t('companyCode')" min-width="100">
                            <template slot-scope="scope">
                                <el-input type="text" v-max="64" v-model="scope.row.code" size="small" required></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="address" :label="$t('address')" min-width="150">
                            <template slot-scope="scope">
                                <el-input type="text" v-max="255" v-model="scope.row.address" size="small"></el-input>
                            </template>
                        </el-table-column>
                        <el-table-column prop="telephone" :label="$t('mobile')" min-width="100">
                            <template slot-scope="scope">
                                <el-input type="text" v-max="64" v-model="scope.row.telephone" size="small"></el-input>
                            </template>
                        </el-table-column>
                        <!-- <el-table-column prop="jiaduSwitch" :label="$t('jiaduSwitch')" width="100" fixed="right" align="center">
                            <template slot-scope="scope">
                                <el-switch :value="scope.row.jiaduSwitch" @click.native="startORstop(scope.row)"></el-switch>
                            </template>
                        </el-table-column> -->
                        <el-table-column  :label="$t('operation')" width="120" fixed="right" align="center">
                            <template slot-scope="scope">
                                <button class="icon_search iconBtn" :title="$t('watchDetails')" @click="watch(scope.row.id)"></button>
                                <button class="el-icon-check textBtn iconBtn" :title="$t('save')" @click="save(scope.row)"></button>
                                <button class="icon_delete iconBtn" :title="$t('delete')" @click="del(scope.row)"></button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>

        <el-dialog custom-class="content addConfig" :visible.sync="isDialog" :title="$t('add')" width="50%" :close-on-click-modal="false">
            <el-form class="form" ref="addform" :model="addItem" :rules="rules" label-width="30%" :inline-message="true" autocomplete="off">
                <el-form-item label="父级" prop="parentName">
                    <el-popover placement="bottom-start" width="100%" v-model="isShowTree">
                        <Tree ref="parent" id="parent" :plugin="tree_plugin" :datas="items"  @treeClick="selectTree"></Tree>
                        <el-input slot="reference" v-model="addItem.parentName" :placeholder="$t('placeholder.choose')" readonly></el-input>
                    </el-popover>
                </el-form-item>
                <el-form-item :label="$t('companyName')" prop="name">
                    <el-input v-model="addItem.name" :placeholder="$t('placeholder.input')" v-max="255" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('companyCode')" prop="code">
                    <el-input v-model="addItem.code" :placeholder="$t('placeholder.input')" v-max="64" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('address')" prop="address">
                    <el-input v-model="addItem.address" :placeholder="$t('placeholder.input')" v-max="255" clearable></el-input>
                </el-form-item>
                <el-form-item :label="$t('mobile')" prop="telephone">
                    <el-input v-model="addItem.telephone" :placeholder="$t('placeholder.input')" v-max="64" clearable></el-input>
                </el-form-item>
                <!-- <el-form-item :label="$t('jiaduSwitch')" prop="jiaduSwitch">
                    <el-switch v-model="addItem.jiaduSwitch"></el-switch>
                </el-form-item> -->

                <el-form-item class="form_btns">
                    <el-button type="primary" @click="submit('addform')">{{$t("submit")}}</el-button>
                    <el-button @click="isDialog=false">{{$t("cancel")}}</el-button>
                </el-form-item>
              
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import {basicPage} from "@/common/mixin"
const addItem = {
    parentId:null,
    parentName:null,
    name:null,
    code:null,
    address:null,
    telephone:null,
    childGroups:[],
    // jiaduSwitch:false,
}

export default {
    mixins:[basicPage],
    data () {
        return {
            searchOption:{//搜索字段
                companyName:null,
                address:null,
            },
            addList:[],//添加数据是否已填写

            isShowTree:false,//是否出现树
            isDialog:false,//是否出现添加框
            addItem:this.copy(addItem),
            rules:{
                parentName:[{required:true,message:this.$t("noEmpty"),trigger:'change'}],
                name:[{required:true,message:this.$t("noEmpty"),trigger:'change'}],
                code:[{required:true,message:this.$t("noEmpty"),trigger:'change'}],
            },
            tree_plugin:{
                name:"name",
                title:"name",
                children:"childGroups",
                isSimpleData:false,
            },
        };
    },

    props : {},

    components: {
        Tree:()=>import("@/components/Tree"),
    },

    computed: {},

    mounted(){
        this.getPageData();
    },

    methods: {
        //分页
        async getPageData(pugin={}){
           Object.assign(this.paginations,pugin);
           let obj={
                pageNum:-1,
                pageSize:-1,
                searchBy:"name",
                keyword:this.searchOption.companyName,
                orderType:"asc",
                search:{
                    address:this.searchOption.address
                }
           };
           const {data}=await this.axios.post("ui/group/list",obj);
           if(data.statusCode==0&&data.data){
                this.items=[data.data];
           }else {
                this.items=[];
           } 

        },

        //添加
        addGroup(){
            this.addItem = this.copy(addItem);
            try{
                this.$nextTick(this.$refs.addform.clearValidate);

                if(this.$refs.parent){
                    let treeObj = this.$refs.parent.zTreeObj;
                    treeObj.cancelSelectedNode();
                    treeObj.expandAll(false);
                }
                
            }catch(e){}

            this.isDialog = true;
            
        },

        //选择父节点
        selectTree(treeNode,treeId){
            this.addItem.parentId=treeNode.id;
            this.addItem.parentName=treeNode.name;
        },

        //提交添加群组
        submit(form){
            this.$refs[form].validate(async valid=>{
                if(valid){
                    let obj = this.copy(this.addItem);
                    delete obj.parentName;
                    const {data}=await this.axios.post("ui/group/save?parentId="+obj.parentId,obj);
                    if(data.statusCode==0){
                        this.isDialog = false;
                        this.commonTip(this.$t("add_S"));
                        this.getPageData();
                        
                    }
                }

            })
        },

        //保存修改
        save(obj){
            this.commonConfirm({title:this.$t("isSave")}).then(async ()=>{
                const {data}=await this.axios.post("ui/group/saveOrupdate",obj);
                if(data.statusCode==0){
                    this.commonTip(this.$t("save_S")); 
                }
            });
        },

        //删除
        del(obj){
             this.commonConfirm({title:this.$t("isDelete")}).then(async ()=>{
                const {data}=await this.axios.get('ui/group/delete?ids='+obj.id);
                if(data.statusCode==0){
                    this.commonTip(this.$t("delete_S"));
                    this.getPageData();
                }
            });
        },

        //开启与关闭
        // startORstop(obj){
        //     let isTitle=this.$t("isEnable");
        //     let tip=this.$t("enable_S");
        //     if(obj.jiaduSwitch){//原状态为启用
        //         isTitle=this.$t("isForbidden");
        //         tip=this.$t("forbidden_S");

        //     }else obj.jiaduSwitch = false;

        //     this.commonConfirm({title:isTitle}).then(async ()=>{
        //         const {data}=await this.axios.get("ui/group/updateSwitch",{ params:{ id:obj.id,jiaduSwitch:!obj.jiaduSwitch } });
        //         if(data.statusCode==0){
        //             this.commonTip(tip);
        //             obj.jiaduSwitch=!obj.jiaduSwitch;
        //         }
        //     });
        // },

        //查看详情
        watch(id){
            this.$router.push({name:'groupDetail',query:{id:id}});
        },
    },

}

</script>
<style lang='less' scoped>
@import url("../../../css/base.less");

/deep/ .cell{
    display: flex;
    align-items: center;
    justify-content: center;

    .el-input{
        &.add{
            input{
                background-color: transparent;
                border-color: @color_text!important;
                padding-left: 10px;
            }
        }
        input{
            border-color:transparent!important;
            background-color: transparent;
            padding-left:0;
            line-height: 28px;
            height: 28px;
            &:focus{
                background-color: transparent;
                border-color: @color_text!important;
                padding-left: 10px;
            }
        }
        
    }
       
}

/deep/ td{
    padding:4px 0!important;
}

/deep/.addConfig{
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
        
    }
}

</style>