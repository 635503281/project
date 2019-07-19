<!-- list -->
<template>
    <div id="wrapper"  v-loading="loading"  :element-loading-text="$t('loading')" element-loading-background="rgba(0, 0, 0, 0.3)">
        <div id="top" class="clear">
            <el-col :span="18" class="top_ipt">
                <span class="el-col-4 text_left">{{$t('selectTime')}}:</span>
                <el-date-picker v-model="time" type="datetimerange" :picker-options="pickerOptions" class="el-col-20" value-format="yyyy-MM-dd HH:mm:ss"
                    :range-separator="$t('to')" :start-placeholder="$t('startTime')" :end-placeholder="$t('endTime')"  align="left">
                </el-date-picker>
                
            </el-col>
            <el-col :span="6" class="right">
                <el-button type="primary" @click="getPageData">{{$t("search")}}</el-button>
            </el-col>
        </div>
        
        <div id="center">
            <el-button-group class="left">
                <router-link tag="button" type="button" class="button_a el-button el-button--primary" @click.native="saveItem" :to="{name:'netConfigEdit',query:{id:0}}">{{$t('add')}}</router-link>
                <el-button type="primary" :disabled="selectItems.length<1" @click="edit">{{$t('edit')}}</el-button>
                <el-button type="primary" @click="addData">添加数据</el-button>
                <el-button type="primary" @click="submitData">提交数据</el-button>
            </el-button-group>
            
            <el-table :data="items" border stripe style="width:100%;" max-height="500" @selection-change="selectChange">
                <el-table-column type="selection" fixed="left"></el-table-column>
                <el-table-column type="expand" fixed="left">
                    <template slot-scope="scope">
                        <el-form label-position="left" >
                            <el-form-item :label="$t('name')"><span>{{scope.row.name}}</span></el-form-item>
                            <el-form-item :label="$t('login.password')"><span>{{scope.row.password}}</span></el-form-item>
                            <el-form-item :label="$t('age')"><span>{{scope.row.age}}</span></el-form-item>
                            <el-form-item :label="$t('gao')"><span>{{scope.row.gao}}</span></el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                <el-table-column prop="name" :label="$t('name')" min-width="250" sortable>
                    <template slot-scope="scope">
                        <!-- <router-link to="/index">{{scope.row.name}}</router-link> -->
                        <el-input v-model="scope.row.name"></el-input>
                    </template>    
                </el-table-column>
                <el-table-column prop="age" :label="$t('age')"  min-width="250" sortable>
                    <template slot-scope="scope">
                        <!-- <el-input v-model="scope.row.age"></el-input> -->
                        <el-select v-model="scope.row.age" placeholder="请选择">
                            <el-option v-for="(age,index) in ageList" :key="index" :label="age" :value="age"></el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="gao" :label="$t('gao')"  min-width="250" sortable>
                    <template slot-scope="scope">
                        <el-input type="number" v-model="scope.row.gao"></el-input>
                    </template>
                </el-table-column>
                <el-table-column prop="a" width="200" label="属性a"></el-table-column>
                <el-table-column prop="b" width="200" label="属性b"></el-table-column>
                <el-table-column prop="c" width="200" label="属性c"></el-table-column>
                <el-table-column prop="d" width="200" label="属性d"></el-table-column>
                <el-table-column  :label="$t('operation')" width="100" fixed="right">
                    <template slot-scope="scope">
                        <el-button type="text" class="no_p" :title="$t('edit')"><router-link @click.native="saveItem" :to="{name:'netConfigEdit',query:{id:scope.row.id}}" tag="i" class="el-icon-edit font_20"></router-link></el-button>
                        <el-button type="text" class="no_p" :title="$t('delete')" @click="del(scope.$index)"><i class="el-icon-delete font_20"></i></el-button>
                    </template>
                </el-table-column>
            </el-table>

            <Pagination ref="paginations" :paginations="paginations"/>  
        </div>

    </div>
</template>

<script>
import {getUser,deleteUser} from "@/http/getData"
import Pagination from "@/components/Pagination"
export default {
    // beforeRouteLeave(to,from,next){
    //     if(to.name=="netConfigEdit"){
    //         from.meta.keepAlive=true;
    //     }else{
    //         from.meta.keepAlive=false;
    //     }
    //     next();
    // },
    data () {
        return {
            time:null,//开始结束时间
            pickerOptions: {
                shortcuts: [{
                    text: this.$t('lastWeek'),
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: this.$t('lastMonth'),
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                }, {
                    text: this.$t('last3Month'),
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                        picker.$emit('pick', [start, end]);
                    }
                }]
            },

            items:[
                {name:"lisai",age:25,gao:182},
                {name:"you",age:25,gao:182},
                {name:"hong",age:25,gao:182},
                {name:"q",age:25,gao:182},
                {name:"J",age:25,gao:182},
            ],
            ageList:[18,20,21,22,23,24,25,26,27,28],
            //选中的list
            selectItems:[],
            paginations:{
                total:1000,
                currentPage:1,
                pageSize:10,
                pageSizes:[10,20,30,50,100,1000],
            },
            loading:false
        };
    },

    props : {},

    components: {Pagination},

    computed: {},

    created(){
        console.log("list缓存了")
    },

    mounted(){
        //是否有记录之前的分页参数
        // if(sessionStorage.getItem("paginations")){
        //     this.paginations=JSON.parse(sessionStorage.getItem("paginations"));
        // }
        //获取初始数据
        // this.getPageData();


        // sessionStorage.removeItem("paginations")
    },

    methods: {
        //选中的item
        selectChange(val){
            this.selectItems=val;
        },

        //删除
        del(id){
            this.$confirm('是否删除该用户',"警告",{
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                // deleteUser(id).then(data=>{
                //     if(data.resultCode==0){
                //        this.getPageData();
                //     }
                // })
                console.log(id);
                this.items.splice(id,1)

            }).catch(()=>{

            })
        },

        addData(){
            this.items.push({name:null,age:null,gao:null})
        },

        submitData(){
            console.log(this.items);
        },

        edit(){
            // console.log(this.selectItems);
            let data=new FormData;
            data.append("id",1);data.append("name","test");
            this.axios.post("/test",{id:1,name:"test"},{headers:{"content-type":"multipart/form-data"}}).then(response=>{
                console.log(response);
            },()=>{});
        },

        //获取初始数据
        getPageData(){
            // this.loading=true;
            // let obj={
            //     first:(this.paginations.currentPage-1)*this.paginations.pageSize,
            //     pageSize:this.paginations.pageSize
            // };
            // getUser(obj).then(response=>{
            //     this.loading=false;
            //     if(response.resultCode==0){
            //         this.paginations.total=response.total;
            //         this.items=response.list.map(function(value,index){
            //             return{
            //                 id:value.id,
            //                 name:value.userName,
            //                 password:value.password,
            //                 age:value.age,
            //                 gao:value.gao,
            //             }
            //         })
            //     }
            

            // });
        },

        //保存分页参数
        saveItem(){
            // sessionStorage.setItem("paginations",JSON.stringify(this.paginations));
        }

    }
}

</script>

<style lang='less' scoped>
#top{
    margin-bottom:30px;
    .top_ipt{
        height:40px;
        line-height: 40px;
    }

}

</style>