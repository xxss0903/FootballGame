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

        score1: {
            default: null,
            type: cc.Label
        },

        shootcount1: {
            default: null,
            type: cc.Label
        },

        score2: {
            default: null,
            type: cc.Label
        },

        shootcount2: {
            default: null,
            type: cc.Label
        },


        football: {
            type: cc.Node,
            default: null
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
        player1.score = 0;
        player2.score = 0;
        player1.shootcount = 0;
        player2.shootcount = 0;
        player1.incount = 0;
        player2.incount = 0;
    },

    // 返回，重新开始游戏
    goBack: function () {
        this.resetGame();
        cc.director.loadScene('game');
    },

    // 领取奖品界面
    getRewards: function () {
        cc.director.loadScene("gameover");
    },

    // 重置分数信息等
    setupParams: function () {
        this.score1.string = player1.score;
        this.shootcount1.string = player1.incount;

        this.score2.string = player2.score;
        this.shootcount2.string = player2.incount;
    },

    onLoad() {
        this.setupParams();
    },

    start() {

    },

    // update (dt) {},
});
