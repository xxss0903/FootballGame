import { EIO } from "constants";

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
        football: {
            default: null,
            type: cc.Node
        },

        btnstart: {
            default: null,
            type: cc.Button
        },

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
    startGame: function () {
        G.hallSocket.disconnect();
        cc.director.loadScene("selectmode")
    },

    setupSocket: function () {
        if (cc.sys.isNative) {
            window.io = SocketIO;
        } else {
            window.io = require('socket.io')
        }

        G.globalSocket = io.connect(rooturl);
        var hallurl = rooturl + '/hall'
        console.log('hall url = ' + hallurl);
        G.hallSocket = io.connect(hallurl);

        this.resetSocket();
    },

    // 重置房间的socket 链接
    resetSocket: function () {
        if (G.queueSocket != null) {
            G.queueSocket.disconnect();
            G.queueSocket = null;

        }
        if (G.roomSocket != null) {
            G.roomSocket.disconnect();
            G.roomSocket = null;
        }
    },

    onLoad: function () {
        console.log('onload')
        this.setupSocket();
        this.rotateFootball();
        this.setupClick();
    },

    setupClick: function () {
        let self = this;
        this.btnstart.node.on('click', function (event) {
            self.startGame();
        })
    },

    rotateFootball: function () {
        let self = this;
        var rotateAnim = self.football.getComponent(cc.Animation);
        var animState = rotateAnim.play("fullrotate", 0);
        animState.wrapMode = cc.WrapMode.Loop;
    },

    start() {
    },

    // update (dt) {},
});
