import Vue from "vue";

require("./myDirective/directives");

Vue.use(require("./myPlugin/toast").default);


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
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));

    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
};