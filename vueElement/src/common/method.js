import Vue from "vue"
import axios from "@/http/axios"
import {index,indexChildren} from "@/router/router"
import {Message,MessageBox} from "element-ui"
import i18n from "../i18n/i18n"
import './rsa'
// import "./sm2"

//公共提示框
export const commonTip= Vue.prototype.commonTip = function(message,icon="tip_success",time=2000){
    return new Promise((resolve,reject)=>{
        Message.closeAll();
        Message({
            customClass:"common_tip",
            iconClass:icon,
            message:message,
            duration:time,
            center:true,
            onClose:resolve
        })
    })
    
};

//公共确认框
export const commonConfirm = Vue.prototype.commonConfirm = function({title,message="",icon="tip_notice"}){
    let type="";
    switch(icon){
        case "tip_success":type="success";break;
        case "tip_error":type="error";break;
        case "tip_annotation":type="info";break;
        case "tip_notice":
        default:type="warning";break;
    }
    return new Promise((resolve,reject)=>{
        MessageBox.confirm(
            message,//额外信息
            title,//提示内容
            {
                customClass:"common_confirm",
                type,
                showClose:false,
                cancelButtonText:i18n.t("cancel"),
                cancelButtonClass:"",
                confirmButtonText:i18n.t("confirm"),
                confirmButtonClass:"",
                closeOnClickModal:false,
                closeOnPressEscape:false,
                center:true,
                callback:function(action,instance){
                    if(action=="confirm"){
                        resolve();
                    }else{
                        // reject();
                    }
                }
            }
        )
    });  
};

//切换title
export const changeTitle=function(){
    window.document.title=i18n.t("skTitle");
};

//获取设备
export const getDevice=async()=>{
    let result=[];
    try{
        const {data}=await axios.get("VIID/Images/allDeviceId",{headers:{noLoading:true}});
        if(data.statusCode==0)result=data.data;

    }catch(e){}

    return result
};

//获取操作日志类型
export const getLogType=async ()=>{
    let result={};
    try{
        const {data}=await axios.get("ui/log/getAllLogType",{headers:{noLoading:true}});
        if(data.statusCode==0)result=data.data;
        
    }catch(e){}

    return result
};

//获取guid
export const guid=function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
};

//将img转成base64
export const imgToBase64 = function(img,fomat=true){
    /*
    *img File或者图片路径
    *fomat true--带上 data:image/png;base64, false--去掉data:image/png;base64
    */
    return new Promise((resolve,reject)=>{
        if(img){
            if(img instanceof File){//img为文件
                const reader = new FileReader();
                reader.readAsDataURL(img);
                reader.onload = function (e) {
                    if(fomat)resolve(reader.result);
                    else resolve(reader.result.substring(reader.result.indexOf(",") + 1));
                }
    
            }else if(/.(png|jpg|jpeg|gif|webp)$/.test(img)){//img为图片路径
                let canvas = document.createElement("canvas");
                canvas.width =  img.width;
                canvas.height =  img.height;
                let ctx = canvas.getContext("2d");
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                let dataURL = canvas.toDataURL();
                if(fomat)resolve(dataURL);
                else resolve(dataURL.substring(dataURL.indexOf(",") + 1));
            }

        }else{
            reject(new Error);
        }     
    })
    
};

//将数字转为货币形式
export const toMoneyFormat = function(val){
    if(!val){
        if(val == 0)return val;
        else return "--"   
    }

    let newValue = parseFloat(val);
    if(isNaN(newValue))return val;

    let reg=/(?=(?!\b)(\d{3})+$)/g;
    if(newValue%1 === 0){//整数
        return String(newValue).replace(reg, ','); 

    }else{
        let str = newValue.toString();
        let num1 = parseInt(str.substring(0,str.indexOf('.')));
        num1 = String(num1).replace(reg, ','); 
        let num2 = str.replace(/\d+\.(\d*)/, '$1');
        
        return `${num1}.${num2}`

    }
};

//转百分比数
export const _toFixed = function(num, n = 0){
    if(typeof num != "number"){
        const newNum = parseFloat(num);
        if(isNaN(newNum))return num
        num = newNum;
    }
    //整除
    if(num%1 == 0){
        return num
    }else{
        return parseFloat(num.toFixed(n))
    }

};

