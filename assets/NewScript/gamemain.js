var tmpPlayer = require("player");
var tmpFootball = require("football");
var tmpGate = require("gate");


cc.Class({
    extends: cc.Component,

    properties: {

        football: {
            default: null,
            type: cc.Node
        },

        player: {
            default: null,
            type: cc.Node
        },

        gate: {
            default: null,
            type: cc.Node
        },

        score: {
            default: null,
            type: cc.Label
        },

        startPosition: new cc.Rect(),
        socket: {},
        resetSize: 20

    },

    // 初始化控制系统
    setupControl: function () {
        var self = this;
        var ftball = self.football.getComponent(tmpFootball);
        var pl = self.player.getComponent(tmpPlayer);
        var gt = self.gate.getComponent(tmpGate);

        this.startPosition = ftball.node.getBoundingBoxToWorld();
        console.log(this.startPosition);

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                self.moveFootball();
            },
            onTouchMoved: function (touch, event) {

            },
            onTouchEnded: function (touch, event) {}
        }, self.node);
    },

    // 游戏结束
    gameOver: function () {
        cc.director.loadScene("gameover");
    },

    // 重置足球，摆到球员脚下
    resetFootball: function () {
        var self = this;
        var ftball = self.football.getComponent(tmpFootball);
        var pl = self.player.getComponent(tmpPlayer);
        var gt = self.gate.getComponent(tmpGate);

        ftball.node.setPosition(this.startPosition.x - 520 - 30, this.startPosition.y - 950 - 30);
        ftball.node.stopAllActions();
    },

    resetFootballDirection: function (direction) {
        var self = this;
        var ftball = self.football.getComponent(tmpFootball);

        var x = ftball.node.x
        var y = ftball.node.y
        switch (direction) {
            case 'up':
                y = y + this.resetSize;
                break;
            case 'down':
                y = y - this.resetSize
                break;
            case 'left':
                x = x - this.resetSize
                break;
            case 'right':
                x = x + this.resetSize
                break;
        }
        ftball.node.setPosition(x, y);

    },

    // 足球踢出去的移动轨迹
    moveFootball: function () {
        var randomX = 400 - cc.random0To1() * 800;

        var moveto = cc.moveTo(1, cc.p(randomX, this.node.height / 2 - 400));
        this.football.runAction(moveto);
    },

    onMessage: function (obj) {
        console.log("Hello Football cup");
    },

    // 初始化socket
    setupWebsocket: function () {
        if (cc.sys.isNative) {
            window.io = SocketIO;
        } else {
            window.io = require('socket.io')
        }
        let self = this
        self.socket = window.io('http://localhost:9999');
        self.socket.on('connected', (msg) => {
            console.log('链接上了 ' + msg);
        })

        self.socket.on('handplay', (msg) => {
            console.log(msg)
            var obj = JSON.parse(msg);

            console.log('手柄消息 移动方向' + obj.direction);
            switch (obj.direction) {
                case 'up':
                    console.log('up up')
                    self.resetFootballDirection('up')
                    break;
                case 'down':
                    console.log('down down')
                    self.resetFootballDirection('down')
                    break;
                case 'left':
                    console.log('left left')
                    self.resetFootballDirection('left')
                    break;
                case 'right':
                    console.log('right right')
                    self.resetFootballDirection('right')
                    break;
                case 'press':
                    self.moveFootball();
                    break;
            }
        })

        self.socket.on('disconnect', function (data) {
            console.log('游戏断开链接')
        })

        self.socket.on('error', (msg) => {
            console.log('发生错误 ' + msg);
        })

    },

    // use this for initialization
    onLoad: function () {
        this.setupControl();
        this.moveFootball();
        this.setupWebsocket();
    },

    // called every frame
    update: function (dt) {
        var self = this;
        var ftball = self.football.getComponent(tmpFootball);
        var pl = self.player.getComponent(tmpPlayer);
        var gt = self.gate.getComponent(tmpGate);

        if (cc.rectIntersectsRect(gt.getRect1(), ftball.node.getBoundingBoxToWorld())) {
            pl.addScore(1);
            this.resetFootball();
            this.score.string = pl.score;
        }
        if (cc.rectIntersectsRect(gt.getRect2(), ftball.node.getBoundingBoxToWorld())) {
            pl.addScore(2)
            this.resetFootball();
            this.score.string = pl.score;
        }

    },
});