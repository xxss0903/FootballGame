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
// 服务器地址
window.rooturl = 'http://127.0.0.1:5757';
// window.rooturl = 'http://193.112.183.189:5757';

// 游戏主机地址
window.socketurl = rooturl+'?type=football';
// 当前游戏模式 0:单人模式; 1:多人模式
window.gamemode = 0;
// 当前游戏的房间id，每个界面的游戏有一个固定的roomid，
// 然后手柄扫码也会进入到这个roomid对应的房间里面
window.roomid = 11;
// 游戏玩家1
window.player1 = cc.player;
// 游戏玩家2
window.player2 = cc.player;
// 当前房间名
window.currentroom = 'room1';

// socket 链接对象
window.G = {
    queueSocket: null,
    globalSocket: null,
    hallSocket: null,
    roomSocket: null,
}
