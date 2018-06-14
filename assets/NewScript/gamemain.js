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

        playersp: {
            default: null,
            type: cc.Sprite
        },
        playersp1: {
            default: null,
            type: cc.Sprite
        },
        playersp2: {
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
        center: new cc.p(),
        // 当前踢球的运动员
        currentplayer: cc.player,
        // 扑球在踢球后的时间
        keepdelay: 2.0,
        // 是否检测允许碰撞
        canCollide: false,
    },

    // 初始化控制系统 
    setupControl: function () {
        var self = this;
        var ftball = self.football.getComponent(tmpFootball);
        var pl = self.playersp.getComponent(tmpPlayer);
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
            onTouchEnded: function (touch, event) { }
        }, self.node);
    },

    // 判断射门点是否在门框内
    isEndPositionInGate: function () {
        return cc.rectContainsRect(this.gate.getBoundingBoxToWorld(), this.kickpoint.getBoundingBoxToWorld());
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
        let self = this;
        var ftball = this.football.getComponent(tmpFootball);
        // 关闭碰撞
        ftball.switchCollide(false);
        ftball.node.setPosition(this.startPosition);
        this.endPosition = cc.p(0, 0);
        this.kickpoint.setPosition(this.endPosition)
        ftball.node.stopAllActions();
        ftball.node.runAction(cc.fadeTo(0, 255));
        this.updateArrowDirection();
        this.goalkeeper.setPosition(this.keeperPosition);
        this.goalkeeper.rotation = 0;

        self.canCollide = false;
        // 重置了，发信号给手柄能够继续点击按钮
        this.sendShootEndSinal();
    },

    // 发送信号表示一个射击完成
    sendShootEndSinal: function () {
        var status = {
            'shootstatus': "end"
        }
        var statusStr = JSON.stringify(status)
        mysocket.emit("shootstatus", statusStr);
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
        }, self.keepdelay, 0);
    },

    keepBall: function () {
        let self = this;
        self.canCollide = true;
        console.log("开始扑球");
        var keeper = self.goalkeeper.getComponent(tmpKeeper);
        keeper.keepBall();
        // 开启碰撞
        var ftball = self.football.getComponent(tmpFootball);
        ftball.switchCollide(self.isEndPositionInGate());
    },

    // 计算当前球得位置计算分数
    calculateScore: function () {
        var self = this;
        var pl = self.playersp.getComponent(tmpPlayer);
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

    // 如果断开链接，尝试重新链接
    tryConnectSocket: function () {
        console.log('尝试重新链接');
        if (cc.sys.isNative) {
            window.io = SocketIO;
        } else {
            window.io = require('socket.io')
        }
        let self = this
        self.socket = window.io(socketurl);
        mysocket = self.socket;
        self.socket.on('connection', function () {
            console.log('连接上了')
        });

        self.socket.on('connect', function () {
            mysocket = self.socket;
            console.log('链接上了 ' + msg);
        });

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

    // 初始化socket
    setupWebsocket: function () {
        let self = this;
        mysocket.on('handplay', (msg) => {
            var obj = JSON.parse(msg);

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


        mysocket.on('disconnect', function (data) {
            console.log('游戏断开链接')
            self.tryConnectSocket();
        })

        mysocket.on('error', (msg) => {
            console.log('发生错误 ' + msg);
            self.tryConnectSocket();
        })

        mysocket.on('timeout', (msg) => {
            self.tryConnectSocket();
            console.log('链接超时');
        })
    },

    setupSingleMode: function () {
        let self = this;
        self.playersp1.enabled = true;
        self.playersp2.enabled = false;
        self.currentplayer = player1;
        self.player = self.playersp1;
        cc.loader.loadRes(player1.rolepic.toString(), cc.SpriteFrame, function (err, spriteFrame) {
            self.playersp1.spriteFrame = spriteFrame;
        });
    },

    setupMultiMode: function () {
        let self = this;
        self.playersp1.enabled = true;
        self.playersp2.enabled = true;
        self.currentplayer = player1;
        cc.loader.loadRes(player1.rolepic.toString(), cc.SpriteFrame, function (err, spriteFrame) {
            self.playersp1.spriteFrame = spriteFrame;
        });
        cc.loader.loadRes(player2.rolepic.toString(), cc.SpriteFrame, function (err, spriteFrame) {
            self.playersp2.spriteFrame = spriteFrame;
        });
    },

    hideAllPlayer: function(){
        let self = this;
        self.playersp1.enabled = false;
        self.playersp2.enabled = false;
    },

    setupPlayer: function () {
        let self = this;
        self.playersp = self.playersp1;
        self.hideAllPlayer();
        switch (gamemode) {
            case 'single':
                this.setupSingleMode();
                break;

            case 'multi':
                this.setupMultiMode();
                break;
        }
    },

    setupParams: function () {
        this.maxHeight = this.gate.height * 1.5;
    },

    // 足球被扑到了
    keepOut: function () {
        let self = this;
        console.log('球被扑救到');
        self.resetFootball();
    },

    // use this for initialization
    onLoad: function () {
        let self = this;
        self.setupParams();
        self.setupPlayer();
        self.setupControl();
        self.setFootballStartPosition();
        self.setupWebsocket();
    },

    // called every frame
    update: function (dt) {
        let self = this;
        var ftball = self.football.getComponent(tmpFootball);
        if (ftball.getCollisionStatus()) {
            // 已经碰撞到了，得分，重置
            self.keepOut();
            ftball.resetCollisionStatus();
        }
    },
});