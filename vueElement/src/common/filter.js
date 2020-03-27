import Vue from "vue"

//将后台返回的base64格式转成图片格式
Vue.filter("baseToImg",function(val){
    //URL.createObjectURL(File)创建一个二进制文件
    if(!val||/^data:image/.test(val)||/.(png|jpg|jpeg|gif|webp)$/.test(val)||/^blob:/.test(val))return val;//含data:imgage开头的，及图片路径格式的，已blob:开头的二进制图片,返回原值
    else if(/^(http:\/\/|https:\/\/)/.test(val)&&!/.(png|jpg|jpeg|gif|webp)$/.test(val) )return val;//网络路径的图片直接显示
    else  return `data:image/png;base64,${val.replace(/\\n/g,'\n')}`;//补全base64图片
    
});

//计算与当前时间差值（绝对值）
Vue.filter("formatDistance",function(val){
    //return formatDistanceStrict(parseISO(val),new Date(),{locale: zhCN})
    let old = new Date(val).getTime();
    let now = new Date().getTime();
    let dis = now - old;
    let perSec = 1000;
    let perMin = 60*perSec;
    let perHour = 60*perMin;
    let perDay = 24*perHour;
    let perMon = 30*perDay;
    let perYear = 365*perDay;
    dis = Math.abs(dis);
    if (dis<perMin){  //1分钟内
      return Math.round(dis/perSec)+"秒";
    } else if (dis < perHour) {  //1小时内
      return Math.round(dis/perMin)+"分钟";
    } else if (dis < perDay){  //1天内
      return Math.round(dis/perHour)+"小时";
    } else if (dis < perMon){ //1月内
      return Math.round(dis/perDay)+"天";
    } else if (dis < perYear){ //1年内
      return Math.round(dis/perMon)+"月";
    }
    return Math.round(dis/perYear)+"年";
})

//转换时间格式
Vue.filter("timeFormat",function(val,format="yyyy-MM-dd HH:mm:ss"){
    if(!val)return '--'
    if(typeof val == 'string')val = val.replace(new RegExp(/-/gm) ,"/");
    let time=new Date(val).format(format);
    return time
});

//字符串转json
Vue.filter("toJson",function(val){
    if(typeof val =="string"){
        if(val){
            if(val.indexOf(";")){
                let arr=val.split(";");
                if(!arr[arr.length-1])arr.pop();

                arr=arr.map(va=>{
                    try{
                        let value=eval("("+va+")");
                        if(!value&&value!=0)value="";
                        return value
                    }catch(e){
                        return va
                    }
                });

                if(arr.length==1)return arr[0]
                else return arr

            }else{
                return eval("("+val+")")
            }

        }else return ""

    }else{
        return ""
    }
});

//将数字转为货币形式
Vue.filter("toMoneyFormat",function(val){
    if(!val){
        if(val == 0)return val
        else  return "--"  
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
    
});

//将小数转为百分比数
Vue.filter("toPercentage", function(val){
    if(val == null)return '--'

    let newVal = parseFloat(val);
    if(isNaN(newVal))return val
    if(newVal>1)return `${newVal}%`
    else return `${100*newVal}%`

});
