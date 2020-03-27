<template>
    <div>
        <div class="content" style="padding:0;">
            <OffBMap ref="deviceMap" class="main" id="deviceMap" :center="center" :zoom="zoom" :maxZoom="maxZoom" :minZoom="minZoom"
             @moveend="moveend" @zoomend="zoomend">
                <BMarkCluster>
                    <BMarker v-for="(mark,i) in items" :key="i" :position="{longitude:mark.longitude,latitude:mark.latitude}"
                            @click="clickMark(mark,i)" :title="mark.name" :icon="{url:'/static/assets/bmap_offline/images/tou.png',size:{width:24,height:23}}">
                        <BInfo :show="mark.isShow" :position="{longitude:mark.longitude,latitude:mark.latitude}"
                                @open="openORclose('open',i)" @close="openORclose('close',i)">
                            <h4 style='margin:0 0 5px 0;padding:0.2em 0'>{{mark.name}}</h4>
                            <div>经度：{{mark.longitude}}</div>
                            <div>纬度：{{mark.latitude}}</div>
                            <div>
                                <button @click="enter(mark)" style='color:blue;cursor:pointer;border:none;padding:0;background:none;'>比中情况</button>
                            </div> 
                        </BInfo>
                    </BMarker>
                </BMarkCluster>
            </OffBMap>

            <div class="markNum">
                <!-- <span>设备总数:<i @click="enterDevice('')">{{markNum.all}}</i></span> -->
                <span>已地图标记:<i @click="enterDevice(1)">{{markNum.is}}</i></span>
                <span>未地图标记:<i @click="enterDevice(2)">{{markNum.no}}</i></span>
            </div>
        </div>
        <el-dialog custom-class="content" :visible.sync="ratioInfo.isDialog" :title="ratioInfo.deviceName+' 比中情况'" center width="90%" :close-on-click-modal="false">
            <PhotoTable :items="ratioInfo.items" :paginations="ratioInfo.paginations" :getPageData="ratioInfo.getPageData" :showBoxs="ratioInfo.showBox">
            </PhotoTable>
        </el-dialog>
        <PhotoInfo :row="ratioInfo.row" :showDrawer.sync="ratioInfo.showDrawer"></PhotoInfo>
    </div>
    
</template>

<script>
import OffBMap from "@/components/offBMap/OffBMap"
import BMarkCluster from "@/components/offBMap/BMarkCluster"
import BMarker from "@/components/offBMap/BMarker"
import BInfo from "@/components/offBMap/BInfo"

import PhotoTable from "@/components/PhotoTable"
import PhotoInfo from "@/components/PhotoInfo"

