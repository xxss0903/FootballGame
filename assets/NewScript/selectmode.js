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

        socket: {}
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
            self.chooseSingleMode();
        });
        self.multi.on('click', function (event) {
            // 进入多人模式
            self.chooseMultiMode();
        })
    },

    // 链接socket
    chooseSingleMode: function () {
        let self = this;
        if (cc.sys.isNative) {
            window.io = SocketIO;
        } else {
            window.io = require('socket.io')
        }
        console.log('单人登陆')
        self.socket = window.io(socketurl);
        console.log(self.socket);


        // 测试不了解
        gamemode = 'single';
        cc.director.loadScene('selectplayer');

        self.socket.on('connect', (msg) => {
            console.log('链接上了 ' + msg);
            mysocket = self.socket;
            // 将游戏模式发送给服务器
            self.socket.emit('gamemode', 'single');
        })

        self.socket.on('selectmode', (msg) => {
            var obj = JSON.parse(msg);
            gamemode = obj.mode;
            currentroom = obj.room;
            cc.director.loadScene('selectplayer');
        })

        self.socket.on('disconnect', function (data) {
            console.log('游戏断开链接')
        })

        self.socket.on('error', (msg) => {
            console.log('发生错误 ' + msg);
        })

        self.socket.on('timeout', (msg) => {
            console.log('链接超时');
        })

        self.socket.on('handplay', (msg) => {
            console.log('手柄 ' + msg);
        })
    },

    // 进入房间，多人模式
    chooseMultiMode: function () {
        let self = this;
        if (cc.sys.isNative) {
            window.io = SocketIO;
        } else {
            window.io = require('socket.io')
        }
        console.log('多人登陆')
        self.socket = window.io(socketurl);
        console.log(self.socket);

        // 测试不了解
        gamemode = 'multi';
        cc.director.loadScene('selectplayer');


        self.socket.on('connect', (msg) => {
            cc.director.loadScene('selectplayer');
            console.log('链接上了 ' + msg);
            mysocket = self.socket;
            // 将游戏模式发送给服务器
            self.socket.emit('gamemode', 'multi');
        })

        self.socket.on('selectmode', (msg) => {
            var obj = JSON.parse(msg);
            gamemode = obj.mode;
            currentroom = obj.room;
            cc.director.loadScene('selectplayer');
        })

        self.socket.on('disconnect', function (data) {
            console.log('游戏断开链接')
        })

        self.socket.on('error', (msg) => {
            console.log('发生错误 ' + msg);
        })

        self.socket.on('timeout', (msg) => {
            console.log('链接超时');
        })

        self.socket.on('handplay', (msg) => {
            console.log('手柄 ' + msg);
        })
    },

    onLoad() {},

    start() {
        this.setupControlEvent();
    },

    // update (dt) {},
});