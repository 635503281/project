<!-- 人像比对管理 -->
<template>
    <div>
        <!-- <el-breadcrumb class="myBreadcrumb">
            <el-breadcrumb-item v-for="(menu,i) in $route.meta.menus" :key="i" :to="menu.path||null">{{menu.name}}</el-breadcrumb-item>
        </el-breadcrumb> -->

        <div class="content">
            <div class="search">
                <div class="search_item">
                    <span>{{$t("selectTime")}}:</span>
                    <el-date-picker type="datetimerange" v-model="searchOption.times" range-separator="~" :start-placeholder="$t('startTime')" :end-placeholder="$t('endTime')"
                      value-format="yyyy-MM-dd HH:mm:ss" :picker-options="defaultTime.day_pickerOptions()" :clearable="false" popper-class="defaultTime_range">
                    </el-date-picker>
                </div>
                <div class="search_item">
                    <span>{{$t("shotPlaceFullAdress")}}:</span>
                    <el-input v-model="searchOption.shotPlaceFullAdress" :placeholder="$t('placeholder.input')" clearable></el-input>
                </div>
                <div class="search_btns">
                    <el-button type="primary" @click="search">{{$t("search")}}</el-button>
                    <el-button type="primary" @click="refresh"><span>{{isRefresh?'开启':'关闭'}}</span>刷新</el-button>
                </div>
            </div>

            <div class="main">
                <div class="main-table">
                    <div v-if="!items.length" class="empty_text">{{$t("noData")}}</div>
                    <el-row :gutter="20">
                        <el-col :xs="8" :sm="6" :md="4"  :lg="3" :xl="2" v-for="(row,k) in items" :key="k">
                            <el-card shadow="hover" :class="card_style(row)">
                                <div class="photo_box">
                                    <el-image :class="{'null':imgNull(row.Data)}" :src="row.Data|baseToImg" :alt="$t('image')">
                                        <template slot="placeholder"><img :src="row.Data|baseToImg"></template>
                                    </el-image>
                                    <div class="photo_operate">
                                        <span title="详情" class="el-icon-search" @click="showBox(row)"></span>
                                        <!-- <span title="定位" class="el-icon-location-outline" @click="position(row)"></span> -->
                                    </div>
                                </div>
                                
                                <div class="cardInfo">
                                    <pTip :content="row.createTime|timeFormat('MM-dd HH:mm:ss')"></pTip>
                                    <pTip :content="row.ShotPlaceFullAdress||'--'"></pTip>
                                    <template v-if="row.checkStatus == 1">
                                        <pTip :content="row.unqualifiedReason"></pTip>
                                    </template>
                                    <template v-else>
                                        <!-- <template v-if="row.facehitRecordPo&&row.facehitRecordPo.id">
                                            <pTip :class="[val.type]" v-for="val in filterArr(warnFlagList,row.facehitRecordPo.earlyWarningSign)" :key="val.id">
                                                <template v-if="row.facehitRecordPo.faceHitBackgroundRecordPo" v-slot:c>
                                                    <span v-for="va in filterArr(warnTypeList,row.facehitRecordPo.faceHitBackgroundRecordPo.warningType)" :key="va.id">
                                                        {{va.name == "--"?val.name:va.name}}
                                                    </span>
                                                </template>
                                                <span v-else v-slot:c>{{val.name}}</span>
                                            </pTip>
                                        </template> -->
                                        <template v-if="row.earlyWarningSign&&warnFlagList.some(v=>v.id==row.earlyWarningSign)">
                                            <pTip :class="[val.type]" v-for="val in filterArr(warnFlagList,row.earlyWarningSign)" :key="val.id">
                                                <template v-slot:c v-if="row.facehitRecordPo&&row.facehitRecordPo.faceHitBackgroundRecordPo&&row.facehitRecordPo.faceHitBackgroundRecordPo.managementCategoryName">
                                                    <span>{{row.facehitRecordPo.faceHitBackgroundRecordPo.managementCategoryName}}</span>
                                                </template>
                                                <template v-slot:c v-else><span>{{val.name}}</span></template>
                                            </pTip>
                                        </template>
                                        <p v-else class="grey"><span>未比中</span></p>
                                    </template>
                                    
                                </div>
                            </el-card>      
                        </el-col>
                    </el-row>
                </div>
                <Pagination :paginations="paginations" @changeDate='getPageData' :resize="true"/> 
            </div>
        </div>
        <el-drawer custom-class="myDrawer" :title="row.facehitRecordPo&&row.facehitRecordPo.id?'比中信息':'图片信息'" :visible.sync="showDrawer" direction="rtl" size="60%" :before-close="()=>{this.showDrawer=false;this.isMore=false;setTimeout(()=>this.row={})}">
            <div class="drawer_content">
                <template v-if="row.facehitRecordPo&&row.facehitRecordPo.id">
                    <div class="drawer_box">
                        <div class="drawer_wraper">
                            <div class="drawer_image" >
                                <template v-if="row.facehitRecordPo.faceHitBackgroundRecordPo">
                                    <el-popover popper-class="img_pop" placement="left-start" trigger="hover">
                                        <el-image :class="{'null':imgNull(row.facehitRecordPo.faceHitBackgroundRecordPo.personPhoto)}" :src="row.facehitRecordPo.faceHitBackgroundRecordPo.personPhoto|baseToImg"></el-image>
                                        <el-image slot="reference" :class="{'null':imgNull(row.facehitRecordPo.faceHitBackgroundRecordPo.personPhoto)}" :src="row.facehitRecordPo.faceHitBackgroundRecordPo.personPhoto|baseToImg"></el-image>
                                    </el-popover>
                                </template>
                                <template v-else>
                                    <el-image class="null" src=""></el-image>
                                </template>
                            </div>
            
                            <div class="drawer_details moreline" style="max-height:270px;">
                                <pTip><template v-slot:c><span>{{$t("similarity")}}:</span><span>{{row.facehitRecordPo.similarity|toPercentage}}</span></template></pTip>
                                <pTip><template v-slot:c><span>{{$t("featureID")}}:</span><span>{{row.facehitRecordPo.featureID||"--"}}</span></template></pTip>
                                <pTip><template v-slot:c><span>{{$t("earlyWarningSign")}}:</span>
                                    <el-tag v-for="val in filterArr(warnFlagList,row.facehitRecordPo.earlyWarningSign)" :key="val.id" size="small" :type="val.type">{{val.name}}</el-tag>
                                </template></pTip>
                                <!-- <pTip><template v-slot:c><span>{{$t("deviceID")}}:</span><span>{{row.facehitRecordPo.deviceID||"--"}}</span></template></pTip> -->
                                <!-- <pTip><template v-slot:c><span>图片ID:</span><span>{{row.facehitRecordPo.faceImageID||"--"}}</span></template></pTip> -->
                                <!-- <pTip><template v-slot:c><span>{{$t("compareTime")}}:</span><span>{{row.facehitRecordPo.compareTime|timeFormat}}</span></template></pTip> -->
                                <!-- <pTip><template v-slot:c><span>{{$t("shotPlaceFullAdress")}}:</span><span v-if="row.facehitRecordPo.shotPlaceFullAdress">{{row.facehitRecordPo.shotPlaceFullAdress}}</span>
                                    <span v-else>{{row.facehitRecordPo.imagePo?row.facehitRecordPo.imagePo.ShotPlaceFullAdress||"--":"--"}}</span>
                                </template></pTip> -->

                                <template v-if="row.facehitRecordPo.faceHitBackgroundRecordPo">
                                    <!-- <pTip>
                                        <template v-slot:c><span>关注人员类型:</span><span v-for="val in filterArr(warnTypeList,row.facehitRecordPo.faceHitBackgroundRecordPo.warningType)" :key="val.id">{{val.name}}</span></template>
                                    </pTip> -->
                                    <pTip><template v-slot:c><span>{{$t("managementCateGory")}}:</span><span>{{row.facehitRecordPo.faceHitBackgroundRecordPo.managementCategoryName||'--'}}</span></template></pTip>
                                    <pTip><template v-slot:c><span>{{$t("controllingMatter")}}:</span><span>{{row.facehitRecordPo.faceHitBackgroundRecordPo.controllingMatter||'--'}}</span></template></pTip>
                                    <pTip><template v-slot:c><span>{{$t("suggestedDisposalMeasure")}}:</span><span>{{row.facehitRecordPo.faceHitBackgroundRecordPo.suggestedDisposalMeasure||'--'}}</span></template></pTip>
                                    <pTip><template v-slot:c><span>{{$t("policeName")}}:</span><span>{{row.facehitRecordPo.faceHitBackgroundRecordPo.policeName||'--'}}</span></template></pTip>
                                    <pTip><template v-slot:c><span>{{$t("controllingUnitPoliceName")}}:</span><span>{{row.facehitRecordPo.faceHitBackgroundRecordPo.controllingUnitPoliceName||'--'}}</span></template></pTip>
                                    <pTip><template v-slot:c><span>{{$t("registerUnitPoliceName")}}:</span><span>{{row.facehitRecordPo.faceHitBackgroundRecordPo.registerUnitPoliceName||'--'}}</span></template></pTip>
                                    <pTip><template v-slot:c><span>{{$t("registerPeopleName")}}:</span><span>{{row.facehitRecordPo.faceHitBackgroundRecordPo.registerPeopleName||'--'}}</span></template></pTip>
                                    <pTip><template v-slot:c><span></span><span></span></template></pTip>

                                    <pTip><template v-slot:c><span>{{$t("personName")}}:</span><span>{{row.facehitRecordPo.faceHitBackgroundRecordPo.personName||'--'}}</span></template></pTip>
                                    <pTip><template v-slot:c><span>{{$t("personSex")}}:</span>
                                        <span v-if="row.facehitRecordPo.faceHitBackgroundRecordPo.personSex=='1'">男</span>
                                        <span v-else-if="row.facehitRecordPo.faceHitBackgroundRecordPo.personSex=='2'">女</span>
                                        <span v-else>{{row.facehitRecordPo.faceHitBackgroundRecordPo.personSex||'--'}}</span>
                                    </template></pTip>
                                    <pTip><template v-slot:c><span>{{$t("identificationCard")}}:</span><span>{{row.facehitRecordPo.faceHitBackgroundRecordPo.identityNumber||'--'}}</span></template></pTip>
                                    <pTip><template v-slot:c><span>{{$t("personBirth")}}:</span><span>{{row.facehitRecordPo.faceHitBackgroundRecordPo.personBirth|timeFormat("yyyy-MM-dd")}}</span></template></pTip>
                                    <pTip><template v-slot:c><span>户籍区县名称:</span><span>{{row.facehitRecordPo.faceHitBackgroundRecordPo.ResidenceNoName||'--'}}</span></template></pTip>
                                    <pTip><template v-slot:c><span>{{$t("residenceAddress")}}:</span><span>{{row.facehitRecordPo.faceHitBackgroundRecordPo.residenceAddress||'--'}}</span></template></pTip>
                                    <pTip><template v-slot:c><span>居住区县名称:</span><span>{{row.facehitRecordPo.faceHitBackgroundRecordPo.AddressNoName||'--'}}</span></template></pTip>
                                    <pTip><template v-slot:c><span>{{$t("address1")}}:</span><span>{{row.facehitRecordPo.faceHitBackgroundRecordPo.address||'--'}}</span></template></pTip>
                                    <pTip><template v-slot:c><span>{{$t("responsiblePoliceName")}}:</span><span>{{row.facehitRecordPo.faceHitBackgroundRecordPo.responsiblePoliceName||'--'}}</span></template></pTip>
                                    <pTip><template v-slot:c><span>{{$t("responsiblePolicePhoneNumber")}}:</span><span>{{row.facehitRecordPo.faceHitBackgroundRecordPo.responsiblePolicePhoneNumber||'--'}}</span></template></pTip>
                                    <pTip><template v-slot:c><span>{{$t("registerTime")}}:</span><span>{{row.facehitRecordPo.faceHitBackgroundRecordPo.registerTime|timeFormat}}</span></template></pTip>
                                </template>
                            </div>
                        </div>
                    </div>

                    <!-- <div class="drawer_box" v-if="row.facehitRecordPo.faceHitBackgroundRecordPo">
                        <h4 class="title">背景信息</h4>
                        <div class="drawer_wraper">
                            <div class="drawer_image" >
                                <el-image :class="{'null':imgNull(row.facehitRecordPo.faceHitBackgroundRecordPo.personPhoto)}" :src="row.facehitRecordPo.faceHitBackgroundRecordPo.personPhoto|baseToImg"></el-image>
                            </div>
                            <div class="drawer_details moreline" style="max-height:300px;">
                                <pTip><template v-slot:c><span>{{$t("personName")}}:</span><span>{{row.facehitRecordPo.faceHitBackgroundRecordPo.personName||'--'}}</span></template></pTip>
                                <pTip><template v-slot:c><span>{{$t("personSex")}}:</span><span>{{{"1":"男","2":"女","":"--",[null]:"--"}[row.facehitRecordPo.faceHitBackgroundRecordPo.personSex]}}</span></template></pTip>
                                <pTip><template v-slot:c><span>{{$t("identificationCard")}}:</span><span>{{row.facehitRecordPo.faceHitBackgroundRecordPo.identityNumber||'--'}}</span></template></pTip>
                                <pTip><template v-slot:c><span>{{$t("personBirth")}}:</span><span>{{row.facehitRecordPo.faceHitBackgroundRecordPo.personBirth|timeFormat("yyyy-MM-dd")}}</span></template></pTip>
                                <pTip><template v-slot:c><span>{{$t("residenceNo")}}:</span><span>{{row.facehitRecordPo.faceHitBackgroundRecordPo.residenceNo||'--'}}</span></template></pTip>
                                <pTip><template v-slot:c><span>{{$t("residenceAddress")}}:</span><span>{{row.facehitRecordPo.faceHitBackgroundRecordPo.residenceAddress||'--'}}</span></template></pTip>
                                <pTip><template v-slot:c><span>{{$t("addressNo")}}:</span><span>{{row.facehitRecordPo.faceHitBackgroundRecordPo.addressNo||'--'}}</span></template></pTip>
                                <pTip><template v-slot:c><span>{{$t("address1")}}:</span><span>{{row.facehitRecordPo.faceHitBackgroundRecordPo.address||'--'}}</span></template></pTip>
                                <pTip><template v-slot:c><span>{{$t("featureID")}}:</span><span>{{row.facehitRecordPo.faceHitBackgroundRecordPo.featId||'--'}}</span></template></pTip>
                                <pTip><template v-slot:c><span>{{$t("warnFlag")}}:</span>
                                    <el-Tag v-if="row.facehitRecordPo.faceHitBackgroundRecordPo.warningSign=='1'" type="red">{{$t("warn_red")}}</el-Tag>
                                    <el-Tag v-else-if="row.facehitRecordPo.faceHitBackgroundRecordPo.warningSign=='2'" size="small" type="orange">{{$t("warn_orange")}}</el-Tag>
                                    <el-Tag v-else-if="row.facehitRecordPo.faceHitBackgroundRecordPo.warningSign=='3'" size="small" type="yellow">{{$t("warn_yellow")}}</el-Tag>
                                    <el-Tag v-else-if="row.facehitRecordPo.faceHitBackgroundRecordPo.warningSign=='4'" type="no" size="small">{{$t("warn_no")}}</el-Tag>
                                    <el-Tag v-else type="no" size="small">--</el-Tag>
                                </template></pTip>
                                <pTip>
                                    <template v-slot:c><span>关注人员类型:</span><span v-for="val in filterArr(warnTypeList,row.facehitRecordPo.faceHitBackgroundRecordPo.warningType)" :key="val.id">{{val.name}}</span></template>
                                </pTip>
                                <pTip><template v-slot:c><span>{{$t("suggestedDisposalMeasure")}}:</span><span>{{row.facehitRecordPo.faceHitBackgroundRecordPo.suggestedDisposalMeasure||'--'}}</span></template></pTip>
                                <pTip><template v-slot:c><span>{{$t("compareTime")}}:</span><span>{{row.facehitRecordPo.faceHitBackgroundRecordPo.comparingTime|timeFormat}}</span></template></pTip>
                                <pTip><template v-slot:c><span>{{$t("deviceID")}}:</span><span>{{row.facehitRecordPo.faceHitBackgroundRecordPo.deviceId||'--'}}</span></template></pTip>
                                <pTip><template v-slot:c><span>{{$t("policeCode")}}:</span><span>{{row.facehitRecordPo.faceHitBackgroundRecordPo.policeCode||"--"}}</span></template></pTip>
                                <pTip><template v-slot:c><span>{{$t("managementCateGory")}}:</span><span>{{row.facehitRecordPo.faceHitBackgroundRecordPo.managementCateGory||'--'}}</span></template></pTip>
                                <pTip><template v-slot:c><span>{{$t("controllingMatter")}}:</span><span>{{row.facehitRecordPo.faceHitBackgroundRecordPo.controllingMatter||'--'}}</span></template></pTip>
                                <pTip><template v-slot:c><span>{{$t("controllingUnitPoliceCode")}}:</span><span>{{row.facehitRecordPo.faceHitBackgroundRecordPo.controllingUnitPoliceCode||'--'}}</span></template></pTip>
                                <pTip><template v-slot:c><span>{{$t("controllingUnitPoliceName")}}:</span><span>{{row.facehitRecordPo.faceHitBackgroundRecordPo.controllingUnitPoliceName||'--'}}</span></template></pTip>
                                <pTip><template v-slot:c><span>{{$t("responsiblePoliceName")}}:</span><span>{{row.facehitRecordPo.faceHitBackgroundRecordPo.responsiblePoliceName||'--'}}</span></template></pTip>
                                <pTip><template v-slot:c><span>{{$t("responsiblePolicePhoneNumber")}}:</span><span>{{row.facehitRecordPo.faceHitBackgroundRecordPo.responsiblePolicePhoneNumber||'--'}}</span></template></pTip>
                                <pTip><template v-slot:c><span>{{$t("registerUnitPoliceCode")}}:</span><span>{{row.facehitRecordPo.faceHitBackgroundRecordPo.registerUnitPoliceCode||'--'}}</span></template></pTip>
                                <pTip><template v-slot:c><span>{{$t("registerUnitPoliceName")}}:</span><span>{{row.facehitRecordPo.faceHitBackgroundRecordPo.registerUnitPoliceName||'--'}}</span></template></pTip>
                                <pTip><template v-slot:c><span>{{$t("registerPeopleName")}}:</span><span>{{row.facehitRecordPo.faceHitBackgroundRecordPo.registerPeopleName||'--'}}</span></template></pTip>
                                <pTip><template v-slot:c><span>{{$t("registerTime")}}:</span><span>{{row.facehitRecordPo.faceHitBackgroundRecordPo.registerTime|timeFormat}}</span></template></pTip>       
                            </div>
                        </div>
                    </div> -->
                </template>

                <div class="drawer_box">
                    <h4 class="title" v-if="row.facehitRecordPo&&row.facehitRecordPo.id">图片信息</h4>
                    <div class="drawer_wraper">
                        <div class="drawer_image">
                            <el-popover popper-class="img_pop" placement="left-start" trigger="hover">
                                <el-image :class="{'null':imgNull(row.Data)}" :src="row.Data|baseToImg"></el-image> 
                                <el-image slot="reference" :class="{'null':imgNull(row.Data)}" :src="row.Data|baseToImg"></el-image> 
                            </el-popover>
                        </div>
                        <div class="drawer_details moreline" style="max-height:230px;">
                            <pTip><template v-slot:c><span>采集时间:</span><span>{{row.ShotTime|timeFormat}}</span></template></pTip>
                            <pTip><template v-slot:c><span>上报时间:</span><span>{{row.reportTime|timeFormat}}</span></template></pTip>
                            <pTip><template v-slot:c><span>请求时间:</span><span>{{row.RequestTime|toTime}}</span></template></pTip>
                            <pTip><template v-slot:c><span>比对时间:</span><span>{{row.retrieveRspTime|timeFormat}}</span></template></pTip>
                            <pTip><template v-slot:c><span>预警时间:</span><span>{{row.warnTime|timeFormat}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("deviceID")}}:</span><span>{{row.DeviceID||"--"}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("shotPlaceFullAdress")}}:</span><span>{{row.ShotPlaceFullAdress||"--"}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("collector")}}:</span><span>{{row.CollectorName||"--"}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("collectorOrg")}}:</span><span>{{row.CollectorOrg||"--"}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("description")}}:</span><span>{{row.ContentDescription||"--"}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("title")}}:</span><span>{{row.Title||"--"}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("addrCode")}}:</span><span>{{row.AddrCode||"--"}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("addrDetail")}}:</span><span>{{row.AddrDetail||"--"}}</span></template></pTip>
                            <pTip><template v-slot:c><span>图片ID:</span><span>{{row.ImageID}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("imgSource")}}:</span><span>{{row.ImageSource||"--"}}</span></template></pTip>
                            <p v-if="row.FaceList&&row.FaceList.length"><span class="textBtn" @click="isMore=!isMore">{{isMore?"收起":"更多..."}}</span></p>
                            <!-- <pTip><template v-slot:c><span>{{$t("shotPlaceLongitude")}}:</span><span>{{row.ShotPlaceLongitude||"--"}}</span></template></pTip> -->
                            <!-- <pTip><template v-slot:c><span>{{$t("shotPlaceLatitude")}}:</span><span>{{row.ShotPlaceLatitude||"--"}}</span></template></pTip> -->
                            <!-- <pTip><template v-slot:c><span>{{$t("width")}}:</span><span>{{row.Width!=null?row.Width:"--"}}</span></template></pTip> -->
                            <!-- <pTip><template v-slot:c><span>{{$t("height")}}:</span><span>{{row.Height!=null?row.Height:row.height!=null?row.height:"--"}}</span></template></pTip> -->
                            <!-- <pTip><template v-slot:c><span>{{$t("sourceVideoID")}}:</span><span>{{row.SourceVideoID||"--"}}</span></template></pTip> -->
                            <!-- <pTip><template v-slot:c><span>{{$t("storagePath")}}:</span><span>{{row.StoragePath||"--"}}</span></template></pTip> -->
                            <!-- <pTip><template v-slot:c><span>{{$t("fileSize")}}:</span><span>{{row.FileSize}}</span></template></pTip> -->
                            <!-- <pTip><template v-slot:c><span>文件格式:</span><span>{{row.FileFormat}}</span></template></pTip> --> 
                        </div>
                        
                    </div>
                </div>
                
                <template v-if="isMore&&row.FaceList&&row.FaceList.length">
                    <h4 class="title">附加图片及人脸信息</h4>
                    <div class="drawer_box morewraper">
                        <div class="drawer_wraper" v-for="(v,i) in row.FaceList" :key="i">
                            <template v-if="v.SubImageList&&v.SubImageList.length">
                                <el-carousel class="drawer_image" :interval="5000"  indicator-position="none" :arrow="v.SubImageList.length>1?'hover':'never'">
                                    <el-carousel-item v-for="(val,k) in v.SubImageList" :key="k">
                                        <el-popover popper-class="img_pop" placement="left-start" trigger="hover">
                                            <el-image :class="{'null':imgNull(val.dada)}" :src="val.data|baseToImg"></el-image>
                                            <el-image slot="reference" :class="{'null':imgNull(val.dada)}" :src="val.data|baseToImg"></el-image>
                                        </el-popover>
                                    </el-carousel-item>
                                </el-carousel>
                            </template>
                            <div v-else class="drawer_image"><el-image class="null" src=""></el-image></div>
                            <div class="drawer_details"><!-- moreline -->
                                <pTip><template v-slot:c><span>{{$t("name1")}}:</span><span>{{v.Name||"--"}}</span></template></pTip>
                                <pTip><template v-slot:c><span>{{$t("gender")}}:</span>
                                    <span v-if="v.GenderCode=='1'">{{$t("man")}}</span>
                                    <span v-else-if="v.GenderCode=='2'">{{$t("woman")}}</span>
                                    <span v-else-if="v.GenderCode">未知</span>
                                    <span v-else>--</span>
                                </template></pTip>
                                <pTip><template v-slot:c><span>{{$t("ethic")}}:</span><span>{{v.EthicCode||"--"}}</span></template></pTip>
                                <pTip><template v-slot:c><span>{{$t("faceID")}}:</span><span>{{v.FaceID||"--"}}</span></template></pTip>
                                <pTip><template v-slot:c><span>{{$t("deviceID")}}:</span><span>{{v.DeviceID||"--"}}</span></template></pTip>
                                <pTip><template v-slot:c><span>{{$t("sourceID")}}:</span><span>{{v.SourceID||"--"}}</span></template></pTip>
                                <pTip><template v-slot:c><span>{{$t("locationMarkTime")}}:</span><span>{{v.LocationMarkTime|toTime}}</span></template></pTip>
                                <pTip><template v-slot:c><span>{{$t("faceAppearTime")}}:</span><span>{{v.FaceAppearTime|toTime}}</span></template></pTip>
                                <pTip><template v-slot:c><span>{{$t("faceDisAppearTime")}}:</span><span>{{v.FaceDisAppearTime|toTime}}</span></template></pTip>
                                <!-- <pTip><template v-slot:c><span>{{$t("leftTopX")}}:</span><span>{{v.LeftTopX||"--"}}</span></template></pTip>
                                <pTip><template v-slot:c><span>{{$t("leftTopY")}}:</span><span>{{v.LeftTopY||"--"}}</span></template></pTip>
                                <pTip><template v-slot:c><span>{{$t("rightBtmX")}}:</span><span>{{v.RightBtmX||"--"}}</span></template></pTip>
                                <pTip><template v-slot:c><span>{{$t("rightBtmY")}}:</span><span>{{v.RightBtmY||"--"}}</span></template></pTip> -->
                            </div>
                        </div>
                    </div>
                </template>
                
            </div>
        </el-drawer>

        <!-- <el-drawer custom-class="myDrawer" title="比中信息" :visible.sync="showRatio" direction="rtl" size="60%" :before-close="()=>{this.showRatio=false;setTimeout(()=>this.ratioObj={})}">
            <div class="drawer_content">
                <div class="drawer_box">
                    <div class="drawer_wraper">
                        <div class="drawer_image" >
                            <div class="image_title">人像照片</div>
                            <el-image :class="{'null':imgNull(ratioObj.faceImage)}" :src="ratioObj.faceImage|baseToImg"></el-image>
                        </div>
                        <div class="drawer_image" >
                            <div class="image_title">现场照片</div>
                            <el-image :class="{'null':imgNull(ratioObj.sceneImage)}" :src="ratioObj.sceneImage|baseToImg"></el-image>
                        </div>
                        <div class="drawer_details hasImageTitle">
                            <pTip><template v-slot:c><span>{{$t("similarity")}}:</span><span>{{ratioObj.similarity|toPercentage}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("featureID")}}:</span><span>{{ratioObj.featureID||"--"}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("deviceID")}}:</span><span>{{ratioObj.deviceID||"--"}}</span></template></pTip>
                            <pTip><template v-slot:c><span>图片ID:</span><span>{{ratioObj.faceImageID||"--"}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("compareTime")}}:</span><span>{{ratioObj.compareTime|timeFormat}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("earlyWarningSign")}}:</span>
                                <el-tag v-for="val in filterArr(warnFlagList,ratioObj.earlyWarningSign)" :key="val.id" size="small" :type="val.type">{{val.name}}</el-tag>
                            </template></pTip>
                            <pTip><template v-slot:c><span>{{$t("shotPlaceFullAdress")}}:</span><span v-if="ratioObj.shotPlaceFullAdress">{{ratioObj.shotPlaceFullAdress}}</span>
                                <span v-else>{{ratioObj.imagePo?ratioObj.imagePo.ShotPlaceFullAdress||"--":"--"}}</span>
                            </template></pTip>
                        </div>
                    </div>
                </div>
                <div class="drawer_box" v-if="ratioObj.faceHitBackgroundRecordPo">
                    <h4 class="title">背景信息</h4>
                    <div class="drawer_wraper">
                        <div class="drawer_image" >
                            <el-image :class="{'null':imgNull(ratioObj.faceHitBackgroundRecordPo.personPhoto)}" :src="ratioObj.faceHitBackgroundRecordPo.personPhoto|baseToImg"></el-image>
                        </div>
                        <div class="drawer_details moreline" style="max-height:300px;">
                            <pTip><template v-slot:c><span>{{$t("personName")}}:</span><span>{{ratioObj.faceHitBackgroundRecordPo.personName||'--'}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("personSex")}}:</span><span>{{{"1":"男","2":"女","":"--",[null]:"--"}[ratioObj.faceHitBackgroundRecordPo.personSex]}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("identificationCard")}}:</span><span>{{ratioObj.faceHitBackgroundRecordPo.identityNumber||'--'}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("personBirth")}}:</span><span>{{ratioObj.faceHitBackgroundRecordPo.personBirth|timeFormat("yyyy-MM-dd")}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("residenceNo")}}:</span><span>{{ratioObj.faceHitBackgroundRecordPo.residenceNo||'--'}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("residenceAddress")}}:</span><span>{{ratioObj.faceHitBackgroundRecordPo.residenceAddress||'--'}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("addressNo")}}:</span><span>{{ratioObj.faceHitBackgroundRecordPo.addressNo||'--'}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("address1")}}:</span><span>{{ratioObj.faceHitBackgroundRecordPo.address||'--'}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("featureID")}}:</span><span>{{ratioObj.faceHitBackgroundRecordPo.featId||'--'}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("warnFlag")}}:</span>
                                <el-Tag v-if="ratioObj.faceHitBackgroundRecordPo.warningSign=='1'" type="red">{{$t("warn_red")}}</el-Tag>
                                <el-Tag v-else-if="ratioObj.faceHitBackgroundRecordPo.warningSign=='2'" size="small" type="orange">{{$t("warn_orange")}}</el-Tag>
                                <el-Tag v-else-if="ratioObj.faceHitBackgroundRecordPo.warningSign=='3'" size="small" type="yellow">{{$t("warn_yellow")}}</el-Tag>
                                <el-Tag v-else-if="ratioObj.faceHitBackgroundRecordPo.warningSign=='4'" type="no" size="small">{{$t("warn_no")}}</el-Tag>
                                <el-Tag v-else type="no" size="small">--</el-Tag>
                            </template></pTip>
                            <pTip>
                                <template v-slot:c><span>关注人员类型:</span><span v-for="val in filterArr(warnTypeList,ratioObj.faceHitBackgroundRecordPo.warningType)" :key="val.id">{{val.name}}</span></template>
                            </pTip>
                            <pTip><template v-slot:c><span>{{$t("suggestedDisposalMeasure")}}:</span><span>{{ratioObj.faceHitBackgroundRecordPo.suggestedDisposalMeasure||'--'}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("compareTime")}}:</span><span>{{ratioObj.faceHitBackgroundRecordPo.comparingTime|timeFormat}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("deviceID")}}:</span><span>{{ratioObj.faceHitBackgroundRecordPo.deviceId||'--'}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("policeCode")}}:</span><span>{{ratioObj.faceHitBackgroundRecordPo.policeCode||"--"}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("managementCateGory")}}:</span><span>{{ratioObj.faceHitBackgroundRecordPo.managementCateGory||'--'}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("controllingMatter")}}:</span><span>{{ratioObj.faceHitBackgroundRecordPo.controllingMatter||'--'}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("controllingUnitPoliceCode")}}:</span><span>{{ratioObj.faceHitBackgroundRecordPo.controllingUnitPoliceCode||'--'}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("controllingUnitPoliceName")}}:</span><span>{{ratioObj.faceHitBackgroundRecordPo.controllingUnitPoliceName||'--'}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("responsiblePoliceName")}}:</span><span>{{ratioObj.faceHitBackgroundRecordPo.responsiblePoliceName||'--'}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("responsiblePolicePhoneNumber")}}:</span><span>{{ratioObj.faceHitBackgroundRecordPo.responsiblePolicePhoneNumber||'--'}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("registerUnitPoliceCode")}}:</span><span>{{ratioObj.faceHitBackgroundRecordPo.registerUnitPoliceCode||'--'}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("registerUnitPoliceName")}}:</span><span>{{ratioObj.faceHitBackgroundRecordPo.registerUnitPoliceName||'--'}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("registerPeopleName")}}:</span><span>{{ratioObj.faceHitBackgroundRecordPo.registerPeopleName||'--'}}</span></template></pTip>
                            <pTip><template v-slot:c><span>{{$t("registerTime")}}:</span><span>{{ratioObj.faceHitBackgroundRecordPo.registerTime|timeFormat}}</span></template></pTip>       
                        </div>
                    </div>
                </div>
            </div>
        </el-drawer> -->

        <el-dialog custom-class="location_map" :visible.sync="isDialog" title="位置" center width="80%" :close-on-click-modal="false" :destroy-on-close="true">
            <Location :mark="mark"></Location>
        </el-dialog> 
    </div>
