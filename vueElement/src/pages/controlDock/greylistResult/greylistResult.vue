<!-- 灰名单身份识别 -->
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
                    <span>{{$t("name1")}}:</span>
                    <el-input v-model="searchOption.name" :placeholder="$t('placeholder.input')" clearable></el-input>
                </div>
                <div class="search_item">
                    <span>{{$t("faceImageID")}}:</span>
                    <el-input v-model="searchOption.faceImageID" :placeholder="$t('placeholder.input')" clearable></el-input>
                </div>
                <div class="search_btns only">
                    <el-button type="primary" @click="search">{{$t("search")}}</el-button>
                </div>
            </div>

            <div class="main">
                <div class="main-table">
                    <div v-if="!items.length" class="empty_text">{{$t("noData")}}</div>
                    <el-row :gutter="20">
                        <el-col :xs="8" :sm="6" :md="4"  :lg="3" :xl="2" v-for="(row,k) in items" :key="k">
                            <el-card shadow="hover">
                                <el-image :src="row.XP|baseToImg" :alt="$t('image')" @click.native="showBox(row)"></el-image>
                                <div class="cardInfo">
                                    <p>{{row.createTime}}</p>
                                    <p><span>{{$t("name1")}}:</span><span>{{row.XM||"--"}}</span></p>
                                    <p><span>{{$t("similarity")}}:</span><span>{{row.RXXSD!=null?row.RXXSD:"--"}}</span></p>
                                </div>
                            </el-card>      
                        </el-col>
                    </el-row>
                </div>
                <Pagination :paginations="paginations" @changeDate='getPageData' :resize="true"/> 
            </div>
        </div>
        <el-drawer custom-class="myDrawer" :title="$t('details')" :visible.sync="showDrawer" direction="rtl" size="60%" :before-close="()=>{this.showDrawer=false;setTimeout(()=>this.row={})}">
            <div class="drawer_content">
                <el-image :src="row.XP|baseToImg"></el-image>
                <div class="Box">
                    <div class="Info">
                        <p><span>{{$t("faceImageID")}}:</span><span>{{row.RXXPID||"--"}}</span></p>
                        <p><span>{{$t("name1")}}:</span><span>{{row.XM||"--"}}</span></p>
                        <p><span>{{$t("gender")}}:</span><span>{{row.XBDM||"--"}}</span></p>
                        <p><span>{{$t("ethic")}}:</span><span>{{row.MZDM||"--"}}</span></p>
                        <p><span>{{$t("identificationCard")}}:</span><span>{{row.GMSFHM||"--"}}</span></p>
                        <p><span>{{$t("personBirth")}}:</span><span>{{row.CSRQ||"--"}}</span></p>
                        <p><span>{{$t("residenceNo")}}:</span><span>{{row.HJDZ_SSXQDM}}</span></p>
                        <p><span>{{$t("residenceAddress")}}:</span><span>{{row.HJDZ_QHNXXDZ||"--"}}</span></p>
                    </div>
                </div>     
            </div>
        </el-drawer>
    </div>
</template>

<script>
import {basicPage} from "@/common/mixin"

export default {
    mixins:[basicPage],

    data () {
        return {
            searchOption:{
                faceImageID:null,
                times:null,
                name:null,
            },
            deviceList:[{id:null,name:this.$t("all")}],
        };
    },

    props : {},

    components: {},

    computed: {},

    mounted(){},

    methods: {
        //分页
        async getPageData(plugin={}){
            Object.assign(this.paginations,plugin);
            let obj={
                pageNum:this.paginations.currentPage,
                pageSize:this.paginations.pageSize,
                searchBy:"name",
                keyword:this.searchOption.name,
                search:{
                    faceImageID:this.searchOption.faceImageID,
                    startTime:this.searchOption.times?this.searchOption.times[0]:null,
                    endTime:this.searchOption.times?this.searchOption.times[1]:null,
                }
            }
            const {data} =await this.axios.post("ui/graylist/listResult",obj);
            if(data.statusCode==0){
                this.paginations.total=data.data.total;
                this.items=data.data.result;

            }else{
                this.paginations.total=0;
                this.items=[];
            }

        },
        
    }
}

</script>
<style lang='less' scoped>
</style>