//获取有权限的菜单
export const getMenus=function(list=[]){
    list=list||[];

    //查找所有父级
    function findParent(key,array){
        let arr=[];
        if(key!=null){
            let parent=array.filter(v=>v.id==key)[0];
            while(parent){
                arr.push(parent.url);
                parent=array.filter(v=>v.id==parent.parentId)[0];
            }
        
        }
        return arr.reverse()
    };

    //查找菜单页面的按钮
    function findBtns(id,list){
        let obj={};
        const btns = list.filter(v=>v.parentId==id&&v.type==2);
        if(btns.length)btns.forEach(v=>obj[v.name]=true);
        
        return obj
    };

    const childrenMenu=indexChildren.filter(self_menu=>{
        for(let menu of list){
            if(self_menu.meta&&self_menu.meta.activeMenu==menu.url){
                //填充展开的父级
                self_menu.meta.openedMenu=findParent(menu.parentId,list);

                //填充菜单页面按钮权限
                // if(!self_menu.meta.hasOwnProperty("defaultMenus"))self_menu.meta.btns=findBtns(menu.id,list);
                
                //填充面包屑菜单的名称
                const old=Vue.prototype.copy(self_menu.meta.defaultMenus);
                self_menu.meta.menus=self_menu.meta.openedMenu.map(open=>{
                    for(let m of list){
                        if(open==m.url)return {name:m.name}    
                    }
                });

                if(old&&old.length)self_menu.meta.menus=[...self_menu.meta.menus,{name:menu.name,path:menu.url},...old];
                else self_menu.meta.menus=[...self_menu.meta.menus,{name:menu.name}] 
                self_menu.meta.menus=self_menu.meta.menus.filterSame("name");

                return true
            }
        }
        return false
    });
    index.children=childrenMenu;
    return [index,{path:'*',redirect:"/login"}]
};

//RSA加密
export const RSA={
    makePublicKey:function(encryptionExponent,decryptionExponent,modulus){
        return new RSAUtils.getKeyPair(encryptionExponent,decryptionExponent,modulus);
    },
    encodeRSA:function(publicKey,data){
        return RSAUtils.encryptedString(publicKey,data.split("").reverse().join(""));
    },
    getPublicKey:async userName=>{
        let publickey='';
        const {data:keyInfo}=await axios.get("rsaKey/"+userName,{headers:{noLoading:true}});
        if(keyInfo.statusCode==0){
            publickey=RSA.makePublicKey(keyInfo.data[0].exponent, "", keyInfo.data[0].modulus);
            return publickey
        }  
    },
};

//SM2加密
// export const SM2={
//     makeKey:sm2.generateKeyPairHex,//生成公 私钥
//     encode:sm2.doEncrypt,//doEncrypt(msgString, publicKey, cipherMode); // 加密结果 const cipherMode = 1; // 1 - C1C3C2，0 - C1C2C3，默认为1
//     decode:sm2.doDecrypt,//doDecrypt(encryptData, privateKey, cipherMode); // 解密结果
// }


//正则
export const Reg = {
    lonReg: /^(\-|\+)?(((\d|[1-9]\d|1[0-7]\d|0{1,3})\.\d{0,6})|(\d|[1-9]\d|1[0-7]\d|0{1,3})|180\.0{0,6}|180)$/,
    latReg: /^(\-|\+)?([0-8]?\d{1}\.\d{0,6}|90\.0{0,6}|[0-8]?\d{1}|90)$/,
};

export const checkLonOrLat = function(str, type="lon"){
    if(str == null)return false

    str = str.toString();
    let _type = "lonReg";
    const arr = ["东经", "西经", "北纬", "南纬"];
    const fnArr = new Array(arr.length);
    fnArr[0] = function(str){
        if(Reg.lonReg.test(str))return str
        return false
    };
    fnArr[1] = function(str){
        if(Reg.lonReg.test(str))return `-${str}`
        return false
    };
    fnArr[2] = function(str){
        if(Reg.latReg.test(str))return str
        return false
    };
    fnArr[3] = function(str){
        if(Reg.latReg.test(str))return `-${str}`
        return false
    };

    for(let i=0,va;va=arr[i];i++){
        if(str.includes(va)){
            let a = str.split(va)[1].trim();
            return fnArr[i](a);    
        }
    }
    
    if(type == "lat")_type = "latReg";
    if(Reg[_type].test(str))return str;
    return false

};