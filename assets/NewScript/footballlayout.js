// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var tmpFootball = require("football");

cc.Class({
    extends: cc.Component,

    properties: {

        fire: {
            default: null,
            type: cc.Sprite
        },

        football: {
            default: null,
            type: cc.Sprite
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
        speed: "int",
        collisionStatus: false,
        cancollide: false,
    },

    // getPosition: function(){
    //     return this.kickpoint.getPosition();
    // },

    // up: function () {
    //     var x = this.getPosition().x;
    //     var y = this.getPosition().y;
    //     this.node.setPosition(x, y + MOVESTEP);
    // },
    // down: function () {
    //     var x = this.getPosition().x;
    //     var y = this.getPosition().y;
    //     this.node.setPosition(x, y - MOVESTEP);
    // },
    // left: function () {
    //     var x = this.getPosition().x;
    //     var y = this.getPosition().y;
    //     this.node.setPosition(x - MOVESTEP, y);
    // },
    // right: function () {
    //     var x = this.getPosition().x;
    //     var y = this.getPosition().y;
    //     this.node.setPosition(x + MOVESTEP, y);
    // },

    // LIFE-CYCLE CALLBACKS:
    getBox: function () {
        return this.node.getBoundingBoxToWorld();
    },

    kickMe: function () {
        var rotateAnim = this.getComponent(cc.Animation);
        var animState = rotateAnim.play("football");
        this.showFire(true);
    },

    getCollisionStatus: function () {
        return this.collisionStatus;
    },

    resetCollisionStatus: function () {
        this.showFire(false);
        this.collisionStatus = false;
    },

    switchCollide: function (collide) {
        cc.director.getCollisionManager().enabled = collide;
        // 是否显示火焰效果
        this.showFire(collide);
        // 播放足球的旋转动画
        var ftball = this.football.getComponent(tmpFootball);
        console.log('切换足球')
        console.log(ftball);
        ftball.rotateMe(collide);
        // cc.director.getCollisionManager().enabledDebugDraw = collide;
        // cc.director.getCollisionManager().enabledDrawBoundingBox = collide;
    },


    // 播放开始进入游戏的足球动画
    playStartAnim: function () {
        var anim = this.getComponent(cc.Animation);
        var animState = anim.play("footballin");
        // var ftball = this.getComponent(tmpFootball);
        // var rotateAnim = ftball.getComponent(cc.Animation);
        // var animState = rotateAnim.play("footballin");
    },

    // 初始化碰撞系统
    setupCollisionSystem: function () {

    },

    onCollisionEnter: function (other, self) {
        this.collisionStatus = true;
        console.log('发生碰撞 enter')
    },

    onCollisionStay: function (other, self) {
        console.log("发生碰撞 stay")
    },

    onCollisionExit: function (other, self) {
        console.log("发生碰撞 exit")
    },

    showFire: function (show) {
        this.fire.enabled = show;
    },


    onLoad() {
        this.showFire(false);
        this.setupCollisionSystem();
    },

    start() {

    },

    update(dt) { },
});