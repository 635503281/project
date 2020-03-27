<!-- 编辑菜单 -->
<template>
    <div>
        <el-breadcrumb class="myBreadcrumb">
            <el-breadcrumb-item v-for="(menu,i) in $route.meta.menus.filter((v,i)=>i!=0)" :key="i" :to="menu.path||null">{{menu.name}}</el-breadcrumb-item>
        </el-breadcrumb>

        <div class="content main-form">
            <el-form class="form" ref="menuform" :model="menu" :rules="rules" label-width="30%" :inline-message="true" autocomplete="off">
                <el-form-item v-if="id==0" :label="$t('type')" prop="type">
                    <el-radio-group v-model="menu.type">
                        <el-radio :label=0>{{$t("catalogue")}}</el-radio>
                        <el-radio :label=1>{{$t("menu")}}</el-radio>
                        <el-radio :label=2>{{$t("button")}}</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item :label="name" prop="name">
                    <el-input v-model="menu.name" :placeholder="$t('placeholder.input')" clearable></el-input>
                </el-form-item>
                <el-form-item v-if="menu.type!=2" :label="$t('parentId')" prop="parentId">
                    <el-popover placement="bottom-start" width="100%" v-model="isShowTree">
                        <Tree ref="menuTree" id="menuTree" :plugin="tree_plugin" :datas="menuList" @treeClick="selectParent" @treeInit="initTree"></Tree>
                        <el-input slot="reference" v-model="menu.parentName" :placeholder="$t('placeholder.input')" clearable></el-input>
                    </el-popover>
                </el-form-item>
                <!-- <el-form-item v-if="menu.type==0&&!menu.parentId" :label="$t('icon')" prop="icon">
                    <el-popover placement="bottom-start" popper-class="iconPopover" v-model="isShowIcon">
                        <i slot="reference" :class="[menu.icon,'pointer']"></i>
                        <div>
                            <i v-for="(icon,index) in iconList" :key="index" :class="[icon,'myIcon',{'active':icon==menu.icon}]"  @click="menu.icon=icon"></i>
                        </div>
                    </el-popover>
                </el-form-item> -->
                <el-form-item v-if="id==0&&menu.type!=2" :label="$t('url')" prop="url">
                    <el-input v-model="menu.url" :placeholder="$t('placeholder.input')" clearable :disabled="id!=0"></el-input>
                </el-form-item>
                <el-form-item :label="$t('priority')" prop="priority">
                    <el-input v-model="menu.priority" :placeholder="$t('placeholder.input')"></el-input>
                </el-form-item>
                <el-form-item class="form_btns">
                    <el-button type="primary" @click="submit('menuform')">{{$t("submit")}}</el-button>
                    <el-button @click="()=>this.$router.push({name:'menus'})">{{$t("cancel")}}</el-button>
                </el-form-item>
              
            </el-form>
            
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            id:0,
            menu:{
                type:1,//类型 0--目录 1--菜单 2--按钮
                name:null,//名称
                icon:null,//图标
                url:null,//地址
                parentId:null,//父节点
                parentName:null,//父节名称
                priority:null,//优先级
            },
            rules:{
                type:[{required:true,message:this.$t("noEmpty"),trigger:'change'}], 
                name:[{required:true,message:this.$t("noEmpty"),trigger:'change'}], 
            },
            isShowTree:false,//是否显示父节点树形菜单
            tree_plugin:{
                name:"name",
                title:"name",
                isSimpleData:true,
            },
            menuList:[],
            isShowIcon:false,//是否显示icon
            iconList:[
                'icon-guankongshuju','icon-shebeiguanli','icon-renliankuguanli','icon-xitongguanli','icon-qianduanfuwu','el-icon-platform-eleme','el-icon-eleme','el-icon-delete-solid',
                'el-icon-s-tools','el-icon-setting','el-icon-user-solid','el-icon-user','el-icon-phone','el-icon-phone-outline','el-icon-star-on','el-icon-star-off','el-icon-s-goods',
                'el-icon-goods','el-icon-warning','el-icon-warning-outline','el-icon-question','el-icon-info','el-icon-success','el-icon-circle-plus','el-icon-zoom-in','el-icon-zoom-out',
                'el-icon-s-help','el-icon-help','el-icon-picture','el-icon-picture-outline','el-icon-picture-outline-round','el-icon-upload','el-icon-upload2','el-icon-download','el-icon-camera-solid',
                'el-icon-camera','el-icon-video-camera','el-icon-message-solid','el-icon-s-cooperation','el-icon-s-order','el-icon-s-platform','el-icon-s-promotion','el-icon-s-home',
                'el-icon-s-ticket','el-icon-s-management','el-icon-s-open','el-icon-s-shop','el-icon-s-marketing','el-icon-s-flag','el-icon-s-finance','el-icon-s-claim','el-icon-s-custom',
                'el-icon-s-opportunity','el-icon-s-data','el-icon-s-check','el-icon-menu','el-icon-share','el-icon-view','el-icon-date','el-icon-folder-opened','el-icon-folder',
                'el-icon-tickets','el-icon-document-remove','el-icon-document-copy','el-icon-document','el-icon-document-add','el-icon-printer','el-icon-takeaway-box','el-icon-monitor',
                'el-icon-mobile','el-icon-attract','el-icon-umbrella','el-icon-headset','el-icon-brush','el-icon-mouse','el-icon-reading','el-icon-data-line','el-icon-data-board',
                'el-icon-pie-chart','el-icon-data-analysis','el-icon-film','el-icon-suitcase','el-icon-collection','el-icon-notebook-1','el-icon-notebook-2','el-icon-office-building',
                'el-icon-school','el-icon-table-lamp','el-icon-house','el-icon-shopping-bag-1','el-icon-shopping-bag-2','el-icon-present','el-icon-bank-card','el-icon-money','el-icon-coin',
                'el-icon-wallet','el-icon-discount','el-icon-price-tag','el-icon-guide','el-icon-female','el-icon-connection','el-icon-chat-square','el-icon-set-up','el-icon-turn-off',
                'el-icon-message','el-icon-postcard','el-icon-position','el-icon-turn-off-microphone','el-icon-bangzhu','el-icon-time','el-icon-odometer','el-icon-aim','el-icon-copy-document',
                'el-icon-stopwatch','el-icon-medal','el-icon-trophy','el-icon-first-aid-kit','el-icon-discover','el-icon-place','el-icon-location-outline','el-icon-location-information',
                'el-icon-alarm-clock','el-icon-map-location','el-icon-timer','el-icon-lock','el-icon-key','el-icon-service','el-icon-mobile-phone','el-icon-basketball','el-icon-ship','el-icon-soccer',
                'el-icon-wind-power','el-icon-lightning','el-icon-sunrise','el-icon-sunny','el-icon-cloudy','el-icon-moon','el-icon-dish','el-icon-sugar','el-icon-water-cup','el-icon-refrigerator',
                'el-icon-grape','el-icon-apple','el-icon-coffee','el-icon-milk-tea','el-icon-potato-strips','el-icon-lollipop',
            ]
        };
    },

    props : {},

    components: {
        Tree:()=>import("@/components/Tree"),
    },

    computed: {
        name(){
            switch(this.menu.type){
                case 0:return this.$t("catalogue")+this.$t("name");break;
                case 2:return this.$t("button")+this.$t("name");break;
                case 1:
                default: return this.$t("menu")+this.$t("name");
                break;
            }
        }
    },

    async beforeMount(){
        this.id=parseInt(this.$route.query.id);
        if(this.id)await this.getMenu();

        this.getMenus();
    },

    mounted(){},

    methods: {
        //获取单个menu
        async getMenu(){
            const {data}=await this.axios.get(`ui/privilege/${this.id}`,);
            if(data.statusCode==0){
                this.menu=data.data;
            }

        },

        //获取所有菜单
        async getMenus(){
            const {data}=await this.axios.post("ui/privilege/all",{},{headers:{noLoading:true}});
            this.menuList=data.data.filter(v=>v.type!=2&&!v.parentId);
        },

        //初始tree
        initTree(zTreeObj){
            let seletedNode= zTreeObj.transformToArray(zTreeObj.getNodes()).filter(node=>node.id==this.menu.parentId)[0];
            zTreeObj.selectNode(seletedNode);
        },

        //选择父节点
        selectParent(treeNode,treeId){
            this.menu.parentId=treeNode.id;
            this.menu.parentName=treeNode.name;
        },

        //提交
        submit(form){
            this.$refs[form].validate(async valid=>{
                if(valid){
                    let url="ui/privilege/add";
                    let tip=this.$t("add_S");
                    if(this.id!=0){
                        url="ui/privilege/edit";
                        tip=this.$t("modify_S");
                    }
                    //处理数据
                    if(this.menu.type!=0)this.menu.cron=null;
                    if(this.menu==2)this.menu.url=null;

                    await this.commonConfirm({title:this.$t("menuTip")});
                    const {data}=await this.axios.post(url,this.menu);
                    if(data.statusCode==0){
                        this.commonTip(tip).then(()=>{
                            this.$router.push({name:"menus"});
                        });
                    }
                }

            })
        },

    },

    watch:{
       "menu.parentId":function(ne,val){
            if(!ne){
                const zTreeObj=this.$refs["menuTree"].zTreeObj;
                // let selectedNode=zTreeObj.transformToArray(zTreeObj.getNodes()).filter(function(node){return node.id==val})[0];
                // zTreeObj.cancelSelectedNode(selectedNode);
                zTreeObj.cancelSelectedNode();
            }
       } 
    }
}

</script>
<style lang='less' scoped>
.pointer{
    cursor: pointer;
    font-size:16px;
    outline: none;
    &[class^="el-icon-"]{
        font-size: 18px;
        vertical-align: middle;
    }
}
.myIcon{
    cursor: pointer;
    margin:6px 14px 6px 0;
    font-size:16px;
    &[class^="el-icon-"]{
        font-size: 18px;
    }
    &.active{
        color:red;
    }
    
}

</style>
<style>
.iconPopover{
    max-width:50%;
}
</style>
