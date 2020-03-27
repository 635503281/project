const getParent = $component => ($component.abstract || $component.$el === $component.$children[0].$el) ? getParent($component.$parent) : $component

export const overlay = {
    data(){
        return {

        }

    },

    mounted(){
        const $parent = getParent(this.$parent);
        const map = $parent.map;
        const {ready} = this;
        map ? ready() : $parent.$on('ready', ready);
    },

    computed : {
        renderByParent () {
            return this.$parent.preventChildrenRender
        }
    },

    methods : {
        ready(){
            const $parent = getParent(this.$parent);
            this.map = $parent.map;
            this.load();
            this.$emit('ready');
        },

        unload () {
            const {map, originInstance} = this;
            try{
                switch(this.type){
                    case "overlay":
                        map.removeOverlay(originInstance);
                    break; 
                    case "markerClusterer":
                        originInstance.clearMarkers();
                    break; 
                }

            }catch(e){}
           
        },

        reload () {
            this && this.$nextTick(() => {
              this.unload()
              this.$nextTick(this.load)
            })
        },  
    },

    beforeDestroy(){
        const {unload, renderByParent, $parent} = this;
        if (renderByParent) {
            $parent.reload()
            
        }
        unload();
    },
    destroyed(){
        const {unload, renderByParent, $parent} = this;
        if (renderByParent) {
            $parent.reload()
            
        }
        unload();
    }
}