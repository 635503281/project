import eVue from "./event"
import {ProxySetTimeout} from "./common"

const port = "54405";
let url = window.location.protocol.replace("http","ws") + window.location.hostname +":"+ port;
if(process.env.NODE_ENV == "development"){
    url = window.location.href.substring(0, window.location.href.indexOf("#")).replace("http","ws") + "mysocket";
}

class MyWebsocket {
    constructor(url, reConnectNum=3, time=5000){
        if(!url)throw new Error("必须传一个url");
        if(typeof reConnectNum !="number")throw new Error("第二个参数传Number");
        if(typeof time !="number")throw new Error("第三个参数传Number");

        this.url = url;
        this.webSocket = null;
        this.reConnectNum = reConnectNum;//重连总次数
        this.num = 0;//当前重连接次数
        this.timer = null;
        this.defaultTime = time;//重连默认间隔时间
        this.time = time;//重连间隔时间

    }

    createWebSocket(){
        if(window.WebSocket){
            this.createWebSocket = ()=>{
                try{
                    this.webSocket = new WebSocket(this.url);
                }catch(e){
                    console.log("socket连接失败");
                    this.reConnect();
                    return 
                }
                this.webSocket.onopen = ()=>{
                    this.num = 0;
                    this.time = this.defaultTime;
                }
                this.webSocket.onclose = event=>{
                    console.log("socket断开链接");
                };
                this.webSocket.onerror = event=>{
                    console.log("socket链接错误");
                    this.reConnect();   
                };
                this.webSocket.onmessage = event=>{
                    let data=JSON.parse(event.data);
                    this.do(data);
                };
            }
            this.createWebSocket();
        }else{
            console.log("您的浏览器不支持websocket");
        }
    };

    //重连
    reConnect(){
        if(this.timer)return 

        this.num++;
        if(this.num > this.reConnectNum)return
        this.timer = setTimeout(()=>{
            clearTimeout(this.timer);
            this.timer = null;
            this.createWebSocket();
        }, this.time);

        this.time*=2; 
   
    };

    //关闭连接
    closeWebSocket(){
        if(this.webSocket)this.webSocket.close();
        this.num = 0;
        this.time = this.defaultTime;
    }

    //具体做啥
    do(data){
        
    };

}

class SKSocket extends MyWebsocket{
    constructor(){
        super(...arguments);
        this.comparison_fn = new ProxySetTimeout(data=>eVue.$emit('comparison', data), 5000);
        this.ratio_fn = new ProxySetTimeout(data=>eVue.$emit('ratio', data), 5000);
        this.greyList_fn = new ProxySetTimeout(data=>eVue.$emit('greyList', data), 5000);
    }

    do(data){
        console.log("socket数据:");
        console.log(data);

        switch(data.type){
            case 1 ://比中结果
                this.ratio_fn(data.value);
            break;
            case 3 ://人像对比
                this.comparison_fn(data.value);
            break;
            case 2 ://灰名单结果
                this.greyList_fn(data.value);
            break;
        }
    }
}

const skSocket = new SKSocket(url, 3);
const createWebSocket = skSocket.createWebSocket.bind(skSocket);
const closeWebSocket = skSocket.closeWebSocket.bind(skSocket);

export {createWebSocket}
export {closeWebSocket}
export default skSocket
