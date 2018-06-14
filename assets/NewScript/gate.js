// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var tmpFootball = require("football");

cc.Class({
    extends: cc.Component,

    properties: {

        cancollide: false,
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
    getBox: function () {
        return this.node.getBoundingBoxToWorld();
    },

    getRect1: function () {
        var x = this.getBox().x;
        var y = this.getBox().y;
        var width = this.getBox().width;
        var height = this.getBox().height;
        var rect1 = new cc.Rect(x, y, width / 3, height / 2);
        return rect1;
    },

    getRect2: function () {
        var x = this.getBox().x;
        var y = this.getBox().y;
        var width = this.getBox().width;
        var height = this.getBox().height;
        var rect2 = new cc.Rect(x, y + height / 2, width / 3, height / 2);
        return rect2;
    },

    getRect3: function () {
        var x = this.getBox().x;
        var y = this.getBox().y;
        var width = this.getBox().width;
        var height = this.getBox().height;
        var rect3 = new cc.Rect(x + width/3, y , width / 3, height);
        return rect3;
    },

    getRect4: function () {
        var x = this.getBox().x;
        var y = this.getBox().y;
        var width = this.getBox().width;
        var height = this.getBox().height;
        var rect2 = new cc.Rect(x + 2 * width/3 , y , width / 3, height/2);
        return rect2;
    },

    getRect5: function () {
        var x = this.getBox().x;
        var y = this.getBox().y;
        var width = this.getBox().width;
        var height = this.getBox().height;
        var rect2 = new cc.Rect(x + 2 * width / 3, y + height/2, width / 3, height/2);
        return rect2;
    },

    onLoad() {
        var self = this;
    },

    start() {

    },

    update(dt) {},
});