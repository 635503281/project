import Vue from "vue"

//使用v-focus
Vue.directive("focus",{
    //当绑定元素插入到 DOM 中
    inserted:function(el,binding,vnode,oldVnode){
        /*el=>指令所绑定的元素
        *binding一个对象，包含以下属性
        *   name: 指令名，不包括 v- 前缀。
            value: 指令的绑定值， 例如： v-my-directive="1 + 1", value 的值是 2。
            oldValue: 指令绑定的前一个值，仅在 update 和 componentUpdated 钩子中可用。无论值是否改变都可用。
            expression: 绑定值的表达式或变量名。 例如 v-my-directive="1 + 1" ， expression 的值是 "1 + 1"。
            arg: 传给指令的参数。例如 v-my-directive:foo， arg 的值是 "foo"。
            modifiers: 一个包含修饰符的对象。 例如： v-my-directive.foo.bar, 修饰符对象 modifiers 的值是 { foo: true, bar: true }
        *
        *vnode: Vue 编译生成的虚拟节点
        *oldVnode: 上一个虚拟节点，仅在 update 和 componentUpdated 钩子中可用  
        */
    },
    //只调用一次,指令第一次绑定到元素时调用
    bind:function(){

    },
    //被绑定元素所在的模板更新时调用
    update:function(){

    },
    //只调用一次， 指令与元素解绑时调用
    unbind:function(){

    },
    //被绑定元素所在模板完成一次更新周期时调用
    componentUpdated:function(){

    } 
});
//只需要bind和update时可简写=>  name,function(){}
Vue.directive("focus1",{
    inserted:function(el,binding){
        el.focus();
    }
});