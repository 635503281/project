<!-- 百度离线地图 -->
<template>
    <div :ref="this.id||'view'" style="width: 100%; height: 100%">
        <slot></slot>
    </div>
</template>

<script>
import {bindE} from "./common";
export default {
    name: "OffBMap",
    data(){
        return {
            map : null,//地图
        }
    },

    props : {
        id : {
            type : String,
            required : false,
        },
        //中心 经度,纬度
        center : {
            type : Object,
            required : true,
            
        },
        //初始缩放
        zoom :{
            type : Number,
            // default : 12,
        },
        maxZoom:{
            type : Number,
        },
        minZoom : {
            type : Number,
        },
        mapType: {
            type: String
        },
        mapStyle: {
            type: Object
        },
        theme: {
            type: Array
        },
        scrollWheelZoom: {
            type: Boolean,
            default: true
        },
    },

    watch : {
        center(val, oldVal){
            const centerP = new BMap.Point(val.longitude, val.latitude);
            map.centerAndZoom(centerP, this.zoom);
        },
        'center.longitude' (val, oldVal) {
            const {map, zoom, center} = this;
            if (val !== oldVal && val >= -180 && val <= 180) {
                map.centerAndZoom(new BMap.Point(val, center.latitude), zoom)
            }
        },
        'center.latitude' (val, oldVal) {
            const {map, zoom, center} = this;
            if (val !== oldVal && val >= -74 && val <= 74) {
                map.centerAndZoom(new BMap.Point(center.longitude, val), zoom)
            }
        },
        zoom (val, oldVal) {
            const {map} = this
            if (val !== oldVal && val >= this.minZoom && val <= this.maxZoom) {
                map.setZoom(val)
            }
        },
        minZoom (val) {
            const {map} = this
            map.setMinZoom(val)
        },
        maxZoom (val) {
            const {map} = this
            map.setMaxZoom(val)
        },
        mapType (val) {
            const {map} = this
            map.setMapType(global[val])
        },
        theme (val) {
            const {map} = this
            map.setMapStyle({styleJson: val})
        },
        'mapStyle.features': {
            handler (val, oldVal) {
                const {map, mapStyle} = this
                const {style, styleJson} = mapStyle
                map.setMapStyle({
                    styleJson,
                    features: val,
                    style
                })
            },
            deep: true
        },
        'mapStyle.style' (val, oldVal) {
            const {map, mapStyle} = this
            const {features, styleJson} = mapStyle
            map.setMapStyle({
                styleJson,
                features,
                style: val
            })
        },
        'mapStyle.styleJson': {
            handler (val, oldVal) {
                const {map, mapStyle} = this
                const {features, style} = mapStyle
                map.setMapStyle({
                    styleJson: val,
                    features,
                    style
                })
            },
            deep: true
        },
        mapStyle (val) {
            const {map, theme} = this
            !theme && map.setMapStyle(val)
        },
        scrollWheelZoom (val) {
            const {map} = this
            val ? map.enableScrollWheelZoom() : map.disableScrollWheelZoom()
        },
    },

    mounted(){
        if (this.map) {
            return
        }
        let $el = this.$refs[this.id||'view'];
        this.map = new BMap.Map($el, {
         
        });
        const {minZoom,maxZoom,mapType,map,theme, mapStyle,scrollWheelZoom} = this;
        minZoom && map.setMinZoom(minZoom)
        maxZoom && map.setMaxZoom(maxZoom)
        mapType && map.setMapType(global[mapType]);
        scrollWheelZoom ? map.enableScrollWheelZoom() : map.disableScrollWheelZoom();

        theme ? map.setMapStyle({styleJson: theme}) : map.setMapStyle(mapStyle);
        bindE.call(this, this.map);

        this.map.reset();
        const centerP = new BMap.Point(this.center.longitude, this.center.latitude);
        this.map.centerAndZoom(centerP, this.zoom);
        this.$emit('ready');
    },

    methods : {
    },

}
</script>

<style>
.BMap_cpyCtrl , .anchorBL{
    display:none; 
}
</style>
