<!-- 优图组 -->
<template>
    <div>
        <!-- <el-breadcrumb class="myBreadcrumb">
            <el-breadcrumb-item v-for="(menu,i) in $route.meta.menus" :key="i" :to="menu.path||null">{{menu.name}}</el-breadcrumb-item>
        </el-breadcrumb> -->

        <div class="content">
            <div class="main">
                <div class="main-table">
                    <el-table max-height="100%" :data="items" style="width: 100%" :empty-text="$t('noData')" @selection-change="val=>this.selectItems=val">
                        <!-- <el-table-column type="selection" fixed="left"></el-table-column> -->
                        <el-table-column prop="groupId" :label="$t('groupId')" min-width="150"></el-table-column>
                        <el-table-column prop="groupSize" :label="$t('groupSize')" min-width="150"></el-table-column>
                        <el-table-column prop="groupName" :label="$t('groupName')" min-width="150">
                            <!-- <template slot-scope="scope">
                                <el-input v-if="scope.row.isEdit" v-model="scope.row.groupName"></el-input>
                                <span v-else>{{scope.row.groupName||'--'}}</span>
                            </template> -->
                        </el-table-column>
                        <!-- <el-table-column prop="groupType" :label="$t('groupType')" min-width="150">
                            <template slot-scope="scope">
                                <el-input v-if="scope.row.isEdit" type="number" v-model="scope.row.groupType"></el-input>
                                <span v-else>{{scope.row.groupType||'--'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="description" :label="$t('description')" min-width="180">
                            <template slot-scope="scope">
                                <el-input v-if="scope.row.isEdit" v-model="scope.row.description"></el-input>
                                <span v-else>{{scope.row.description||'--'}}</span>
                            </template>
                        </el-table-column> -->
                        <!-- <el-table-column  :label="$t('operation')" width="90" fixed="right" align="center">
                            <template slot-scope="scope">
                                <button class="icon_modify iconBtn" :title="$t('modify')" @click="scope.row.isEdit=!scope.row.isEdit"></button>
                                <button class="el-icon-check iconBtn" :title="$t('save')" style="color:#4282ff;font-size:18px;"  @click="save(scope.row)"></button>
                                <button class="icon_delete iconBtn" :title="$t('delete')" @click="del('youtu/group/delete?groupId='+scope.row.groupId)"></button>
                            </template>
                        </el-table-column> -->
                    </el-table>
                    <!-- <Pagination :paginations="paginations" @changeDate='getPageData'/>   -->
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {basicPage} from "@/common/mixin"

export default {
    mixins:[basicPage],

    data () {
        return {
        };
    },

    props : {},

    components: {},

    computed: {},

    mounted(){

        this.getPageData();
    },

    methods: {
        //分页
        async getPageData(plugin={}){
            Object.assign(this.paginations,plugin);

            const {data}=await this.axios.get("youtu/group");
            if(data.statusCode==0){
                this.paginations.total=data.data.total;
                this.items=data.data.map(val=>{
                    val.isEdit=false;
                    return val
                });
            }else {
                this.paginations.total=0;
                this.items=[];
            }
        },

        //保存
        save(obj){
            this.commonConfirm({title:this.$t("isModify")}).then(async ()=>{
                const {data}=await this.axios.post("youtu/saveOrUpdateGroup",obj);
                if(data.statusCode==0){
                    this.commonTip(this.$t("modify_S"));
                    obj.isEdit=false;
                }
            })
        }
    }
}

</script>
<style lang='less' scoped>
</style>