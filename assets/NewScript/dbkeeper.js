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

    // 随机根据概率扑球
    keepBall: function () {
        // 生成随机得扑救方向
        var randomDirection = Math.floor(Math.random() * 6);
        var direction = ''
        switch (randomDirection) {
            case 0:
                this.keepLeftDown();
                direction = 'leftdown';
                break;
            case 1:
                this.keepLeftUp();
                direction = 'leftup';
                break;
            case 2:
                this.keepRightDown();
                direction = 'rightdown';
                break;
            case 3:
                this.keepRightUp();
                direction = 'rightup';
                break;
            case 4:
                this.keepDown();
                direction = 'centerdown';
                break;
            case 5:
                this.keepUp();
                direction = 'centerup';
                break;
        }
        return direction
    },

    keepLeftUp: function () {
        this._armatureDisPlay.playAnimation('keeprightup', 1);

    },

    keepLeftDown: function () {
        // 执行动画
        this._armatureDisPlay.playAnimation('keepleftdown', 1);
    },

    keepRightDown: function () {
        // 执行动画
        this._armatureDisPlay.playAnimation('keeprightdown', 1);
    },

    keepRightUp: function () {
        this._armatureDisPlay.playAnimation('keeprightup', 1);

    },

    keepUp: function () {
        this._armatureDisPlay.playAnimation('keepup', 1);
    },

    keepDown: function () {

    },

    standMove: function () {
        if (this._armatureDisPlay != undefined) {
            this._armatureDisPlay.playAnimation('standmove', 0);
        }
    },

    animationEventHandler: function (event) {
        if (event.type == dragonBones.EventObject.FADE_IN_COMPLETE) {
            cc.log(event.detail.animationName + ' fade in complete');
        } else if (event.type == dragonBones.EventObject.FADE_OUT_COMPLETE) {
            cc.log(event.detail.animationName + ' fade out complete');
        }
    },

    setupKeeperAnimation: function () {

    },

    setupDragonBones: function () {
        //获取 ArmatureDisplay
        this._armatureDisPlay = this.getComponent(dragonBones.ArmatureDisplay)
        //获取 Armatrue
        this._armature = this._armatureDisPlay.armature()
        //添加动画监听
        this._armatureDisPlay.addEventListener(dragonBones.EventObject.FADE_IN_COMPLETE, this.animationEventHandler, this)
        this._armatureDisPlay.addEventListener(dragonBones.EventObject.FADE_OUT_COMPLETE, this.animationEventHandler, this)
    },

    onLoad() {
        this.setupKeeperAnimation();
        this.setupDragonBones();
    },

    start() {

    },

    // update (dt) {},
});