</template>

<script>
import {basicPage} from "@/common/mixin"
import eVue from "@/common/event"
import pTip from "@/components/pTip"
import Location from "@/components/Location"
import {checkLonOrLat} from "@/common/method"

export default {
    mixins:[basicPage],
    data () {
        return {
            isRefresh: true,//默认开启刷新
            searchOption:{
                times:this.defaultTime.day(),
                // times:null,
                deviceID:null,//设备id
                shotPlaceFullAdress:null,
            },
            deviceList:[{id:null,Name:this.$t("all")}],

            warnFlagList:[
                {id:null,name:this.$t("all")},{id:1,name:this.$t("warn_red"),type:"red"},{id:2,name:this.$t("warn_orange"),type:"orange"},{id:3,name:this.$t("warn_yellow"),type:"yellow"},{id:4,name:this.$t("warn_no"),type:"no"},
            ],
            showRatio:false,//显示比中信息
            ratioObj:{},

            warnTypeList:[
                {id:"1",name:"全国在逃"},{id:"2",name:"全国布控"},{id:"3",name:"全国治安重点人"},{id:"4",name:"本地布控"},{id:"5",name:"地方治安重点人"}
            ],

            isMore:false,//是否显示更多信息

            isDialog: false,
            mark: {
                longitude: 0,
                latitude: 0,
            }
        };
    },

    components:{
        pTip, Location
    },

    filters: {
        toTime(val){
            if(!val)return "--"
            val=val.toString();
            if(val.indexOf("-")!=-1)return val
            return val.slice(0,4)+"-"+val.slice(4,6)+"-"+val.slice(6,8)+" "+val.slice(8,10)+":"+val.slice(10,12)+":"+val.slice(12,14)
        }
    },

    computed:{
        //过滤数据循环
        filterArr(){
            return function(list,id){
                let arr=list.filter(val=>val.id==id);
                if(!arr.length)arr=[{id,name:"--",type:"no"}];
                return arr
            }
        },

        imgNull(){
            return function(val){
                if(val == null||val == "null")return true
                else{
                    if(!val)return false
                    let arr = val.split("/").reverse();
                    const newVal = arr[0];
                    if(newVal == null|| newVal == "null")return true
                    else return false
                }
                    
            }
       },

        card_style(){
            return function(row){
                const {earlyWarningSign} = row;
                let arrClass = [];
                switch(earlyWarningSign){
                    case 1:  arrClass.push('border_red');break;
                    case 2:  arrClass.push('border_orange');break;
                    case 3:  arrClass.push('border_yellow');break;
                    case 4:  arrClass.push('border_no');break;
                }
                
                return arrClass.join(" ")
            }
        }
    },

    mounted(){
        //监听socket推送
        this.refresh();
    },

    methods: {
        //出现详情
        async showBox(row){
            const {id, partition} = row;
            const {data} = await this.axios.post(`ui/image/get/partition/${id}?partition=${partition}`);
            if(data.statusCode == 0){
                if(data.data){
                    this.showDrawer = true;
                    this.row = data.data;
                }else{
                    this.commonTip("没有详情",'tip_notice');
                }
        
            }
        },

        //分页
        async getPageData(plugin={},headers={}){
            Object.assign(this.paginations,plugin);
            let obj={
                pageNum:this.paginations.currentPage,
                pageSize:this.paginations.pageSize,
                searchBy:"shotPlaceFullAdress",
                keyword:this.searchOption.shotPlaceFullAdress,
                search:{
                    startTime:this.searchOption.times?this.searchOption.times[0]:null,
                    endTime:this.searchOption.times?this.searchOption.times[1]:null,
                }
            }
            const {data}=await this.axios.post("ui/image/homelist",obj,{headers});
            if(data.statusCode==0){
                this.paginations.total=data.data.total;
                this.items=data.data.result;
            }else{
                this.paginations.total=0;
                this.items=[];
            }

        },

        //定位
        position(row){
            const {ShotPlaceLongitude, ShotPlaceLatitude} = row;
            const lon = checkLonOrLat(ShotPlaceLongitude, "lon");
            const lat = checkLonOrLat(ShotPlaceLatitude, "lat");
            if(!lon||!lat){
                this.commonTip("经纬度格式不正确", "tip_notice");
                return;
            }

            this.mark = { longitude: lon, latitude: lat};
            this.isDialog = true;
        },

        //开启监听
        openRefresh(){
            eVue.$on("ratio", ()=>{
                this.getPageData({currentPage:1},{noLoading:true,responseError: true});
            });
            eVue.$on("comparison", ()=>{
                this.getPageData({currentPage:1},{noLoading:true,responseError: true});
            });
        },
        //关闭监听
        closeRefresh(){
            eVue.$off("ratio");
            eVue.$off("comparison");
        },

        //开关实时刷新
        refresh(){
            this.isRefresh?this.openRefresh():this.closeRefresh();
            this.isRefresh = !this.isRefresh;
        },
    },

    destroyed(){
        this.closeRefresh();
    },
}

</script>
<style lang='less' scoped>
.textBtn{
    color:#4181FF!important;
    cursor: pointer;
    bottom: 12px;
    left:0;
}

.photo_box{
    position: relative;
    height: auto;
    &:hover{
        .photo_operate{
            display: block;
        }
    }

    /deep/ .el-image{
        cursor: default!important;
        img{
            cursor: default!important;
        }
    }
  
    @height:30px;
    .photo_operate{
        display: none;
        position: absolute;
        width: 100%;
        bottom: 3px;
        line-height: @height;
        background: rgba(255,255,255, 0.1);
        
        span{
            margin-left: 4px;
            cursor: pointer;
            color:#4181FF;
            font-size: 20px;
            vertical-align: middle;
        }
    }
}
</style>