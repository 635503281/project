<!-- index -->
<template>
    
    <el-container class="index">
        <el-header class="clear">
            <ul class="ul1 clear left">
                <router-link tag="li" to="/index/config" active-class="active">配置管理</router-link>
                <router-link tag="li" to="/index/warn" active-class="active">告警管理</router-link>
                <router-link tag="li" to="/index/inspect" active-class="active">巡检监控</router-link>
                <router-link tag="li" to="/index/feature" active-class="active">性能管理</router-link>
                <router-link tag="li" to="/index/safe" active-class="active">安全管理</router-link>
            </ul>

            <el-dropdown class="right setting" trigger="click">
                <el-button type="primary" style="margin-right: 15px">设置 <i class="el-icon-setting"></i></el-button>
                
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item>个人中心</el-dropdown-item>
                    <el-dropdown-item >
                        <el-button class="hei" type="text" @click="exit">退出</el-button>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
            <el-dropdown class="right setting">
                <el-button type="text bai" style="margin-right: 15px">{{$t("languageSet")}} <i class="el-icon-setting"></i></el-button>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item><el-button class="hei" type="text" @click="changeLang('zh-cn')">{{$t("zh")}}</el-button> </el-dropdown-item>
                    <el-dropdown-item><el-button class="hei" type="text" @click="changeLang('en-us')">{{$t("en")}}</el-button></el-dropdown-item>
                </el-dropdown-menu>
                    
            </el-dropdown>
        </el-header>
        <router-view v-if='reload'></router-view>
       
    </el-container>

    
</template>

<script>
import { mapState } from 'vuex';

export default {
  data() {
    return {
        reload:true
        
    };
  },
  //暴露给所有子组件的方法， inject:['refresh']
  provide(){
      return{
          refresh:this.refresh
      }
  },

  props: {},

  components: {},

  computed: {
      
  },

  watch:{
  },

  mounted() {
    //判断是否登录
    if(!this.$store.state.login_flag){
        this.$router.push("/login");
    }
 
  },

  destroyed(){
  },

  methods: {
      //退出
      exit(){
          this.$store.commit("EXIT");
          this.$router.push("/login")
      },
      
      //改变语言
      changeLang(lang){
          this.$store.commit("CHANGE_LANG",lang);
          this.$i18n.locale=lang;
          this.refresh();
      },
      //刷新
      refresh(){
          this.reload=false;
          this.$nextTick(function(){
              this.reload=true;
          })     
          
      }
  }
};
</script>
<style>
.left{
    float: left;
}
.right{
     float:right;
}
.hei{
    color:#606266;
}
.bai{
    color:#fff;
}
.text_left{
    text-align: left;
}
.text_right{
    text-align: right;
}

</style>

<style lang='less' scoped>

.el-header{
    background-color: #4aa0f8;
    color:#fff;
}

.ul1{
    color:#fff;
    margin-left:50px;
    li{
        float:left;
        line-height:60px;
        margin-right: 30px;
        cursor:pointer;
    }
}

.setting{
    line-height:60px;
}

.el-container.index {
    height:100%;
}


.active{
    color:#ffd04b
}

</style>