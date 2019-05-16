import Vue from "vue"
import axios from "axios"

let instance=axios.create();

instance.defaults.timeout=50000;//超时时间
let strPath = window.document.location.pathname; 
let appName = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);
const serverUrl = window.location.origin + appName;
instance.defaults.baseURL=serverUrl;//请求地址前缀

// 拦截器
// 请求配置
instance.request=instance.interceptors.request.use(
    config=>{
        let header={
            token:"123",
            author:"lisai"
        };
        config.headers=Object.assign(header,config.headers)    
        return config
    },

    error=>{
        return Promise.reject(error)
    }
)

instance.response=instance.interceptors.response.use(
    response=>{

        return response
    },

    error=>{
        return Promise.reject(error)
    }

)

Vue.prototype.axios=axios;

export default instance
