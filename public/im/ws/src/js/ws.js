/* 1. 判断缓存中是否有 token
 * 2. onopen 初始化，失败则返回原因，清除 token 重新登录
 * 3. 成功，则调用好友列表接口，群组列表接口渲染页面
 * 4. 监听好友消息，好友上/下线提醒，群组消息，世界消息
 * 5. 监听用户发送的三种消息
 * 6. 关掉页面时，清除缓存
 */

var ws = new WebSocket('ws://chat.huido.site:8090');

//心跳
// var heartCheck = {
//     timeout: 60000,//60ms
//     timeoutObj: null,
//     reset: function(){
//         clearTimeout(this.timeoutObj);
//         this.start();
//     },
//     start: function(){
//         this.timeoutObj = setTimeout(function(){
//             ws.send("HeartBeat");
//         }, this.timeout)
//     }
// }

ws.onopen = function (ev) {
    // 初始化缓存
    init();
    // heartCheck.start();
};

ws.onmessage = function (ev) {
    // heartCheck.reset();
    // layim.getMessage(ev.data);
    console.log(ev.data);
    var data = eval('(' + ev.data + ')');
    console.log(data);
    // console.log(ev.data);
    if(data.method !=undefined && data.method != null && data.method != ""){
        var method = data.method;
        eval(method+"(data.data)");
    }else if(data.errorCode == 50000){
        // location.href = loginUrl;
    } else{
        //layer.msg('errCode:'+data.errorCode+' '+data.msg);
        layer.msg(data);
    }
};



ws.onclose = function (ev) {
    layer.msg('服务器故障，请重新登录');
    // 清除本地缓存
    // todo
    // location.href = SCOPE.login_url;
    // setTimeout(function (){
    //     location.href = loginUrl;
    // }, 2000);

};

ws.onerror = function (ev) {
    console.log('error:'+ ev.data);
    location.href = SCOPE.logout_url;
};

// 缓存初始化
function init() {
    var data = {
        "controller":"OnOpen",
        "action":"init",
        "content":{"token":token}
    };
    var data = JSON.stringify(data);
    ws.send(data);
}

// 获取好友列表
function getFriendsList() {
    var data = {
        "controller":"Friend",
        "action":"getFriends",
        "content":{"token":token}
    };
    var data = JSON.stringify(data);
    ws.send(data);
}

// 获取群组列表
function getGroupsList() {
    var data = {
        "controller":'Group',
        "action":"getGroups",
        "content":{"token":token}
    };
    var data = JSON.stringify(data);
    ws.send(data);
}
