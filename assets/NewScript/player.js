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
        score: 0,
        // 角色卡片图片
        rolepic: "",    
        // 角色踢球的图片
        playpic: "play1",
        // 角色名
        roomname: "",
        myname: '',
        // 射球数量
        shootcount: 0,
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
    addScore: function(sc){
        this.score += sc;
        cc.sys.localStorage.setItem("score", this.score);
    },

    addShootCount: function(shoot){
        let self = this;
        self.shootcount += shoot;
    },

    // 移动踢球
    playBall: function () {
        var rotateAnim = this.getComponent(cc.Animation);
        var animState = rotateAnim.play("playball");
    },

    // onLoad () {},

    start () {

    },

    // update (dt) {},
});
