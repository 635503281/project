<!-- pagination -->
<template>
    <el-pagination background layout="total, next,jumper,pager,prev,sizes" @size-change="handleSizeChange" @current-change="handleCurrentChange"
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
                pageSize:1,
                pageSizes:[10,20,30,50,100],
                maxPage:1
            }
        };
    },

    props : {
        paginations:{
            type:Object,
            required:true,
            default:()=>this.paginations_d,   
        }
    },
    // ["paginations"],

        
    components: {},

    computed: {},

    mounted(){
        
    },

    methods: {
        handleSizeChange(size){
            this.$parent.paginations.pageSize=size;
            this.$parent.getPageData();
        },
        handleCurrentChange(currentPage){
            this.$parent.paginations.currentPage=currentPage;
            this.$parent.getPageData();
        }
    }
}

</script>
<style>
.el-pagination {
    background: #e4e7ed;
}
.el-pagination .el-pagination__total{
    float:left;   
}
.el-pagination .el-pagination__sizes,.btn-prev,.el-pagination__jump,.btn-next,.el-pager{
    float: right;
}


</style>

<style lang='less' scoped>



</style>