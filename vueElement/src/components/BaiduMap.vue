<!-- 百度地图 -->
<template>
    <baidu-map ref="map" class="map" ak='Q7qVxsuKAZ23ibDj8fDcnzahwgBO0cmu' @ready="handler" :mapClick="false" @click="getLocationPoint"
        :center="{lng:map.longitude,lat:map.latitude}" :zoom="map.zoom" :scroll-wheel-zoom="true" >
        <bm-map-type  :map-types="['BMAP_HYBRID_MAP','BMAP_NORMAL_MAP']" anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-map-type>
        <!-- <bm-city-list anchor="BMAP_ANCHOR_TOP_RIGHT" :offset="{width:100,height:8}"></bm-city-list> -->
        <!-- <bm-scale anchor="BMAP_ANCHOR_TOP_LEFT"></bm-scale>
        <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT" ></bm-navigation> -->
        <bm-marker v-for="(path,index) of paths" :key="index" :position='path' :clicking="false"></bm-marker>
        <bm-marker v-for="(path,index) of paths" :key="index" :position='path' :offset="{width:0,height:-50}" :icon="{url:path.icon,size:{width:50,height:50}}" @click="selectImg(path,index)">
            <!-- <bm-info-window :show="path.isShowInfo" @close="path.isShowInfo=false" @open="path.isShowInfo=true">{{path}}</bm-info-window> -->
        </bm-marker>
        <bm-polyline  :path='paths' stroke-color="red" :stroke-opacity="0.5" :stroke-weight="2"></bm-polyline>
        <bm-geolocation anchor="BMAP_ANCHOR_BOTTOM_RIGHT" :showAddressBar="true" :autoLocation="true"></bm-geolocation>   
    </baidu-map>
</template>

<script>
import Vue from 'vue'
import {BaiduMap,BmMapType,BmMarker,BmPolyline,BmGeolocation} from "vue-baidu-map"

export default {
    data () {
        return {
             map:{
                longitude:0,//经度
                latitude:0,//纬度
                zoom:3,//地图展示级别
            },
            
        };
    },
        
    props:{
        markData:{
            type:Array
        }
    },
    
    components:{BaiduMap,BmMapType,BmMarker,BmPolyline,BmGeolocation},

    mounted(){
    },

    computed:{
        paths:function(){
            return this.markData.map(val=>{
                val.lng=val.longitude;
                val.lat=val.latitude;
                if(!val.icon.includes('data:image/png;base64,'))val.icon=`data:image/png;base64,${val.icon.replace(/\\n/g,'\n')}`;
                return val
            })
        }
    },
    
    methods:{
        handler({BMap,map}){
            this.map.zoom=15;
            if(!this.markData.length){
                const geolocation=new BMap.Geolocation();
                geolocation.getCurrentPosition(val=>{
                    this.map.longitude=val.longitude;
                    this.map.latitude=val.latitude;
                },{enableHighAccuracy: true});
            }
            
        },

        getLocationPoint(e){
            // this.map.longitude=e.point.lng;
            // this.map.latitude=e.point.lat;
        },

        selectImg(){
            this.$emit("selectImg",...arguments);
        }
    },

    watch:{
       markData:{
           immediate:true,
           handler:function(ne){
               if(ne.length){
                   this.map.longitude=ne[0].longitude;
                   this.map.latitude=ne[0].latitude;
               }
               
           }
       } 
    }
}

</script>
<style lang="less">
.map{
    width:100%;
    height: 100%;

    /deep/.anchorBL {
        display: none;
    }

    .BMap_Marker{
        img[src^="data:image/png;base64,"]{
            width:100%;
        }
    }
}
</style>