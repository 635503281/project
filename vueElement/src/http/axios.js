import Vue from "vue"
import axios from "axios"

let instance=axios.create();

// let cancelToken=instance.CancelToken;
// let source=cancelToken.source();
// instance.defaults.cancelToken=source.token;
// instance.cancel=source.cancel;

instance.defaults.timeout=50000;//超时时间
let strPath = window.document.location.pathname; 
let appName = strPath.substring(0, strPath.substr(1).indexOf('/') + 1);
const serverUrl = window.location.origin + appName;
instance.defaults.baseURL=serverUrl;//请求地址前缀

// 拦截器(取消拦截器 instance.interceptors.request.eject(instance.request))
// 请求配置
instance.request=instance.interceptors.request.use(
    config=>{
        let header={
            token:"123",
            author:"lisai",
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

Vue.prototype.axios=instance;

export default instance
