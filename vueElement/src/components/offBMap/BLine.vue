<template>
    <div></div>
</template>
<script>
import {overlay} from "./mixin"
import {bindE} from "./common";
export default {
    name:"BLine",
    mixins : [overlay],
    data(){
        return{
            type:"overlay",
        }
    },
    props: {
        path: {
            type: Array
        },
        strokeColor: {
            type: String
        },
        strokeWeight: {
            type: Number
        },
        strokeOpacity: {
            type: Number
        },
        strokeStyle: {
            type: String
        },
        massClear: {
            type: Boolean,
            default: true
        },
        clicking: {
            type: Boolean,
            default: true
        },
        editing: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        path: {
            handler (val, oldVal) {
                this.reload()
            },
            deep: true
        },
        strokeColor (val) {
            this.originInstance.setStrokeColor(val)
        },
        strokeOpacity (val) {
            this.originInstance.setStrokeOpacity(val)
        },
        strokeWeight (val) {
            this.originInstance.setStrokeWeight(val)
        },
        strokeStyle (val) {
            this.originInstance.setStrokeStyle(val)
        },
        editing (val) {
            val ? this.originInstance.enableEditing() : this.originInstance.disableEditing()
        },
        massClear (val) {
            val ? this.originInstance.enableMassClear() : this.originInstance.disableMassClear()
        },
        clicking (val) {
            this.reload()
        }
    },
    methods: {
        load () {
            const {map, path, strokeColor, strokeWeight, strokeOpacity, strokeStyle, editing, massClear, clicking} = this
            const overlay = new BMap.Polyline(path.map(item => new BMap.Point(item.longitude, item.latitude)), {
                strokeColor,
                strokeWeight,
                strokeOpacity,
                strokeStyle,
                enableEditing: editing,
                enableMassClear: massClear,
                enableClicking: clicking
            })
            this.originInstance = overlay;
            map.addOverlay(overlay);
            bindE.call(this, overlay);
        }
    }
}
</script>

