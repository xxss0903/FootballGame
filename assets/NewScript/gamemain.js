import { dirname } from "path";

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
        currentshootcount: {
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

        avatarl: {
            default: null,
            type: cc.Sprite
        },
        avatarr: {
            default: null,
            type: cc.Sprite
        },

        avatarbgl: {
            default: null,
            type: cc.Sprite
        },

        avatarbgr: {
            default: null,
            type: cc.Sprite
        },

        //游戏音效
        bgMusic: {
            url: cc.AudioClip,
            default: null
        },

        tiqiuMusic: {
            url: cc.AudioClip,
            default: null
        },

        koushaoMusic: {
            url: cc.AudioClip,
            default: null
        },

        // 每次射球次数，每个选手轮流射球
        shootTimes: 5,
        maxHeight: 400,
        moveDuration: 0.5,
        // 足球起始点
        startPosition: cc.p(),
        // 足球踢出去的点
        endPosition: cc.p(),
        // 左边方向速度开关
        accLeft: false,
        // 右边速度开关
        accRight: false,
        // 加速度
        accel: 0,
        // 球在x方向的速度
        xSpeed: 0,
        // 球在y方向的速度
        ySpeed: 0,
        // 最大的移动速度
        maxMoveSpeed: 0,
        // 足球的起始点
        startPosition: cc.p(),
        keeperPosition: cc.p(),
        defaultKickPoint: cc.p(),
        socket: {},
        resetSize: 1,
        center: new cc.p(),
        // 当前踢球的运动员
        currentplayer: null,
        // 扑球在踢球后的时间
        keepdelay: 0.1,
        // 球员踢球动作的时间
        playduration: 0.1,
        // 是否检测允许碰撞
        canCollide: false,
        // 是否被普救到
        isKeepOut: false,
        shootCallback: null,
        // 最大轮回射球数
        maxTime: 5,
        ftballSize: 100,
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
        var rotateAngle = 270 - cc.pToAngle(p) / Math.PI * 180;

        this.arrow.rotation = rotateAngle;
    },

    stopMusic: function () {
        cc.audioEngine.stopAll();
    },

    // 游戏结束
    gameOver: function () {
        this.stopMusic();
        console.log('game over ')
        switch (gamemode) {
            case 0:
                cc.director.loadScene("singlescore");
                break;
            case 1:
                cc.director.loadScene("multiscore");
                break;
        }
    },

    // 重置守门员
    resetKeeper: function () {
        let self = this;
        cc.loader.loadRes('jump1', cc.SpriteFrame, function (err, spriteFrame) {
            self.goalkeeper.spriteFrame = spriteFrame;
        });
    },

    // 重置足球，摆到球员脚下
    resetFootball: function () {
        let self = this;
        this.resetKeeper();
        var ftball = this.football.getComponent(tmpFootball);
        // 关闭碰撞
        ftball.switchCollide(false);
        ftball.node.setPosition(this.startPosition);
        console.log('重置足球大小');
        console.log(self.football);
        // 球的大小还原
        self.football.width = self.ftballSize;
        self.football.height = self.ftballSize;
        self.football.scaleX = 1;
        self.football.scaleY = 1;

        this.endPosition = cc.p(0, 51);
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

        this.judgeShootFinish();


    },

    playBgm: function (playOrStop) {
        cc.audioEngine.play(this.bgMusic, true, 0.2)
    },

    playTiqiu: function () {
        cc.audioEngine.play(this.tiqiuMusic, false, 1);
    },

    playKoushao: function () {
        cc.audioEngine.play(this.koushaoMusic, false, 1);
    },

    judgeShootFinish: function () {
        let self = this;
        switch (gamemode) {
            case 0:
                self.judgeSingleShootFinish();
                break;
            case 1:
                self.judgeMultiShootFinish();
                break;
        }

    },

    judgeSingleShootFinish: function () {
        let self = this;
        if (player1 == undefined) {
            return
        }
        var pl1 = self.playersp1.getComponent(tmpPlayer);
        player1.score = pl1.score;
        player1.shootcount = pl1.shootcount;
        if (pl1.shootcount == self.shootTimes) {
            self.gameOver();
        }
    },

    judgeMultiShootFinish: function () {
        let self = this;
        var pl1 = self.playersp1.getComponent(tmpPlayer);
        var pl2 = self.playersp2.getComponent(tmpPlayer);
        player1.score = pl1.score;
        player1.shootcount = pl1.shootcount;
        player2.score = pl2.score;
        player2.shootcount = pl2.shootcount;
        if (pl1.shootcount + pl2.shootcount == 2 * self.shootTimes) {
            self.gameOver();
        }
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

    showPlayerViews: function (enablePlayer1, enablePlayer2) {
        let self = this;
        console.log(self.score1)
        self.playersp1.enabled = enablePlayer1;
        self.shootcount1.enabled = enablePlayer1;
        self.shootcounttag1.active = enablePlayer1;
        self.scoretag1.active = enablePlayer1;
        self.score1.enabled = enablePlayer1;
        self.avatarl.enabled = enablePlayer1;
        self.avatarbgl.enabled = enablePlayer1;

        self.playersp2.enabled = enablePlayer2;
        self.shootcount2.enabled = enablePlayer2;
        self.shootcounttag2.active = enablePlayer2;
        self.score2.enabled = enablePlayer2;
        self.scoretag2.active = enablePlayer2;
        self.avatarr.enabled = enablePlayer2;
        self.avatarbgr.enabled = enablePlayer2;
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
        if (G.roomSocket == null) {
            return
        }
        G.roomSocket.emit('shootstatus', statusStr);
    },

    setFootballStartPosition: function () {
        this.startPosition = cc.p(this.football.x, this.football.y);
        this.endPosition = cc.p(this.kickpoint.x, this.kickpoint.y);
        this.updateArrowDirection();
    },

    // 手柄控制小红点的位置
    resetFootballDirection: function (direction, power) {
        let self = this;
        console.log('重置目的点 ')
        console.log(self.football);
        // var ftball = self.football.getComponent(tmpFootball);

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
        this.schedule(function () {
            self.resetFootball();
        }, 0.5, 0)
    },

    // 足球踢出去的移动轨迹
    moveFootball: function (power) {
        let self = this;

        if (power == undefined) {
            power = 0;
        }
        var moveTime = this.moveDuration - power;
        console.log('movetime = ' + moveTime);
        var startP = cc.p(this.football.x, this.football.y);
        // 设置起始和结束坐标
        this.startPosition = startP;
        var endP = this.endPosition;

        // 计算贝塞尔的中间线，得到曲线
        // 如果落球点在射球点右边，那么向右边偏
        // 如果落球点在射球点左边，那么向左偏
        var bX = this.startPosition.x;
        var dis = 150;
        if (this.endPosition.x >= this.startPosition.x) {
            bX = this.endPosition.x + dis;
        } else {
            bX = this.endPosition.x - dis;
        }
        var bY = this.startPosition.y + (this.endPosition.y - this.startPosition.y) / 2;
        var bezierPoint = cc.p(bX, bY);
        var bezierToPath = [cc.p(this.startPosition), bezierPoint, cc.p(this.endPosition)];
        var moveto = cc.bezierTo(moveTime, bezierToPath);

        // 直线运动
        // var moveto = cc.moveTo(moveTime, endP);

        // moveto.easing(cc.easeOut(moveTime));
        var scaleto = cc.scaleTo(moveTime, 0.6, 0.6);
        var rotateto = cc.rotateTo(moveTime, 3600);
        var fadeto = cc.fadeTo(moveTime, 200);
        var movePath = cc.spawn(moveto, rotateto, fadeto, scaleto);
        this.football.runAction(movePath);
        // 定时重置足球乙级计算最后分数
        this.schedule(self.shootCallback, moveTime, 0, moveTime);
        // 定时进行扑球
        self.delayKeepBall();
    },

    delayKeepBall: function () {
        let self = this;
        console.log('准备扑球')
        this.schedule(function () {
            self.keepBall();
        }, self.keepdelay, 0);
    },

    keepBall: function () {
        let self = this;
        console.log('扑球 ...');
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
        self.playTiqiu();
    },

    // 更新当前选手的射球数
    updateShootCount: function () {
        let self = this;
        var player = self.playersp.getComponent('player');
        self.currentshootcount.string = player.shootcount;
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
        if (G.roomSocket == null) {
            return
        }
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
            console.log('控制球');
            console.log(msg)
            console.log(self.currentplayer);
            var obj = JSON.parse(msg);
            if (obj.playername != self.currentplayer.myname) {
                // 如果不是当前球员的手柄在控制，那么就跳过
                return
            } else {
                console.log(obj.playername + " 开始");
            }

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
        if (player1 == undefined) {
            return
        }
        cc.loader.loadRes(player1.playpic, cc.SpriteFrame, function (err, spriteFrame) {
            self.playersp1.spriteFrame = spriteFrame;
        });
        // 形象
        cc.loader.loadRes(self.getAvatarPic(player1.rolepic, 'll'), cc.SpriteFrame, function (err, spriteFrame) {
            self.avatarl.spriteFrame = spriteFrame;
        });
    },

    getAvatarPic: function (name, who) {
        return 'avatar_' + name + '_' + who
    },

    setupMultiMode: function () {
        let self = this;
        self.playersp1.enabled = true;
        self.playersp2.enabled = true;
        if (player1 == undefined) {
            return
        }
        cc.loader.loadRes(player1.playpic, cc.SpriteFrame, function (err, spriteFrame) {
            self.playersp1.spriteFrame = spriteFrame;
        });
        cc.loader.loadRes(player2.playpic, cc.SpriteFrame, function (err, spriteFrame) {
            self.playersp2.spriteFrame = spriteFrame;
        });
        // 形象图标图像初始化
        cc.loader.loadRes(self.getAvatarPic(player1.rolepic, 'll'), cc.SpriteFrame, function (err, spriteFrame) {
            self.avatarl.spriteFrame = spriteFrame;
        });
        cc.loader.loadRes(self.getAvatarPic(player2.rolepic, 'rr'), cc.SpriteFrame, function (err, spriteFrame) {
            self.avatarr.spriteFrame = spriteFrame;
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
        console.log('当前球员')
        console.log(self.currentplayer);
        self.playersp = self.playersp1;
        self.currentscore = self.score1;
        self.currentshootcount = self.shootcount1;
        console.log(self.playersp1);
        console.log('c初始化足球');
        console.log(self.football);
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
        console.log('player sp');
        console.log(self.playersp1);
        self.playBgm();
    },

    // 更新足球的轨迹
    updateFootballPath: function (ftball, dt) {
        let self = this;
        // 根据当前加速度方向每帧更新速度
        if (this.accLeft) {
            this.xSpeed -= this.accel * dt;
        } else if (this.accRight) {
            this.xSpeed += this.accel * dt;
        }
        // 限制主角的速度不能超过最大值
        if (Math.abs(this.xSpeed) > this.maxMoveSpeed) {
            // if speed reach limit, use max speed with current direction
            this.xSpeed = this.maxMoveSpeed * this.xSpeed / Math.abs(this.xSpeed);
        }

        // 根据当前速度更新主角的位置
        ftball.x += this.xSpeed * dt;
    },

    // called every frame
    update: function (dt) {
        let self = this;
        var ftball = self.football.getComponent(tmpFootball);
        // self.updateFootballPath(ftball, dt);
        if (ftball.getCollisionStatus()) {
            // 已经碰撞到了，得分，重置
            self.keepOut();
            ftball.resetCollisionStatus();
        }
    },
});