export default {
    data(){
        return {
            center: {
                longitude: 114.408,
                latitude: 30.455,
            },
            maxZoom: 15,
            minZoom: 4,
            zoom: 12,
            items: [
                // {longitude:114.434417,latitude:30.505971,name:'设备一',terminalInfoId:"123"},
                // {longitude:114.464420,latitude:30.505960,name:'设备二',terminalInfoId:"456"},
                // {longitude:114.432430,latitude:30.515950,name:'设备三',terminalInfoId:"789"},
                // {longitude:114.454417,latitude:30.555971,name:'设备四',terminalInfoId:"123"},
                // {longitude:114.494420,latitude:30.555960,name:'设备五',terminalInfoId:"456"},
                // {longitude:114.442430,latitude:30.545950,name:'设备六',terminalInfoId:"789"},
                // {longitude:114.414417,latitude:30.535971,name:'设备七',terminalInfoId:"123"},
                // {longitude:114.484420,latitude:30.575960,name:'设备八',terminalInfoId:"456"},
                // {longitude:114.472430,latitude:30.585950,name:'设备九',terminalInfoId:"789"},
                // {longitude:114.534417,latitude:30.565971,name:'设备十',terminalInfoId:"123"},
                // {longitude:114.564420,latitude:30.585960,name:'设备十一',terminalInfoId:"456"},
                // {longitude:114.532430,latitude:30.615950,name:'设备十二',terminalInfoId:"789"},
                // {longitude:114.634417,latitude:30.565971,name:'设备十三',terminalInfoId:"123"},
                // {longitude:114.664420,latitude:30.585960,name:'设备十四',terminalInfoId:"456"},
                // {longitude:114.632430,latitude:30.615950,name:'设备十五',terminalInfoId:"789"},
            ],
            brounds:[],//地图可视区域
            markNum:{
                is: 0,
                no: 0,
                all: 0,
            },
            timer: null,
            
            ratioInfo: {
                isDialog: false,
                deviceId: null,
                deviceName: null,
                items: [],
                paginations: {
                    total:1,
                    currentPage:1,
                    pageSize:10,
                    pageSizes:[10,20,30,50,100],
                    maxPage:1
                },
                getPageData:async function(plugin={}, headers={}){
                    Object.assign(this.ratioInfo.paginations,plugin);
                    let obj = {
                        pageNum:this.ratioInfo.paginations.currentPage,
                        pageSize:this.ratioInfo.paginations.pageSize,
                        search:{
                            deviceID:this.ratioInfo.deviceId
                        }
                    };
                    const {data} = await this.axios.post("ui/facehit/homelist", obj, {headers});
                    if(data.statusCode == 0){
                        this.ratioInfo.paginations.total= data.data.total;
                        this.ratioInfo.items = data.data.result;
                    }else{
                        this.ratioInfo.paginations.total = 0;
                        this.ratioInfo.items = [];
                    }
                }.bind(this),

                showDrawer: false,
                showBox: async function(row){
                    const {id} = row;
                    const {data} = await this.axios.post(`ui/facehit/get/${id}`,null,{headers:{noLoading:true}});
                    if(data.statusCode == 0){
                        if(data.data){
                            this.ratioInfo.showDrawer = true;
                            this.ratioInfo.row = data.data;
                        }else{
                            this.commonTip("没有详情",'tip_notice');
                        }
                
                    }
                }.bind(this),
                row: {}
            },
            
        }
    },
    components: {
        OffBMap, BMarkCluster, BMarker, BInfo, PhotoTable, PhotoInfo
    },
    mounted(){
        this.getCenter();
        this.getDeviceNum();
    },
    methods: {
        //点击标记
        clickMark(mark,i){
            this.$set(this.items[i],"isShow",!this.items[i].isShow);
            // this.center.latitude = mark.latitude;
            // this.center.longitude = mark.longitude;
        },
        openORclose(type,i){
            let bool = true;
            if(type == "close")bool=false;
            this.$set(this.items[i],"isShow",bool);
        },
        //比中详情
        async enter(mark){
            if(!mark.terminalInfoId){
                this.commonTip("没有设备ID",'tip_notice');
                return 
            }
            this.ratioInfo.deviceId = mark.terminalInfoId;
            this.ratioInfo.deviceName = mark.name;
            try{
                if(this.ratioInfo.paginations.pageSize!=10)await this.ratioInfo.getPageData();
            }catch(e){}

            this.ratioInfo.isDialog = true;
        },
        //获取地图中心坐标
        async getCenter(){
            const {data} = await this.axios.get("ui/systemInfo/getItude",{headers: {noLoading: true}});
            if(data.statusCode == 0){
                let str = data.data||"0,0";
                let arr = str.split(",");
                this.center = {
                    longitude: parseFloat(arr[0]),
                    latitude: parseFloat(arr[1]),
                };
            }
        },
        //获取所有标记设备
        async getAllDevice(){
            let obj={
                pageNum:-1,
                pageSize:-1,
                search:{
                    markType: 1,//已地图标记
                }
            };
            const {data}=await this.axios.post("ui/terminalInfo/list",obj);
            if(data.statusCode==0){
                this.items=data.data.result;
            }else {
                this.items=[];
            }
        },
        //获取标记和与未标记数量
        async getDeviceNum(){
            const {data} = await this.axios.get("ui/getMarkNum",{headers: {noLoading:true}});
            if(data.statusCode == 0){

                const is = isNaN(parseInt(data.data.markNum))?0:parseInt(data.data.markNum);
                const no = isNaN(parseInt(data.data.notMarkNum))?0:parseInt(data.data.notMarkNum);
                this.markNum = {
                    is, no,
                    all: is+no
                };
            }
        },
        //根据范围获取设备
        getBoundsDevice(){
            if(this.timer)return

            this.timer = setTimeout(async function(){
                clearTimeout(this.timer);
                this.timer = null;
                let obj = {
                    minLongitude: this.brounds[0].lng.toString(),
                    minLatitude: this.brounds[0].lat.toString(),
                    maxLongitude: this.brounds[1].lng.toString(),
                    maxLatitude: this.brounds[1].lat.toString(),
                };
                const {data} = await this.axios.post("ui/terminalBitmap/refresh", obj, {headers: {noLoading: true}});
                if(data.statusCode == 0&&data.data){
                    //移动时避免出现弹框消失
                    let openId = null;
                    for(let v of this.items){
                        if(v.isShow == true){
                            openId = v.id;
                            break
                        }
                    }
                    if(openId){
                        for(let v of data.data){
                            if(v.id == openId){
                                v.isShow = true;
                                break;
                            }
                        }
                    }
                    this.items = data.data||[];
                }else{
                    this.items = [];
                }
            }.bind(this), 1000);
    
        },

        //进入设备列表页面
        enterDevice(markType){
            this.$router.push({name: "device", params: {markType}});
        },

        //地图移动
        moveend(e){
            this.brounds = this.getBounds(e.target);
            this.getBoundsDevice();
        },
        //地图缩放
        zoomend(e){
            this.zoom = e.target.getZoom();
            this.brounds = this.getBounds(e.target);
            this.getBoundsDevice();
        },
        //获取地图可视区域
        getBounds(map){
            let brounds = map?map.getBounds():this.$refs.deviceMap.map.getBounds();
            let SouthWest = brounds.getSouthWest();
            let NorthEast = brounds.getNorthEast();
            return [SouthWest, NorthEast]
        },
    }
}
</script>

<style scoped lang="less">
.markNum{
    position: absolute;
    bottom: 20px;
    right: 40px;
    z-index: 9;
    span{
        margin-right: 20px;
        i{
            margin-left: 10px;
            font-style: normal;
            color: #4181FF;
            cursor: pointer;
        }
    }
}

/deep/.content.el-dialog{
    height: 80%;
    box-sizing: border-box;
    margin:5% auto 0!important;
    .el-dialog__header .el-dialog__title{
        color:rgba(255,255,255,0.8);
    }
    .el-dialog__body{
        padding-left: 0;
        padding-right: 0;
        flex:1;
        overflow: hidden;
        .main{
            height: 100%;
        }
    }
}
</style>


