// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var tmpplayer = require('player');

cc.Class({
    extends: cc.Component,

    properties: {

        playerprefab: {
            default: null,
            type: cc.Prefab
        },

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

        playersp1: {
            default: null,
            type: cc.Sprite
        },
        playersp2: {
            default: null,
            type: cc.Sprite
        },
        // 当前选择显示的角色精灵
        currentsprite: {
            default: null,
            type: cc.Sprite
        },
        // 当前对应的全局选手
        currentplayer: cc.player,
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

        var items = self.selectgroup.toggleItems;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            item.node.on('toggle', function (event) {
                self.changeToggleItem(event.target);
            }, self);
        }
    },

    // 选择球员之后设置
    changeToggleItem: function (item) {
        let self = this;
        var name = item.name.replace('<Toggle>', '') + "_selected";
        try {
            cc.loader.loadRes(name.toString(), cc.SpriteFrame, function (err, spriteFrame) {
                self.currentsprite.spriteFrame = spriteFrame;
            });
        } catch (error) {
            cc.loader.loadRes(name.toString(), cc.SpriteFrame, function (err, spriteFrame) {
                self.currentsprite.spriteFrame = spriteFrame;
            });
        }

    },

    getSelectedPlayer: function () {
        let self = this;
        var items = self.selectgroup.toggleItems;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.isChecked == true) {
                var selectedPlayerName = item.name.replace("<Toggle>", "");
                return selectedPlayerName;
                break;
            }
        }
        return 'henry';
    },

    setupClick: function () {
        let self = this;
        switch (gamemode) {
            case 0:
                this.selectSinglePlayer();
                break;

            case 1:
                this.selectMultiPlayer();
                break;
        }
    },

    selectSinglePlayer: function (player) {
        let self = this;
        this.confirm.node.on('click', function (event) {
            self.currentplayer.rolepic = self.getSelectedPlayer();
            cc.director.loadScene('game');
        })

        this.back.node.on('click', function (event) {
            self.resetConfig();
            cc.director.loadScene('selectmode');
        })
    },

    // 初始化多人模式
    selectMultiPlayer: function () {
        let self = this;
        this.confirm.node.on('click', function (event) {
            self.currentplayer.rolepic = self.getSelectedPlayer();
            self.currentplayer = player2;
            // 切换精灵
            self.currentsprite = self.playersp2
            self.selectSinglePlayer(player2);
        })

        this.back.node.on('click', function (event) {
            self.resetConfig();
            cc.director.loadScene('selectmode');
        })
    },

    // 重置全局的player设置
    resetConfig: function () {
        gamemode = 0
        player1 = {};
        player2 = {};
    },

    // 隐藏所有玩家角色
    hideAllPlayer: function () {
        let self = this;
        self.playersp1.enabled = false;
        self.playersp2.enabled = false;
    },

    setupSinglePlayer: function () {
        let self = this;
        player1 = new tmpplayer();
        player1.myname = 'player1';

        self.playersp1.enabled = true
        self.playersp2.enabled = false
        try {
            var selectedname = self.getSelectedPlayer();
            selectedname = selectedname + "_selected"
            cc.loader.loadRes(selectedname, cc.SpriteFrame, function (err, spriteFrame) {
                self.playersp1.spriteFrame = spriteFrame;
            });
        } catch (error) {
            cc.loader.loadRes(selectedname, cc.SpriteFrame, function (err, spriteFrame) {
                self.playersp1.spriteFrame = spriteFrame;
            });
        }
    },

    setupMultiPlayer: function () {
        let self = this;
        self.playersp1.enabled = true
        self.playersp2.enabled = true

        player1 = new tmpplayer();
        player1.myname = 'player1';

        player2 = new tmpplayer();
        player2.myname = 'player2';
        try {
            var selectedname = self.getSelectedPlayer();
            selectedname = selectedname + "_selected"
            cc.loader.loadRes(selectedname, cc.SpriteFrame, function (err, spriteFrame) {
                self.playersp1.spriteFrame = spriteFrame;
                self.playersp2.spriteFrame = spriteFrame;
            });
        } catch (error) {
            cc.loader.loadRes(selectedname, cc.SpriteFrame, function (err, spriteFrame) {
                self.playersp1.spriteFrame = spriteFrame;
                self.playersp2.spriteFrame = spriteFrame;
            });
        }
    },

    // 初始化玩家
    setupPlayer: function () {
        let self = this;
        self.hideAllPlayer();
        switch (gamemode) {
            case 0:
                // 单个玩家
                this.setupSinglePlayer();
                break;

            case 1:
                // 多个玩家 
                this.setupMultiPlayer();
                break;
        }
        self.currentsprite = self.playersp1;
        self.currentplayer = player1;
    },

    onLoad() {
        this.setupToggleGroup();
        this.setupClick();
        this.setupPlayer();
    },

    // update (dt) {},
});