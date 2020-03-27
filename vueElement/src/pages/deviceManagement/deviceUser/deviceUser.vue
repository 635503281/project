<!-- 设备用户 -->
<template>
    <div>
        <!-- <el-breadcrumb class="myBreadcrumb">
            <el-breadcrumb-item v-for="(menu,i) in $route.meta.menus" :key="i" :to="menu.path||null">{{menu.name}}</el-breadcrumb-item>
        </el-breadcrumb> -->

        <div class="content">
            <div class="search">
                <div class="search_item">
                    <span>{{$t("uid")}}:</span>
                    <el-input v-model="searchOption.userName" :placeholder="$t('placeholder.input')" clearable></el-input>
                </div>
                <div class="search_item">
                    <span>{{$t("status")}}:</span>
                    <el-select v-model="searchOption.enable" :placeholder="$t('placeholder.choose')" clearable>
                        <el-option :label="$t('enable')" :value="true"></el-option>
                        <el-option :label="$t('forbidden')" :value="false"></el-option>
                    </el-select>
                </div>
                <div class="search_btns">
                    <el-button type="primary" @click="search">{{$t("search")}}</el-button>
                    <el-button type="primary" icon="el-icon-plus" @click="()=>this.$router.push({name:'editDeviceUser',query:{id:0}})">{{$t("add")}}</el-button>
                </div>
            </div>

            <div class="main">
                <!-- <el-button-group class="main_btns">
                    <el-button type="primary" icon="el-icon-plus" @click="()=>this.$router.push({name:'editDeviceUser',query:{id:0}})">{{$t("add")}}</el-button>
                </el-button-group> -->
                <div class="main-table">
                    <el-table max-height="100%" :data="items" style="width: 100%" :empty-text="$t('noData')" @selection-change="val=>this.selectItems=val">
                        <el-table-column prop="username" :label="$t('uid')" min-width="150">
                            <template slot-scope="scope">
                                <router-link tag="a" class="textBtn" :to="{name:'device',params:{userName:scope.row.username}}">{{scope.row.username}}</router-link>
                            </template>
                        </el-table-column>
                        <el-table-column prop="password" :label="$t('password')" min-width="150">
                            <template slot-scope="scope">{{scope.row.password|decode}}</template>
                        </el-table-column>
                        <el-table-column prop="terminalNum" :label="$t('terminalNum')" min-width="150" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="remark" :label="$t('remarks')" min-width="150" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="createTime" :label="$t('createTime')" width="140" sortable></el-table-column>
                        <el-table-column prop="enable" :label="$t('enableStatus')" width="90" fixed="right" align="center">
                            <template slot-scope="scope">
                                <el-switch :value="scope.row.enable" @click.native="startORstop(scope.row)"></el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column  :label="$t('operation')" width="80" fixed="right" align="center">
                            <template slot-scope="scope">
                                <router-link tag="button" class="icon_modify iconBtn" :title="$t('modify')" @click.native="saveItem('deviceUser')" :to="{name:'editDeviceUser',query:{id:scope.row.id}}"></router-link>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <Pagination :paginations="paginations" @changeDate='getPageData'/> 
            </div>
        </div>
    </div>
</template>

<script>
import {basicPage} from "@/common/mixin"
import base64 from "@/common/base64"

export default {
    mixins:[basicPage],
    data () {
        return {
            searchOption:{//搜索字段
                userName:null,
                enable:null,
            },
        };
    },

    props : {},

    components: {},

    filters: {
        decode:val=>base64.decode(val),
        
    },

    mounted(){
        if(this.$store.state.pageInfo.name=='deviceUser'){
            this.paginations=this.$store.state.pageInfo.paginations;
            this.searchOption=this.$store.state.pageInfo.searchOption;
        }
        this.getPageData();

        this.$store.commit("SAVE_PAGEINFO");
    },

    methods: {
        //禁用启用
        startORstop(obj){
            let isTitle=this.$t("isEnable");
            let tip=this.$t("enable_S");
            if(obj.enable){//原状态为启用
                isTitle=this.$t("isForbidden");
                tip=this.$t("forbidden_S");
            }
            this.commonConfirm({title:isTitle}).then(async ()=>{
                let newObj={...this.copy(obj),enable:!obj.enable}; 
                const {data}=await this.axios.post('ui/terminalUserInfo/saveOrupdate',newObj);
                if(data.statusCode==0){
                    this.commonTip(tip);
                    obj.enable=!obj.enable;
                }
            });
        },

        //分页
        async getPageData(plugin={}){
            Object.assign(this.paginations,plugin);
            let obj={
                pageNum:this.paginations.currentPage,
                pageSize:this.paginations.pageSize,
                searchBy:"username",
                keyword:this.searchOption.userName,
                search:{
                    enable:this.searchOption.enable,
                }
               
            };

            const {data}=await this.axios.post("ui/terminalUserInfo/list",obj);
            if(data.statusCode==0){
                this.paginations.total=data.data.total;
                this.items=data.data.result;
            }else {
                this.paginations.total=0;
                this.items=[];
            }
        },

    }
}

</script>
<style lang='less' scoped>
</style>