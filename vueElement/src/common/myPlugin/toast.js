import Vue from 'Vue';

export default {
    install(Vue,options){
        let z=1000;
        let top=50;
        Vue.prototype.myToast=(msg,time=2000)=>{
            let toastArr=document.querySelectorAll(".myToast");
            if(toastArr.length<1){
                z=1000;
            }else{
                let last=toastArr[toastArr.length-1].style.top;
                console.log(last)
            }
            return new Promise((resove,reject)=>{
                let Tem= Vue.extend({
                    template:`<div class="myToast" style="position:absolute;z-index:${z++};top:50%;left:50%; height:150px;width:500px;border:1px solid #ccc;border-radius:2px;transform:translate(calc(-50% + 140px),-50%)">
                        <h3 style="text-align:center;margin:30px 0;">${msg}</h3>
                        <div style="display:flex;justify-content: center">
                            <el-button class="" @click='ok'>确定</el-button>
                            <el-button class="" @click='cancel'>取消</el-button>
                        </div>
                    </div>`,
                    methods:{
                        ok(){
                            resove();
                            this.cancel();
                            
                        },
                        cancel(){
                            document.body.removeChild(tem);
                        }
                    }
                });
    
                let tem=new Tem().$mount().$el;
    
                document.body.appendChild(tem);
    
            });
            
            // if(time){
            //     setTimeout(()=>{
            //         document.body.removeChild(tem);
            //     },time);
            // }
            

        }
    }
}