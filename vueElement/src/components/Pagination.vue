<!-- pagination -->
<template>
    <el-pagination class="myPagination" background layout="total, jumper,sizes,next,pager,prev" @size-change="handleSizeChange" @current-change="handleCurrentChange" :small="true"
        :current-page.sync="paginations.currentPage"
        :page-size="paginations.pageSize"
        :page-sizes="paginations.pageSizes"
        :total="paginations.total">
    </el-pagination>
</template>

<script>
export default {
    data () {
        return {
            paginations_d:{
                total:1,
                currentPage:1,
                pageSize:10,
                pageSizes:[10,20,30,50,100],
                maxPage:1
            },
        };
    },

    props : {
        paginations:{
            type:Object,
            required:true,
            default:()=>this.paginations_d,   
        },
        resize:{
            type:Boolean,
            required:false,
            default:false,
        }
    },
        
    components: {},

    computed: {},

    beforeMount(){
        if(this.resize){
            const _this=this;
            let timer=null;
            this.changeScreenWidth();
            this.onresize=function(){
                if(timer)return false
                timer = setTimeout(() => {
                    clearTimeout(timer);
                    timer = null;
                    _this.changeScreenWidth();
                }, 500);
            }
            window.addEventListener("resize",this.onresize);  
        }
           
    },

    methods: {
        handleSizeChange(size){
            this.$emit("changeDate",{pageSize:size,currentPage:1});
        },
        
        handleCurrentChange(currentPage){
            this.$emit("changeDate",{currentPage:currentPage});
        },

        changeScreenWidth(){
            let width=document.documentElement.clientWidth;
            let pageSize=10;
            if(width>=1920){
                pageSize=12*2;
            }else if(width>=1200){
                pageSize=8*2;
            }else if(width>=992){
                pageSize=6*2;
            }else if(width>=768){
                pageSize=4*2;
            }else {
                pageSize=3*2;
            }
            let pageSizes=[pageSize,2*pageSize,3*pageSize,5*pageSize,10*pageSize];
            if(this.paginations.pageSize!=pageSize)this.$emit("changeDate",{currentPage:1,pageSize:pageSize,pageSizes:pageSizes});
        }
    },

    destroyed(){
        if(this.resize)window.removeEventListener("resize",this.onresize);
    }
}

</script>
<style lang='less'>
@import url("../css/base.less");

body .myPagination.el-pagination{
    // background: #e4e7ed;
    padding:10px 0 1px;
   
    .el-pagination__total{
        float:left;  
    }
    .el-pagination__sizes,.btn-prev,.el-pagination__jump,.btn-next,.el-pager{
        float: right;
    }
    .el-pagination__jump{
        margin-left: 0;
    }
    .el-input.el-pagination__editor{
        float:none;
        input{
            padding-left:3px;
        }
    }

    .el-pagination__sizes .el-select--mini .el-input--mini{
        @mini_height:22px;
        input{
            height:@mini_height;
        } 
        .el-input__icon{
            line-height:@mini_height; 
        }
    }
    

    .el-pager li,.btn-next,.btn-prev{
        border:1px solid @color_input_border;
        border-radius: 1px;
        background-color: transparent;
        color:@color_input;
       
    }
    .el-pager li{
        &.active{
            border-color:#409EFF;
            color:#fff;
        }
        &:hover{
            color:#fff!important;
        }
    }
    .btn-next,.btn-prev{
        &:disabled{
            color:@color_text;
        }
    }

    .el-input{
        &.is-focus input{
            border-color:@color_text!important;
        }
        input{
            color:@color_input;
            background-color: transparent;
            border-color:@color_input_border;
            line-height: 20px;
            &:hover{
                border-color:@color_input_border;
            }
            &:focus{
                border-color:@color_text;
            }
        }
    } 
    .el-select .el-input input:focus{
        border-color: @color_input_border;
    }

    .el-pager .more::before{
        line-height: 20px!important;
    }
}

</style>