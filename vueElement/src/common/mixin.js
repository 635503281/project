import Pagination from "@/components/Pagination"
//页面基础数据
export const basicPage={
    data(){
        return{
            paginations:{//分页字段
                total:0,
                currentPage:1,
                pageSize:document.documentElement.clientWidth<=1200?10:20,
                pageSizes:[10,20,30,50,100],
            },
            items:[],//数据
            selectItems:[],//选中
            showDrawer:false,//是否显示右边抽屉
            row:{},//抽屉中展示的数据
        }
    },
    components : {Pagination},
    methods:{
        //搜索
        search(){
            this.paginations.currentPage=1;
            this.getPageData();            
        },
        //保存数据
        saveItem(name=null){
            this.$store.commit("SAVE_PAGEINFO",{name:name,paginations:this.paginations,searchOption:this.searchOption});
        },
        //删除
        del(url,type = "get"){
            this.commonConfirm({title:this.$t("isDelete")}).then(async ()=>{
                let data;
                if(type == "post")data = (await this.axios.post(url)).data;
                else data = (await this.axios.get(url)).data;
                if(data.statusCode==0){
                    this.commonTip(this.$t("delete_S"));
                    this.getPageData();
                }
            });
              
        },
        //出现抽屉
        showBox(row){
            this.showDrawer=true;
            this.row=row;
        }
    }
}