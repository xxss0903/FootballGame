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

        startPosition: new cc.Rect()

    },

    // self define function
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

    gameOver: function () {
        cc.director.loadScene("gameover");
    },

    resetFootball: function () {

        var self = this;
        var ftball = self.football.getComponent(tmpFootball);
        var pl = self.player.getComponent(tmpPlayer);
        var gt = self.gate.getComponent(tmpGate);

        ftball.node.setPosition(this.startPosition.x - 520 - 30, this.startPosition.y - 950 - 30);
        ftball.node.stopAllActions();

    },

    moveFootball: function () {
        var randomX = 400 - cc.random0To1() * 800;

        var moveto = cc.moveTo(1, cc.p(randomX, this.node.height / 2 - 400));
        this.football.runAction(moveto);
    },

    // use this for initialization
    onLoad: function () {
        this.setupControl();
        this.moveFootball();
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