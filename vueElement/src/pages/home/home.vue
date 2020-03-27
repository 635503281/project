<!-- 大屏首页 -->
<template>
    <div class="home">
        <div class="content">
            <div class="main">
                <div class="home_top">
                    <div class="home_chunk top_left">
                        <h4 class="home_title">人像比对
                            <ul class="setComparionTime">
                                <li :class="{'active':v.day==comparisonTime}" v-for="(v,i) in comparisonTimeList" :key="i" @click="setComparionTime(v.day)">{{v.name}}</li>
                            </ul>  
                        </h4>
                        <div class="home_box">
                            <div class="comparison">
                                <div>
                                    <el-progress type="circle" :percentage="comparisonRate.allRate" color="#7E72F2" :stroke-width="16"></el-progress>
                                    <el-progress class="all-ratio" type="circle" :percentage="comparisonRate.ratioRate" color="#FF4A4C" :stroke-width="16" :show-text="false"></el-progress>
                                    <p><span>{{comparisonNum.allNum|toMoneyFormat}}</span>
                                        <span>比对总数</span>
                                    </p>
                                </div>
                                <div>
                                    <el-progress type="circle" :percentage="comparisonRate.ratioRate" color="#FF4A4C" :stroke-width="16"></el-progress>
                                    <p><span>{{comparisonNum.ratioNum|toMoneyFormat}}</span>
                                        <span>比中数</span>
                                    </p>
                                </div>
                                <div>
                                    <el-progress type="circle" :percentage="comparisonRate.noRatioRate" color="#7E72F2" :stroke-width="16"></el-progress>
                                    <p><span>{{comparisonNum.noRatioNum|toMoneyFormat}}</span>
                                        <span>未比中数</span>
                                    </p>
                                </div>

                                <div class="comparison_max">
                                    <el-progress type="circle" :percentage="comparisonRate.comparsionRate" color="#00CE7D" :stroke-width="16" :show-text="false"></el-progress>
                                    <p><span>{{comparisonNum.comparsionMaxNum|toMoneyFormat}} <i>/&nbsp;h</i></span>
                                        <span>比对峰值</span>
                                    </p>
                                </div>
                                <div class="alarm_time">
                                    <el-progress type="circle" :percentage="comparisonRate.grayRate" color="#FE7C45" :stroke-width="16" ></el-progress>
                                    <div class="alarm_timeText">
                                        <p><span>{{comparisonNum.grayReqNum|toMoneyFormat}}</span>
                                            <span>灰名单请求数</span>
                                        </p>
                                        <p><span>{{comparisonNum.grayResultNum|toMoneyFormat}}</span>
                                            <span>灰名单接收数</span>
                                        </p>
                                    </div>
                                 </div>
                            </div>
                        </div>
                    </div>
                    <div class="home_chunk top_right">
                        <h4 class="home_title">实时抓拍 <i class="el-icon-arrow-right" @click='()=>this.$router.push({name:"comparison"})' ></i></h4>
                        <div class="home_box overflow_auto" style="overflow-y:hidden;">
                            <div class="photo" v-for="(v,i) in photoList" :key="i">
                                <el-image :class="{'null':imgNull(v.Data)}" :src="v.Data|baseToImg">
                                    <template slot="placeholder"><img :src="v.Data|baseToImg"></template>
                                </el-image>
                                <div>
                                    <span class="photo_icon el-icon-location"></span>
                                    <p>{{v.createTime|toTime1Format}}</p>
                                </div>
                            </div>
                            <span class="noData" v-if="!photoList.length">
                                <i v-show="loadingPhoto" class="el-icon-loading"></i>
                                <span v-show="!loadingPhoto">暂无数据</span>
                            </span>
                        </div>
                    </div>
                </div>

                <div class="home_foot">
                    <div class="foot_left">
                        <div class="home_chunk left_top">
                            <h4 class="home_title">比中信息</h4>
                            <div class="home_box">
                                <div class="line_search">
                                    <el-date-picker type="daterange" v-model="times" range-separator="~" :start-placeholder="$t('startTime')" :end-placeholder="$t('endTime')" 
                                        value-format="yyyy-MM-dd" prefix-icon="el-icon-arrow-down" :picker-options="defaultTime.day_pickerOptions(7)"  @change="selectTime">
                                    </el-date-picker>
                                </div>
                                <Echart :option="option_alarm" id="line1"></Echart>
                                <div class="alarm_table">
                                    <div>
                                        <span>状态</span><span>红色预警</span><span>橙色预警</span><span>黄色预警</span><span>不预警</span>
                                    </div>
                                    <div>
                                        <span>最大值</span><span>{{alarm.tableData.red.max||0}}</span><span>{{alarm.tableData.orange.max||0}}</span>
                                        <span>{{alarm.tableData.yellow.max||0}}</span><span>{{alarm.tableData.no.max||0}}</span>
                                    </div>
                                    <div>
                                        <span>最小值</span><span>{{alarm.tableData.red.min||0}}</span><span>{{alarm.tableData.orange.min||0}}</span>
                                        <span>{{alarm.tableData.yellow.min||0}}</span><span>{{alarm.tableData.no.min||0}}</span>
                                    </div>
                                    <div>
                                        <span>平均值</span><span>{{alarm.tableData.red.average||0}}</span><span>{{alarm.tableData.orange.average||0}}</span>
                                        <span>{{alarm.tableData.yellow.average||0}}</span><span>{{alarm.tableData.no.average||0}}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="left_foot">
                            <div class="home_chunk foot_l">
                                <h4 class="home_title">运行状态 <i class="el-icon-arrow-right" @click='()=>this.$router.push({name:"runStatus"})'></i></h4>
                                <div class="home_box">
                                    <div class="runStatus">
                                        <div class="cpuUser">
                                            <span>处理器使用率(%)</span>
                                            <el-progress :percentage="runStatus.cpuRate" color="#7E72F2"></el-progress>
                                        </div>
                                        <div class="cpuUser">
                                            <span>内存使用率(%)</span>
                                            <el-progress :percentage="runStatus.storageRate" color="#00CE7D"></el-progress>
                                        </div>
                                        <div class="cpuUser">
                                            <span>磁盘分区最大使用率(%)</span>
                                            <el-progress :percentage="runStatus.diskRate" color="#FF4A4C"></el-progress>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="home_chunk foot_m">
                                <h4 class="home_title">采集设备 <i class="el-icon-arrow-right" @click='()=>this.$router.push({name:"device"})'></i></h4>
                                <div class="home_box">
                                    <div class="deviceStatus">
                                        <div class="online">
                                            <el-progress type="circle" :percentage="deviceStatus.onlineRate" color="#00CE7D" :stroke-width="16"></el-progress>
                                            <p><span>{{deviceNum.onlineNum|toMoneyFormat}} <i>台</i></span>
                                               <span>在线设备</span>
                                            </p>
                                        </div>
                                        <div class="outline">
                                            <el-progress type="circle" :percentage="deviceStatus.outlineRate" color="#928F9A" :stroke-width="16"></el-progress>
                                            <p><span>{{deviceNum.outlineNum|toMoneyFormat}} <i>台</i></span>
                                               <span>离线设备</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div class="home_chunk foot_r">
                                <h4 class="home_title">特征数据 <i class="el-icon-arrow-right" @click='()=>this.$router.push({name:"featureData"})'></i></h4>
                                <div class="home_box" style="padding:0;">
                                    <div class="featureDate">
                                        <p><span>{{featureData.recentUpdateNum|toMoneyFormat}}</span><span>最近更新特征数</span></p>
                                        <p><span style="font-size:12px;">{{featureData.updateTime|timeFormat('MM-dd HH:mm:ss')}}</span><span>最近更新时间</span></p>
                                    </div>
                                    <div class="featureDate_pie">
                                        <Echart :option="option_featureData" id="featureDate_pie"></Echart>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="home_chunk foot_right">
                        <h4 class="home_title">实时比中 <i class="el-icon-arrow-right" @click='()=>this.$router.push({name:"ratioInfo"})'></i></h4>
                        <div class="home_box column overflow_auto">
                            <div class="ratio" v-for="(v,i) in ratioList" :key="i">
                                <el-image :class="{'null':imgNull(v.faceImage)}" :src="v.faceImage|baseToImg">
                                    <template slot="placeholder"><img :src="v.faceImage|baseToImg"></template>
                                </el-image>
                                <div class="ratio_info">
                                    <!-- <p><span>{{$t("personName")}}:</span>
                                        <span>{{v.faceHitBackgroundRecordPo&&v.faceHitBackgroundRecordPo.personName?v.faceHitBackgroundRecordPo.personName:"--"}}</span>
                                    </p> -->
                                    <p><span>{{$t("similarity")}}:</span><span>{{v.similarity|toPercentage}}</span></p>
                                    <p>{{v.createTime}}</p>
                                    <template>
                                        <pTip v-if="v.shotPlaceFullAdress" :content="v.shotPlaceFullAdress"></pTip>
                                        <pTip v-else :content="v.imagePo?v.imagePo.ShotPlaceFullAdress||'--':'--'"></pTip>
                                    </template>
                                    <!-- <template>
                                        <pTip :class="[val.type]" v-for="val in filterArr(warnFlagList,v.earlyWarningSign)" :key="val.id">
                                            <template v-if="v.faceHitBackgroundRecordPo" v-slot:c>
                                                <span v-for="va in filterArr(warnTypeList,v.faceHitBackgroundRecordPo.warningType)" :key="va.id">
                                                    {{va.name == "--"?val.name:va.name}}
                                                </span>
                                            </template>
                                            <span v-else v-slot:c>{{val.name}}</span>
                                        </pTip>
                                    </template> -->
                                    <template>
                                        <pTip :class="[val.type]" v-for="val in filterArr(warnFlagList,v.earlyWarningSign)" :key="val.id" 
                                            :content='v.faceHitBackgroundRecordPo?v.faceHitBackgroundRecordPo.managementCategoryName||val.name:val.name'>
                                        </pTip>
                                    </template>
                                </div>
                            </div>
                            <span class="noData" v-if="!ratioList.length">
                                <i v-show="loadingRatio" class="el-icon-loading"></i>
                                <span v-show="!loadingRatio">暂无数据</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import {toMoneyFormat, _toFixed} from "@/common/method"
