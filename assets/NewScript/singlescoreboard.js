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

        score: {
            default: null,
            type: cc.Label
        },

        shootcount: {
            default: null,
            type: cc.Label
        },

        football: {
            type: cc.Node,
            default: null
        },

        btnback: {
            default: null,
            type: cc.Button
        },

        btnreward: {
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

    // 重新游戏
    resetGame: function () {
        if (G.roomSocket != null) {
            G.roomSocket.disconnect();
        }
        G.isReconnect = true;
        if (player1 == null || player1 == undefined) {
            return
        }
        player1.score = 0;
        player1.shootcount = 0;
        player1.incount = 0;
    },

    // 返回，重新开始游戏
    goBack: function () {
        this.resetGame();
        // 重新进入游戏界面
        cc.director.loadScene('game');
    },

    // 领取奖品界面
    getRewards: function () {
        cc.director.loadScene("gameover");
    },

    // 重置分数信息等
    setupParams: function () {
        if (player1 == null || player1 == undefined) {
            return
        }
        this.score.string = player1.score;
        this.shootcount.string = player1.incount;
    },

    onLoad() {
        this.setupParams();
    },

    start() {

    },

    // update (dt) {},
});