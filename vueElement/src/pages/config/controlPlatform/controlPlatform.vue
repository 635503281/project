<!-- 管控平台配置 -->
<template>
    <div>
        <!-- <el-breadcrumb class="myBreadcrumb">
            <el-breadcrumb-item v-for="(menu,i) in $route.meta.menus" :key="i" :to="menu.path||null">{{menu.name}}</el-breadcrumb-item>
        </el-breadcrumb> -->

        <div class="content">
            <div class="main">
                <el-upload ref="upload" :multiple="false" :auto-upload="true" :file-list="fileList" :before-upload="file=>this.fileList=[file]" action="ui/cspconfig/upload" :http-request="upload">
                    <el-button type="primary">{{$t("import")}}</el-button>
                    <!-- <el-button type="danger" @click.stop="reboot">{{$t("reboot")}}</el-button> -->
                </el-upload>
                <h3>{{$t("controlPlatformConfig")}}：</h3>
                <Json-viewer :value="config"></Json-viewer>
            </div>
            
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            config:{},
            fileList:[],
        };
    },

    props : {},

    components: {
        JsonViewer:()=>import("vue-json-viewer"),
    },

    computed: {},

    mounted(){
        this.getConfig();
    },

    methods: {
        //获取配置
        async getConfig(){
            const {data}=await this.axios.get("ui/cspconfig/mq/view");
            if(data.statusCode==0){
                this.config=data.data;
            }
        },

        //上传
        async upload(value){
            try{
                const {data}=await this.axios.post(value.action,value.file,
                    {   headers : { noLoading : true },
                        onUploadProgress : progressEvent => {
                            let percent=(progressEvent.loaded / progressEvent.total * 100) | 0;
                            value.onProgress({percent});
                        }
                    }
                );
                if(data.statusCode==0){
                    this.commonTip(this.$t("upload_S"));
                    value.onSuccess(this.$t("upload_S"));
                }else{
                    value.onError(this.$t("upload_F"));
                }

            }catch(e){
                value.onError(this.$t("upload_F"));
            }
            
        },

        //重启
        async reboot(){
            await this.commonConfirm({title:this.$t("isReboot")});
            this.axios.get("ui/cspconfig/reboot",{headers:{noTip:true}});
            setTimeout(()=>{
                window.location.reload();
            },10000);
        },
    }
}

</script>
<style lang='less' scoped>
@import url("../../../css/base.less");

h3{
    margin-bottom:0;
    color:@color_text;
}
el-upload {
    margin-bottom:20px;
}
/deep/ .el-upload-list{
    display: inline-block;
    vertical-align: middle;
    margin-left:10px;
    .el-upload-list__item:first-child{
        margin-top:0;
    }
    .el-upload-list__item{
        transition:none;
    }
}

/deep/ .jv-container {
    background-color: transparent!important;
    flex:1;
    overflow-y: auto;

    .jv-node .jv-key, .jv-item.jv-object{
        color:@color_text!important;
    }
}

</style>