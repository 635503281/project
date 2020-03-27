import Vue from "vue"
import axios from "axios"
import store from "@/store/store"
import {commonTip} from "@/common/method"
import i18n from "../i18n/i18n"
import router from '@/router/router'

const CancelToken = axios.CancelToken;
let instance=axios.create();
instance.defaults.timeout=100000;//超时时间
const strPath = window.document.location.pathname; 
const appName = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);
const serverUrl = window.location.protocol+"//"+window.location.host+appName;
instance.defaults.baseURL=serverUrl;//请求地址前缀


function filterCancel(config){
    let cancelArr=Vue.prototype.copy(store.state.axiosCancel);
    for(let i=0,val;val=cancelArr[i];i++){
        if(val.url==config.url){
            cancelArr.splice(i,1);
            break;
        }
    }
    
    store.commit("SET_AXIOSCANCEL",cancelArr);
};

// 拦截器(取消拦截器 instance.interceptors.request.eject(instance.request))
// 请求配置
instance.request=instance.interceptors.request.use(
    config=>{
        //设置取消请求
        config.cancelToken = new CancelToken(cancel => {
            let cancelArr=store.state.axiosCancel;
            cancelArr.push({url:instance.defaults.baseURL+"/"+config.url,cancel:cancel,isCancel:config.headers.isCancel});
            cancelArr=cancelArr.filterSame("url");
            store.commit("SET_AXIOSCANCEL",cancelArr);
        });

        if(!config.headers.noLoading){//带noLoading:true的不启用全局加载层
            store.commit("CHANGE_LOADING",true);
        }

        if(config.headers.page=="login"){//登录页面不做统一处理
            return config
        }

        // const token=store.state.token;
        // if(!token)return config;

        let header={
            // token:token,
            "content-type":"application/json"
        };
        config.headers=Object.assign(header,config.headers);
        //修改数据类型
        if(config.headers["content-type"]=="multipart/form-data"&&config.method=="post"&&!(config.data instanceof FormData)){
            let data=new FormData;
            for(let key in config.data){
                data.append(key,config.data[key]);
            }
            config.data=data;
        }
        if(config.method=="post"&&(config.data instanceof File)){
            let file=new FormData;
            file.append("file",config.data);
            config.data=file;
        }    
        return config
    },

    error=>{
        const {config,request,response}=error;
        if(!config)return  Promise.reject(response)
        filterCancel(config);

        if(!config.headers.noLoading)store.commit("CHANGE_LOADING",false);

        commonTip(i18n.t("requestError"),"tip_error")

        return Promise.reject(response)
    }
)

instance.response=instance.interceptors.response.use(
    response=>{
        const {config,data}=response;
        filterCancel(config);

        if(!config.headers.noLoading){
            store.commit("CHANGE_LOADING",false);
        }

        if(config.headers.noTip)return response;//noTip:true不提示错误信息

        if(data.statusCode!=0){
            commonTip(data.statusMsg,"tip_error");
            
            if(data.statusCode==20002||data.statusCode==30006){//退出登录
                if(data.statusCode==30006){//license无效
                    store.commit("SET_LICENSE",{time:null,type:null});
                    localStorage.removeItem(`myLicense${window.location.host}`);
                }
                store.commit("EXIT");
                router.push({name:"login"});
            }
        }
        
        if(config.headers.page=="login"){//登录页面不做统一处理
            return response
        }

        return response
    },

    error=>{
        const {config,request,response}=error;
        if(!config)return Promise.reject(response);
        filterCancel(config);

        if(!config.headers.noLoading)store.commit("CHANGE_LOADING",false);

        if(config.headers.responseError)return Promise.reject(response);//responseError:true不报错提示

        let errTip="responseError";
        switch(request.status){
            case 400:errTip="responseError_400"; break;
            case 401:errTip="responseError_401"; break;
            case 403:errTip="responseError_403"; break;
            case 404:errTip="responseError_404"; break;
            case 405:errTip="responseError_405"; break;
            case 500:errTip="responseError_500"; break;
            case 503:errTip="responseError_503"; break;
        }
        commonTip(i18n.t(errTip),"tip_error");
        
        return Promise.reject(response);
    }

)

Vue.prototype.axios=instance;

export default instance
