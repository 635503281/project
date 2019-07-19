import Vue from "vue";
import event from "./event";

require("./myDirective/directives");

Vue.use(require("./myPlugin/toast").default);

Vue.prototype.event=event;

//深拷贝
Vue.prototype.copy=function(obj){

    let deepCopy=function(arr) {
        if (arr instanceof Array) {
            let n = [];
            for (let i = 0 ,length=arr.length; i < length; ++i) {
                n[i] = deepCopy(arr[i]);
            }
            return n;

        } else if (arr instanceof Object) {
            let n = {};
            for (var i in arr) {
                n[i] = deepCopy(arr[i]);
            }
            return n;
        } else {
            return arr;
        }
    }

    return deepCopy(obj)
}

// 时间对象转为自定义的格式
Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,               //月份
        "d+": this.getDate(),                    //日
        "H+": this.getHours(),                   //小时(24小时制)
        "h+": this.getHours()>=12?this.getHours()-12:this.getHours(),//小时(12小时制)                 
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));

    for (var k in o){
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    }
    return fmt;
};

//数组原型上添加过滤相同元素的方法()
Array.prototype.filterSame=function(key){
    let newArr=this.reverse();
    newArr=newArr.filter((value,index)=>{
        let isObject1=(typeof value =="object");
        let contrastValue=isObject1?value[key]:value;
        for(let i=index+1,item;item=newArr[i++];){
            let isObject2=(typeof item =="object")
            let contrastItem=isObject2?item[key]:item;

            if((isObject1&&isObject2)||(!isObject1&&!isObject2)){
                if(contrastValue!=undefined&&contrastItem!=undefined&&contrastValue==contrastItem)return false
            }
                 
        }
        return true
    });
    return newArr.reverse()
};