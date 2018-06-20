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
        // 当前得分
        currentscore: {
            default: null,
            type: cc.Label
        },
        // 当前射门数量的label
        currentshootcount:{
            default: null,
            type: cc.Label
        },

        score1: {
            default: null,
            type: cc.Label
        },
        score2: {
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

        shootcounttag1: {
            default: null,
            type: cc.Node
        },

        scoretag1: {
            default: null,
            type: cc.Node
        },

        shootcounttag2: {
            default: null,
            type: cc.Node
        },

        scoretag2: {
            default: null,
            type: cc.Node
        },
        // 选手2的蛇球数
        shootcount2: {
            default: null,
            type: cc.Label
        },
        // 选手1的射球数
        shootcount1: {
            default: null,
            type: cc.Label
        },


        // 每次射球次数，每个选手轮流射球
        shootTimes: 5,
        maxHeight: 400,
        moveDuration: 5,
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
        keepdelay: 0.5,
        // 球员踢球动作的时间
        playduration: 0.1,
        // 是否检测允许碰撞
        canCollide: false,
        // 是否被普救到
        isKeepOut: false,
        shootCallback: null,
        // 最大轮回射球数
        maxTime: 5,
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
                self.beginTiqiu();
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

        // 判断是否切换球员
        if (gamemode == 1) {
            self.switchPlayer();
        }

        // 重置了，发信号给手柄能够继续点击按钮
        this.sendShootEndSinal();
    },

    // 切换球员进行射
    switchPlayer: function () {
        let self = this;
        var tmpposition1 = cc.p(self.playersp1.node.x, self.playersp1.node.y);
        var tmpposition2 = cc.p(self.playersp2.node.x, self.playersp2.node.y);
        console.log('切换球员')
        console.log(self.currentplayer)
        if (self.currentplayer.myname === 'player1') {
            // 切换到选手2
            self.currentplayer = player2;
            self.playersp = self.playersp2;
            self.currentscore = self.score2;
            self.currentshootcount = self.shootcount2
            self.showPlayer2Views();
        } else {
            // 切换到选手1
            self.currentplayer = player1;
            self.playersp = self.playersp1;
            self.currentscore = self.score1;
            self.currentshootcount = self.shootcount1;
            self.showPlayer1Views();
        }
        self.playersp1.node.setPosition(tmpposition2);
        self.playersp2.node.setPosition(tmpposition1);
    },

    showPlayer1Views: function () {
        var enablePlayer1 = true;
        var enablePlayer2 = false;
        this.showPlayerViews(enablePlayer1, enablePlayer2);
    },

    showPlayer2Views: function () {
        var enablePlayer1 = false;
        var enablePlayer2 = true;
        this.showPlayerViews(enablePlayer1, enablePlayer2);
    },

    showPlayerViews: function(enablePlayer1, enablePlayer2){
        let self = this;
        console.log(self.score1)
        self.playersp1.enabled = enablePlayer1;
        self.shootcount1.enabled = enablePlayer1;
        self.shootcounttag1.active = enablePlayer1;
        self.scoretag1.active = enablePlayer1;
        self.score1.enabled = enablePlayer1;

        self.playersp2.enabled = enablePlayer2;
        self.shootcount2.enabled = enablePlayer2;
        self.shootcounttag2.active = enablePlayer2;
        self.score2.enabled = enablePlayer2;
        self.scoretag2.active = enablePlayer2;
    },

    // 发送信号表示一个射击完成
    sendShootEndSinal: function () {
        var status = {
            // 当前射门状态，完成
            'shootstatus': "end",
            // 切换到下一个选手的手柄
            'next': '0',
        }
        var statusStr = JSON.stringify(status)
        // mysocket.emit("shootstatus", statusStr);
        // 给当前房间发送信号
        G.roomSocket.emit('shootstatus', statusStr);
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

    shootResult: function () {
        let self = this;
        // 先计算分数
        self.calculateScore();
        this.schedule(function(){
            self.resetFootball();
        }, 0.5, 0)
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
        this.schedule(self.shootCallback, moveTime, 0, moveTime);
        // 定时进行扑球
        this.schedule(function () {
            self.keepBall();
        }, self.keepdelay, 0);
    },

    keepBall: function () {
        let self = this;
        self.canCollide = true;
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
        console.log('计算fenshu ')
        console.log(pl);
        console.log(self.currentscore);
        if (!self.isKeepOut) {
            if (cc.rectIntersectsRect(gt.getRect1(), this.kickpoint.getBoundingBoxToWorld())) {
                pl.addScore(2)
            }
            if (cc.rectIntersectsRect(gt.getRect2(), this.kickpoint.getBoundingBoxToWorld())) {
                pl.addScore(3)
            }
            if (cc.rectIntersectsRect(gt.getRect3(), this.kickpoint.getBoundingBoxToWorld())) {
                pl.addScore(1)
            }
            if (cc.rectIntersectsRect(gt.getRect4(), this.kickpoint.getBoundingBoxToWorld())) {
                pl.addScore(2)
            }
            if (cc.rectIntersectsRect(gt.getRect5(), this.kickpoint.getBoundingBoxToWorld())) {
                pl.addScore(3)
            }
        }
        self.currentscore.string = pl.score;
        self.isKeepOut = false;
    },

    onMessage: function (obj) {
        console.log("Hello Football cup");
    },

    // 球员开始移动准备踢球
    playerBegin: function () {
        let self = this;
        var player = self.playersp.getComponent('player');
        player.playBall();
        player.addShootCount(1);
        self.updateShootCount();
    },

    // 更新当前选手的射球数
    updateShootCount: function(){
        let self = this;
        var player = self.playersp.getComponent('player');
    },

    beginMoveBall: function () {
        let self = this;
        this.schedule(function () {
            self.moveFootball();
        }, self.playduration, 0);
    },

    // 开始踢球
    beginTiqiu: function () {
        let self = this;
        // 执行踢球的动作
        // 移动球 
        var seq = cc.sequence([self.playerBegin(), self.beginMoveBall()]);

    },

    // 初始化socket
    setupWebsocket: function () {
        let self = this;

        // 房间的roomsocket接受消息
        G.roomSocket.on('shootstart', function (data) {
            console.log('射球开始');
            console.log(data);
        })

        G.roomSocket.on('shootend', function (data) {
            console.log('射球结束')
            console.log(data)
        })

        G.roomSocket.on('control', function (msg) {
            console.log('调整方向');
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
                    self.beginTiqiu();
                    break;
            }
        })

        G.roomSocket.on('disconnect', function () {
            console.log('游戏界面断开链接')
        })


    },

    setupSingleMode: function () {
        let self = this;
        self.playersp1.enabled = true;
        self.playersp2.enabled = false;
        cc.loader.loadRes(player1.rolepic.toString(), cc.SpriteFrame, function (err, spriteFrame) {
            self.playersp1.spriteFrame = spriteFrame;
        });
    },

    setupMultiMode: function () {
        let self = this;
        self.playersp1.enabled = true;
        self.playersp2.enabled = true;
        cc.loader.loadRes(player1.rolepic.toString(), cc.SpriteFrame, function (err, spriteFrame) {
            self.playersp1.spriteFrame = spriteFrame;
        });
        cc.loader.loadRes(player2.rolepic.toString(), cc.SpriteFrame, function (err, spriteFrame) {
            self.playersp2.spriteFrame = spriteFrame;
        });
    },

    hideAllPlayer: function () {
        let self = this;
        self.playersp1.enabled = false;
        self.playersp2.enabled = false;
    },

    setupPlayer: function () {
        let self = this;
        self.currentplayer = player1;
        self.playersp = self.playersp1;
        self.currentscore = self.score1;
        self.currentshootcount = self.shootcount1;
        self.hideAllPlayer();
        switch (gamemode) { 
            case 0:
                this.setupSingleMode();
                break;

            case 1:
                this.setupMultiMode();
                break;
        }
        self.showPlayer1Views();
    },

    setupParams: function () {
        let self = this;
        this.maxHeight = this.gate.height * 1.5;
        this.shootCallback = function () {
            self.shootResult();
        }
        console.log(this.shootCallback)
    },

    // 足球被扑到了
    keepOut: function () {
        let self = this;
        self.isKeepOut = true;
        console.log('球被扑救到');
        this.unschedule(this.shootCallback);
        self.shootResult();
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