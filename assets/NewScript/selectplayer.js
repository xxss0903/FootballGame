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

        playername: 'player',
        playercount: 1,
        player1: cc.Sprite,
        player2: cc.Sprite
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
            console.log(item)
            item.node.on('toggle', function (event) {
                self.changeToggleItem(item);
            }, self);
        }
    },

    // 选择球员之后设置
    changeToggleItem: function (item) {
        let self = this;
        var name = item.name.replace('<Toggle>', '')
        console.log('选中球员 ' + name);
        console.log(self.player1);
        cc.loader.loadRes(name.toString(), cc.SpriteFrame, function (err, spriteFrame) {
            self.player1.spriteFrame = spriteFrame;
        });
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
                return selectedPlayerName;
                break;
            }
        }
        return 'henry';
    },

    setupClick: function () {
        let self = this;
        switch (gamemode) {
            case 'single':
                this.selectSinglePlayer(player1);
                break;

            case 'multi':
                this.selectMultiPlayer();
                break;
        }
    },

    selectSinglePlayer: function (player) {
        let self = this;
        this.confirm.node.on('click', function (event) {
            console.log('confirm');
            player.rolepic = self.getSelectedPlayer();
            cc.director.loadScene('game');
        })
    },

    // 创建一个新的选手对象
    createNewPlayer: function () {
        // 使用给定的模板在场景中生成一个新节点
        var newPlayer = cc.instantiate(this.playerprefab);
        // 将新增的节点添加到 Canvas 节点下面
        this.node.addChild(newPlayer);
        return newPlayer;
    },

    selectMultiPlayer: function () {
        let self = this;
        this.confirm.node.on('click', function (event) {
            console.log('confirm');
            player1.rolepic = self.getSelectedPlayer();
            self.selectSinglePlayer(player2);
        })

        this.back.node.on('click', function (event) {
            console.log('返回选择模式');
            self.resetConfig();
            cc.director.loadScene('selectmode');
        })
    },

    resetConfig: function () {
        player1 = {};
        player2 = {};
        gamemode = 'single'
    },

    createSinglePlayer: function () {
        let self = this;
        self.player1 = self.createNewPlayer();
        self.player1.setPosition(-100, -400);
    },

    createMultiPlayers: function () {
        let self = this;
        var player1 = self.createNewPlayer();
        player1.setPosition(-100, -400);
        var player2 = self.createNewPlayer();
        player2.setPosition(100, -400);
    },

    // 初始化玩家
    setupPlayer: function () {
        console.log(gamemode);
        switch (gamemode) {
            case 'single':
                // 单个玩家
                this.createSinglePlayer();
                player1.myname = "player1";
                break;

            case 'multi':
                // 多个玩家 
                this.createMultiPlayers();
                player1.myname = "player1";
                player2.myname = "player2";
                break;
        }
    },


    onLoad() {
        this.setupPlayer();
        this.setupToggleGroup();
        this.setupClick();
    },

    start() {

    },

    // update (dt) {},
});