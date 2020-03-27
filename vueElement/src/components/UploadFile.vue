<!-- uploadFile -->
<template>
    <el-dialog custom-class="myUpload" :visible.sync="visible" @close="close" :title="title||$t('upload')"
        :close-on-click-modal="false">
        <div>
            <el-upload ref="uploadFile" :action="url" :multiple="true" :drag="true" :auto-upload="false" :http-request="upload" :before-upload="beforeUpload">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">{{$t("uploadFile_tip1")}}<em>{{$t("uploadFile_tip2")}}</em></div>
            </el-upload>
            <div class="btns">
                <el-button v-if="templateUrl" type="primary" @click="downloadTemplate">{{$t("downloadTemplate")}}</el-button>
                <el-button type="primary" @click="submit">{{$t("upload")}}</el-button>
            </div>
        </div>
    </el-dialog>
</template>

<script>
export default {
    data () {
        return {
            timer:null,
            
        };
    },

    props : {
        visible:{
            type:Boolean,
            default:false,
        },
        url:{//上传地址
            type:String,
        },
        templateUrl:{//下载模板地址
            type:String,
        },
        title:{//标题
            type:String,
        },
        format:{//格式
            type:Array,
        },
        formatTip:{//错误格式提示
            type:String,
        }
    },

    components: {},

    computed: {},

    mounted(){},

    methods: {
        //上传前做文件格式校验
        beforeUpload(file){
            const name = file.name;
            if(this.format&&this.format.length){
                if(this.format.some(v=>name.indexOf(v)!=-1)){//满足格式
                    return true
                }else{
                    this.commonTip(this.formatTip||"文件格式错误","tip_notice");
                    return false
                }
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
                    //批量上传1s后触发更新事件
                    if(!this.timer){
                        this.timer=setTimeout(()=>{
                            clearTimeout(this.timer);
                            this.timer = null;
                            this.$emit("uploadSuccess");
                        },1000);
                    }
                    
                    this.commonTip(this.$t("upload_S"));
                    value.onSuccess(this.$t("upload_S"));

                }else{
                    value.onError(this.$t("upload_F"));
                }

            }catch(e){
                value.onError(this.$t("upload_F"));
            }
            
        },

        //提交
        submit(){
            this.$refs.uploadFile.submit();
        },

        //下载模板
        downloadTemplate(){
            window.location.href=this.templateUrl
        },

        //关闭
        close(){
            this.$emit('update:visible', false);
            this.$refs.uploadFile.clearFiles();
        },
    }
}

</script>
<style lang='less' scoped>
/deep/ .myUpload{
    max-width:600px;
    .el-dialog__header{
        .el-dialog__title{
            display: block;
            width:100%;
            text-align: center;
        }
        
    }

    .el-dialog__body{
        padding-top:10px;
        padding-bottom:20px;
        .el-upload {
            width:100%;
            .el-upload-dragger{
                width:100%;
            }
        }
        .el-upload-list{
            margin-bottom: 10px;
            height: auto;
            max-height: 200px;
            overflow-y: auto;
            .el-upload-list__item{
                outline: none;
                height: auto;
                overflow: hidden;
                .el-progress{
                    top:15px;
                    .el-progress__text{
                        top:-8px;
                    }
                }
            }
            .el-upload-list__item:first-child{
                margin-top:5px;
            }

            .el-icon-circle-check:before{
                content:"";
                display: inline-block;
                width:14px;
                height: 14px;
                background-image: url("../img/login/ic_correct.png");
                background-size:cover; 
                vertical-align: middle;
                margin-top:-4px;
            }
        }

        .btns{
            display: flex;
            justify-content: center;
        }
    }
}
</style>