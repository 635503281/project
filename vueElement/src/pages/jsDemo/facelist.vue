<!-- 优图组 -->
<template>
  <div class="js-box" style="height:100%">
    <!-- <el-breadcrumb class="myBreadcrumb">
      <el-breadcrumb-item v-for="(menu,i) in $route.meta.menus" :key="i" :to="menu.path||null">{{menu.name}}
      </el-breadcrumb-item>
    </el-breadcrumb> -->

    <div class="content" v-infinite-scroll="load" infinite-scroll-disabled="notLoad" infinite-scroll-immediate="false">
      <div class="main js-facelist">
        <div class="main-table">
          <el-row :gutter="20">
            <el-col :span="calListSpan" :key="index" v-for="(item,index) in items" @click.native="click(item)">
              <el-card class="card">
                <div align="center">
                  <img class="card-image" :src="item.data|baseToImg" alt="人像图片"/>
                </div>
                <div style="padding: 4px;" align="center">
                  <span>{{(item.grayPersonInfo==null) ? "未识别":(item.grayPersonInfo.XM ||"暂时未知")}}</span>
                  <div class="bottom clearfix">
                    <time class="time">{{ item.shotTime | formatDistance }}前</time>
                  </div>
                </div>
                <div align="center">
                  <span>{{ warningMsgInfo(item.backgroundRecord) }}</span>
                </div>
              </el-card>
            </el-col>
          </el-row>
          <!-- <Pagination :paginations="paginations" @changeDate='getPageData' :resize="true"/> -->
        </div>
      </div>
    </div>
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="80%"
      class="js-face-detail">
      <el-row :gutter="10">
        <el-col :span="6" class="js-face-detail">
          <div align="center">
            <img :src="detailItem.data|baseToImg" alt="抓拍照"/>
          </div>
          <div align="center">抓拍照</div>
        </el-col>
        <el-col :span="6" class="js-face-detail">
          <div align="center">
            <img :src="grayPersonInfo.XP|baseToImg" alt="标准照"/>
          </div>
          <div align="center">标准照</div>
        </el-col>
        <el-col :span="12">
          <el-row>
            <el-col>时间：{{detailItem.shotTime||"--"}}</el-col>
          </el-row>
          <el-row>
            <el-col>出现地：{{detailItem.shotPlace||"--"}}</el-col>
          </el-row>
          <el-row>
            <el-col>姓名：{{grayPersonInfo.XM||"--"}}</el-col>
          </el-row>
          <el-row>
            <el-col>相似度：{{grayPersonInfo.RXXSD||"--"}}</el-col>
          </el-row>
          <el-row>
            <el-col>性别：{{grayPersonInfo.XBDM==1?"男":"女"}}</el-col>
          </el-row>
          <el-row>
            <el-col>出生日期：{{grayPersonInfo.CSRQ||"--"}}</el-col>
          </el-row>
          <el-row>
            <el-col>民族：{{grayPersonInfo.MZDM||"--"}}</el-col>
          </el-row>
          <el-row>
            <el-col>身份证号码：{{grayPersonInfo.GMSFHM||"--"}}</el-col>
          </el-row>
          <el-row>
            <el-col>户籍地址：{{grayPersonInfo.HJDZ_SSXQDM||"--"}}</el-col>
          </el-row>
          <el-row>
            <el-col>户籍详细地址：{{grayPersonInfo.HJDZ_QHNXXDZ||"--"}}</el-col>
          </el-row>
          <el-row>
            <el-col>预警标识：{{ warningMsgInfo(backgroundInfo) }}</el-col>
          </el-row>
        </el-col>
      </el-row>
      <hr>
      <div>最近照片</div>
      <el-row :gutter="12">
        <el-col :span="calListSpan" :key="index" v-for="(item,index) in imageDetail.otherImages" @click.native="click2(item)">
          <el-card class="card">
            <div align="center">
              <img class="card-image" :src="item.data|baseToImg" alt="最近照片"/>
            </div>
            <div style="padding: 8px;" align="center">
              <div class="bottom clearfix">
                <time class="time">{{ item.shotTime| formatDistance }}前</time>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <hr>
      <div>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="dialogVisible = false">关 闭</el-button>
                </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import {basicPage} from "@/common/mixin"
    import "./jsDemo.less"

    export default {
        mixins: [basicPage],

        data() {
            return {
                paginations:{//分页字段
                    total:0,
                    currentPage:1,
                    pageSize:48,
                    pageSizes:[10,20,30,50,100],
                },
                notLoad:false,
                screenWidth:document.documentElement.clientWidth,
                timer:null,
                dialogVisible: false,
                dialogTitle: "详细信息",
                detailItem: {},
                grayPersonInfo:{},
                backgroundInfo:{},
                imageDetail: {
                    otherImages: []
                },
                warnSignMap:{1:"红色预警",2:"橙色预警",3:"黄色预警",4:"不预警"}
            };
        },

        props: {},

        components: {},

        computed: {
          calListSpan(){
              let width = this.screenWidth;
              let span = 3;
              if(width>=1920) span = 3;
              else if(width>=1200)span=4;
              else if(width>=992)span=6;
              else if(width>=768)span=8;
              else span=12;
              
              return span
          }
        },

        mounted() {
            this.getPageData();
            this.timer = setInterval(() => {
                this.getPageData({currentPage:1},{noLoading: true});
            }, 50000);

            //监听屏幕宽度  
            (function(_this){
              let timer=null;
              _this.onresize=function(){
                  if(timer)return false
                  timer = setTimeout(() => {
                      clearTimeout(timer);
                      timer = null;
                      _this.screenWidth = document.documentElement.clientWidth;
                  }, 500);
              }
              window.addEventListener("resize",_this.onresize);
            })(this);  
        },

        methods: {
            click(item) {
                this.detailItem = JSON.parse(JSON.stringify(item));
                this.grayPersonInfo = this.detailItem.grayPersonInfo;
                this.backgroundInfo = this.detailItem.backgroundRecord;
                if (this.grayPersonInfo == null){
                    this.grayPersonInfo ={};
                }
                if (this.backgroundInfo == null){
                    this.backgroundInfo ={};
                }
                this.getImageDetail(item);
                //console.log(item);
            },
            click2(item){
                this.detailItem.shotTime = item.shotTime;
                this.detailItem.shotPlace = item.shotPlace;
                this.detailItem.data = item.data;
            },
            // calListSpan(){
            //     let size = this.paginations.pageSize;
            //     let span = 48/size;
            //     span = span<3 ? 3:span;
            //     return span;
            // },
            warningMsgInfo(background){
                if (background==null){
                    return "不在比对库中";
                }
                let sign = background.warningSign;
                if (sign==null){
                    return "无预警标识";
                }
                return this.warnSignMap[sign]||"预警标识错误";
            },
            async getPageData(plugin = {},headers = {}) {
                Object.assign(this.paginations, plugin);
                let obj = {
                    pageNum: this.paginations.currentPage,
                    pageSize: this.paginations.pageSize,
                    orderBy: 'shotTime',
                    search: {
                        startTime: null,
                        endTime: null,
                    }
                }
                const {data} = await this.axios.post("ui/jsdemo/list", obj, {headers});
                if (data.statusCode == 0) {
                    this.paginations.total = data.data.total;
                    this.items = data.data.result;
                    this.notLoad = false;
                } else {
                    this.paginations.total = 0;
                    this.items = [];
                }
            
            }, 
            async getImageDetail(item) {
                let idNumber = "no number";
                if (item.grayPersonInfo!=null &&item.grayPersonInfo.GMSFHM!=null){
                    idNumber = item.grayPersonInfo.GMSFHM;
                }
                const {data} = await this.axios.post("ui/jsdemo/detail/" + idNumber);
                if (data.statusCode == 0) {
                    this.imageDetail = data.data;
                    if (this.imageDetail.otherImages==null || this.imageDetail.otherImages.length==0){
                        this.imageDetail.otherImages=[item];
                    }
                    this.dialogVisible = true;
                } else {
                    this.imageDetail = null;
                }
                
            },
            async load(){
                this.paginations.currentPage = this.paginations.currentPage + 1;
                let obj = {
                    pageNum: this.paginations.currentPage,
                    pageSize: this.paginations.pageSize,
                    orderBy: 'shotTime',
                    search: {
                        startTime: null,
                        endTime: null,
           
                    }
                }
                const {data} = await this.axios.post("ui/jsdemo/list", obj,{headers:{noLoading:true}});
                if(data.statusCode == 0&&data.data.result&&data.data.result.length){
                    this.items = [...this.items, ...data.data.result];
                }else{
                  this.paginations.currentPage = this.paginations.currentPage -1;
                  this.notLoad = true;
                }
            }
        },

        destroyed(){
            if(this.timer)clearInterval(this.timer);
            if(this.onresize)window.removeEventListener("resize",this.onresize)
        }
    }

</script>
<style lang='less' scoped>
</style>
