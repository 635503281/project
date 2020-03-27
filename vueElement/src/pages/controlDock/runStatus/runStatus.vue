<!-- 运行状态上报 -->
<template>
    <div>
        <!-- <el-breadcrumb class="myBreadcrumb">
            <el-breadcrumb-item v-for="(menu,i) in $route.meta.menus" :key="i" :to="menu.path||null">{{menu.name}}</el-breadcrumb-item>
        </el-breadcrumb> -->

        <div class="content">
            <div class="search">
                <div class="search_item">
                    <span>{{$t("selectTime")}}:</span>
                    <el-date-picker type="datetimerange" v-model="searchOption.times" range-separator="~" :start-placeholder="$t('startTime')" :end-placeholder="$t('endTime')"
                      value-format="yyyy-MM-dd HH:mm:ss" clearable>
                    </el-date-picker>
                </div>
                <div class="search_item">
                    <span>{{$t("warnInfo")}}:</span>
                    <el-select multiple collapse-tags v-model="searchOption.warnInfo" :placeholder="$t('placeholder.choose')" clearable>
                        <el-option v-for="(val,i) in warnInfoList" :key="i" :value="val.id" :label="val.name"></el-option>
                    </el-select>
                </div>
                <div class="search_btns">
                    <el-button type="primary" @click="search">{{$t("search")}}</el-button>
                </div>

                <div class="edition  right">
                    <p><span>上线时间：</span><span>{{edition.updateTime||"--"}}</span></p>
                    <p><span>版本信息：</span><span>{{edition.value||"--"}}</span></p>
                </div>
            </div>

            <div class="main">
                <Echart :option="option_L" id="line" style="height:40%;"></Echart>
                <div class="main-table">
                    <el-table max-height="100%" :data="items" style="width: 100%" :empty-text="$t('noData')" @selection-change="val=>this.selectItems=val">
                        <el-table-column prop="cloSyl" :label="$t('cloSyl')+'(%)'" min-width="150"></el-table-column>
                        <el-table-column prop="ncSyl" :label="$t('ncSyl')+'(%)'" min-width="150"></el-table-column>
                        <el-table-column prop="cpSyl" :label="$t('cpSyl')+'(%)'" min-width="150"></el-table-column>
                        <el-table-column prop="gjxxdm" :label="$t('warnInfo')" min-width="200" >
                            <template slot-scope="scope">
                                <template v-for="id in stringToArray(scope.row.gjxxdm)">
                                    <p class="warnInfo" :key="index" v-for="(val,index) in filterArr(warnInfoList,id)">{{val.name}}</p>
                                </template>
                            </template> 
                        </el-table-column>
                        <el-table-column prop="createTime" :label="$t('createTime')" width="140" sortable></el-table-column>
                    </el-table>
                </div>
                <Pagination :paginations="paginations" @changeDate='getPageData'/>
            </div>
        </div>
    </div>
</template>

<script>
import {basicPage} from "@/common/mixin"

//直线图刻度线的颜色
const color_line_mark = "#3a354a";
const color_xy = '#928F9A';
const color_pie_p2 = "#928F9A";

