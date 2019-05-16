import axios from "./axios";

function http(method="get",url='',data={},headers={}){
    return new Promise((resolve,reject)=>{
        let params={};
        if(method=="get"&&Object.keys(data).length>0){
            params=data;
        }
        axios({method,url,data,params,headers}).then(res=>{
            let data=res.data;
             resolve(data); 
            
        }).catch(err=>{
            reject(err);
        })
    })
    
}





//获取所有用户名接口
export const getUser=(option,headers)=>http('post','ajax/user',option,headers)

//验证用户
export const checkUser=(user,headers)=>http("post",'ajax/checkUser',user,headers)

//添加用户
export const insertUser=(user,headers)=>http("post","ajax/insertUser",user,headers)

//根据id获取用户信息
export const getUserById=(id,headers)=>http("get","ajax/findUser?id="+id,{},headers)

//修改用户信息
export const updateUser=(user,headers)=>http("post","ajax/updateUser",user,headers)

//根据id删除用户
export const deleteUser=(id,headers)=>http("get","ajax/deleteUser?id="+id,{},headers)

//获取语言
export const getLangList=(id,data,headers)=>http("get","/rest/v1/getLanguages?id="+id,data,headers)