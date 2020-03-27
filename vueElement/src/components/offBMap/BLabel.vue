<script>
import {overlay} from "./mixin"
import {bindE} from "./common";

export default {
    name : "BLabel",
    mixins : [overlay],
    data(){
        return{
            type : "overlay"
        }
    },
    props: {
        content: {
            type: String
        },
        title: {
            type: String
        },
        offset: {},
        position: {},
        labelStyle: {},
        zIndex: {
            type: Number,
            default: 0
        },
        massClear: {
            type: Boolean,
            default: true
        }
    },
    watch: {
        content (val) {
            this.originInstance.setContent(val);
        },
        title (val) {
            this.originInstance.setTitle(val);
        },
        'offset.width' (val, oldVal) {
            if (val.toString() !== oldVal.toString()) {
                this.originInstance.setOffset(new BMap.Size(val, this.offset.height));
            }
        },
        'offset.height' (val, oldVal) {
            if (val.toString() !== oldVal.toString()) {
                this.originInstance.setOffset(new BMap.Size(this.offset.width, val));
            }
        },
        'position.longitude' (val, oldVal) {
            if (val.toString() !== oldVal.toString() && val >= -180 && val <= 180) {
                this.originInstance.setCenter(new BMap.Point(val, this.position.latitude))
            }
        },
        'position.latitude' (val, oldVal) {
            if (val.toString() !== oldVal.toString() && val >= -74 && val <= 74) {
                this.originInstance.setCenter(new BMap.Point(this.position.longitude, val))
            }
        },
        labelStyle: {
            handler (val) {
                this.originInstance.setStyle(val)
            },
            deep: true
        },
        zIndex (val) {
            this.originInstance.setZIndex(val)
        },
        massClear (val) {
            val ? this.originInstance.enableMassClear() : this.originInstance.disableMassClear()
        }
  },
  methods: {
    load () {
      const {map, content, title, offset, position, labelStyle, zIndex, massClear, $parent} = this
      const overlay = new BMap.Label(content, {
        offset: new BMap.Size(offset.width,offset.height),
        position: new BMap.Point(position.width,position.height),
        enableMassClear: massClear
      })
      this.originInstance = overlay
      try {
        $parent.originInstance.setLabel(overlay)
      } catch (e) {
        map.addOverlay(overlay)
      }
      title && overlay.setTitle(title)
      labelStyle && overlay.setStyle(labelStyle)
      zIndex && overlay.setZIndex(zIndex)
      bindE.call(this, overlay);
    }
  }
}
</script>
