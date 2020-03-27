<template>
    <span>
        <slot></slot>
    </span>
</template>
<script>
import {overlay} from "./mixin"
export default {
    name:"BMarkCluster",
    mixins: [overlay],
    data(){
        return{
            type:"markerClusterer",
        }
    },
    props:{
        maxZoom : {
            type : Number,
            default : 15
        },

    },
    watch:{
        maxZoom (val) {
            const {originInstance} = this
            originInstance.setMaxZoom(val);
        },
    },
    methods:{
        load(){
            const {map,maxZoom} = this;
            this.originInstance = new BMapLib.MarkerClusterer(map, {
                maxZoom,
            });

            this.$nextTick(() => {
                const markers = this.$children.map(inst => inst.originInstance).filter(marker => marker instanceof BMap.Marker);
                this.originInstance.addMarkers(markers);
            })
        }
    },
    beforeCreate () {
        this.preventChildrenRender = true
    }
}
</script>

