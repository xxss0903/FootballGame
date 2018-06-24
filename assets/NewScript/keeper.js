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
    // 随机方向进行扑球
    keepBall: function () {
        // 生成随机得扑救方向
        var randomDirection = Math.floor(Math.random() * 6);
        switch (randomDirection) {
            case 0:
                this.keepLeftDown();
                break;

            case 1:
                this.keepLeftTop();
                break;
            case 2:
                this.keepRightDown();
                break;
            case 3:
                this.keepRightTop();
                break;
            case 4:
                this.keepDown();
                break;
            case 5:
                this.keepTop();
                break;
        }
    },

    // 向左下方扑救
    keepLeftDown: function () {
        var rotateAnim = this.getComponent(cc.Animation);
        var animState = rotateAnim.play("keepleftdown");
    },

    // 左上方扑救
    keepLeftTop: function () {
        var rotateAnim = this.getComponent(cc.Animation);
        var animState = rotateAnim.play("keepleftup");

    },

    // 右下方扑救
    keepRightDown: function () {
        var rotateAnim = this.getComponent(cc.Animation);
        var animState = rotateAnim.play("keeprightdown");
    },

    // 右上方扑救
    keepRightTop: function () {
        var rotateAnim = this.getComponent(cc.Animation);
        var animState = rotateAnim.play("keeprightup");
    },

    // 正下方扑救
    keepDown: function () {
        var rotateAnim = this.getComponent(cc.Animation);
        var animState = rotateAnim.play("keepdown");
    },

    // 正上方扑救
    keepTop: function () {
        var rotateAnim = this.getComponent(cc.Animation);
        var animState = rotateAnim.play("keepup");
    },

    switchCollide: function(collide){
        cc.director.getCollisionManager().enabled = collide;
        // cc.director.getCollisionManager().enabledDebugDraw = collide;
        // cc.director.getCollisionManager().enabledDrawBoundingBox = collide;
    },

    // 初始化碰撞系统
    setupCollisionSystem: function () {


    },

    onCollisionEnter: function (other, self) {
        console.log('发生碰撞 enter' + other)
    },

    onCollisionStay: function (other, self) {
        console.log("发生碰撞 stay" + other)
    },

    onCollisionExit: function (other, self) {
        console.log("发生碰撞 exit" + other)
    },

    setupKeeperAnimation: function(){
        var moveAnim = this.getComponent(cc.Animation);
        var animState = moveAnim.play("keepermove");
    },


    onLoad() {
        this.setupKeeperAnimation();
    },

    start() {

    },

    // update (dt) {},
});