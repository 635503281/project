<!-- migu -->
<template>
    <div class="main">
        <div class="head">
            <el-select v-model="data1" placeholder="请选择" clearable filterable  @change="change1">
                <el-option v-for="item in options1" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
            <!-- <span>{{strData1}}</span> -->
        </div>
       <div>
           <el-select class="lisai" v-model="data2" placeholder="请选择" @change="change2" multiple collapse-tags>
               <el-option v-for="item in options2" :key="item.id" :value="item.id" :label="item.name"></el-option>
           </el-select>
       </div>
       <div>
           <el-progress type="circle" :percentage="data3" :status="status"></el-progress>
           <div style="width:50%;margin:0 auto;">
               <el-slider v-model="data3" @change="changeSlider" ></el-slider>
           </div>
           
       </div>
       <div>
           <ul>
               <el-button type="primary" @click="refresh">刷新</el-button>
               <el-button type="primary" @click="fn2">点我</el-button>
               <li v-for="item in list" :key="item.id">
                   <span>{{item.id}}</span>
                   <span>{{item.value}}</span>
                   <input type="text" v-model="item.value">
               </li>
           </ul>
       </div>
       <div>
           <input type="text" v-model="test.name1">
           <input type="text" v-model="test.name2">
           <input type="text" v-model="name" v-focus1>
       </div>
       <div>
           <el-button @click="click1">弹出消息</el-button>
       </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            data1:null,
            data2:[],
            data3:0,
            status:null,
            options1:[
                {id:1,name:'选择一'},
                {id:2,name:'选择二'},
                {id:3,name:'选择三'},
            ],
            options2:[
                {id:1,name:"多选一"},
                {id:2,name:"多选二"},
                {id:3,name:"多选三"},
                {id:4,name:"多选四"}
            ],
            list:[
                {id:1,value:"123"},
                {id:2,value:"sdfsd"}
            ],
            test:{
                name1:"",
                name2:"",
            }
        };
    },
    inject:["refresh"],

    props : {},

    components: {},

    computed: {
        strData1(){
            if(!this.data1)return ''
            return this.data1.toString()+"lisai"
        },
        name:{
            get(){
                if(!this.test.name1)return this.test.name2;
                if(!this.test.name2)return this.test.name1;
                return `${this.test.name1} ${this.test.name2}`
            },
            set(value){
                let arr=value.trim().split(" ");
                if(arr.length==1){
                    if(this.test.name2){
                        this.test.name2=arr[0];
                        this.test.name1='';
                        return
                    }
                   
                    this.test.name1=arr[0];
                    this.test.name2='';
                    return
                }
                this.test.name1=arr[0];
                this.test.name2=arr[1]; 
            }
        }
    },

    mounted(){
        var timer=setInterval(()=>{
            this.data3+=6;
            if(this.data3>=100){
                this.data3=100;
                this.status="success";
                clearInterval(timer);
            }
        },500);
        
        let obj=new Proxy({},{
            get:function(target,key){
                return target[key]
            },
            set:function(target,key,value){
                // console.log(`设置新属性${key}`);
                target[key]=value;
                return true
            }  
        });
        obj.name="lisai";
        obj.arr=[1,2,3];
        // console.log(this.copy(obj));
        // console.log(Object.entries(obj));
       
    },
    watch:{
        list:{
            handler:function(ne,old){
                console.log(ne)
            },
            immediate:false,//不会在绑定的时候执行
            deep:true
        },
        data3(ne,old){
            // console.warn(ne);
        }
    },
    methods: {
        change1(){
            console.log(this.data1);
        },
        change2(){
            console.log(this.data2);
            setTimeout(()=>{
                this.data1=null;
            },3000);
        },
        click1(){
            this.$message({ type: 'success',message:"弹出来的消息",duration:2000});
            this.$notify({
                title: '标题名称',
                message:'这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案这是提示文案',
                duration:3000  
            });
            // this.myToast("自定义弹出层插件")
            // .then(()=>{
            //     console.log('点击了确认');
            // });
        },
        changeSlider(value){
            console.log(value);
            if(value>=100){
                this.status="success";
            }else{
                this.status=null;
            }
        },
        fn2(){
            // this.$set(this.list,1,{id:3,value:"lisai"});
            // this.list[1].value="lisai";
            this.$set(this.list[1],"value","lisai")
        }
    }
}
 function defineReactive(data, key, val) {
            observe(val); // 递归遍历所有子属性
            Object.defineProperty(data, key, {
                enumerable: true,
                configurable: true,
                get: function() {
                    console.log("属性重新定义")
                    return val;
                },
                set: function(newVal) {
                    val = newVal;
                    console.log('属性' + key + '已经被监听了，现在值为：“' + newVal.toString() + '”');
                }
            });
        }
        
        function observe(data) {
            if (!data || typeof data !== 'object') {
                return;
            }
            Object.keys(data).forEach(function(key) {
                defineReactive(data, key, data[key]);    
            });
        };
        
        var library = {
            book1: {
                name: ''
            },
            book2: ''
        };
        observe(library);
        // library.book1.name = 'vue权威指南'; // 属性name已经被监听了，现在值为：“vue权威指南”
        // library.book2 = '没有此书籍';  // 属性book2已经被监听了，现在值为：“没有此书籍”
        // console.log(library.book2)
</script>
<style lang='less' scoped>
</style>
