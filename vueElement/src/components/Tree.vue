<!-- zTree -->
<template>
    <div class="treeBox">
        <ul :id="id" class="ztree myTree"></ul>
    </div>
</template>

<script>
import "./zTree/js/jquery-1.4.4.min.js"
import "./zTree/css/zTreeStyle/zTreeStyle.css"
import "./zTree/js/jquery.ztree.all.min.js"
import "./zTree/js/jquery.ztree.exhide.min.js"
import "./zTree/js/fuzzysearch.js"

export default {
    data () {
        return {
            zTreeObj:{},

            setting:{//配置
                data:{
                    key:{
                        name:this.plugin.name,
                        title:this.plugin.title,
                        checked:this.plugin.checked||"checked",
                        children:this.plugin.children||"children",
                        url:this.plugin.url||"myUrl",
                        icon:this.plugin.icon||"myIcon"
                    },
                    simpleData:{
                        enable:this.plugin.isSimpleData,
                        idKey:this.plugin.idKey||"id",
                        pIdKey:this.plugin.pIdKey||"parentId",
                        rootPId: null,
                    }
                },
                check:{
                    enable:this.plugin.checkbox||false,
                    chkboxType:this.plugin.checkboxType||{Y:"ps",N:"ps"},
                },
                callback:{
                    onExpand:function(event, treeId, treeNode){
                        this.$emit("treeExpand",treeNode,treeId,event);
                    }.bind(this),

                    onClick:function(event, treeId, treeNode){
                        this.$emit("treeClick",treeNode,treeId,event);
                    }.bind(this),
                }
            },

        };
    },

    props : {
        id:{
            type:String,
            required:true,
        },
        plugin:{
            type:Object,
            default:()=>{
                return {
                    name:"",//展示的字段(加搜索的时候name设值与title不同的字段)
                    title:"",//提示字段
                    checked:"checked",//选中字段
                    children:"children",//子属性字段
                    isSimpleData:false,//是否是简单数据
                    idKey:"id",
                    pIdKey:"parentId",//对应关系
                    checkbox:false,//是否启用复选框
                    checkboxType:{//设置取消是不关联父节点(p-父 s-子)
                        Y:"ps",
                        N:"ps"
                    },

                }
            }
        },
        datas:{
            type:Array,
            required:true,
        }
    },

    components: {},

    computed: {},

    mounted(){
        this.init();
    },
    
    watch:{
        datas:function(){
            this.init();
        }
        
    },

    methods: {
        init(){
            if(this.datas.length>0){
                this.zTreeObj=$.fn.zTree.init($(`#${this.id}`),this.setting,this.datas);
                this.$emit("treeInit",this.zTreeObj);
            }
            
        }
    }
}

</script>
<style lang='less' scoped>
@import url("../css/base.less");

.treeBox .ztree.myTree{
    /deep/ li a{
        color:@color_text;

        &.curSelectedNode{
            color:@color_default;
            opacity: 1;
            background-color: rgba(65,129,255, 0.2);
            border-color:transparent;
        }
    }
} 
</style>