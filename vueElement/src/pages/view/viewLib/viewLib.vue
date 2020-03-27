<!-- 视图库 -->
<template>
    <div>
        <!-- <el-breadcrumb class="myBreadcrumb">
            <el-breadcrumb-item v-for="(menu,i) in $route.meta.menus" :key="i" :to="menu.path||null">{{menu.name}}</el-breadcrumb-item>
        </el-breadcrumb> -->

        <div class="content">
            <div class="main">
                <el-button-group class="main_btns">
                    <el-button type="primary" icon="el-icon-plus" @click="()=>this.$router.push({name:'editViewLib',query:{id:0}})">{{$t("add")}}</el-button>
                </el-button-group>
                <div class="main-table">
                    <el-table ref="viewLib_table" max-height="100%" :data="items" style="width: 100%" :empty-text="$t('noData')">
                        <el-table-column type="expand" width="1">
                            <template slot-scope="scope">
                                <div class="expand">
                                    <i class="el-icon-close" @click="closeQuery(scope.row)"></i>
                                    <div>
                                        <h4>本地订阅</h4>
                                        <template v-if="scope.row.local">
                                            <el-table max-height="200px" :data="scope.row.local" style="width: 100%" :empty-text="$t('noData')" @selection-change="val=>scope.row.selectItems=val">
                                                <el-table-column type="selection"></el-table-column>
                                                <el-table-column prop="subscribeID" label="订阅任务编号" min-width="150" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                                                <el-table-column prop="title" label="主题" min-width="120" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                                                <el-table-column prop="resourceURI" label="订阅资源路径" min-width="150" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                                            </el-table>
                                        </template>
                                        
                                    </div>
                                    <div>
                                        <h4>远程订阅</h4>
                                        <template v-if="scope.row.remote">
                                            <el-table max-height="200px" :data="scope.row.remote" style="width: 100%" :empty-text="$t('noData')">
                                                <el-table-column prop="subscribeID" label="订阅任务编号" min-width="150" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                                                <el-table-column prop="title" label="主题" min-width="120" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                                                <el-table-column prop="resourceURI" label="订阅资源路径" min-width="150" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                                            </el-table>
                                        </template>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="name" label="名称" min-width="120" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="endpoint" label="接口地址" min-width="150" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="username" label="用户名" min-width="120" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="remarks" label="备注" min-width="150" :formatter="(r,c,value)=>value||'--'"></el-table-column>
                        <el-table-column prop="createTime" :label="$t('createTime')" width="140" sortable></el-table-column>
                        <el-table-column label="备案" width="160" align="center">
                            <template slot-scope="scope">
                                <button class="textBtn"  @click="register(scope.row.id)">注册</button>
                                <button class="textBtn"  @click="logout(scope.row.id)">注销</button>
                                <button class="textBtn"  @click="keepalive(scope.row.id)">保活</button>
                            </template>
                        </el-table-column>
                        <el-table-column label="订阅" width="244" align="center">
                            <template slot-scope="scope">
                                <button class="textBtn"  @click="add(scope.row.id)">添加</button>
                                <button class="textBtn"  @click="subscribe(scope.row)">订阅</button>
                                <button class="textBtn"  @click="query(scope.row)">查询</button>
                                <button class="textBtn"  @click="revoke(scope.row)">撤销</button>
                                <button class="textBtn"  @click="alarm(scope.row.id)">告警</button>
                            </template>
                        </el-table-column>
                        <el-table-column  :label="$t('operation')" width="80" fixed="right" align="center">
                            <template slot-scope="scope">
                                <router-link tag="button" class="icon_modify iconBtn" :title="$t('modify')" @click.native="saveItem('viewLib')" :to="{name:'editViewLib',query:{id:scope.row.id}}"></router-link>
                                <button class="icon_delete iconBtn" :title="$t('delete')" @click="del('ui/viewlib/delete?id='+scope.row.id,'post')"></button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <Pagination :paginations="paginations" @changeDate='getPageData'/> 
            </div>
        </div>

        <el-dialog custom-class="content dialogContent" :visible.sync="isSubscribe" title="添加订阅" width="50%" :close-on-click-modal="false">
            <el-form class="form" ref="subscribeform" :model="subscribeItem" :rules="rules" label-width="30%" :inline-message="true" autocomplete="off">
                <el-form-item label="操作类型" prop="operateType">
                    <el-select v-model="subscribeItem.operateType" :placeholder="$t('placeholder.choose')" clearable>
                        <el-option label="订阅" :value="0"></el-option>
                        <el-option label="取消订阅" :value="1"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="订阅执行状态" prop="subscribeStatus">
                    <el-select v-model="subscribeItem.subscribeStatus" :placeholder="$t('placeholder.choose')" clearable>
                        <el-option label="订阅中" :value="0"></el-option>
                        <el-option label="已取消订阅" :value="1"></el-option>
                        <el-option label="订阅到期" :value="2"></el-option>
                        <el-option label="未订阅" :value="9"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="订阅任务编号" prop="subscribeID">
                    <el-input v-model="subscribeItem.subscribeID" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                <el-form-item label="主题" prop="title">
                    <el-input v-model="subscribeItem.title" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                <el-form-item label="查询类型" prop="subscribeType">
                    <el-select v-model="subscribeItem.subscribeType" :placeholder="$t('placeholder.choose')" clearable>
                        <el-option label="本级订阅" :value="1"></el-option>
                        <el-option label="跨域订阅" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="订阅类别" prop="subscribeDetail">
                    <el-input v-model="subscribeItem.subscribeDetail" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                <el-form-item label="订阅资源路径" prop="resourceURI">
                    <el-input v-model="subscribeItem.resourceURI" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                <el-form-item label="申请人姓名" prop="applicantName">
                    <el-input v-model="subscribeItem.applicantName" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                <el-form-item label="申请单位名称" prop="applicantOrg">
                    <el-input v-model="subscribeItem.applicantOrg" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                <el-form-item label="时间范围" prop="subscribeID">
                    <el-date-picker type="datetimerange" v-model="subscribeItem.times" range-separator="~" :start-placeholder="$t('startTime')" :end-placeholder="$t('endTime')"
                      value-format="yyyy-MM-dd HH:mm:ss" clearable>
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="订阅信息接收地址" prop="receiveAddr">
                    <el-input v-model="subscribeItem.receiveAddr" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                <el-form-item label="信息上报间隔(s)" prop="reportInterval">
                    <el-input type="number" v-model="subscribeItem.reportInterval" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                <el-form-item label="订阅的理由" prop="reason">
                    <el-input v-model="subscribeItem.reason" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                
                <el-form-item label="订阅取消单位" prop="subscribeCancelOrg">
                    <el-input v-model="subscribeItem.subscribeCancelOrg" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                <el-form-item label="订阅取消人" prop="subscribeCancelPerson">
                    <el-input v-model="subscribeItem.subscribeCancelPerson" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                <el-form-item label="取消时间" prop="cancelTime">
                    <el-date-picker type="datetime" v-model="subscribeItem.cancelTime" value-format="yyyy-MM-dd HH:mm:ss" :placeholder="$t('placeholder.choose')" clearable></el-date-picker>
                </el-form-item>
                <el-form-item label="取消原因" prop="cancelReason">
                    <el-input v-model="subscribeItem.cancelReason" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>

                <el-form-item class="form_btns">
                    <el-button type="primary" @click="submit('subscribeform')" :loading="loadSubmit">{{$t("submit")}}</el-button>
                    <el-button @click="isSubscribe=false">{{$t("cancel")}}</el-button>
                </el-form-item>
              
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import {basicPage} from "@/common/mixin"
const subscribeItem = {//订阅对象
    operateType:null,//操作类型(int)，0：订阅；1：取消订阅
    subscribeStatus:null,//订阅执行状态(int)。0：订阅中1：已取消订阅2：订阅到期9：未订阅
    subscribeID:null,//订阅任务编号
    title:null,//描述订阅的主题和目标,订阅时必选
    subscribeType:null,//查询类型(int),1：本级订阅；2：跨域订阅
    subscribeDetail:null,//订阅类别
    resourceURI:null,//订阅资源路径
    applicantName:null,//申请人姓名
    applicantOrg:null,//申请单位名称
    times:null,//时间
    beginTime:null,//开始时间
    endTime:null,//结束时间
    receiveAddr:null,//订阅信息接收地址
    reportInterval:null,//信息上报间隔(int)
    reason:null,//订阅的理由
    subscribeCancelOrg:null,//订阅取消单位，仅在取消订阅时使用
    subscribeCancelPerson:null,//订阅取消人，仅在取消订阅时使用
    cancelTime:null,//取消时间，仅在取消订阅时使用
    cancelReason:null,//取消原因
}
export default {
    mixins:[basicPage],

    data () {
        return {
            items: [
                // {
                //     id: 1,
                //     name:"test",
                //     endpoint:"test",
                //     username:"test",
                //     password:"test",
                //     remarks:"test",
                //     createTime: "2019-12-24 14:40:00"
                // }
            ],

            isSubscribe:false,//订配置框阅
            subscribeItem: this.copy(subscribeItem),//订阅对象

            loadSubmit:false,
        };
    },

    props : {},

    components: {},

    mounted(){
        if(this.$store.state.pageInfo.name=='viewLib'){
            this.paginations=this.$store.state.pageInfo.paginations;
            this.searchOption=this.$store.state.pageInfo.searchOption;
        }
        this.getPageData();

        this.$store.commit("SAVE_PAGEINFO");
    },

    methods: {
        //分页
        async getPageData(plugin={}){
            Object.assign(this.paginations,plugin);
            let obj={
                pageNum:this.paginations.currentPage,
                pageSize:this.paginations.pageSize,
            };

            const {data}=await this.axios.post("ui/viewlib/list",obj);
            if(data.statusCode==0){
                this.paginations.total=data.data.total;
                this.items=data.data.result;
            }else {
                this.paginations.total=0;
                this.items=[];
            }
        },

        //注册
        register(id){
            this.commonConfirm({title:'是否注册'}).then(async ()=>{
                const {data} = await this.axios.post(`ui/viewlib/register?id=${id}`);
                if(data.statusCode == 0){
                    this.commonTip('注册成功');
                }
            });
        },

        //注销
        logout(id){
             this.commonConfirm({title:'是否注销'}).then(async ()=>{
                const {data} = await this.axios.post(`ui/viewlib/unregister?id=${id}`);
                if(data.statusCode == 0){
                    this.commonTip('注销成功');
                }
            });
        },

        //保活
        keepalive(id){
             this.commonConfirm({title:'是否保活'}).then(async ()=>{
                const {data} = await this.axios.post(`ui/viewlib/keepalive?id=${id}`);
                if(data.statusCode == 0){
                    this.commonTip('保活成功');
                }
            });
        },

        //添加订阅
        add(id){
            this.isSubscribe = true;
            this.subscribeItem._id = id;
        },
        //清空订阅对象
        subscribeItem(){
            this.subscribeItem = this.copy(subscribeItem);
        },
        //提交订阅
        submit(form){
            this.$refs[form].validate(async valid=>{
                if(valid){
                    let obj = this.copy(this.subscribeItem);
                    obj.beginTime = obj.times?obj.times[0]:null;
                    obj.endTime = obj.times?obj.times[1]:null;
                    delete obj.times;
                    delete obj._id;
                    
                    this.loadSubmit = true;
                    try{
                        const {data} = await this.axios.post('ui/viewlib/subscribes/add?id='+this.subscribeItem._id,obj,{headers:{noLoading:true}});
                        if(data.statusCode==0){
                            this.isSubscribe = false;
                            this.clearSubscribeItem();
                            this.commonTip('添加订阅成功');
                        }
                        this.loadSubmit = false;
                    }catch(e){
                        this.loadSubmit = false;
                    }
                    
                }

            })
        },
        //订阅
        async subscribe(row){
            let {id, selectItems = []} = row;
            if(!selectItems)selectItems = [];
            if(selectItems.length == 0)return

            const ids = selectItems.map(v=>v.id);
            const {data} = await this.axios.post(`ui/viewlib/subscribes/push?id=${id}&subIds=${ids}`);
            if(data.statusCode == 0){
                this.commonTip('订阅成功');
                this.queryRemote(row, 100);
            }
            
        },

        //查询本地的
        async queryLocal(row){
            const {id} = row;
            const {data} = await this.axios.get("ui/viewlib/subscribes/native/query?id="+id,{headers:{noLoading:true}});
            if(data.statusCode == 0){
                let list = data.data||[];
                row.local = list;
                return list
            }
        },
        //查询远程的
        async queryRemote(row, count){
            const {id} = row;
            const {data} = await this.axios.get("ui/viewlib/subscribes/viid/queryCount?id="+id+"&count="+count,{headers:{noLoading:true}});
            if(data.statusCode == 0){
                let list = data.data||[];
                row.remote = list;
                return list
            }
        },
        //查询
        query(row){
            const _this = this;
            const {id} = row;
            this.$store.commit("CHANGE_LOADING",true);
            Promise.all([this.queryLocal(row), this.queryRemote(row, 100)]).then(([local,remote])=>{
                _this.$store.commit("CHANGE_LOADING",false);
                _this.$refs.viewLib_table.toggleRowExpansion(row,true);
            });
        },
        //关闭查询
        closeQuery(row){
            this.$refs.viewLib_table.toggleRowExpansion(row,false);
            delete row.selectItems;
            delete row.local;
            delete row.remote;
        },

        //撤销
        revoke(row){
            let {id, selectItems = []} = row;
            if(!selectItems)selectItems = [];
            if(selectItems.length == 0)return
            else if(selectItems.length >1){
                this.commonTip("只能撤销一个", "tip_notice");
                return 
            }
            const ids = selectItems.map(v=>v.id);
            this.commonConfirm({title:'是否撤销'}).then(async ()=>{
                const {data} = await this.axios.post(`ui/viewlib/subscribes/revoke?id=${id}&subId=${ids}`);
                if(data.statusCode == 0){
                    this.commonTip('撤销成功');
                    this.queryRemote(row, 100);
                }
            });
        },

        //告警
        alarm(id){

        },

    }
}

</script>
<style lang='less' scoped>
.main-table{
    /deep/.el-table{
        .expand{
            &::after{
                content:"";
                display: block;
                width:0;
                clear: both;
            }
            padding:10px 20px;
            .el-icon-close{
                position: absolute;
                top:6px;
                right:12px;
                cursor: pointer;
                font-size:16px;
            }
            >div{
                float: left;
                width:50%;
                padding:0 10px;
                h4{
                    padding:0;
                    margin: 0;
                    line-height: 30px;
                    text-align: center;
                }
            }

        }
        .el-table__expand-column{
            .el-icon::before{
                content:"";
            }
        }

        .el-table__empty-block{
            min-height: 35px!important;
            height: 35px!important;
            line-height: 35px!important;
        }
    }
}
</style>