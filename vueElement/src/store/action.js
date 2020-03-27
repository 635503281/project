import axios from "@/http/axios"

export default {
    
    async getLicense({commit,state}){
        if(!state.license.time){
            try{
                const {data}=await axios.get("/pon-traffic/license/checkLicense",{headers:{page:"login",noTip:true}});
                if(data.statusCode==0){
                    const endTime=new Date(data.data.endTime).getTime();
                    commit("SET_LICENSE",{time:endTime,type:data.data.enPay});
                }

            }catch(e){}
            
        }
    }

}