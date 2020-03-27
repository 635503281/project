import Vue from "vue";

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

//tree转list // tree 为当前树的数据源  key为父节点key值
Array.treeTransArray=function(tree, key, a="parentId") {
    const result = [];
    tree.forEach(item => {
        const loop = data => {
            result.push(data);
            let child = data[key];
            if(child){
            	for(let i = 0; i < child.length; i++){
					loop({...child[i],[a]:data.id});
                }
                delete data[key];
            }
        }
        loop(item);
    })
    return result;

};

//list转tree //数组转树 list 数组数据源 ,key 对应父节点id字符串 obj={sort ,desc}排序字段
Array.arrayTransTree= function(list ,key,a="children",sort={sortby:null,desc:1}) {
    let neList=list.filter(parent=>{
        let branchArr=list.filter(child=>String(parent.id)==String(child[key]));
        parent[a]=[];
        if(branchArr.length > 0){
            //排序
            if(sort.sortby){
                if(sort.desc==1)branchArr=branchArr.sort((a,b)=>a[sort.sortby]-b[sort.sortby]);//升序
                else branchArr=branchArr.sort((a,b)=>b[sort.sortby]-a[sort.sortby]);//降序
            }
            parent[a] = branchArr;

        }else delete parent[a]
        //过滤出顶层父级
        for(let grandfather of list){
            if(String(parent[key])!== String(grandfather.id))continue;
            else return false
        }
        return true 
        
    });

    //排序
    if(sort.sortby){
        if(sort.desc==1)neList=neList.sort((a,b)=>a[sort.sortby]-b[sort.sortby]);//升序
        else neList=neList.sort((a,b)=>b[sort.sortby]-a[sort.sortby]);//降序
    }

    return neList         
};

//深拷贝
export const copy = Vue.prototype.copy =function(obj){

    const deepCopy=function(arr) {
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

//判断两个对象是否相等
export const isEqual = Vue.prototype.isEqual = function(x, y) {
    // If both x and y are null or undefined and exactly the same
    if (x === y) {
        return true;
    }

    // If they are not strictly equal, they both need to be Objects
    if (!(x instanceof Object) || !(y instanceof Object)) {
        return false;
    }

    //They must have the exact same prototype chain,the closest we can do is
    //test the constructor.
    if (x.constructor !== y.constructor) {
        return false;
    }

    for (var p in x) {
        //Inherited properties were tested using x.constructor === y.constructor
        if (x.hasOwnProperty(p)) {
            // Allows comparing x[ p ] and y[ p ] when set to undefined
            if (!y.hasOwnProperty(p)) {
                return false;
            }

            // If they have the same strict value or identity then they are equal
            if (x[p] === y[p]) {
                continue;
            }

            // Numbers, Strings, Functions, Booleans must be strictly equal
            if (typeof(x[p]) !== "object") {
                return false;
            }

            // Objects and Arrays must be tested recursively
            if (!Object.equals(x[p], y[p])) {
                return false;
            }
        }
    }

    for (p in y) {
        // allows x[ p ] to be set to undefined
        if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
            return false;
        }
    }
    return true;
};

//默认时间
Vue.prototype.defaultTime = {
    day:function(day = 1, type = "datetimerange"){
        /*
        *day 天数
        *type 格式-datetimerange/daterange
        */
        let format = "yyyy-MM-dd HH:mm:ss";
        if(type == "daterange")format = "yyyy-MM-dd";
        let now = new Date();
        now.setDate(now.getDate() + 1);
        const mTime = new Date(now).format('yyyy-MM-dd') + " 00:00:00";
        const time = new Date(mTime.replace(new RegExp(/-/gm) ,"/")).getTime();
        const end = new Date(time).format(format);
        const first = new Date(time - day*24*60*60*1000).format(format);
        return [first,end]
    },
    day_pickerOptions:function(day = 1){
        let firstTime = null;
        return {
            onPick :({maxDate,minDate})=>{
                if(!maxDate)firstTime = minDate.getTime();
                else firstTime = null;
            },
            disabledDate:(time)=>{
                if(firstTime){
                    //一天的范围
                    var range = day*24*60*60*1000;
                    var min = firstTime - range;
                    var max = firstTime + range;
                    return time.getTime() > max || time.getTime() < min 
                }
                return false
            }
        }
    },
};

//代理节流
export class ProxySetTimeout {
    constructor(fn, time = 1000){
        if(!(fn instanceof Function))throw new Error("请传一个需要代理的函数");
        if(typeof time != "number")throw new Error("请传数字延时时间");
        this.fn = fn;//代理原函数
        this.time = time;//延迟时间
        
        return this.proxy();
    }

    proxy(){
        let timer = null;
        
        return function(){
            if(timer)return 
            let arg = arguments;
            
            timer = setTimeout(function(){
                clearTimeout(timer);
                timer = null;
                this.fn.apply(this, arg)

            }.bind(this), this.time);

            
        }.bind(this)
    }
};