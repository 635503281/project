<!-- loading -->
<template>
    <div class="loading" v-if="loading">
         <div class="animation-2">
            <div class="shape shape1"></div>
            <div class="shape shape2"></div>
            <div class="shape shape3"></div>
            <div class="shape shape4"></div>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            
        };
    },

    props : {},

    components: {},

    computed: {
        loading(){
            return this.$store.state.loading
        }
    },

    mounted(){},

    methods: {},

    watch:{
        
    }
}

</script>
<style lang='less' scoped>
    .loading{
        position: absolute;
        z-index:10;
        left:0;
        top:0;
        width:100%;
        height:100%;
        background: rgba(0,0,0,0.7);
        opacity: 0.9;
        @keyframes rotation {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }
    }

    // 定义加载动效
    .animation-2{
        position: relative;
        left: 50%;
        top: 50%;
        width: 30px;
        height: 30px;
        animation: rotation 1s infinite;
        
        .shape{
            position: absolute;
            width: 10px;
            height: 10px;
            border-radius: 50%;
        }
        .shape1 {
            left: 0;
            background-color: rgba(65,129,255,1);
            animation: animation2shape1 0.5s ease 0s infinite alternate;
        } 
        @keyframes animation2shape1 {
            from {
                transform: translate(0, 0);
            }
            to {
                transform: translate(20px, 20px);
            }
        }

        .shape2 {
            right: 0;
            background-color: rgba(65,129,255,0.8);;
            animation: animation2shape2 0.5s ease 0s infinite alternate;
        }  
        @keyframes animation2shape2 {
            from {
                transform: translate(0, 0);
            }
            to {
                transform: translate(-20px, 20px);
            }
        }

        .shape3 {
            bottom: 0;
            background-color: rgba(65,129,255,0.7);;
            animation: animation2shape3 0.5s ease 0s infinite alternate;
        } 
        @keyframes animation2shape3 {
            from {
                transform: translate(0, 0);
            }
            to {
                transform: translate(20px, -20px);
            }
        }

        .shape4 {
            bottom: 0;
            right: 0;
            background-color: rgba(65,129,255,0.6);;
            animation: animation2shape4 0.5s ease 0s infinite alternate;
        }  
        @keyframes animation2shape4 {
            from {
                transform: translate(0, 0);
            }
            to {
                transform: translate(-20px, -20px);
            }
        }

    }

</style>