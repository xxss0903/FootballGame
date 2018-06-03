// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html


//定义全局的变量
window.onfire=require("onfire");           //处理事件的类库
var netConfig=require('netconfig');
var NetControl={
    _sock:{},  //当前的webSocket的对象
    connect: function () {
        if(this._sock.readyState!==1){
            //当前接口没有打开
            //重新连接
            this._sock = new WebSocket(netConfig.host+":"+netConfig.port);
            this._sock.onopen = this._onOpen.bind(this);
            this._sock.onclose = this._onClose.bind(this);
            this._sock.onmessage = this._onMessage.bind(this);
        }
        return this;
    },

    _onOpen:function(){
        onfire.fire("onopen");
    },
    _onClose:function(err){
        onfire.fire("onclose",err);
    },
    _onMessage:function(obj){

        onfire.fire("onmessage",obj);
    },

    send:function(msg){
        this._sock.send(msg);
        console.log("send msg"+msg);
    },

};

module.exports=NetControl;