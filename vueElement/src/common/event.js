"use strict";
    
var eventObj={};

function EventFn(name){
    this.name=name;
};

EventFn.prototype.listen=function(key,fn){
    if(!eventObj.hasOwnProperty(key)){
        eventObj[key]={};
    }
    if(!eventObj[key][this.name]){
        eventObj[key][this.name]=[];
    }
    eventObj[key][this.name].push(fn);
    
};

EventFn.listen=function(key,fn){
    if(!eventObj.hasOwnProperty(key)){
        eventObj[key]={};
    }
    if(!eventObj[key][this.name]){//this.name="EventFn"
        eventObj[key][this.name]=[];
    }
    eventObj[key][this.name].push(fn)
};

EventFn.prototype.emit=function(key){
    if(eventObj.hasOwnProperty(key)&&eventObj[key][this.name]&&eventObj[key][this.name].length>0){
        Array.prototype.shift.call(arguments);
        for(var i=0,fn;fn=eventObj[key][this.name][i++];){
            fn.apply(this,arguments);
        }      
        
    }

};

EventFn.emit=function(key){
    if(eventObj.hasOwnProperty(key)){
        Array.prototype.shift.apply(arguments);
        for(var arr in eventObj[key]){
            if(eventObj[key][arr].length>0){
                for(var i=0,fn;fn=eventObj[key][arr][i++];){
                    fn.apply(fn,arguments);
                }

            }

        }
        
    }
};

EventFn.prototype.off=function(key){
    if(eventObj.hasOwnProperty(key)){
        delete eventObj[key][this.name]
    }
};

EventFn.off=function(key){
    if(eventObj.hasOwnProperty(key)){
        eventObj[key]={};
    }
}

export default EventFn
