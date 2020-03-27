<!-- 比中信息 -->
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
                    <span>{{$t("deviceID")}}:</span>
                    <el-input v-model="searchOption.deviceID" :placeholder="$t('placeholder.input')" clearable></el-input>
                </div>
                <div class="search_item">
                    <span>{{$t("warnFlag")}}:</span>
                    <el-select v-model="searchOption.earlyWarningSign" :placeholder="$t('placeholder.choose')" clearable>
                        <el-option v-for="(val,i) in warnFlagList" :key="i" :value="val.id" :label="val.name"></el-option>
                    </el-select>
                </div>
                <div class="search_btns only">
                    <el-button type="primary" @click="search">{{$t("search")}}</el-button>
                    <el-button type="primary" @click="refresh"><span>{{isRefresh?'开启':'关闭'}}</span>刷新</el-button>
                </div>
            </div>

            <PhotoTable :items="items" :paginations="paginations" :getPageData="getPageData" :showBoxs="showBox">
                <!-- <template slot="operate" slot-scope="{row}">
                    <span  title="定位" class="el-icon-location-outline" @click="position(row)"></span>
                </template> -->
            </PhotoTable>
        </div>
        <PhotoInfo :row="row" :showDrawer.sync="showDrawer"></PhotoInfo>

        <el-dialog custom-class="location_map" :visible.sync="isDialog" title="位置" center width="80%" :close-on-click-modal="false" :destroy-on-close="true">
            <Location :mark="mark"></Location>
        </el-dialog>    
    </div>
</template>

<script>
import {basicPage} from "@/common/mixin"
import eVue from "@/common/event"
import {checkLonOrLat} from "@/common/method"

import PhotoTable from "@/components/PhotoTable"
import PhotoInfo from "@/components/PhotoInfo"
import Location from "@/components/Location"

export default {
    mixins:[basicPage],

    data () {
        return {
            isRefresh: true,//默认开启刷新
            searchOption:{
                times:null,
                id:this.$route.params.id?parseFloat(this.$route.params.id):null,
                deviceID:this.$route.params.deviceId?this.$route.params.deviceId:null,
                earlyWarningSign:null,
            },
            warnFlagList:[
                {id:null,name:this.$t("all")},{id:1,name:this.$t("warn_red"),type:"red"},{id:2,name:this.$t("warn_orange"),type:"orange"},{id:3,name:this.$t("warn_yellow"),type:"yellow"},{id:4,name:this.$t("warn_no"),type:"no"},
            ], 

            isDialog: false,
            mark: {
                longitude: 0,
                latitude: 0,
            }
        };
    },

    components: {
        PhotoTable, PhotoInfo, Location
    },

    mounted(){
        //监听socket推送
        this.refresh();
    },

    methods: {
        //出现详情
        async showBox(row){
            const {id} = row;
            const {data} = await this.axios.post(`ui/facehit/get/${id}`);
            if(data.statusCode == 0){
                if(data.data){
                    this.showDrawer = true;
                    this.row = data.data;
                }else{
                    this.commonTip("没有详情",'tip_notice');
                }
        
            }
        },

        //分页
        async getPageData(plugin={},headers={}){
            Object.assign(this.paginations,plugin);
            let obj={
                pageNum:this.paginations.currentPage,
                pageSize:this.paginations.pageSize,
                searchBy:"deviceID",
                keyword:this.searchOption.deviceID,
                search:{
                    startTime:this.searchOption.times?this.searchOption.times[0]:null,
                    endTime:this.searchOption.times?this.searchOption.times[1]:null,
                    id:this.searchOption.id,
                    earlyWarningSign:this.searchOption.earlyWarningSign,
                }
            }
            const {data}=await this.axios.post("ui/facehit/homelist",obj,{headers});
            if(data.statusCode==0){
                this.paginations.total=data.data.total;
                this.items=data.data.result;
            }else{
                this.paginations.total=0;
                this.items=[];
            }
        },

        //定位
        position(row){
            const {shotPlaceLongitude, shotPlaceLatitude} = row;
            const lon = checkLonOrLat(shotPlaceLongitude, "lon");
            const lat = checkLonOrLat(shotPlaceLatitude, "lat");
            if(!lon||!lat){
                this.commonTip("经纬度格式不正确", "tip_notice");
                return;
            }

            this.mark = { longitude: lon, latitude: lat};
            this.isDialog = true;
        },

        //开启监听
        openRefresh(){
            eVue.$on("ratio", ()=>{
                this.getPageData({currentPage:1},{noLoading:true,responseError: true});
            });
        },
        //关闭监听
        closeRefresh(){
            eVue.$off("ratio");
        },

        //开关实时刷新
        refresh(){
            this.isRefresh?this.openRefresh():this.closeRefresh();
            this.isRefresh = !this.isRefresh;
        },
    },
    
    destroyed(){
        this.closeRefresh();
    },
}

</script>
<style lang='less' scoped>
</style>
