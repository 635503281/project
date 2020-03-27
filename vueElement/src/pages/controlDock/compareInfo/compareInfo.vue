<!-- 比对信息 -->
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
                    <span>{{$t("deviceID")}}:</span>
                    <el-input v-model="searchOption.deviceID" :placeholder="$t('placeholder.input')" clearable></el-input>
                </div>
                <div class="search_btns">
                    <el-button type="primary" @click="search">{{$t("search")}}</el-button>
                </div>
            </div>

            <div class="main">
                <div class="main-table">
                    <el-table max-height="100%" ref="compareInfo_table" :data="items" style="width: 100%" :empty-text="$t('noData')" @selection-change="val=>this.selectItems=val" 
                        @row-click="row=>this.$refs['compareInfo_table'].toggleRowExpansion(row)">
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <div class="expand">
                                    <div v-if="scope.row.faceImage">
                                        <p>{{$t("faceImage")}}</p>
                                        <img :src="scope.row.faceImage|baseToImg">
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="deviceID" :label="$t('deviceID')" min-width="180" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="no" :label="$t('index_no')" min-width="150" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="sid" :label="$t('sid')" min-width="150" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <!-- <el-table-column prop="head" :label="$t('headID')" min-width="150" :formatter="(r,c,value)=>value||'--'"></el-table-column> -->
                        <!-- <el-table-column prop="resultID" :label="$t('resultID')" min-width="150" :formatter="(r,c,value)=>String(value==null?'--':value)"></el-table-column> -->
                        <el-table-column prop="compareTime" :label="$t('compareTime')" width="140" :formatter="(r,c,value)=>new Date(value).format('yyyy-MM-dd HH:mm:ss')||'--'"></el-table-column>
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

export default {
    mixins:[basicPage],

    data () {
        return {
            searchOption:{
                times:null,
                id:null,
                deviceID:null,
            },
        };
    },

    props : {},

    components: {},

    computed: {},

    mounted(){
        if(this.$route.params.id)this.searchOption.id=parseFloat(this.$route.params.id);

        this.getPageData();
    },

    methods: {
        //分页
        async getPageData(plugin={}){
            Object.assign(this.paginations,plugin);
            let obj={
                pageNum:this.paginations.currentPage,
                pageSize:this.paginations.pageSize,
                searchBy:"deviceID",
                keyword:this.searchOption.deviceID,
                search:{
                    startTime:this.searchOption.times?this.searchOption.times[0]:null,
                    endTime:this.searchOption.times?this.searchOption.times[1]:null,
                    id:this.searchOption.id
                }
            }
            const {data}=await this.axios.post("ui/nofacehit/list",obj);
            if(data.statusCode==0){
                this.paginations.total=data.data.total;
                this.items=data.data.result;
            }else{
                this.paginations.total=0;
                this.items=[];
            }
        }
    }
}

</script>
<style lang='less' scoped>
.expand{
    margin-left: 50px;
    display: flex;
    >div{
        text-align: center;
        margin-right:10px;
        max-width:50%;
        img{
            max-width:100%;
            max-height: 500px;
        }
    }
}
</style>