<!-- pTip -->
<template>
    <p ref="p">
        <el-tooltip v-if="content" :disabled="disabled" effect="dark" :content="content" placement="top" :enterable="false">
            <span ref="span" @mouseenter="mouseenter">{{content}}</span>
        </el-tooltip>
        <el-tooltip v-else :disabled="disabled" effect="dark" placement="top" :enterable="false">
            <div slot="content"><slot name="c"></slot></div>
            <div class="toolTip" ref="span" @mouseenter="mouseenter"><slot name="c"></slot></div>
        </el-tooltip>
    </p>
    
</template>

<script>
export default {
    data () {
        return {
            disabled : true,
        };
    },

    props : {
        content:{
            type : String,
        }
    },

    components: {},

    computed: {},

    mounted(){},

    methods: {
       mouseenter(e){
           if(this.$refs.p.offsetWidth <= this.$refs.span.offsetWidth){
               this.disabled = false;
           }else{
               this.disabled = true;
           }
       } 
    }
}

</script>
<style lang='less' scoped>
p{
    width :100%;
    span,.toolTip{
        display: inline-block;
        vertical-align: middle;
        max-width: 100%;
        white-space:nowrap;
        overflow: hidden;
        text-overflow:ellipsis;
    }
}
</style>