import pTip from "@/components/pTip"
import eVue from "@/common/event"

//告警颜色
const color_red = "#FF4A4C";
const color_yellow = "#FFC802";
const color_orange = "#FE7C45";
const color_no = "#00CE7D"; 
//饼状图中第二个文字的颜色
const color_pie_p2 = "#928F9A";
//直线图刻度线的颜色
const color_line_mark = "#3a354a";
const color_xy = '#928F9A';

export default {
    data () {
        return {
            timerTime:10*60*1000,//定时刷新时间
            timer:null,//定时刷新器

            times:this.defaultTime.day(7,'daterange'),
            alarm:{
                list:[
                    // { time:"2019-12-01 17:10:00",redNum:120,orangeNum:220, yellowNum:150,noNum:820},
                ],

                tableData:{
                    red:{ max:0, min:0, average:0},
                    orange:{ max:0, min:0, average:0},
                    yellow:{ max:0, min:0, average:0},
                    no:{ max:0, min:0, average:0}
                }
            },
            option_alarmD:{
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
                    axisPointer: {//鼠标滑动出现横线
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                legend: {//图例组件
                    left:"3%",
                    top:1,
                    textStyle:{
                        color:"#fff",
                        padding:[2,0,0,5],
                    },
                    icon:"circle",//图例图标的形状
                    itemWidth:10,//图例图标的大小
                    itemGap:30,//间距
                    inactiveColor:color_xy,//取消的颜色
                    data:['红色预警','橙色预警','黄色预警','不预警'],
                },
                color:[color_red,color_orange,color_yellow,color_no],
                toolbox: {
                    feature: {
                        // saveAsImage: {}
                    }
                },
                grid: {//主体部分，直角坐标系内绘图网格
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    top:"60px",
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        // type :"time",
                        // splitNumber:7,//x轴显示的分割数
                        boundaryGap : false,
                        axisLabel:{//x轴刻度样式
                            color:color_xy,
                            formatter:v=>{
                                let format = "MM-dd";
                                if((new Date(this.times[1]) - new Date(this.times[0]))<24*60*60*1000)format = "HH:mm"

                                if(v)return new Date(v.replace(new RegExp(/-/gm) ,"/")).format(format)
                                else return v
                            }
                            
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
                                // type:'dashed',//虚线
                            },
                        }
                    }
                ],
                series : [
                    {
                        name:'红色预警',
                        type:'line',
                        smooth:true,  //这个是把线变成曲线
                        areaStyle: {opacity :0.2},//覆盖的区域
                        data:[]
                    },
                    {
                        name:'橙色预警',
                        type:'line',
                        smooth:true,
                        areaStyle: {opacity :0.2},
                        data:[]
                    },
                    {
                        name:'黄色预警',
                        type:'line',
                        smooth:true,
                        areaStyle: {opacity :0.2},
                        data:[]
                    },
                    {
                        name:'不预警',
                        type:'line',
                        smooth:true,
                        // label: {
                        //     normal: {
                        //         show: true,
                        //         position: 'top'
                        //     }
                        // },
                        areaStyle: {opacity :0.2},
                        data:[]
                    }
                ]
            },

            comparisonNum:{
                allNum:0,//对比总数
                ratioNum:0,//比中数
                noRatioNum:0,//未比中数

                comparsionMaxNum:0,//比对峰值
                comparsionAverageNum:0,//比对平均值

                alarmMaxTime:0,//最大警响应时间
                alarmAverageTime:0,//平均报警响应时间

                grayReqNum:0,//灰名单请求总数
                grayResultNum:0,//灰名单接收总数
            },
            comparisonTime:1,
            comparisonTimeList:[
                {name:"今天",day:1},{name:"7天",day:7},{name:"30天",day:30},{name:"全部",day:-1},
            ],
               
            loadingPhoto:false,
            photoList:[
                // {Data:"",createTime:""},
            ],

            loadingRatio:false,
            warnFlagList:[
                {id:1,name:this.$t("warn_red"),type:"red"},{id:2,name:this.$t("warn_orange"),type:"orange"},{id:3,name:this.$t("warn_yellow"),type:"yellow"},{id:4,name:this.$t("warn_no"),type:"no"},
            ],
            ratioList:[
                // {faceImage:"",faceHitBackgroundRecordPo:{personName:"张三"}, createTime:"2019-12-03 20:30:00",similarity:0.8,earlyWarningSign:1},
            ],

            featureData:{
                featureLabNum:0,//特征库数
                recentUpdateNum:0,//最近更新特征数
                updateTime:null,//最近更新时间

                redNum:0,//红色预警个数
                orangeNum:0,//橙色预警,
                yellowNum:0,//黄色预警       
                noNum:0,//不预警
            },

            runStatus:{
                cpuRate:0,//处理器使用率
                storageRate:0,//内存使用率
                diskRate:0,//磁盘使用率
            },

            deviceNum:{
                onlineNum:0,//在线设备
                outlineNum:0,//不在线设备
            },

            warnTypeList:[
                {id:"1",name:"全国在逃"},{id:"2",name:"全国布控"},{id:"3",name:"全国治安重点人"},{id:"4",name:"本地布控"},{id:"5",name:"地方治安重点人"}
            ]

        };
    },

    filters: {
        toTime1Format(val){
            let time = new Date(val.replace(new RegExp(/-/gm) ,"/")).format("HH:mm:ss");
            return time
        }
    },

    components: {
        Echart:()=>import("@/components/Echart"),
        pTip,
    },

    computed: {
        //过滤数据循环
        filterArr(){
            return function(list,id){
                let arr=list.filter(val=>val.id==id);
                if(!arr.length)arr=[{id,name:"--",type:"no"}];
                return arr
            }
        },

       imgNull(){
            return function(val){
                if(val == null||val == "null")return true
                else{
                    if(!val)return false
                    let arr = val.split("/").reverse();
                    const newVal = arr[0];
                    if(newVal == null|| newVal == "null")return true
                    else return false
                }
                    
            }
       },

        //人像比对占比
        comparisonRate(){
            let allRate = 0, ratioRate = 0, noRatioRate = 0, comparsionRate = 0, alarmRate = 0 ,grayRate = 0;
            let {allNum, ratioNum, noRatioNum, comparsionMaxNum, comparsionAverageNum, alarmMaxTime, alarmAverageTime, grayReqNum, grayResultNum} = this.comparisonNum;
            if(!allNum)allNum = 1;
            if(!ratioNum)ratioNum = 0;
            if(!noRatioNum)noRatioNum = 0;
            if(!comparsionMaxNum)comparsionMaxNum = 1;
            if(!alarmMaxTime)alarmMaxTime = 1;
            if(!grayReqNum)grayReqNum = 1;
            if(!grayResultNum)grayResultNum = 0;
            
            ratioRate = _toFixed(100*ratioNum/allNum, 1);
            noRatioRate = _toFixed(100*noRatioNum/allNum, 1);
            allRate = _toFixed(ratioRate + noRatioRate, 1);
            comparsionRate = _toFixed(100*comparsionAverageNum/comparsionMaxNum, 1);
            alarmRate = _toFixed(100*alarmAverageTime/alarmMaxTime, 1);
            grayRate = _toFixed(100*grayResultNum/grayReqNum, 1);
            return {allRate, ratioRate, noRatioRate, comparsionRate, alarmRate, grayRate}
        },

        //告警配置
        option_alarm(){
            let {list} = this.alarm;
            if(!list)list = [];

            let redArr = [], orangeArr = [], yellowArr = [], noArr = [];
            if(list.length){
                this.option_alarmD.title.show = false;
                list.sort((a,b)=>new Date(a.time) - new Date(b.time)).forEach(v=>{
                    redArr.push([v.time, v.redNum]);
                    orangeArr.push([v.time, v.orangeNum]);
                    yellowArr.push([v.time, v.yellowNum]);
                    noArr.push([v.time, v.noNum]);
                });
            }else{
                this.option_alarmD.title.show = true;
            }
            this.option_alarmD.series[0].data = redArr;
            this.option_alarmD.series[1].data = orangeArr;
            this.option_alarmD.series[2].data = yellowArr;
            this.option_alarmD.series[3].data = noArr;
            
            return { ...this.option_alarmD} 
        },

        //设备占比
        deviceStatus(){
            let onlineRate = 0, outlineRate = 0;
            let {onlineNum,outlineNum} = this.deviceNum;
            if(!onlineNum)onlineNum = 0;
            if(!outlineNum)outlineNum = 0;
            
            const all = (onlineNum + outlineNum)==0?1:onlineNum + outlineNum;
            onlineRate = _toFixed(100*(this.deviceNum.onlineNum)/all, 1);
            outlineRate = _toFixed(100*(this.deviceNum.outlineNum)/all, 1);
            return {onlineRate, outlineRate} 
        },

        //特征数据
        option_featureData(){
            let {redNum, orangeNum, yellowNum, noNum} = this.featureData;
            if(!redNum)redNum = 0;
            if(!orangeNum)orangeNum = 0;
            if(!yellowNum)yellowNum = 0;
            if(!noNum)noNum = 0;
            let all = redNum + orangeNum + yellowNum + noNum;

            return {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a}<br>{b}: {c}({d}%)"
                },
                color:[color_red,color_orange,color_yellow,color_no],
                graphic:[
                    {
                        type: 'text',
                        left :"center",
                        top: "40%",
                        style :{
                            text: toMoneyFormat(all),
                            textAlign: 'center',
                            fill: '#fff',
                            font: '13px "Microsoft YaHei"'
                        }
                    },
                    {
                        type: 'text',
                        left :"center",
                        top: "54%",
                        style :{
                            text: "特征总数",
                            textAlign: 'center',
                            fill: color_pie_p2,
                            font: '12px "Microsoft YaHei"'
                        }
                    }
                ],
                series: [
                    {
                        name:'特征库分布',
                        type:'pie',
                        radius: ['50%', '64%'],
                        avoidLabelOverlap: true,
                        animation: false,
                        label: {
                            show: true,
                            formatter:({value})=>toMoneyFormat(value),
                            fontSize:10,
                        },
                        labelLine: {
                            show: true,
                            length:4,
                            length2:10,
                            smooth: 0.2,
                        },
                        data:[
                            {value:redNum, name:'红色预警',label:{show:redNum?true:false},labelLine:{show:redNum?true:false}},
                            {value:orangeNum, name:'橙色预警',label:{show:orangeNum?true:false},labelLine:{show:orangeNum?true:false}},
                            {value:yellowNum, name:'黄色预警',label:{show:yellowNum?true:false},labelLine:{show:yellowNum?true:false}},
                            {value:noNum, name:'不预警',label:{show:noNum?true:false},labelLine:{show:noNum?true:false}},
                        ],
                     
                    }
                ]
            }
        },

    },

    mounted(){
        this.getAlarm();
        this.getPhoto();
        this.getRatio();
        this.getComparison();
        this.getFeatureData();
        this.getRunStatus();
        this.getDeviceStatus();

        //监听屏幕
        (function(_this){
            let timer=null;
            _this.onresize=()=>{
                if(timer)return false
                timer = setTimeout(() => {
                    clearTimeout(timer);
                    timer = null;
                    let height = document.documentElement.clientHeight;
                    if(height<900){
                        _this.option_alarmD.grid.top = "40px";
                    }else{
                        _this.option_alarmD.grid.top = "60px";
                    }
                }, 500);
            }
            let height = document.documentElement.clientHeight;
            if(height<900)_this.option_alarmD.grid.top = "40px";
            
            window.addEventListener("resize",_this.onresize);
        })(this);
        
        //监听socket推送
        eVue.$on("comparison", ()=>{
            this.getPhoto({responseError: true});
        });
        eVue.$on("ratio", ()=>{
            this.getRatio({responseError: true});
        });

        //定时刷新
        this.timer = setInterval(()=>{
            this.getAlarm();
            this.getComparison();
            this.getFeatureData();
            this.getRunStatus();
            this.getDeviceStatus();
        },this.timerTime);
    },

    methods: {
        //选择比对时间
        setComparionTime(day){
            if(this.comparisonTime == day)return;
            this.comparisonTime = day;
            this.getComparison();
        },

        //获取人像对比
        async getComparison(){
            const {data} = await this.axios.post("ui/image/hit/count",{days: this.comparisonTime} ,{ headers:{noLoading:true}});
            if(data.statusCode == 0&&data.data){
                this.comparisonNum = data.data;
            }
        },

        //选择比中时间
        selectTime(){
            this.getAlarm();
        },

        //获取比中(告警)信息
        async getAlarm(){
            let obj = {
                search:{
                    startTime: this.times?this.times[0]:null,
                    endTime: this.times?this.times[1]:null,
                }
            }
            const {data} = await this.axios.post("ui/facehit/listCurveAndTableData",obj,{ headers:{noLoading:true}});
            if(data.statusCode == 0){
                this.alarm.list = data.data||[];
                
                if(data.tableData){//处理数据
                    if(!data.tableData.red)data.tableData.red = { max:0, min:0, average:0};
                    if(!data.tableData.orange)data.tableData.orange = { max:0, min:0, average:0};
                    if(!data.tableData.yellow)data.tableData.yellow = { max:0, min:0, average:0};
                    if(!data.tableData.no)data.tableData.no = { max:0, min:0, average:0};
                    this.alarm.tableData = data.tableData;
                }
                  
            }
        },

        //获取特征数据
        async getFeatureData(){
            const {data} = await this.axios.post("ui/feature/count",null,{ headers:{noLoading:true}});
            if(data.statusCode == 0&&data.data){
                this.featureData = data.data;
            }
        },

        //获取设备状态
        async getDeviceStatus(){
            const {data} = await this.axios.post("ui/device/count",null, {headers: {noLoading: true}});
            if(data.statusCode == 0&&data.data){
                this.deviceNum = data.data;
            }
        },

        //获取运行状态
        async getRunStatus(){
            const {data} = await this.axios.post("ui/run/status/count",null, {headers: {noLoading: true}});
            if(data.statusCode == 0&&data.data){
                this.runStatus = data.data;
            }
        },

        //实时抓拍
        async getPhoto(headers={}){
            let obj = {
                pageNum : 1,
                pageSize : 10,
                search:{
                    startTime:this.defaultTime.day(1)[0],
                    endTime:this.defaultTime.day(1)[1],
                }
            };
            this.loadingPhoto = true;
            try{
                const {data} = await this.axios.post('ui/image/homelist',obj,{ headers:Object.assign({noLoading:true},headers)});
                if(data.statusCode == 0 &&data.data&&data.data.result){
                    this.photoList = data.data.result;
                }
                this.loadingPhoto = false;
            }catch(e){
                this.loadingPhoto = false;
            }
           
        },

        //实时比中
        async getRatio(headers={}){
            this.loadingRatio = true;
            try{
                const {data} = await this.axios.post('ui/facehit/homelist',{pageNum:1,pageSize:10},{ headers:Object.assign({noLoading:true},headers)});
                if(data.statusCode ==0 &&data.data&&data.data.result){
                    this.ratioList = data.data.result;
                }
                this.loadingRatio = false;
            }catch(e){
                this.loadingRatio = false;
            }
            
        },

    },

    destroyed(){
        eVue.$off("comparison");
        eVue.$off("ratio");
        if(this.onresize)window.removeEventListener("resize",this.onresize);
        if(this.timer)clearInterval(this.timer);
    },
}

