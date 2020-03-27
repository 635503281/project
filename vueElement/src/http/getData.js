import axios from "./axios";

function http(method="get",url='',data={},headers={}){
    return new Promise((resolve,reject)=>{
        let params={};
        if(method=="get"&&Object.keys(data).length>0)params=data;
        
        axios({method,url,data,params,headers}).then(res=>{
            let {data}=res;
            resolve(data); 
            
        }).catch(err=>{
            reject(err);
        })
    })
    
}





//获取所有用户接口
export const getUser=(data,headers)=>http('post','ajax/user',data,headers)
