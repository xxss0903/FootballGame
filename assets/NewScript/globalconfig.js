// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html


// 单个游戏的socket
window.mysocket = {};
// 游戏大厅的socket
window.hallsocket = null;
// 游戏主机地址
window.socketurl = 'http://localhost:9999?type=football';
// 当前游戏模式
window.gamemode = 'single';
// 游戏玩家1
window.player1 = cc.player;
// 游戏玩家2
window.player2 = cc.player;
// 当前房间名
window.currentroom = 'room1';
