<!-- 设备备案 -->
<template>
    <div>
        <!-- <el-breadcrumb class="myBreadcrumb">
            <el-breadcrumb-item v-for="(menu,i) in $route.meta.menus" :key="i" :to="menu.path||null">{{menu.name}}</el-breadcrumb-item>
        </el-breadcrumb> -->

        <div class="content">
            <div class="search">
                <div class="search_item">
                    <span>{{$t("deviceID")}}:</span>
                    <el-input v-model="searchOption.deviceID" :placeholder="$t('placeholder.input')" clearable></el-input>
                </div>
                <div class="search_item">
                    <span>{{$t("deviceName")}}:</span>
                    <el-input v-model="searchOption.deviceName" :placeholder="$t('placeholder.input')" clearable></el-input>
                </div>
                <div class="search_item">
                    <span>{{$t("ipAddress")}}:</span>
                    <el-input v-model="searchOption.ipAddress" :placeholder="$t('placeholder.input')" clearable></el-input>
                </div>
                <div class="search_item">
                    <span>{{$t("type")}}:</span>
                    <el-select v-model="searchOption.type" :placeholder="$t('placeholder.choose')" clearable>
                        <el-option :label="$t('equipmentType_0')" :value="0"></el-option>
                        <el-option :label="$t('equipmentType_1')" :value="1"></el-option>
                        <el-option :label="$t('equipmentType_2')" :value="2"></el-option>
                    </el-select>
                </div>
                <div class="search_item">
                    <span>{{$t("address")}}:</span>
                    <el-input v-model="searchOption.address" :placeholder="$t('placeholder.input')" clearable></el-input>
                </div>
                <div class="search_btns">
                    <el-button type="primary" @click="search">{{$t("search")}}</el-button>
                </div>
            </div>

            <div class="main">
                <div class="main-table">
                    <el-table max-height="100%" :data="items" style="width: 100%" :empty-text="$t('noData')" @selection-change="val=>this.selectItems=val">
                        <el-table-column prop="DeviceID" :label="$t('deviceID')" min-width="180"></el-table-column>
                        <el-table-column prop="name" :label="$t('deviceName')" min-width="150" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="ipAddress" :label="$t('ipAddress')" min-width="120" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="port" :label="$t('port')" min-width="80" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="Uid" :label="$t('uid')" min-width="120" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="type" :label="$t('type')" min-width="90">
                            <template slot-scope="scope">
                                <span v-if="scope.row.type==0">{{$t("equipmentType_0")}}</span>
                                <span v-else-if="scope.row.type==1">{{$t("equipmentType_1")}}</span>
                                <span v-else-if="scope.row.type==2">{{$t("equipmentType_2")}}</span>
                                <span v-else>--</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="OrgCode" :label="$t('orgCode')" min-width="120" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="OrgName" :label="$t('orgName')" min-width="170" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="PlaceCode" :label="$t('placeCode')" min-width="150" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="Address" :label="$t('address')" min-width="150" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="Longitude" :label="$t('longitude')" min-width="80" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="Latitude" :label="$t('latitude')" min-width="80" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="createTime" :label="$t('createTime')" width="140" sortable></el-table-column>
                        <!-- <el-table-column  :label="$t('operation')" width="80" fixed="right" align="center">
                            <template slot-scope="scope">
                                <button class="icon_delete iconBtn" :title="$t('delete')" @click="del(scope.row.id)"></button>
                            </template>
                        </el-table-column> -->
                    </el-table>
                </div>
                <Pagination :paginations="paginations" @changeDate='getPageData'/>
            </div>
        </div>
    </div>
</template>

<script>
import {basicPage} from "@/common/mixin"

export default {
    mixins:[basicPage],
    data () {
        return {
            searchOption:{//搜索字段
                deviceID:null,
                deviceName:null,
                ipAddress:null,
                address:null,
                type:null,
            },
        };
    },

    props : {},

    components: {},

    computed: {},

    mounted(){
        this.getPageData();    
    },

    methods: {
        //分页
        async getPageData(plugin={}){
            Object.assign(this.paginations,plugin);
            let obj={
                pageNum:this.paginations.currentPage,
                pageSize:this.paginations.pageSize,
                searchBy:"name",
                keyword:this.searchOption.deviceName,
                search:{
                    deviceID:this.searchOption.deviceID,
                    ipAddress:this.searchOption.ipAddress,
                    address:this.searchOption.address,
                    type:this.searchOption.type,
                }
            };

            const {data}=await this.axios.post("ui/Register/list",obj);
            if(data.statusCode==0){
                this.paginations.total=data.data.total;
                this.items=data.data.result;
            }else {
                this.paginations.total=0;
                this.items=[];
            }
        },

        //删除
        del(id){
            this.commonConfirm({title:this.$t("isDelete")}).then(async ()=>{
                const {data}=await this.axios.post("ui/UnRegister",{id});
                if(data.statusCode==0){
                    this.commonTip(this.$t("delete_S"));
                    this.getPageData();
                }
            });

        },
    }
}

</script>
<style lang='less' scoped>
</style>