</script>
<style lang='less' scoped>
@import url("../../css/base.less");

.home{
    height: 100%;
    .content{
        margin:0;
        padding:0;
        height:100%;
        box-sizing: border-box;
        background-color: @background_base;
        box-shadow: none;
    }
}

.content .main{
    height: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    color: #fff;
    
    //各个模块
    .home_chunk{
        border-radius: 2px;
        background-color: @block;
    }

    .home_title{
        @line_height:40px;
        margin:0;
        line-height: @line_height;
        text-indent: 10px;
        border-bottom:1px solid @title_bc;
        
        i{
           float:right;
           line-height: @line_height;
           margin-right:10px;
           font-size:12px;
           color:@color1;
           cursor: pointer;
        }

        .setComparionTime{
            float: right;
            margin: 0;
            padding: 0;
            &::after{
                content:"";
                display: block;
                width:0;
                clear: both;
            }
            li{
                float: left;
                line-height: @line_height;
                height: @line_height;
                list-style: none;
                padding:0 15px;
                text-indent: 0;
                color:@color1;
                font-size:12px;
                cursor: pointer;
                &.active{
                    color:#fff;
                }
            }
        }
    }
    .home_box{
        flex: 1;
        display: flex;
        position: relative;
        padding:@home_p;

        &.column{
            flex-direction: column;
        }
        &.overflow_auto{
            overflow: auto;

            &::-webkit-scrollbar{
                background-color: @block;
                width:10px;
                height: 10px;
            }
            &::-webkit-scrollbar-thumb{
                background-color:#3e3a4e;
                border-radius: 2px;
            }
   
        }

        /deep/ .myChart{
            flex: 1;
            width:100%;
        }
        // 饼状图
        .pie1{
            flex:1;
            display: flex;
            flex-direction: column;
            align-items: center;
            
            >div{
                p{
                    text-align: center;
                    margin: 0;
                    line-height: 30px;
                    &:nth-of-type(2){
                        color: @color1;
                    }
                    
                }
            }   
            
        }

        //曲线图
        #line1{
            margin-top:20px;
            flex:2;
        }
        .line_search{
            position: absolute;
            top:20px + 10px;
            right:4%;
            z-index:9;

            .el-range-editor{
                background-color: transparent;
                border:none;
                padding:0;
                padding-right:18px;
                width:auto;

                &.is-active /deep/ .el-icon-arrow-down{
                    transform: rotateZ(180deg);
                }
                /deep/ .el-icon-arrow-down{//箭头
                    position: absolute;
                    right:0;
                    top:0;
                    line-height: 28px;
                    cursor: pointer;
                    transition: all 0.3s linear;
                }

                /deep/ .el-range__close-icon{
                    display: none;
                }

                /deep/ input{
                    background-color: transparent;
                    color:#fff;
                    width:80px;
                }
                /deep/ .el-range-separator{
                    color:#fff;
                    padding:0;
                    line-height: 28px;
                }
            }
        }
        .alarm_table{
            flex: 1;
            margin-top:80px;
            margin-bottom:1%;
            display: flex;
            justify-content: space-around;
            border-left:1px solid @title_bc;
            border-bottom:1px solid @title_bc;
            >div{
                display: flex;
                flex: 1;
                flex-direction: column;
                justify-content: space-around;
                
                span{
                    flex:1;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    overflow: hidden;
                    word-break:keep-all;
                    border-top:1px solid @title_bc;
                    border-right:1px solid @title_bc;
                    font-size:12px;
                    &:first-of-type{
                        color:@color1;
                    }
                }
               
            }
        }   
        
        //特征数据
        .featureDate{
            position: absolute;
            height:100%;
            width:40%;
            // flex:2;
            // margin-right: 10px;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            overflow: hidden;
            p{
                margin:0;
                span{
                    display: block;
                    text-align: center;
                    line-height: 24px;
                    &:nth-of-type(1){
                        font-size:16px;
                    }
                    &:nth-of-type(2){
                        font-size:12px;
                        color:@color1;
                    }
                }
     
            }
        }
        .featureDate_pie{
            margin-left:25%;
            flex:1;
            display: flex;
            flex-direction: column;
            .myChart{
                flex:1;
            }
        }

        //实时抓拍
        .photo{
            display: flex;
            flex-direction: column;
            margin-right:10px;
            min-width: 80px;
            max-width:100px;
            /deep/ .el-image{
                flex:1;
                min-width: 80px;
                max-width:100px;
                max-height: 120px;
                min-height: 100px;
            }
            >div {
                .photo_icon{
                    display: inline-block;
                    position: relative;
                    width:100%;
                    height: 0;
                    border-top:1px solid @photo_c;
                    font-size :12px;
                    margin-top:13px;
                    color:@photo_c;
                    &::before{//图标
                        display: inline-block;
                        position: absolute;
                        left:50%;
                        transform: translate(-50%,-100%);
                    }
                    &::after{
                        display: inline-block;
                        content:"";
                        width:10px;
                        border-top:1px solid @photo_c;
                        position: absolute;
                        right:-10px;
                        top:-1px;   
                    }
                }

                p{
                    margin:4px 0;
                    text-align: center;
                }
            }

            &:last-of-type{
                /deep/ .el-image{
                    padding-right:10px;
                }
                >div{
                    .photo_icon::after{
                        border-top:none;
                    }
                }
            }
        }

        //实时比中
        .ratio{
            display: flex;
            margin-bottom:10px;
            padding-bottom:10px;
            border-bottom:1px solid @photo_c;
            min-height: 100px;
            max-height: 120px;
            height: auto;

            &:last-of-type{
               margin-bottom:0; 
            }

            /deep/ .el-image{
                min-width: 80px;
                max-width:100px;
                max-height: 120px;
                min-height: 100px;
                .el-image__error, .el-image__placeholder{
                    min-width: 100px;
                }
            }

            .ratio_info{
                flex:1;
                margin-left: 20px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                p{
                    margin:0;
                    line-height: 20px;
                    white-space: nowrap;
                    &:nth-of-type(3){
                        color:@color1;
                    }

                    span:not(.el-tag):nth-of-type(1){
                        margin-right:10px;
                        color:@color1;
                    }    
                }
            }
        }

        //运行状态
        .runStatus{
            width:100%;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            >div span{
                color:@color1;
                font-size:12px;
            }
            /deep/ .el-progress{
                .el-progress-bar{
                    padding-right:0;

                    .el-progress-bar__outer{
                        background-color: #3e3a4e;
                    }
                }
                .el-progress__text{
                    position: absolute;
                    top:-14px;
                    right:0;
                    color:#fff;
                    font-size:14px!important;
                }
            }
        }

        //人像比对 设备状态
        .comparison,.deviceStatus{
            width :100%;
            display: flex;
            justify-content: space-around;
            >div{
                flex:1;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
                margin:20px 0;
                
                &:not(:last-of-type){
                    border-right:1px solid @title_bc;
                }

                /deep/.el-progress {
                    width:50%;
                    height: auto;
                    max-height: 80px;
                    max-width: 80px;
                    .el-progress-circle{
                        width:100%!important;
                        height: auto!important;
                        svg{
                            max-height: 80px;
                            max-width: 80px;
                        }
                    }
                    svg path:first-child{
                        stroke: #3e3a4e;
                    }
                    .el-progress__text{
                        color:#fff;
                        font-size:14px!important;
                    }
                }

                p{
                    text-align: center;
                    margin:0;
                    span{
                        display: block;
                        margin:10px 0;
                        font-size:16px;
                        i{
                            font-size:14px;
                            font-style: normal;
                        }
                    }
                    span:nth-of-type(2){
                        color:@color1;
                        font-size:12px;
                    }
                }
            }
        }
        .comparison{
            >div{
                position: relative;
                /deep/ .all-ratio{
                    position: absolute;
                    top:0;
                    left: 50%;
                    transform: translateX(-50%);
                    svg path:first-child{
                        stroke:transparent;
                    }
                }
                /deep/.el-progress svg path:first-child{
                    stroke-dasharray:4!important;
                }
            }

            .comparison_max,.alarm_time{
                /deep/ .el-progress .el-progress-circle{
                    position: relative;
                    &::after{
                        content:"";
                        display: inline-block;
                        position: absolute;
                        top:50%;
                        left:50%;
                        width:24px;
                        height: 24px;
                        transform: translate(-50%,-50%);  
                    }
                }
                .alarm_timeText{
                    width: 100%;
                    display: flex;
                    justify-content: space-around;
                }
            }
            .comparison_max /deep/ .el-progress .el-progress-circle:after{
                background-image: url("../../img/home/comparion_max.png");
                background-size: cover;
            }
            // .alarm_time /deep/ .el-progress .el-progress-circle:after{
            //    background-image: url("../../img/home/alarm_time.png");
            //    background-size: cover;
            // }

        }

        //暂无数据
        .noData{
            color:@color1;
            flex:1;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    .home_top{
        flex: 2;
        display: flex;
        overflow: hidden;
        margin-bottom: @margin;
        .top_left{
            flex: 2;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            margin-right: @margin;
            
        }
        .top_right{
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
         
        }
    }

    .home_foot{
        flex: 5;
        display: flex;
        overflow: hidden;
        .foot_left{
            flex: 2;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            margin-right: @margin;
            .left_top{
                flex: 3;
                display: flex;
                flex-direction: column;
                overflow: hidden;
                margin-bottom: @margin;

            }
            .left_foot{
                flex: 2;
                display: flex;
                overflow: hidden;
                .foot_l{
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    margin-right: @margin;
                
                }
                .foot_m{
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    margin-right: @margin;
                }
                .foot_r{
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    // overflow: hidden;
                   
                }
            }
        }
        .foot_right{
            flex: 1;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            
        }
    }

    @media screen and (max-height:900px){
        .home_title{
            @line_height:30px;
            line-height: @line_height;
            i{
                line-height: @line_height;
            }

            .setComparionTime li{
                height: @line_height;
                line-height: @line_height;
            }
        }

        .home_box{

            //曲线图
            #line1{
                margin-top:0;
            }
            .line_search{
                top:10px;
            }
            .alarm_table{
                margin-top:40px;
            }
            
            .comparison,.deviceStatus{
                >div {
                    margin:10px 0;
                    /deep/ .el-progress {
                        width:30%;
                        .el-progress__text{
                            font-size:12px!important;
                        }
                    }

                    p span{
                        margin: 5px 0;
                    }
                }

                .comparison_max,.alarm_time{
                    /deep/ .el-progress .el-progress-circle::after{
                        width:18px;
                        height: 18px;
                    }
                }

            }

            .deviceStatus>div /deep/ .el-progress{
                width:40%;
            }
        }
    }
    @media screen and (max-height:700px){
        .home_box{
            .comparison,.deviceStatus{
                >div {
                    margin:0;
                    /deep/ .el-progress {
                        width:28%;
                    }
                }
            }
            .deviceStatus>div /deep/ .el-progress{
                width:34%;
            }

        }
    }
    
}

</style>