<!-- echart -->
<template>
    <div class="myChart" :id="id" :ref="id" :style="style"></div>
</template>

<script>
import echarts from "echarts/lib/echarts"
// 引入折线图等组件
import "echarts/lib/chart/line"
import "echarts/lib/chart/bar"
import "echarts/lib/chart/pie"
// 引入提示框和title组件，图例
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/title'
import 'echarts/lib/component/legend'
import 'echarts/lib/component/legendScroll'//图例翻译滚动
import 'echarts/lib/component/graphic'
import {ProxySetTimeout} from "@/common/common"

export default {
    data () {
        return {
            myChart : null,
        };
    },

    props : {
        id : {
            type : String,
            required : true,
        },
        option : {
            type : Object,
            required : true,
        },
        style : {
            type :Object,
        }
    },

    components: {},

    computed: {},

    mounted(){
        this.myChart = echarts.init(this.$refs[this.id]);
        this.myChart.setOption(this.option);
        
        //确保高度100%
        this.$nextTick(()=>{
            const pHeight = this.$refs[this.id].offsetHeight;
            const height = this.$refs[this.id].firstChild.offsetHeight;
            if(pHeight > height||pHeight < height)this.myChart.resize();
        });

        if(this.myChart){
            this.resize = new ProxySetTimeout(this.myChart.resize, 100);
            window.addEventListener("resize", this.resize);
        }
    },

    watch:{
        'option':{
            immediate:false,
            handler:function(){
                if(this.myChart)this.myChart.setOption(this.option);
            },
            deep:true,
        }
        
    },

    methods: {},

    destroyed(){
        if(this.myChart)window.removeEventListener("resize", this.resize);
    }
}

</script>
<style lang='less' scoped>
.myChart{
    width:100%;
    min-height:10px;

}
</style>