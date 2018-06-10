var tmpPlayer = require("player");
var tmpFootball = require("football");
var tmpGate = require("gate");
var tmpKeeper = require("keeper");

cc.Class({
    extends: cc.Component,

    properties: {

        football: {
            default: null,
            type: cc.Node
        },

        player: {
            default: null,
            type: cc.Sprite
        },

        gate: {
            default: null,
            type: cc.Node
        },

        score: {
            default: null,
            type: cc.Label
        },

        kickpoint: {
            default: null,
            type: cc.Node
        },

        goalkeeper: {
            default: null,
            type: cc.Node
        },

        background: {
            default: null,
            type: cc.Node
        },

        arrow: {
            default: null,
            type: cc.Node
        },

        maxHeight: 400,
        moveDuration: 2,
        // 足球起始点
        startPosition: cc.p(),
        // 足球踢出去的点
        endPosition: cc.p(),
        keeperPosition: cc.p(),
        defaultKickPoint: cc.p(),
        socket: {},
        resetSize: 1,
        center: new cc.p()
    },

    // 初始化控制系统 
    setupControl: function () {
        var self = this;
        var ftball = self.football.getComponent(tmpFootball);
        var pl = self.player.getComponent(tmpPlayer);
        var gt = self.gate.getComponent(tmpGate);

        // this.startPosition = ftball.node.getBoundingBoxToWorld();
        // console.log(this.startPosition);

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

    // 更新箭头的转动角度
    updateArrowDirection: function () {
        var p = this.startPosition.sub(this.endPosition);
        var rotateAngle = 180 - cc.pToAngle(p) / Math.PI * 180;

        this.arrow.rotation = rotateAngle;
    },

    // 游戏结束
    gameOver: function () {
        cc.director.loadScene("gameover");
    },

    // 重置足球，摆到球员脚下
    resetFootball: function () {
        var ftball = this.football.getComponent(tmpFootball);
        ftball.node.setPosition(this.startPosition);
        this.endPosition = cc.p(0, 0);
        this.kickpoint.setPosition(this.endPosition)
        ftball.node.stopAllActions();
        ftball.node.runAction(cc.fadeTo(0, 255));
        this.updateArrowDirection();
        this.goalkeeper.setPosition(this.keeperPosition);
        this.goalkeeper.rotation = 0;
    },

    setFootballStartPosition: function () {
        this.startPosition = cc.p(this.football.x, this.football.y);
        this.endPosition = cc.p(this.kickpoint.x, this.kickpoint.y);
        this.updateArrowDirection();
    },

    // 手柄控制小红点的位置
    resetFootballDirection: function (direction, power) {
        var self = this;
        var ftball = self.football.getComponent(tmpFootball);

        var x = this.kickpoint.x
        var y = this.kickpoint.y
        console.log(x);
        switch (direction) {
            case 'up':
                y = y + this.resetSize / 2;
                break;
            case 'down':
                y = y - this.resetSize / 2;
                break;
            case 'left':
                x = x - this.resetSize;
                break;
            case 'right':
                x = x + this.resetSize;
                break;
            case 'press':
                // 根据能量计算y轴的点
                y = y + power * this.maxHeight;
                break;
        }

        this.endPosition = cc.p(x, y);
        this.kickpoint.setPosition(this.endPosition);
        // 计算箭头的转动角度
        this.updateArrowDirection();
    },

    // 根据足球上左右位移，计算出一对点
    getFootLinePoints: function (kickpoint) {

        return Pair
    },

    // 足球踢出去的移动轨迹
    moveFootball: function (power) {
        let self = this;

        if (power == undefined) {
            power = 0;
        }
        var moveTime = this.moveDuration + 1 - power * 2;

        var startP = cc.p(this.football.x, this.football.y);
        var endP = this.endPosition;
        console.log('运动到 ' + endP);

        var moveto = cc.moveTo(moveTime, endP);
        moveto.easing(cc.easeOut(moveTime));
        var rotateto = cc.rotateTo(moveTime, 720);
        var fadeto = cc.fadeTo(moveTime, 0);
        var movePath = cc.spawn(moveto, rotateto, fadeto);
        this.football.runAction(movePath);
        // 定时重置足球乙级计算最后分数
        this.schedule(function () {
            self.calculateScore();
            self.resetFootball();
        }, moveTime, 0, moveTime);
        // 定时进行扑球
        this.schedule(function () {
            self.keepBall();
        }, 0, 0);
    },

    keepBall: function(){
        let self = this;
        console.log("扑球");
        var keeper = self.goalkeeper.getComponent(tmpKeeper);
        keeper.keepBall();
    },

    // 计算当前球得位置计算分数
    calculateScore: function () {
        var self = this;
        var pl = self.player.getComponent(tmpPlayer);
        // 球门
        var gt = self.gate.getComponent(tmpGate);
        if (cc.rectIntersectsRect(gt.getRect1(), this.kickpoint.getBoundingBoxToWorld())) {
            pl.addScore(2)
            this.score.string = pl.score;
        }
        if (cc.rectIntersectsRect(gt.getRect2(), this.kickpoint.getBoundingBoxToWorld())) {
            pl.addScore(3)
            this.score.string = pl.score;
        }
        if (cc.rectIntersectsRect(gt.getRect3(), this.kickpoint.getBoundingBoxToWorld())) {
            pl.addScore(1)
            this.score.string = pl.score;
        }
        if (cc.rectIntersectsRect(gt.getRect4(), this.kickpoint.getBoundingBoxToWorld())) {
            pl.addScore(2)
            this.score.string = pl.score;
        }
        if (cc.rectIntersectsRect(gt.getRect5(), this.kickpoint.getBoundingBoxToWorld())) {
            pl.addScore(3)
            this.score.string = pl.score;
        }
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
            var obj = JSON.parse(msg);
            console.log(msg)

            switch (obj.direction) {
                case 'up':
                    self.resetFootballDirection('up')
                    break;
                case 'down':
                    self.resetFootballDirection('down')
                    break;
                case 'left':
                    self.resetFootballDirection('left')
                    break;
                case 'right':
                    self.resetFootballDirection('right')
                    break;
                case 'press':
                    self.resetFootballDirection('press', obj.power);
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

        self.socket.on('timeout', (msg) => {
            console.log('链接超时');
        })

    },

    setupPlayer: function () {
        let self = this;
        var resStr = 'resources/' + playerrole + '.png'
        var realUrl = cc.url.raw(resStr);
        console.log('加载玩家头像')
        console.log(playerrole);
        cc.loader.loadRes(playerrole.toString(), cc.SpriteFrame, function (err, spriteFrame) {
            console.log(spriteFrame)
            self.player.spriteFrame = spriteFrame;
            console.log(self.player.node.spriteFrame);
        });
    },

    // 守门员扑救
    keeperSave: function () {

    },

    setupParams: function () {
        this.maxHeight = this.gate.height * 1.5;
    },

    // use this for initialization
    onLoad: function () {
        this.setupParams();
        this.setupPlayer();
        this.setupControl();
        this.setFootballStartPosition();
        this.setupWebsocket();
    },

    // called every frame
    update: function (dt) {
        // var self = this;
        // var ftball = self.football.getComponent(tmpFootball);
        // var pl = self.player.getComponent(tmpPlayer);
        // var gt = self.gate.getComponent(tmpGate);
        // 碰撞检测，碰撞球门
        // if (cc.rectIntersectsRect(gt.getRect1(), ftball.node.getBoundingBoxToWorld())) {
        //     pl.addScore(1);
        //     this.resetFootball();
        //     this.score.string = pl.score;
        // }

        // 分数获取
        // if (cc.rectIntersectsRect(gt.getRect2(), ftball.node.getBoundingBoxToWorld())) {
        //     pl.addScore(2)
        //     this.score.string = pl.score;
        // }

    },
});