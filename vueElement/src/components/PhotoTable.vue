<template>
    <div class="main">
        <div class="main-table">
            <div v-if="!items.length" class="empty_text">{{$t("noData")}}</div>
            <el-row :gutter="20">
                <el-col :xs="8" :sm="6" :md="4"  :lg="3" :xl="2" v-for="(row,k) in items" :key="k">
                    <el-card shadow="hover" :class="card_style(row)">
                        <div class="photo_box">
                            <el-image :class="{'null':imgNull(row.faceImage)}" :src="row.faceImage|baseToImg" :alt="$t('image')">
                                <template slot="placeholder"><img :src="row.faceImage|baseToImg"></template>
                            </el-image>
                            <div class="photo_operate">
                                <span title="详情" class="el-icon-search" @click="showBoxs(row)"></span>
                                <slot name="operate" :row="row"></slot>
                            </div>
                        </div>
                        
                        <div class="cardInfo">
                            <pTip :content="row.createTime|timeFormat('MM-dd HH:mm:ss')"></pTip>
                            <template>
                                <pTip v-if="row.shotPlaceFullAdress" :content="row.shotPlaceFullAdress"></pTip>
                                <pTip v-else :content="row.imagePo?row.imagePo.ShotPlaceFullAdress||'--':'--'"></pTip>
                            </template>
                            <template>
                                <pTip :class="[val.type]" v-for="val in filterArr(warnFlagList,row.earlyWarningSign)" :key="val.id" 
                                    :content='row.faceHitBackgroundRecordPo?row.faceHitBackgroundRecordPo.managementCategoryName||val.name:val.name'>
                                </pTip>
                            </template>
                        </div>
                    </el-card>      
                </el-col>
            </el-row>
        </div>
        <Pagination :paginations="paginations" @changeDate='getPageData' :resize="true"/> 
    </div>
</template>

<script>
import {basicPage} from "@/common/mixin"
import pTip from "@/components/pTip"

export default {
    mixins:[basicPage],
    data(){
        return {
            warnFlagList: [
                {id:null,name:this.$t("all")},{id:1,name:this.$t("warn_red"),type:"red"},{id:2,name:this.$t("warn_orange"),type:"orange"},{id:3,name:this.$t("warn_yellow"),type:"yellow"},{id:4,name:this.$t("warn_no"),type:"no"},
            ],
        }
    },
    props:{
        items: {
            type: Array,
            default: [],
        },
        paginations: {
            type: Object,
            required: true,
        },
        getPageData: {
            type: Function,
            required: true,
        },
        showBoxs: {
            type: Function,
            required: true,
        },

    },
    filters:{
        toTime(val){
            if(!val)return "--"
            val=val.toString();
            if(val.indexOf("-")!=-1)return val
            return val.slice(0,4)+"-"+val.slice(4,6)+"-"+val.slice(6,8)+" "+val.slice(8,10)+":"+val.slice(10,12)+":"+val.slice(12,14)
        }
    },
    components:{
        pTip
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

        card_style(){
            return function(row){
                const {earlyWarningSign, pushWaring = null} = row;
                let arrClass = [];
                switch(earlyWarningSign){
                    case 1:  arrClass.push('border_red');break;
                    case 2:  arrClass.push('border_orange');break;
                    case 3:  arrClass.push('border_yellow');break;
                    case 4:  arrClass.push('border_no');break;
                }
                if(pushWaring == true)arrClass.push('pushWaringS');
                else if(pushWaring == false)arrClass.push('pushWaringF');

                return arrClass.join(" ")
            }
        }
    },
}
</script>

<style lang="less" scoped>
.photo_box{
    position: relative;
    height: auto;
    &:hover{
        .photo_operate{
            display: block;
        }
    }

    /deep/ .el-image{
        cursor: default!important;
        img{
            cursor: default!important;
        }
    }
  
    @height:30px;
    .photo_operate{
        display: none;
        position: absolute;
        width: 100%;
        bottom: 3px;
        line-height: @height;
        background: rgba(255,255,255, 0.1);
    }
}
</style>
<style lang="less">
.main .el-row .photo_operate{
    span{
        margin-left: 4px;
        cursor: pointer;
        color:#4181FF;
        font-size: 20px;
        vertical-align: middle;
    }
}
</style>