export default {
    mixins:[basicPage],

    data () {
        return {
            paginations:{//分页字段
                total:0,
                currentPage:1,
                pageSize:10,
                pageSizes:[10,20,30,50,100],
            },
            searchOption:{
                times:null,
                warnInfo:[],//告警信息
            },
            warnInfoList:[
                {id:"1",name:this.$t("warnInfo_1")},{id:"2",name:this.$t("warnInfo_2")},{id:"3",name:this.$t("warnInfo_3")},{id:"4",name:this.$t("warnInfo_4")},
            ],

            option_D:{
                title : {
                    show:false,
                    textStyle: {
                        color: color_pie_p2,
                        fontSize: 14,
                        fontWeight:100,
                    },
                    text:"暂无数据",
                    left: "center",
                    top: "center",
                },
                tooltip : {
                    trigger: 'axis',
                    formatter:function(params) {  
                        let relVal = params[0].name;
                        for (let i = 0, l = params.length; i < l; i++) {  
                            relVal += `<br/>${params[i].marker} ${params[i].seriesName} : ${params[i].value[1]}%`;
                        }
                        return relVal;  
                    },
                    axisPointer: {//鼠标滑动出现横线
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985',
                        }
                    }
                },
                legend: {//图例组件
                    right:"5%",
                    top:1,
                    textStyle:{
                        color:"#fff",
                        padding:[2,0,0,5],
                    },
                    icon:"circle",//图例图标的形状
                    itemWidth:10,//图例图标的大小
                    itemGap:30,//间距
                    inactiveColor:color_xy,//取消的颜色
                    data:['处理器使用率','内存使用率','磁盘分区使用率'],
                },
                color:['#7E72F2', '#00CE7D', '#FF4A4C'],
                grid: {//主体部分，直角坐标系内绘图网格
                    left: '3%',
                    right: '5%',
                    bottom: '6%',
                    top:"40px",
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        axisLabel:{//x轴刻度样式
                            color:color_xy,
                            // formatter:v=>{
                            //     let format = "yyyy-MM-dd HH:mm:ss";
                            //     return new Date(v.replace(new RegExp(/-/gm) ,"/")).format(format)
                            // } 
                        },
                        splitLine:{
                            show :false,
                        },
                        axisLine:{
                            show:false,
                        }
                    }
                ],
                yAxis : [
                    {
                        type : 'value',
                        axisLabel:{//y轴刻度样式
                            color:color_xy,
                            formatter:v=>`${v}%`,
                        },
                        axisLine:{//y轴是否显示
                           show :false,
                           lineStyle:{
                              color: color_line_mark,
                           }
                        },
                        splitLine: {//y轴刻度定的直线样式
                            lineStyle: {
                                color: color_line_mark,
                            },
                        }
                    }
                ],
                series : [
                    {
                        name:'处理器使用率',
                        type:'line',
                        smooth:true,  //这个是把线变成曲线
                        areaStyle: {opacity :0.2},//覆盖的区域
                        data:[]
                    },
                    {
                        name:'内存使用率',
                        type:'line',
                        smooth:true,
                        areaStyle: {opacity :0.2},
                        data:[]
                    },
                    {
                        name:'磁盘分区使用率',
                        type:'line',
                        smooth:true,
                        areaStyle: {opacity :0.2},
                        data:[]
                    }
                   
                ]
            },

            edition:{
                value:null,//版本信息
                updateTime:null,//更新时间
            }
        };
    },

    props : {},

    components: {
        Echart:()=>import("@/components/Echart"),
    },

    computed: {
        filterArr(){
            return function(list,id){
                let arr=list.filter(val=>val.id==id);
                if(!arr.length)arr=[{id,name:"--"}];
                return arr
            }
        },
        stringToArray(){
            return function(str,flag=","){
                if(!str)str='';
                let arr=str.split(flag);
                return arr;
            }
        },

        option_L(){
            let list = this.copy(this.items||[]);

            let cpu = [], memory = [], disk = [];
            if(list.length){
                this.option_D.title.show = false;
                list.filterSame("createTime").forEach(v=>{
                    cpu.unshift([v.createTime, v.cloSyl]);
                    memory.unshift([v.createTime, v.ncSyl]);
                    disk.unshift([v.createTime, v.cpSyl]);
                });
            }else{
                this.option_D.title.show = true;
            }
            this.option_D.series[0].data = cpu;
            this.option_D.series[1].data = memory;
            this.option_D.series[2].data = disk;

            return { ...this.option_D}
        }
    },

    mounted(){
        this.getEdition();
        this.getPageData();    
    },

    methods: {
        //分页
        async getPageData(plugin={}){
            Object.assign(this.paginations,plugin);
            let obj={
                pageNum:this.paginations.currentPage,
                pageSize:this.paginations.pageSize,
                searchBy:"gjxxdm",
                keyword:this.searchOption.warnInfo.join(","),
                orderType:"desc",
                orderBy: "createTime",
                search:{
                    startTime:this.searchOption.times?this.searchOption.times[0]:null,
                    endTime:this.searchOption.times?this.searchOption.times[1]:null,
                }
            };

            const {data}=await this.axios.post("ui/gateWayStatus/listInfo",obj);
            if(data.statusCode==0){
                this.paginations.total=data.data.total;
                this.items=data.data.result;
            }else {
                this.paginations.total=0;
                this.items=[];
            }
        },

        //获取版本信息
        async getEdition(){
            const {data} = await this.axios.post("ui/systemInfo/get",{name: "deployVersion"}, {headers:{noLoading: true}});
            if(data.statusCode == 0){
                this.edition = data.data.result[0];
            }
        },
    }
}

</script>
<style lang='less' scoped>
.warnInfo{
    margin:0;
}

.content{
    overflow: visible;
    .main{
        overflow: visible;
    }
}
.edition{
    float: right;
    min-width: 300px;
    p{
        margin:0;
        line-height: 24px;
        span{
            color:#928F9A;
            &:nth-of-type(2){
                margin-left:4px;
                color:#fff;
            }
        }
    }
} 
</style>
