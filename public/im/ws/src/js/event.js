
    var token = sessionStorage.getItem('token');

    if (token == undefined) {
        location.href = loginUrl;
    }

    /*
     * 在线人数统计
     */
    function Statistics(data) {
        // console.log(data);
        //$(".statistics span").text(data.count);
        $("#staticNum").text(data.count);
    }

    /*
     * 初始化后获取好友列表
     */
    function initok(data) {
        $('#mynickname').val(data.nickname);
        $('#mynumber').val(data.number);
        $('#last_login').val(data.last_login);
        // 获取好友列表
        getFriendsList();
        // 获取群组列表
        getGroupsList();
    }

    /*
     * 所有弹出成功的回调函数
     */
    function ok(data) {
        console.log(data);
        layer.msg(data);
    }
    //退出
    function belogin($data)
    {
        $.ajax({type:"get",url:SCOPE.logout_url,data:null,success:function(data){},error:function(data){}});
        layer.alert('您已在其他地方登陆了', {
            skin: 'layui-layer-molv' //样式类名
            ,closeBtn: 0
        }, function(index){
            sessionStorage.removeItem("token");
            location.href=SCOPE.logout_url;
            layer.close(index);
        });
    }
    /*
     * 好友上线
     */
    function friendOnLine(data) {
        layer.msg(data.nickname+"已上线");
        layui.use('layim',function(layim){
            layim.setFriendStatus(data.number, 'online');
            layim.getMessage({
                system: true //系统消息
                ,id: data.id //聊天窗口ID
                ,type: "friend" //聊天窗口类型
                ,content: data.nickname+"已上线"
            });
        });
    }

    /*
     * 好友下线提醒
     */
    function friendOffLine(data) {
        layer.msg(data.nickname+"已离线");
        layui.use('layim',function(layim){
            layim.setFriendStatus(data.number, 'offline');
            layim.getMessage({
                system: true //系统消息
                ,id: data.id //聊天窗口ID
                ,type: "friend" //聊天窗口类型
                ,content: data.nickname+"已离线"
            });
        });

    }


    /*
     * 好友列表
     */
    function getFriends(data) {
        var online = [];
        var offline = [];
        // for(var i=0; i< data.length;i++){
        //     if(data[i].online==1){
        //         layui.use('layim',function(layim,data){
        //             layim.setFriendStatus(data.id, 'online');
        //         })
        //     }else{
        //         layui.use('layim',function(layim,data){
        //             layim.setFriendStatus(data.id, 'offline');
        //         })
        //     }
        // }
        //
        // var all = online.concat(offline);
        // for(var y=0; y<all.length; y++){
        //     var value = all[y];
        // 	var online = value.online==1?"online":"offline";
        // $("#friend-list").append(
        //     	'<div class="friend-block" number="'+value.number+'" title="上次登录时间：'+value.last_login+'">'+
        //         	'<div class="status '+online+'"></div>'+
        //         	'<div class="info">'+
        // 			'<div class="nackname">'+value.nickname+'</div>'+
        // 			'<div class="number">'+value.number+'</div>'+
        // 		'</div>'+
        //         '</div>'
        // );
        // }
    }

    /*收到添加好友的申请*/
    function friendRequest(data) {
        var numberId = data.from.number;
        var from = data.from;
        layui.use('layim',function(layim){
                    layer.confirm(data.from.nickname + '申请添加您为好友', {
                        btn: ['同意', '拒绝'] //按钮
                    }, function (index) {
                        parent.layui.layim.setFriendGroup({
                            type: 'friend'
                            , username: data.from.nickname//用户名称或群组名称
                            , avatar: data.from.avatar
                            , group: parent.layui.layim.cache().friend || [] //获取好友分组数据
                            , submit: function (group, index) {
                                var data = {
                                    "controller": "Friend",
                                    "action": "doReq",
                                    "content": {
                                        "token": token,
                                        "check": 1,
                                        "msg_type": 2,
                                        "group_user_id": group,
                                        "friend_id": from.id,
                                        "status": 2,
                                        "msg_id": from.msg_id
                                    }
                                };
                                var data = JSON.stringify(data);
                                parent.ws.send(data);
                                //将好友 追加到主面板
                                layim.addList({
                                    type: 'friend'
                                    , avatar: from.avatar
                                    , username: from.nickname //好友昵称
                                    , groupid: group //所在的分组id
                                    , id: from.id //好友ID
                                    , sign: from.sign //好友签名
                                });
                                parent.layer.close(index);
                                layer.close(index);
                            }
                        });
                        layer.close(index);
                    }, function (index) {
                            var data = {
                                "controller": "Friend",
                                "action": "doReq",
                                "content": {
                                    "token": token,
                                    "msg_type":2,
                                    "friend_id":from.id,
                                    "status":1,
                                    "msg_id":from.msg_id,
                                    "check": 0
                                }
                            };
                            var data = JSON.stringify(data);
                            ws.send(data);
                            layer.close(index);
                            layer.msg("您拒绝了好友添加的申请");
                    })

                })
    }
    /**收到加群的申请
     /*收到添加好友的申请*/
    function groupRequest(data) {
        var numberId = data.from.number;
        var from = data.from;
        layui.use('layim',function(layim){
            layer.confirm(data.from.nickname + '申请加入您的群', {
                btn: ['同意', '拒绝'] //按钮
            }, function (index) {
                        var data = {
                            "controller": "Group",
                            "action": "doJoinGroupReq",
                            "content": {
                                "token": token,
                                "check": 1,
                                "msg_type": 3,
                                "from_id":from.id,
                                "gid":from.gid,
                                "gnumber":from.gnumber,
                                "status": 2,
                                "msg_id": from.msg_id
                            }
                        };
                        var data = JSON.stringify(data);
                        parent.ws.send(data);
                layer.close(index);
            }, function (index) {
                var data = {
                    "controller": "Group",
                    "action": "doJoinGroupReq",
                    "content": {
                        "token": token,
                        "msg_type":3,
                        "status":1,
                        "gid":from.gid,
                        "gnumber":from.gnumber,
                        "from_id":from.id,
                        "msg_id":from.msg_id,
                        "check": 0
                    }
                };
                var data = JSON.stringify(data);
                ws.send(data);
                layer.close(index);
                layer.msg("您拒绝了 加群的申请");
            })

        })
    }
    /*添加好友的结果处理*/

    /*拒绝添加好友*/
    function newFriendFail(data) {
        layer.confirm(data, {
            btn: ['知道了'] //按钮
        }, function (index) {
            layer.close(index);
        });
    }

    /*添加好友成功后*/
    function newFriend(data) {
        layui.use('layim',function(layim){
            layim.addList({
                type: 'friend'
                , avatar: data.avatar
                , username: data.nickname //好友昵称
                , groupid: data.groupid //所在的分组id
                , id: data.id //好友ID
                , sign: data.sign //好友签名
            });
        })
        layer.msg('您已成功添加好友');
    }
    /*拒绝加入群*/
    function newGroupFailMsg(data) {
        layer.confirm(data, {
            btn: ['知道了'] //按钮
        }, function (index) {
            layer.close(index);
        });
    }
    /*
     * 好友聊天消息
     * flag == 1 表示自己的消息 2 表示对方的
     *
     */
    function chat(data) {
        console.log(data);
        layui.use('layim', function (layim) {
            layim.getMessage(data);
        });
    }

    /*
     * 群组聊天消息
     * flag == 1 表示自己的消息 2 表示对方的
     *
     */
    function groupChat(data) {
        console.log(data);
        layui.use('layim', function (layim) {
            layim.getMessage(data);
        });
    }


    /*
     * 世界聊天
     */
    function worldChat(data) {
        var msg = data.msg;
        var user = data.user;

        var text = "<li>" + "<p>" + "<font>" + user['nickname'] + " ( " + user['number'] + " )</font>" + "<span>" + msg + "</span>" + "</p>" + "</li>";
        $('#world-talk').append(
            text
        );
    }

    function groupList(data) {
        for (var i = 0; i < data.length; i++) {
            $('#group-list').append(
                '<div class="friend-block" number="' + data[i].info.gnumber + '" ginfo="' + data[i].info.ginfo + '">' +
                '<i class="fa fa-group"></i>' +
                '<div class="info">' +
                '<div class="nackname">' + data[i].info.gname + '</div>' +
                '<div class="number">' + data[i].info.gnumber + '</div>' +
                '</div>' +
                '</div>'
            );
        }
    }

    /*创建组*/
    function newGroup(data) {
        //将群 追加到主面板
        console.log(data);
        layui.use('layim', function (layim) {
            layim.addList(data);
        });
    }
