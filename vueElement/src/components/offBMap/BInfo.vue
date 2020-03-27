<template>
    <div v-show="show">
        <slot></slot>
    </div>
</template>
<script>
import {overlay} from "./mixin"
import {bindE} from "./common"
export default {
    name:"BInfo",
    mixins : [overlay],
    data(){
        return{
            type:"overlay",
        }
    },
    props:{
        show:{
            type : Boolean,
            default : false,
        },
        position:{
            type : Object
        },
        title: {
            type: String
        },
        width: {
            type: Number
        },
        height: {
            type: Number
        },
        maxWidth: {
            type: Number
        },
        offset: {
            type: Object
        },
        maximize: {
            type: Boolean
        },
        autoPan: {
            type: Boolean
        },
        closeOnClick: {
            type: Boolean,
            default: true
        },
        message: {
            type: String
        }
    },
    watch: {
        show (val) {
            val ? this.openInfoWindow() : this.closeInfoWindow();
        },
        'position.longitude' (val, oldVal) {
            this.reload();
        },
        'position.latitude' (val, oldVal) {
            this.reload();
        },
        'offset.width' (val, oldVal) {
            this.reload()
        },
        'offset.height' (val) {
            this.reload()
        },
        maxWidth () {
            this.reload()
        },
        width (val) {
            this.originInstance.setWidth(val)
        },
        height (val) {
            this.originInstance.setHeight(val)
        },
        title (val) {
            this.originInstance.setTitle(val)
        },
        maximize (val) {
            val ? this.originInstance.enableMaximize() : this.originInstance.disableMaximize()
        },
        autoPan (val) {
            val ? this.originInstance.enableAutoPan() : this.originInstance.disableAutoPan()
        },
        closeOnClick (val) {
            val ? this.originInstance.enableCloseOnClick() : this.originInstance.disableCloseOnClick()
        }
    },
    methods:{
        redraw () {
            this.originInstance.redraw();
        },
        load(){
            const {show, $parent, map, $el, width, height, title, maxWidth, offset, autoPan, closeOnClick, message,maximize} = this;
            const $content = $el;
            const Info = new BMap.InfoWindow($content,{
                width,
                height,
                title,
                maxWidth,
                offset:offset&&new BMap.Size(offset.width, offset.height),
                enableAutoPan: autoPan,
                enableCloseOnClick: closeOnClick,
                enableMessage: typeof message === 'undefined',
                message
            });
            maximize ? Info.enableMaximize() : Info.disableMaximize();
            bindE.call(this,Info);
            this.originInstance = Info;
            Info.redraw();

            [].forEach.call($content.querySelectorAll('img'), $img => {
                $img.onload = () => Info.redraw();
            });
            this.bindObserver();
            this.$container = $parent.originInstance && $parent.originInstance.openInfoWindow ? $parent.originInstance : map;
            show && this.openInfoWindow();
        },
        bindObserver () {
            const MutationObserver = global.MutationObserver
            if (!MutationObserver) {
                return
            }
            const {$el, originInstance} = this
            this.observer = new MutationObserver(mutations => originInstance.redraw())
            this.observer.observe($el, {attributes: true, childList: true, characterData: true, subtree: true})
        },
        openInfoWindow(){
            const {$container,originInstance,position} = this;
            $container.openInfoWindow(originInstance, new BMap.Point(position.longitude, position.latitude));
        },
        closeInfoWindow () {
            this.$container.closeInfoWindow(this.originInstance);
        }
    }
}
</script>

