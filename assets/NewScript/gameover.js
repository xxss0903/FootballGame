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
        }
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
    // 进入游戏界面，利用当前信息继续游戏
    continueGame: function () {
        this.clearScore();
        cc.director.loadScene('game');
    },

    clearScore: function () {

        switch (gamemode) {
            case 0:
                if (player1 == undefined) {
                    return
                }
                player1.score = 0;
                player1.shootcount = 0;
                break;
            case 1:
                if (player1 == undefined || player2 == undefined) {
                    return
                }
                player1.score = 0;
                player1.shootcount = 0;
                player2.score = 0;
                player2.shootcount = 0;
                break;
        }
    },

    resetPlayer: function () {
        player1 = null;
        player2 = null;
    },

    quitGame: function () {
        this.resetPlayer();
        cc.director.loadScene('startgame');
    },

    setup: function () {
        var sc = cc.sys.localStorage.getItem("score");
        this.score.string = "积分：" + sc
    },

    // 初始化获取当前奖品
    setupRewards: function () {

    },

    onLoad() {
        this.setupRewards();
    },

    start() {

    },

    // update (dt) {},
});
