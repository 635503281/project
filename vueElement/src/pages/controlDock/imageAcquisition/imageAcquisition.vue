<!-- 图像采集终端查询 -->
<template>
    <div>
        <!-- <el-breadcrumb class="myBreadcrumb">
            <el-breadcrumb-item v-for="(menu,i) in $route.meta.menus" :key="i" :to="menu.path||null">{{menu.name}}</el-breadcrumb-item>
        </el-breadcrumb> -->

        <div class="content">
            <div class="search">
                <div class="search_item">
                    <span>{{$t("selectTime")}}:</span>
                    <el-date-picker type="datetimerange" v-model="searchOption.times" range-separator="~" :start-placeholder="$t('startTime')" :end-placeholder="$t('endTime')"
                      value-format="yyyy-MM-dd HH:mm:ss" clearable>
                    </el-date-picker>
                </div>
                <div class="search_item">
                    <span>{{$t("deviceName")}}:</span>
                    <el-input v-model="searchOption.deviceName" :placeholder="$t('placeholder.input')" clearable></el-input>
                </div>
                <div class="search_item">
                    <span>{{$t("orgName")}}:</span>
                    <el-input v-model="searchOption.orgName" :placeholder="$t('placeholder.input')" clearable></el-input>
                </div>
                <div class="search_item">
                    <span>{{$t("address")}}:</span>
                    <el-input v-model="searchOption.address" :placeholder="$t('placeholder.input')" clearable></el-input>
                </div>
                <div class="search_item">
                    <span>{{$t("maintainFlag")}}:</span>
                    <el-select v-model="searchOption.type" :placeholder="$t('placeholder.choose')" clearable>
                        <el-option :label="$t('add1')" :value="1"></el-option>
                        <el-option :label="$t('update1')" :value="2"></el-option>
                        <el-option :label="$t('cancel1')" :value="3"></el-option>
                    </el-select>
                </div>
                <div class="search_btns">
                    <el-button type="primary" @click="search">{{$t("search")}}</el-button>
                </div>
            </div>

            <div class="main">
                <div class="main-table">
                    <el-table max-height="100%" :data="items" style="width: 100%" :empty-text="$t('noData')" @selection-change="val=>this.selectItems=val">
                        <el-table-column prop="deviceID" :label="$t('deviceID')" min-width="180" :formatter="(c,r,v)=>v||'--'"></el-table-column>
                        <el-table-column prop="name" :label="$t('deviceName')" min-width="180" :formatter="(c,r,v)=>v||'--'"></el-table-column>
                        <el-table-column prop="orgCode" :label="$t('orgCode')" min-width="120" :formatter="(c,r,v)=>v||'--'"></el-table-column>
                        <el-table-column prop="orgName" :label="$t('orgName')" min-width="170" :formatter="(c,r,v)=>v||'--'"></el-table-column>
                        <el-table-column prop="placeCode" :label="$t('placeCode')" min-width="150" :formatter="(c,r,v)=>v||'--'"></el-table-column>
                        <el-table-column prop="address" :label="$t('address')" min-width="150" :formatter="(c,r,v)=>v||'--'"></el-table-column>
                        <!-- <el-table-column prop="latitude" :label="$t('latitude')" min-width="80" :formatter="(c,r,v)=>v||'--'"></el-table-column>
                        <el-table-column prop="longitude" :label="$t('longitude')" min-width="80" :formatter="(c,r,v)=>v||'--'"></el-table-column> -->
                        <el-table-column prop="type" :label="$t('maintainFlag')" min-width="80">
                            <template slot-scope="scope">
                                <span v-if="scope.row.type==1">{{$t("add1")}}</span>
                                <span v-else-if="scope.row.type==2">{{$t("update1")}}</span>
                                <span v-else-if="scope.row.type==3">{{$t("cancel1")}}</span>
                                <span v-else>--</span>
                            </template> 
                        </el-table-column>
                        <el-table-column prop="createTime" :label="$t('createTime')" width="140" sortable></el-table-column>
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
            searchOption:{
                times:null,
                deviceName:null,
                orgName:null,
                address:null,
                type:null,
            },
        };
    },

    props : {},

    components: {},

    computed: {
    
    },

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
                    startTime:this.searchOption.times?this.searchOption.times[0]:null,
                    endTime:this.searchOption.times?this.searchOption.times[1]:null,
                    orgName:this.searchOption.orgName,
                    address:this.searchOption.address,
                    type:this.searchOption.type,
                }
            };

            const {data}=await this.axios.post("ui/imageAcqTerminalItems/listInfo",obj);
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