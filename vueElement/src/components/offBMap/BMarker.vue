<template>
    <div>
        <slot></slot>
    </div>
</template>

<script>
import {overlay} from "./mixin"
import {bindE} from "./common";

export default {
    name:"BMarker",
    mixins : [overlay],
    data(){
        return{
            type:"overlay",
        }
    },
    props:{
        //位置
        position : {
            type : Object,
            required : true,
        },
        icon : {
            type : Object,//{url,size:{width,height}}
        },
        animation : {
            type: String,
        },
        clicking : {
            type : Boolean,
            default : true,
        },
        dragging : {
            type : Boolean,
            default : false,
        },
        offset: {
            type : Object,
        },
        title: {
            type: String
        },
        top: {
            type: Boolean,
            default: false
        },
        zIndex: {
            type: Number,
            default: 0
        }
    },

    watch:{
        'position.longitude' (val, oldVal) {
            const {originInstance, position, renderByParent, $parent} = this
            if (val !== oldVal && val >= -180 && val <= 180) {
                originInstance.setPosition(new BMap.Point(val, position.latitude));
            }
            renderByParent && $parent.reload()
        },
        'position.latitude' (val, oldVal) {
            const {originInstance, position, renderByParent, $parent} = this
            if (val !== oldVal && val >= -74 && val <= 74) {
                originInstance.setPosition(new BMap.Point(position.longitude, val));
            }
            renderByParent && $parent.reload()
        },
        'offset.width' (val, oldVal) {
            const {originInstance} = this
            if (val !== oldVal) {
                originInstance.setOffset(new BMap.Size(val, this.offset.height))
            }
        },
        'offset.height' (val, oldVal) {
            const {originInstance} = this
            if (val !== oldVal) {
                originInstance.setOffset(new BMap.Size(this.offset.width, val))
            }
        },
        icon:{
            deep : true,
            handler(val){
                this.originInstance.setIcon(
                    new BMap.Icon(val.url,new BMap.Size(val.size.width, val.size.height))
                )
            }
        },
        animation(val, oldVal){
            if(val!=oldVal){
                this.originInstance.setAnimation(global[val]);
            }
        },
        clicking () {
            this.reload()
        },
        dragging (val) {
            val ? this.originInstance.enableDragging() : this.originInstance.disableDragging()
        },
        title (val) {
            this.originInstance.setTitle(val)
        },
        top (val) {
            this.originInstance.setTop(val)
        },
        zIndex (val) {
            this.originInstance.setZIndex(val)
        }
    },

    methods :{
        load(){
            const {map,renderByParent,$parent,clicking,dragging,icon,offset,title,top,zIndex} = this;
            let point = new BMap.Point(this.position.longitude, this.position.latitude);
            let marker = new BMap.Marker(point, {
                enableClicking: clicking,
                enableDragging: dragging,
                icon:icon&& new BMap.Icon(icon.url,new BMap.Size(icon.size.width, icon.size.height)),
                offset : offset&&new BMap.Size(offset.width, offset.height),
                title
            });
            this.originInstance = marker;
            marker.setTop(top);
            marker.setZIndex(zIndex);

            bindE.call(this, marker);

            if (renderByParent) {
                $parent.reload()
            } else {
                map.addOverlay(marker);
            }
            if(this.animation)marker.setAnimation(global[this.animation])
        }
    } 
}
</script>

