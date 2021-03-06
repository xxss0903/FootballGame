// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        single: {
            default: null,
            type: cc.Node
        },
        multi: {
            default: null,
            type: cc.Node
        },

        socket: null,
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:
    setupControlEvent: function () {
        let self = this;
        self.single.on('click', function (event) {
            // 进入单人模式
            gamemode = 0;
            cc.director.loadScene('selectplayer', function () {
                console.log('加载完毕')
            });
        });
        self.multi.on('click', function (event) {
            // 进入多人模式
            gamemode = 1;
            cc.director.loadScene('selectplayer', function () {
                console.log('加载完毕')
            });
        })
    },

    setupSocket: function () {
        if (cc.sys.isNative) {
            window.io = SocketIO;
        } else {
            window.io = require('socket.io')
        }

        // 匹配成功，进入房间
        if(G.queueSocket == null){
            G.queueSocket = io.connect(rooturl + "/queue");
            G.queueSocket.on('game mode', function (info) {
                console.log('游戏模式 ' + info);
            });
            G.queueSocket.on('match success', function (roomId) {
                cc.log('match success ' + window.roomid);
                if(G.roomSocket == null){
                    G.roomSocket = io.connect(rooturl + '/rooms' + window.roomid, { 'force new connection': true });
                    G.roomSocket.emit('who', 'game');
                    // 断开排队队列，已经分配到了房间
                    G.queueSocket.disconnect();
                }
            })
        }
    },

    onLoad() {
        // 选择模式不需要链接socket
        this.setupSocket();
        this.setupControlEvent();
    },

    start() {
    },

    // update (dt) {},
});