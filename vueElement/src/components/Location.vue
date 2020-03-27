<template>
    <div class="location_box">
        <OffBMap ref="location" id="location" :center="mark" :zoom="zoom" :maxZoom="maxZoom" :minZoom="minZoom" @zoomend="zoomend">
            <BMarker :position="mark" animation="BMAP_ANIMATION_BOUNCE"></BMarker>
        </OffBMap>
        <div class="position_icon el-icon-position" title="回原点" @click="goOrigin"></div>
    </div>
    
</template>

<script>
import OffBMap from "@/components/offBMap/OffBMap"
import BMarker from "@/components/offBMap/BMarker"

export default {
    data(){
        return {
            maxZoom: 15,
            minZoom: 4,
            zoom: 12,
        }
    },
    props: {
       mark: {
           type: Object,
           required: true,
       } 
    },
    components: {
        OffBMap, BMarker
    },
    methods: {
        //地图缩放
        zoomend(e){
            this.zoom = e.target.getZoom();
        },

        //回到原点
        goOrigin(){
            const centerP = new BMap.Point(this.mark.longitude, this.mark.latitude);
            this.$refs.location.map.centerAndZoom(centerP, this.zoom);
        },
    }

}
</script>
<style lang="less">
.location_map.el-dialog{
    height: 80%;
    box-sizing: border-box;
    margin:5% auto 0!important;
    padding: 0;
    display: flex;
    flex-direction: column;
    background: #2d283e;
    .el-dialog__header{
        padding-top: 10px;
        .el-dialog__title{
            color:rgba(255,255,255,0.8);
        }
        button{
            top: 10px;
        }
    }
    .el-dialog__body{
        padding: 0;
        flex:1;
    }

    .location_box{
        width: 100%;
        height: 100%;
        position: relative;

        .position_icon{
            position: absolute;
            right: 40px;
            bottom: 40px;
            cursor: pointer;
            color: #4181FF;
            font-size: 24px;
        }
    }
}
</style>

