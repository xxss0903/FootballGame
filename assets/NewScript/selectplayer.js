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

        selectgroup: {
            default: null,
            type: cc.ToggleContainer
        },

        back: {
            default: null,
            type: cc.Button
        },

        confirm: {
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
    setupToggleGroup: function () {
        let self = this;
        this.getSelectedPlayer();
    },

    getSelectedPlayer: function () {
        let self = this;
        var items = self.selectgroup.toggleItems;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.isChecked == true) {
                var selectedPlayerName = item.name.replace("<Toggle>", "");
                console.log('选中了 ' + selectedPlayerName);
                playerrole = selectedPlayerName;
                break;
            }
        }
    },

    setupClick: function () {
        let self = this;
        this.confirm.node.on('click', function (event) {
            console.log('confirm');
            self.getSelectedPlayer();
            cc.director.loadScene('game');
        })
    },


    onLoad() {
        this.setupToggleGroup();
        this.setupClick();
    },

    start() {

    },

    // update (dt) {},
});