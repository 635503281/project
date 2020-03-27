import Vue from "vue"

//input框的最大位数
Vue.directive("max",{
    inserted:function(el,binding,vnode){
        const max=binding.value;
        const  ele=el.querySelector('input')?el.querySelector('input'):el;
        el.addEventListener("input",function(){
            if(ele.value.length>=max){
                ele.value=ele.value.substr(0,max);
                try{
                    ele.dispatchEvent(new Event('input'));
                }catch(e){}
                
            }
        });
    
    }
});