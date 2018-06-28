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

        loading_bar: {
            default: null,
            type: cc.ProgressBar
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
    resetLoadingBar: function (loading) {
        if (loading > 1) {
            loading = 1;
        }
        if (loading < 0) {
            loading = 0;
        }
        console.log('能量: ' + loading);
        this.loading_bar.progress = loading;
    },

    onLoad () {
        let self = this;
        cc.loader.onProgress = function (completedCount, totalCount, item) {
            var progress = (completedCount / totalCount).toFixed(2);
            console.log("completedCount = "+completedCount+",totalCount="+totalCount+",progress="+progress);
            self.resetLoadingBar(progress);
        };
        // 开始加载游戏主界面
        cc.director.preloadScene('game', function(){
            console.log('预加载完成');
            cc.director.loadScene('game');
        })
    },

    start () {

    },

    // update (dt) {},
});
