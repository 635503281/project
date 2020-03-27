<!-- user -->
<template>
    <div>
        <!-- <el-breadcrumb class="myBreadcrumb">
            <el-breadcrumb-item v-for="(menu,i) in $route.meta.menus" :key="i" :to="menu.path||null">{{menu.name}}</el-breadcrumb-item>
        </el-breadcrumb> -->

        <div class="content">
            <div class="search">
                <div class="search_item">
                    <span>{{$t("userName")}}:</span>
                    <el-input v-model="searchOption.userName" :placeholder="$t('placeholder.userName')" clearable></el-input>
                </div>
                <div class="search_item">
                    <span>{{$t("status")}}:</span>
                    <el-select v-model="searchOption.enable" :placeholder="$t('placeholder.choose')" clearable>
                        <el-option :label="$t('activation')" :value="true"></el-option>
                        <el-option :label="$t('forbidden')" :value="false"></el-option>
                    </el-select>
                </div>
                <div class="search_btns">
                    <el-button type="primary" @click="search">{{$t("search")}}</el-button>
                    <el-button type="primary" icon="el-icon-plus" @click="()=>this.$router.push({name:'editUser',query:{id:0}})">{{$t("add")}}</el-button>
                </div>
            </div>

            <div class="main">
                <!-- <el-button-group class="main_btns">
                    <el-button type="primary" icon="el-icon-plus" @click="()=>this.$router.push({name:'editUser',query:{id:0}})">{{$t("add")}}</el-button>
                </el-button-group> -->
                <div class="main-table">
                    <el-table max-height="100%" :data="items" style="width: 100%" :empty-text="$t('noData')" @selection-change="val=>this.selectItems=val">
                        <el-table-column prop="username" :label="$t('userName')" min-width="150"></el-table-column>
                        <el-table-column prop="nickname" :label="$t('nickName')" min-width="150" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="roles" :label="$t('role')" min-width="200" >
                            <template slot-scope="scope">
                                <template v-if="scope.row.roles&&scope.row.roles.length">
                                    <span  v-for="(val,index) in scope.row.roles" :key="index"><i v-if="index">&nbsp;;&nbsp;</i>{{val.name}}</span>
                                </template>
                                <template v-else>--</template>
                            </template>
                        </el-table-column>
                        <el-table-column prop="group" :label="$t('company')" min-width="170">
                            <template slot-scope="scope">{{scope.row.group?scope.row.group.name:"--"}}</template>
                        </el-table-column>
                        <el-table-column prop="mail" :label="$t('mail')" min-width="150" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="mobile" :label="$t('mobile')" min-width="150" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="createTime" :label="$t('createTime')" width="140" sortable></el-table-column>
                        <el-table-column prop="enable" :label="$t('status')" width="80" fixed="right" align="center">
                            <template slot-scope="scope">
                                <el-switch :value="scope.row.enable" @click.native="changeStatus(scope.row)" :disabled="scope.row.username==$store.state.user.userName"></el-switch>
                            </template>
                        </el-table-column>
                        <el-table-column  :label="$t('operation')" width="80" fixed="right" align="center">
                            <template slot-scope="scope">
                                <router-link tag="button" class="icon_modify iconBtn" :title="$t('modify')" @click.native="saveItem('user')" :to="{name:'editUser',query:{id:scope.row.id}}"></router-link>
                                <button class="icon_delete iconBtn" :title="$t('delete')" :disabled='scope.row.username=="admin"' @click="del('ui/user/del/'+scope.row.id)"></button>
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
import {RSA} from "@/common/method"

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

    computed: {},

    mounted(){
        if(this.$store.state.pageInfo.name=='user'){
            this.paginations=this.$store.state.pageInfo.paginations;
            this.searchOption=this.$store.state.pageInfo.searchOption;
        }
        this.getPageData();

        this.$store.commit("SAVE_PAGEINFO");
    },

    methods: {
        //切换状态
        changeStatus(obj){
            if(obj.username==this.$store.state.user.userName)return
            let isTitle=this.$t("isActivation");
            let tip=this.$t("activation_S");
            if(obj.enable){//原状态为启用
                isTitle=this.$t("isForbidden");
                tip=this.$t("forbidden_S")
            }
            this.commonConfirm({title:isTitle}).then(async ()=>{
                let newObj={...this.copy(obj),enable:!obj.enable};
                const publickey=await RSA.getPublicKey(newObj.username);
                newObj.password=RSA.encodeRSA(publickey,newObj.password);
                const {data}=await this.axios.post('ui/user/edit',newObj);
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
                    enable:this.searchOption.enable
                }
            };

            const {data}=await this.axios.post("ui/user/list",obj);
            if(data.statusCode==0){
                this.paginations.total=data.data.total;
                this.items=data.data.result;
            }else {
                this.paginations.total=0;
                this.items=[];
            }
        }
    }
}

</script>
<style lang='less' scoped>
</style>