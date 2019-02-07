// layui.config({
//     base: './' //扩展 JS 所在目录
// });
layui.define(['jquery', 'contextMenu'], function (exports) {
    var ajaxUrl = 'http://chat.huido.site:8090';/*域名*/
    var token = sessionStorage.getItem("token");
    var contextMenu = layui.contextMenu;
    var $ = layui.jquery;
    var layim = parent.layui.layim;
    var cachedata =  parent.layui.layim.cache();
    var im = {
        init: function () {//定义右键操作
            var my_spread = $('.layim-list-friend >li');
            my_spread.mousedown(function (e) {
                var data = {
                    contextItem: "context-friend", // 添加class
                    target: function (ele) { // 当前元素
                        $(".context-friend").attr("data-id", ele.attr('class').replace(/[^0-9]/ig, "")).attr("data-name", ele.find("span").html());
                        $(".context-friend").attr("data-img", ele.find("img").attr('src')).attr("data-type", 'friend');
                    },
                    menu: []
                };
                data.menu.push(im.menuChat());
                data.menu.push(im.menuInfo());
                data.menu.push(im.menuChatLog());
                data.menu.push(im.menuNickName());
                var currentGroupidx = $(this).find('h5').data('groupidx');//当前分组id
                if (my_spread.length >= 2) { //当至少有两个分组时
                    var html = '<ul>';
                    for (var i = 0; i < my_spread.length; i++) {
                        var groupidx = my_spread.eq(i).find('h5').data('groupidx');
                        if (currentGroupidx != groupidx) {
                            var groupName = my_spread.eq(i).find('h5 span').html();
                            html += '<li class="ui-move-menu-item" data-groupidx="' + groupidx + '" data-groupName="' + groupName + '"><a href="javascript:void(0);"><span>' + groupName + '</span></a></li>'
                        }
                        ;
                    }
                    ;
                    html += '</ul>';
                    data.menu.push(im.menuMove(html));
                }
                data.menu.push(im.menuRemove());
                $(".layim-list-friend >li > ul > li").contextMenu(data);//好友右键事件
            });

            $(".layim-list-friend >li > h5").mousedown(function (e) {
                var data = {
                    contextItem: "context-mygroup", // 添加class
                    target: function (ele) { // 当前元素
                        $(".context-mygroup").attr("data-id", ele.data('groupidx')).attr("data-name", ele.find("span").html());
                    },
                    menu: []
                };
                data.menu.push(im.menuAddMyGroup());
                data.menu.push(im.menuRename());
                if ($(this).parent().find('ul li').data('index') !== 0) {
                    data.menu.push(im.menuDelMyGroup());
                }
                ;

                $(this).contextMenu(data);  //好友分组右键事件
            });


            $(".layim-list-group > li").mousedown(function (e) {
                var data = {
                    contextItem: "context-group", // 添加class
                    target: function (ele) { // 当前元素
                        $(".context-group").attr("data-id", ele.attr('class').replace(/[^0-9]/ig, "")).attr("data-name", ele.find("span").html())
                            .attr("data-img", ele.find("img").attr('src')).attr("data-type", 'group')
                    },
                    menu: []
                };
                data.menu.push(im.menuChat());
                // data.menu.push(im.menuInfo());
                data.menu.push(im.menuChatLog());
                data.menu.push(im.menuLeaveGroupBySelf());

                $(this).contextMenu(data);  //面板群组右键事件
            });


            $('.groupMembers > li').mousedown(function (e) {//聊天页面群组右键事件
                var data = {
                    contextItem: "context-group-member", // 添加class
                    isfriend: $(".context-group-member").data("isfriend"), // 添加class
                    target: function (ele) { // 当前元素
                        $(".context-group-member").attr("data-id", ele[0].id.replace(/[^0-9]/ig, ""));
                        $(".context-group-member").attr("data-img", ele.find("img").attr('src'));
                        $(".context-group-member").attr("data-name", ele.find("span").html());
                        $(".context-group-member").attr("data-isfriend", ele.attr('isfriend'));
                        $(".context-group-member").attr("data-manager", ele.attr('manager'));
                        $(".context-group-member").attr("data-groupidx", ele.parent().data('groupidx'));
                        $(".context-group-member").attr("data-type", 'friend');
                    },
                    menu: []
                };
                var _this = $(this);
                var groupInfo = layim.thisChat().data;
                var _time = (new Date()).valueOf();//当前时间
                var _gagTime = parseInt(_this.attr('gagTime'));//当前禁言时间
                if (cachedata.mine.id !== _this.attr('id')) {
                    data.menu.push(im.menuChat());
                    data.menu.push(im.menuInfo());
                    if (3 == e.which && $(this).attr('isfriend') == 0) { //点击右键并且不是好友
                        data.menu.push(im.menuAddFriend())
                    }
                } else {
                    data.menu.push(im.menuEditGroupNickName());
                }
                if (groupInfo.manager == 1 && cachedata.mine.id !== _this.attr('id')) {//是群主且操作的对象不是自己
                    if (_this.attr('manager') == 2) {
                        data.menu.push(im.menuRemoveAdmin());
                    } else if (_this.attr('manager') == 3) {
                        data.menu.push(im.menuSetAdmin());
                    }
                    data.menu.push(im.menuEditGroupNickName());
                    data.menu.push(im.menuLeaveGroup());
                    if (_gagTime < _time) {
                        data.menu.push(im.menuGroupMemberGag());
                    } else {
                        data.menu.push(im.menuLiftGroupMemberGag());
                    }
                }//群主管理

                layui.each(cachedata.group, function (index, item) {
                    if (item.id == _this.parent().data('groupidx') && item.manager == 2 && _this.attr('manager') == 3 && cachedata.mine.id !== _this.attr('id')) {//管理员且操作的是群员
                        data.menu.push(im.menuEditGroupNickName());
                        data.menu.push(im.menuLeaveGroup());
                        if (_gagTime < _time) {
                            data.menu.push(im.menuGroupMemberGag());
                        } else {
                            data.menu.push(im.menuLiftGroupMemberGag());
                        }
                    }//管理员管理
                })
                $(".groupMembers > li").contextMenu(data);
            })


        },
        //自定义消息，把消息格式定义为layim的消息类型
        defineMessage: function (message, msgType) {
            var msg;
            switch (msgType) {
                case 'Text':
                    msg = message.data;
                    break;
                case 'Picture':
                    msg = 'img[' + message.thumb + ']';
                    break;
                case 'Audio':
                    msg = 'audio[' + message.audio + ']';
                    break;
                case 'File':
                    msg = 'file(' + message.url + ')[' + message.filename + ']';
                    break;
                case 'Video':
                    msg = 'video[' + message.video + ']';
                    break;
            }
            ;
            if (message.ext.cmd) {//如果有命令参数

                switch (message.ext.cmd.cmdName) {
                    case 'gag': //禁言
                        im.setGag({
                            groupidx: message.to,
                            type: 'set',
                            user: message.ext.cmd.id,
                            gagTime: message.data
                        });
                        break;
                    case 'liftGag': //取消禁言
                        im.setGag({
                            groupidx: message.to,
                            type: 'lift',
                            user: message.ext.cmd.id,
                            gagTime: 0
                        });
                        break;
                    // case 'setGag': //禁言
                    // case 'joinGroup': //取消禁言
                    // case 'joinGroup': //加入群
                    // case 'leaveGroup': //退出群
                    // case 'setAdmin': //设置管理员
                    // case 'removeAdmin': //取消管理员
                    // break;
                    default:
                        conf.layim.getMessage({
                            system: true //系统消息
                            , id: message.to //聊天窗口ID
                            , type: "group" //聊天窗口类型
                            , content: msg
                        });
                }
                ;
            }
            ;
            if (message.type == 'chat') {
                var type = 'friend';
                var id = message.from;
            } else if (message.type == 'groupchat') {
                var type = 'group';
                var id = message.to;
            }
            if (message.delay) {//离线消息获取不到本地cachedata用户名称需要从服务器获取
                var timestamp = Date.parse(new Date(message.delay));
            } else {
                var timestamp = (new Date()).valueOf();
            }
            var data = {
                mine: false,
                cid: 0,
                username: message.ext.username,
                avatar: "./uploads/person/" + message.from + ".jpg",
                content: msg,
                id: id,
                fromid: message.from,
                timestamp: timestamp,
                type: type
            }
            if (!message.ext.cmd) {
                conf.layim.getMessage(data);
            }
            ;

        },
        sendMsg: function (data) {  //根据layim提供的data数据，进行解析
            var id = conn.getUniqueId();
            var content = data.mine.content;
            var msg = new WebIM.message('txt', id);    // 创建文本消息

            msg.set({
                msg: data.mine.content,
                to: data.to.id,                        // 接收消息对象（用户id）
                roomType: false,
                success: function (id, serverMsgId) {//发送成功则记录信息到服务器
                    var sendData = {
                        to: data.to.id,
                        content: data.mine.content,
                        sendTime: data.mine.timestamp,
                        type: data.to.type
                    };

                    if (data.to.cmd && (data.to.cmd.cmdName == 'leaveGroup' || data.to.cmd.cmdName == 'joinGroup')) {
                        sendData.sysLog = true;
                    }
                    if ((data.to.cmd && sendData.sysLog) || data.to.cmd == 0) {
                        $.get('class/doAction.php?action=addChatLog', sendData, function (res) {
                            var data = eval('(' + res + ')');
                            if (data.code != 1) {
                                console.log('message record fail');
                            }
                        });
                    }
                },
                fail: function (e) {//发送失败移除发送消息并提示发送失败
                    im.popMsg(data, '发送失败 刷新页面试试！');
                }
            });
            if (data.to.id == data.mine.id) {
                layer.msg('不能给自己发送消息');
                return;
            }
            if (data.to.cmd) {
                msg.body.ext.cmd = data.to.cmd;
            }
            msg.body.ext.username = cachedata.mine.username;
            if (data.to.type == 'group') {
                msg.setGroup('groupchat');
                msg.body.chatType = 'chatRoom';
            } else {
                msg.body.chatType = 'singleChat';
            }
            conn.send(msg.body);
        },
        getChatLog: function (data) {
            if (!cachedata.base.chatLog) {
                return layer.msg('未开启更多聊天记录');
            }
            var index = layer.open({
                type: 2
                , maxmin: true
                , title: '与 ' + data.name + ' 的聊天记录'
                , area: ['450px', '600px']
                , shade: false
                , skin: 'layui-box'
                , anim: 2
                , id: 'layui-layim-chatlog'
                , content: cachedata.base.chatLog + '?id=' + data.id + '&type=' + data.type
            });
        },//获取记录功能正常
        removeFriends: function (id) {
                    $.post(ajaxUrl+'/api/im/user/friend/remove', {friend_id: id,token:token}, function (res) {
                        var data = eval('(' + res + ')');
                        if (data.code == 1) {
                            var index = layer.open();
                            layer.close(index);
                            layim.removeList({//从我的列表删除
                                type: 'friend' //或者group
                                , id: id //好友或者群组ID
                            });
                            im.removeHistory({//从我的历史列表删除
                                type: 'friend' //或者group
                                , id: id //好友或者群组ID
                            });
                            // parent.location.reload();
                        } else {
                            layer.msg(data.msg);
                        }
                    });
        },//删除好友成功
        leaveGroupBySelf: function (to, username, roomId) {
            $.get(ajaxUrl+'/api/im/team/group/leave', {id: roomId, memberIdx: to,token:token}, function (res) {
                var data = eval('(' + res + ')');
                if (data.code == 1) {
                    var option = {
                        to: to,
                        roomId: roomId,
                        success: function (res) {
                            //系统消息
                            // im.sendMsg({//系统消息
                            //     mine: {
                            //         content: username + ' 已退出该群',
                            //         timestamp: new Date().getTime()
                            //     },
                            //     to: {
                            //         id: roomId,
                            //         type: 'group',
                            //         cmd: {
                            //             cmdName: 'leaveGroup',
                            //             cmdValue: username
                            //         }
                            //     }
                            // });
                            layim.removeList({
                                type: 'group' //或者group
                                , id: roomId //好友或者群组ID
                            });
                            im.removeHistory({//从我的历史列表删除
                                type: 'group' //或者group
                                , id: roomId //好友或者群组ID
                            });
                            var index = layer.open();
                            layer.close(index);
                            // parent.location.reload();
                        },
                        error: function (res) {
                            console.log('Leave room faild');
                        }
                    };
                    im.leaveGroupBySelf(option);
                } else {
                    layer.msg(data.msg);
                }
            });
        },//移除好友成功
        removeHistory: function (data) {//删除好友或退出群后清除历史记录
            var history = cachedata.local.history;
            delete history[data.type + data.id];
            cachedata.local.history = history;
            layui.data('layim', {
                key: cachedata.mine.id
                , value: cachedata.local
            });
            $('#layim-history' + data.id).remove();
            var hisElem = $('.layui-layim').find('.layim-list-history');
            var none = '<li class="layim-null">暂无历史会话</li>'
            if (hisElem.find('li').length === 0) {
                hisElem.html(none);
            }
        },
        IsExist: function (avatar) { //判断头像是否存在
            var ImgObj = new Image();
            ImgObj.src = avatar;
            if (ImgObj.fileSize > 0 || (ImgObj.width > 0 && ImgObj.height > 0)) {
                return true;
            } else {
                return false;
            }
        },
        audio: function (msg) {//消息提示
            conf.layim.msgbox(msg);
            var audio = document.createElement("audio");
            audio.src = layui.cache.dir + 'css/modules/layim/voice/' + cachedata.base.voice;
            audio.play(); //消息提示音
        },
        addFriendGroup: function (othis, type) {
            var li = othis.parents('li') || othis.parent()
                , uid = li.data('uid') || li.data('id')
                , approval = li.data('approval')
                , name = li.data('name');
            if (uid == 'undifine' || !uid) {
                var uid = othis.parent().data('id'), name = othis.parent().data('name');
            }
            var avatar = li.data('img');
            var gnumber = li.data('gnumber');
            var isAdd = false;
            if (type == 'friend') {
                var default_avatar = './uploads/person/empty2.jpg';
                if (cachedata.mine.id == uid) {//添加的是自己
                    layer.msg('不能添加自己');
                    return false;
                }
                layui.each(cachedata.friend, function (index1, item1) {
                    layui.each(item1.list, function (index, item) {
                        if (item.id == uid) {
                            isAdd = true;
                        }//是否已经是好友
                    });
                });
            } else {
                var default_avatar = avatar;
                for (i in cachedata.group)//是否已经加群
                {
                    if (cachedata.group[i].id == uid) {
                        isAdd = true;
                        break;
                    }
                }
            }
            parent.layui.layim.add({//弹出添加好友对话框
                isAdd: isAdd
                , approval: approval
                , username: name || []
                , uid: uid
                , avatar: avatar
                , group: cachedata.friend || []
                , type: type
                , submit: function (group, remark, index) {//确认发送添加请求
                    if (type == 'friend') {
                        var data = {
                            "controller":"Friend",
                            "action":"sendReq",
                            "content":{
                                "token":parent.token,
                                "id":uid,
                                "remark":remark,
                                "group_user_id":group
                            }
                        };
                        var data = JSON.stringify(data);
                        parent.ws.send(data);
                        parent.layer.close(index);
                    } else {
                        var data = {
                            "controller":"Group",
                            "action":"sendJoinGroupReq",
                            "content":{
                                "token":parent.token,
                                "id":uid,
                                "remark":remark,
                                "gnumber":gnumber
                            }
                        };
                        var data = JSON.stringify(data);
                        parent.ws.send(data);
                        parent.layer.close(index);
                    }
                }
            });

        },//正在完成中--------------------------
        receiveAddFriendGroup: function (othis, agree) {//确认添加好友或群
            var li = othis.parents('li')
                , type = li.data('type')
                , uid = li.data('uid')
                , nickname = li.data('name')
                , sign = li.data('sign')
                , gid = li.data('gid')
                , msgIdx = li.data('id');
            if (type == 1) {
                type = 'friend';
                var avatar = li.data('avatar');
                msgType = 2;
            } else {
                type = 'group';
                var groupIdx = li.data('groupidx');
                msgType = 4;
            }
            var status = agree == 2 ? 2 : 3;
            if (agree == 2) {
                //好友
                if (msgType == 2) {
                    parent.layui.layim.setFriendGroup({
                        type: type
                        , username: nickname//用户名称或群组名称
                        , avatar: avatar
                        , group: cachedata.friend || [] //获取好友分组数据
                        , submit: function (group, index) {
                            var data = {
                                "controller": "Friend",
                                "action": "doReq",
                                "content": {
                                    "token": token,
                                    "check": 1,
                                    "msg_type":msgType,
                                    "group_user_id":group,
                                    "friend_id":uid,
                                    "status":status,
                                    "msg_id":msgIdx
                                }
                            };
                            var data = JSON.stringify(data);
                            parent.ws.send(data);
                            //将好友 追加到主面板
                            layim.addList({
                                type: 'friend'
                                , avatar: avatar
                                , username: nickname //好友昵称
                                , groupid: group //所在的分组id
                                , id: uid //好友ID
                                , sign: sign //好友签名
                            });
                            parent.layer.close(index);
                            othis.parent().html('已同意');
                            // parent.location.reload();
                            im.init();//更新右键点击事件
                            layer.close(index);
                        }
                    });
                } else if (msgType = 4) {
                    //群
                    var data = {
                        "controller": "Group",
                        "action": "doJoinGroupReq",
                        "content": {
                            "token": token,
                            "check": 1,
                            "msg_type": 3,
                            "from_id":uid,
                            "gid":gid,
                            "status": 2,
                            "msg_id": msgIdx
                        }
                    };
                    var data = JSON.stringify(data);
                    parent.ws.send(data);

                    othis.parent().html('已同意');
                    im.init();//更新右键点击事件
                }

            } else {
                //拒绝好友处理
                if(msgType == 2)
                {
                    var data = {
                        "controller": "Friend",
                        "action": "doReq",
                        "content": {
                            "token": token,
                            "friend_id": uid,
                            "check": 0,
                            "msg_type":msgType,
                            "status":status,
                            "msg_id":msgIdx
                        }
                    };
                    var data = JSON.stringify(data);
                    ws.send(data);
                    layer.close(index);
                    layer.msg("您拒绝了好友添加的申请");
                }else//拒绝加群申请
                {
                    var data = {
                        "controller": "Group",
                        "action": "doJoinGroupReq",
                        "content": {
                            "token": token,
                            "msg_type":3,
                            "status":1,
                            "gid":gid,
                            "from_id":uid,
                            "msg_id":msgIdx,
                            "check": 0
                        }
                    };
                    var data = JSON.stringify(data);
                    ws.send(data);
                    layer.close(index);
                    layer.msg("您拒绝了加群的申请");

                }

            }

        },//正在完成中

        //创建群
        createGroup: function (othis) {
            var index = layer.open({
                type: 2
                , title: '创建群'
                , shade: false
                , maxmin: false
                , area: ['550px', '400px']
                , skin: 'layui-box layui-layer-border'
                , resize: false
                , content: cachedata.base.createGroup
            });
        },
        commitGroupInfo: function (othis, data) {
            if (!data.groupName) {
                return false;
            }
             $.get(ajaxUrl+'/api/im/team/group/check?token='+token, {}, function (res) {
                var resData = eval('(' + res + ')');
                if (resData.code == 1) {
                    $.post(ajaxUrl+'/api/im/team/group/create?token'+token, {
                        groupName: data.groupName,
                        des: data.des,
                        number: data.number,
                        approval: data.approval,
                        token:token
                    }, function (respdata) {
                        layer.close(othis.index);
                    });
                        layer.close(othis.index);
                } else {
                    return layer.msg(resData.msg);
                }
                layer.close(layer.index);
            });
        },
        getMyInformation: function () {
            var index = layer.open({
                type: 2
                , title: '我的资料'
                , shade: false
                , maxmin: false
                , area: ['400px', '670px']
                , skin: 'layui-box layui-layer-border'
                , resize: true
                , content: cachedata.base.Information + '?id=' + cachedata.mine.id + '&type=friend'
            });
        },
        getInformation: function (data) {
            var id = data.id || {}, type = data.type || {};
            var index = layer.open({
                type: 2
                , title: type == 'friend' ? (cachedata.mine.id == id ? '我的资料' : '好友资料') : '群资料'
                , shade: false
                , maxmin: false
                // ,closeBtn: 0
                , area: ['400px', '670px']
                , skin: 'layui-box layui-layer-border'
                , resize: true
                , content: cachedata.base.Information + '?id=' + id + '&type=' + type+'&token='+token
            });
        },//查看资料功能正常
        userStatus: function (data) {
            if (data.id) {
                $.get('class/doAction.php?action=userStatus', {id: data.id}, function (res) {
                    var data = eval('(' + res + ')');
                    if (data.code == 1) {
                        if (data.data == 'online') {
                            parent.layim.setChatStatus('<span style="color:#FF5722;">在线</span>');
                        } else {
                            parent.layim.setChatStatus('<span style="color:#444;">离线</span>');
                        }
                    } else {
                        //没有该用户
                    }
                });
            }
        },
        groupMembers: function (othis, e) {
            var othis = $(this);
            var icon = othis.find('.layui-icon'), hide = function () {
                icon.html('&#xe602;');
                $("#layui-layim-chat > ul:eq(1)").remove();
                $(".layui-layim-group-search").remove();
                othis.data('show', null);
            };
            if (othis.data('show')) {
                hide();
            } else {
                icon.html('&#xe603;');
                othis.data('show', true);
                var members = cachedata.base.members || {}, ul = $("#layui-layim-chat"), li = '', membersCache = {};
                var info = JSON.parse(decodeURIComponent(othis.parent().data('json')));
                members.data = $.extend(members.data, {
                    id: info.id
                });
                $.get(members, function (res) {
                    var resp = eval('(' + res + ')');
                    var html = '<ul class="layui-unselect layim-group-list groupMembers" data-groupidx="' + info.id + '" style="height: 510px; display: block;right:-200px;padding-top: 10px;">';
                    layui.each(resp.data.list, function (index, item) {
                        html += '<li  id="' + item.id + '" isfriend="' + item.friendship + '" manager="' + item.type + '" gagTime="' + item.gagTime + '"><img src="' + item.avatar + '">';
                        item.type == 1 ?
                            (html += '<span style="color:#e24242">' + item.username + '</span><i class="layui-icon" style="color:#e24242">&#xe612;</i>') :
                            (item.type == 2 ?
                                (html += '<span style="color:#de6039">' + item.username + '</span><i class="layui-icon" style="color:#eaa48e">&#xe612;</i>') :
                                (html += '<span>' + item.username + '</span>'));
                        html += '</li>';
                        membersCache[item.id] = item;
                    });
                    html += '</ul>';
                    html += '<div class="layui-layim-group-search" socket-event="groupSearch"><input placeholder="搜索"></div>';
                    ul.append(html);
                    im.contextMenu();
                });
            }
        },
        closeAllGroupList: function () {
            var othis = $(".groupMembers");
            othis.remove();//关闭全部的群员列表
            $(".layui-layim-group-search").remove();
            var icon = $('.layim-tool-groupMembers').find('.layui-icon');
            $('.layim-tool-groupMembers').data('show', null);
            icon.html('&#xe602;');
        },
        groupSearch: function (othis) {
            var search = $("#layui-layim-chat").find('.layui-layim-group-search');
            var main = $("#layui-layim-chat").find('.groupMembers');
            var input = search.find('input'), find = function (e) {
                var val = input.val().replace(/\s/);
                var data = [];
                var group = $(".groupMembers li") || [], html = '';
                if (val === '') {
                    for (var j = 0; j < group.length; j++) {
                        group.eq(j).css("display", "block");
                    }
                } else {
                    for (var j = 0; j < group.length; j++) {
                        name = group.eq(j).find('span').html();
                        if (name.indexOf(val) === -1) {
                            group.eq(j).css("display", "none");
                        } else {
                            group.eq(j).css("display", "block");
                        }
                    }
                }
            };
            if (!cachedata.base.isfriend && cachedata.base.isgroup) {
                events.tab.index = 1;
            } else if (!cachedata.base.isfriend && !cachedata.base.isgroup) {
                events.tab.index = 2;
            }
            search.show();
            input.focus();
            input.off('keyup', find).on('keyup', find);
        },
        addMyGroup: function () {//新增分组
            layer.prompt({title: '请输入分组名，并确认', formType: 0, value: ""}, function (groupname,index) {
                if (groupname) {
                    $.get(ajaxUrl+'/api/im/group/user/add', {
                        groupname: groupname,
                        token:token
                    }, function (res) {
                        data = JSON.parse(res);
                        if (data.code == 1) {
                            location.reload();
                            layer.close(index);
                        }
                        layer.msg(data.msg);
                    });
                }
                layer.close(index);
            });
        },//已完成添加分组
        delMyGroup: function (groupidx) {//删除分组
            $.get(ajaxUrl+'/api/im/group/user/del', {id: groupidx,token:token}, function (res) {
                var data = eval('(' + res + ')');
                if (data.code == 1) {
                    var group = $('.layim-list-friend li') || [];
                    for (var j = 0; j < group.length; j++) {//遍历每一个分组
                        groupList = group.eq(j).find('h5').data('groupidx');
                        if (groupList === groupidx) {//要删除的分组
                            if (group.eq(j).find('ul li').hasClass('layim-null')) {//删除的分组下没有好友
                                group.eq(j).remove();
                            } else {
                                // var html = group.eq(j).find('ul').html();//被删除分组的好友
                                var friend = group.eq(j).find('ul li');
                                var number = friend.length;//被删除分组的好友个数
                                for (var i = 0; i < number; i++) {
                                    var friend_id = friend.eq(i).attr('id').replace(/^layim-friend/g, '');//好友id
                                    var friend_name = friend.eq(i).find('span').html();//好友id
                                    var signature = friend.eq(i).find('p').html();//好友id
                                    var avatar = '../uploads/person/' + friend_id + '.jpg';
                                    var default_avatar = './uploads/person/empty2.jpg';
                                    conf.layim.removeList({//将好友从之前分组除去
                                        type: 'friend'
                                        , id: friend_id //好友ID
                                    });
                                    conf.layim.addList({//将好友移动到新分组
                                        type: 'friend'
                                        , avatar: im['IsExist'].call(this, avatar) ? avatar : default_avatar //好友头像
                                        , username: friend_name //好友昵称
                                        , groupid: data.data //将好友添加到默认分组
                                        , id: friend_id //好友ID
                                        , sign: signature //好友签名
                                    });
                                }
                                ;
                            }

                        }
                    }
                    im.init();
                    layer.close(layer.index);
                } else {
                    layer.msg(data.msg);
                }
            });
        }, //已完成删除分组
        setAdmin: function (othis) {
            var username = othis.data('id'), friend_avatar = othis.data('img'),
                isfriend = othis.data('isfriend'), name = othis.data('name'),
                gagTime = othis.data('gagtime'), groupidx = othis.data('groupidx');
            var options = {
                groupId: groupidx,
                username: username,
                success: function (resp) {
                    $.get('class/doAction.php?action=setAdmin', {
                        groupidx: groupidx,
                        memberIdx: username,
                        type: 2
                    }, function (res) {
                        var admin = eval('(' + res + ')');
                        if (admin.code == 1) {
                            $("ul[data-groupidx=" + groupidx + "] #" + username).remove();
                            var html = '<li id="' + username + '" isfriend="' + isfriend + '" manager="2" gagTime="' + gagTime + '"><img src="' + friend_avatar + '"><span style="color:#de6039">' + name + '</span><i class="layui-icon" style="color:#eaa48e"></i></li>'
                            $("ul[data-groupidx=" + groupidx + "]").find('li').eq(0).after(html);
                            im.contextMenu();
                        }
                        layer.msg(admin.msg);
                    });
                },
                error: function (e) {
                }
            };
            conn.setAdmin(options);
        },
        removeAdmin: function (othis) {
            var username = othis.data('id'), friend_avatar = othis.data('img'),
                isfriend = othis.data('isfriend'), name = othis.data('name').split('<'),
                gagTime = othis.data('gagtime'), groupidx = othis.data('groupidx');
            var options = {
                groupId: groupidx,
                username: username,
                success: function (resp) {
                    $.get('class/doAction.php?action=setAdmin', {
                        groupidx: groupidx,
                        memberIdx: username,
                        type: 3
                    }, function (res) {
                        var admin = eval('(' + res + ')');
                        if (admin.code == 1) {
                            $("ul[data-groupidx=" + groupidx + "] #" + username).remove();
                            var html = '<li id="' + username + '" isfriend="' + isfriend + '" manager="3" gagTime="' + gagTime + '"><img src="' + friend_avatar + '"><span>' + name[0] + '</span></li>'
                            $("ul[data-groupidx=" + groupidx + "]").append(html);
                            im.contextMenu();
                        }
                        layer.msg(admin.msg);
                    });
                },
                error: function (e) {
                }
            };
            conn.removeAdmin(options);
        },
        editGroupNickName: function (othis) {
            var memberIdx = othis.data('id'), name = othis.data('name').split('('), groupIdx = othis.data('groupidx');
            layer.prompt({title: '请输入群名片，并确认', formType: 0, value: name[0]}, function (nickName, index) {
                $.get('class/doAction.php?action=editGroupNickName', {
                    nickName: nickName,
                    memberIdx: memberIdx,
                    groupIdx: groupIdx
                }, function (res) {
                    var data = eval('(' + res + ')');
                    if (data.code == 1) {
                        $("ul[data-groupidx=" + groupIdx + "] #" + memberIdx).find('span').html(nickName + '(' + memberIdx + ')');
                        layer.close(index);
                    }
                    layer.msg(data.msg);
                });
            });
        },
        leaveGroup: function (groupIdx, list, username) {//list为数组
            $.get('class/doAction.php?action=leaveGroup', {list: list, groupIdx: groupIdx}, function (res) {
                var data = eval('(' + res + ')');
                if (data.code == 1) {
                    var options = {
                        roomId: groupIdx,
                        list: list,
                        success: function (resp) {
                            console.log(resp);
                        },
                        error: function (e) {
                            console.log(e);
                        }
                    };
                    conn.leaveGroup(options);
                    $("ul[data-groupidx=" + groupIdx + "] #" + data.data).remove();
                    im.sendMsg({//系统消息
                        mine: {
                            content: username + ' 已被移出该群',
                            timestamp: new Date().getTime()
                        },
                        to: {
                            id: groupIdx,
                            type: 'group',
                            cmd: {
                                cmdName: 'leaveGroup',
                                cmdValue: username
                            }
                        }
                    });
                    var index = layer.open();
                    layer.close(index);
                }
                layer.msg(data.msg);
            });
        },
        setGag: function (options) {//设置禁言 取消禁言
            var _this_group = $('.layim-chat-list .layim-chatlist-group' + options.groupidx);//选择操作的群
            if (_this_group.find('span').html()) {
                var index = _this_group.index();//对应面板的index
                var cont = _this_group.parent().parent().find('.layim-chat-box div').eq(index)
                var info = JSON.parse(decodeURIComponent(cont.find('.layim-chat-tool').data('json')));
                // info.manager = message.ext.cmd.cmdValue;第一种
                //禁言 两种方案 第一种是改变用户的状态 优点：只需要判断该参数就能禁言
                // 第二种是设置一个禁言时间点，当当前时间小于该设置的时间则为禁言，优点：自动改变用户禁言状态
                if (options.type == 'set' && (options.user == cachedata.mine.id || options.user == 'ALL')) {//设置禁言单人或全体
                    if (options.gagTime) {
                        info.gagTime = parseInt(options.gagTime);
                        cont.find('.layim-chat-tool').data('json', encodeURIComponent(JSON.stringify(info)));
                        layui.each(cachedata.group, function (index, item) {
                            if (item.id === options.groupidx) {
                                cachedata.group[index].gagTime = info.gagTime;
                            }
                        });
                    }
                    ;
                    cont.find('.layim-chat-gag').css('display', 'block');
                } else if (options.type == 'lift' && (options.user == cachedata.mine.id || options.user == 'ALL')) {//取消禁言单人或全体
                    cont.find('.layim-chat-tool').data('json', encodeURIComponent(JSON.stringify(info)));
                    layui.each(cachedata.group, function (index, item) {
                        if (item.id === options.groupidx) {
                            cachedata.group[index].gagTime = '0';
                        }
                    });
                    cont.find('.layim-chat-gag').css('display', 'none');
                }

            } else {
                if (options.type == 'set' && (options.user == cachedata.mine.id || options.user == 'ALL')) {//设置禁言单人或全体
                    if (options.gagTime) {
                        layui.each(cachedata.group, function (index, item) {
                            if (item.id === options.groupidx) {
                                cachedata.group[index].gagTime = parseInt(options.gagTime);
                            }
                        });
                    }
                    ;
                } else if (options.type == 'lift' && (options.user == cachedata.mine.id || options.user == 'ALL')) {//取消禁言单人或全体
                    layui.each(cachedata.group, function (index, item) {
                        if (item.id === options.groupidx) {
                            cachedata.group[index].gagTime = '0';
                        }
                    });
                }
            }
        },
        popMsg: function (data, msg) {//删除本地最新一条发送失败的消息
            var logid = cachedata.local.chatlog[data.to.type + data.to.id];
            logid.pop();
            var timestamp = '.timestamp' + data.mine.timestamp;
            $(timestamp).html('<i class="layui-icon" style="color: #F44336;font-size: 20px;float: left;margin-top: 1px;">&#x1007;</i>' + msg);
        },


        //菜单功能
        menuChat: function () {
            return data = {
                text: "发送消息",
                icon: "&#xe63a;",
                callback: function (ele) {
                    var othis = ele.parent(), type = othis.data('type'),
                        name = othis.data('name'), avatar = othis.data('img'),
                        id = othis.data('id');
                    layim.chat({
                        name: name
                        , type: type
                        , avatar: avatar
                        , id: id
                    });
                }
            }
        },//聊天功能完成
        menuInfo: function () {
            return data = {
                text: "查看资料",
                icon: "&#xe62a;",
                callback: function (ele) {
                    var othis = ele.parent(), type = othis.data('type'), id = othis.data('id');
                    // id = (new RegExp(substr).test('layim')?substr.replace(/[^0-9]/ig,""):substr);
                    im.getInformation({
                        id: id,
                        type: type
                    });
                }
            }
        },//查看资料功能完成
        menuChatLog: function () {
            return data = {
                text: "聊天记录",
                icon: "&#xe60e;",
                callback: function (ele) {
                    var othis = ele.parent(), type = othis.data('type'), name = othis.data('name'),
                        id = othis.data('id');
                    im.getChatLog({
                        name: name,
                        id: id,
                        type: type
                    });
                }
            }
        },//获取聊天记录成功
        menuNickName: function () {
            return data = {
                text: "修改好友备注",
                icon: "&#xe6b2;",
                callback: function (ele) {
                    var othis = ele.parent(), friend_id = othis.data('id'), friend_name = othis.data('name');
                    layer.prompt({title: '修改备注姓名', formType: 0, value: friend_name}, function (nickName, index) {
                        $.post(ajaxUrl+'/api/im/user/friend/remark', {
                            friend_name: nickName,
                            friend_id: friend_id,
                            token:token
                        }, function (res) {
                            var data = eval('(' + res + ')');
                            if (data.code == 1) {
                                var friendName = $(".layim-friend" + friend_id).find('span');
                                friendName.html(data.data);
                                layer.close(index);
                            }
                            layer.msg(data.msg);
                        });
                    });

                }
            }
        },//好友备注功能完成
        menuMove: function (html) {
            return data = {
                text: "移动联系人",
                icon: "&#xe630;",
                nav: "move",//子导航的样式
                navIcon: "&#xe602;",//子导航的图标
                navBody: html,//子导航html
                callback: function (ele) {
                    var friend_id = ele.parent().data('id');//要移动的好友id
                    friend_name = ele.parent().data('name');
                    var avatar = '../uploads/person/' + friend_id + '.jpg';
                    var default_avatar = './uploads/person/empty2.jpg';
                    var signature = $('.layim-list-friend').find('.layim-friend' + friend_id).find('p').html();//获取签名
                    var item = ele.find("ul li");
                    item.hover(function () {
                        var _this = item.index(this);
                        var groupidx = item.eq(_this).data('groupidx');//将好友移动到分组的id
                        $.post(ajaxUrl+'/api/im/user/friend/move', {
                            friend_id: friend_id,
                            groupid: groupidx,
                            token:token
                        }, function (res) {
                            var data = eval('(' + res + ')');
                            if (data.code == 1) {
                                layim.removeList({//将好友从之前分组除去
                                    type: 'friend'
                                    , id: friend_id //好友ID
                                });
                                layim.addList({//将好友移动到新分组
                                    type: 'friend'
                                    , avatar: data.data.avatar //好友头像
                                    , username: friend_name //好友昵称
                                    , groupid: groupidx //所在的分组id
                                    , id: friend_id //好友ID
                                    , sign: signature //好友签名
                                });
                            }
                            layer.msg(data.msg);
                        });
                    });
                }
            }
        },//移动好友成功
        menuRemove: function () {
            return data = {
                text: "删除好友",
                icon: "&#xe640;",
                events: "removeFriends",
                callback: function (ele) {
                    var othis = ele.parent(), friend_id = othis.data('id'), username, sign;
                    var img = othis.data('img');
                    layui.each(cachedata.friend, function (index1, item1) {
                        layui.each(item1.list, function (index, item) {
                            if (item.id === friend_id) {
                                username = item.username;
                                sign = item.sign;
                            }
                        });
                    });
                    layer.confirm('删除后对方将从你的好友列表消失，且以后不会再接收此人的会话消息。<div class="layui-layim-list"><li layim-event="chat" data-type="friend" data-index="0"><img src="' + img + '"><span>' + username + '</span><p>' + sign + '</p></li></div>', {
                        btn: ['确定', '取消'], //按钮
                        title: ['删除好友', 'background:#b4bdb8'],
                        shade: 0
                    }, function () {
                        im.removeFriends(friend_id);
                    }, function () {
                        var index = layer.open();
                        layer.close(index);
                    });
                }
            }
        },//删除好友成功
        menuAddMyGroup: function () {
            return data = {
                text: "添加分组",
                icon: "&#xe654;",
                callback: function (ele) {
                    im.addMyGroup();
                }
            }

        },//添加功能完成
        menuRename: function () {
            return data = {
                text: "重命名",
                icon: "&#xe642;",
                callback: function (ele) {
                    var othis = ele.parent(), mygroupIdx = othis.data('id'), groupName = othis.data('name');
                    layer.prompt({title: '请输入分组名，并确认', formType: 0, value: groupName}, function (mygroupName, index) {
                        if (mygroupName) {
                            $.get(ajaxUrl+'/api/im/group/user/edit',
                                {
                                groupname: mygroupName,
                                id: mygroupIdx,
                                token:token
                            }, function (res) {
                                var data = eval('(' + res + ')');
                                if (data.code == 1) {
                                    var friend_group = $(".layim-list-friend li");
                                    for (var j = 0; j < friend_group.length; j++) {
                                        var groupidx = friend_group.eq(j).find('h5').data('groupidx');
                                        if (groupidx == mygroupIdx) {//当前选择的分组
                                            friend_group.eq(j).find('h5').find('span').html(mygroupName);
                                        }
                                    }
                                    im.init();
                                    layer.close(index);
                                }
                                layer.msg(data.msg);
                            });
                        }

                    });
                }

            }
        },  // 接口重命名接口完成
        menuDelMyGroup: function () {
            return data = {
                text: "删除该组",
                icon: "&#x1006;",
                callback: function (ele) {
                    var othis = ele.parent(), mygroupIdx = othis.data('id');
                    layer.confirm('<div style="float: left;width: 17%;margin-top: 14px;"><i class="layui-icon" style="font-size: 48px;color:#cc4a4a">&#xe607;</i></div><div style="width: 83%;float: left;"> 选定的分组将被删除，组内联系人将会移至默认分组。</div>', {
                        btn: ['确定', '取消'], //按钮
                        title: ['删除分组', 'background:#b4bdb8'],
                        shade: 0
                    }, function () {
                        im.delMyGroup(mygroupIdx);
                    }, function () {
                        var index = layer.open();
                        layer.close(index);
                    });
                }
            }
        },//跳转到删除分组名接口
        menuLeaveGroupBySelf: function () {
            return data = {
                text: "退出该群",
                icon: "&#xe613;",
                callback: function (ele) {
                    var othis = ele.parent(),
                        group_id = othis.data('id'),
                        groupname = othis.data('name');
                    avatar = othis.data('img');
                    layer.confirm('您真的要退出该群吗？退出后你将不会再接收此群的会话消息。<div class="layui-layim-list"><li layim-event="chat" data-type="friend" data-index="0"><img src="' + avatar + '"><span>' + groupname + '</span></li></div>', {
                        btn: ['确定', '取消'], //按钮
                        title: ['提示', 'background:#b4bdb8'],
                        shade: 0
                    }, function () {
                        var user = cachedata.mine.id;
                        var username = cachedata.mine.username;
                        im.leaveGroupBySelf(user, username, group_id);
                    }, function () {
                        var index = layer.open();
                        layer.close(index);
                    });
                }
            }
        },//退出群组完成
        menuAddFriend: function () {
            return data = {
                text: "添加好友",
                icon: "&#xe654;",
                callback: function (ele) {
                    var othis = ele;
                    im.addFriendGroup(othis, 'friend');
                }
            }
        },
        menuEditGroupNickName: function () {
            return data = {
                text: "修改群名片",
                icon: "&#xe60a;",
                callback: function (ele) {
                    var othis = ele.parent();
                    im.editGroupNickName(othis);
                }
            }
        },
        menuRemoveAdmin: function () {
            return data = {
                text: "取消管理员",
                icon: "&#xe612;",
                callback: function (ele) {
                    var othis = ele.parent();
                    im.removeAdmin(othis);
                }
            }
        },
        menuSetAdmin: function () {
            return data = {
                text: "设置为管理员",
                icon: "&#xe612;",
                callback: function (ele) {
                    var othis = ele.parent(), user = othis.data('id');
                    im.setAdmin(othis);
                }
            }
        },
        menuLeaveGroup: function () {
            return data = {
                text: "踢出本群",
                icon: "&#x1006;",
                callback: function (ele) {
                    var othis = ele.parent();
                    var friend_id = ele.parent().data('id');//要禁言的id
                    var username = ele.parent().data('name');
                    var groupIdx = ele.parent().data('groupidx');
                    var list = new Array();
                    list[0] = friend_id;
                    im.leaveGroup(groupIdx, list, username)
                }
            }
        },
        menuGroupMemberGag: function () {
            return data = {
                text: "禁言",
                icon: "&#xe60f;",
                nav: "gag",//子导航的样式
                navIcon: "&#xe602;",//子导航的图标
                navBody: '<ul><li class="ui-gag-menu-item" data-gag="10m"><a href="javascript:void(0);"><span>禁言10分钟</span></a></li><li class="ui-gag-menu-item" data-gag="1h"><a href="javascript:void(0);"><span>禁言1小时</span></a></li><li class="ui-gag-menu-item" data-gag="6h"><a href="javascript:void(0);"><span>禁言6小时</span></a></li><li class="ui-gag-menu-item" data-gag="12h"><a href="javascript:void(0);"><span>禁言12小时</span></a></li><li class="ui-gag-menu-item" data-gag="1d"><a href="javascript:void(0);"><span>禁言1天</span></a></li></ul>',//子导航html
                callback: function (ele) {
                    var friend_id = ele.parent().data('id');//要禁言的id
                    friend_name = ele.parent().data('name');
                    groupidx = ele.parent().data('groupidx');
                    var item = ele.find("ul li");
                    item.hover(function () {
                        var _index = item.index(this), gagTime = item.eq(_index).data('gag');//禁言时间
                        $.get('class/doAction.php?action=groupMemberGag', {
                            gagTime: gagTime,
                            groupidx: groupidx,
                            friend_id: friend_id
                        }, function (resp) {
                            var data = eval('(' + resp + ')');
                            if (data.code == 1) {
                                var gagTime = data.data.gagTime;
                                var res = {
                                    mine: {
                                        content: gagTime + '',
                                        timestamp: data.data.time
                                    },
                                    to: {
                                        type: 'group',
                                        id: groupidx + "",
                                        cmd: {
                                            id: friend_id,
                                            cmdName: 'gag',
                                            cmdValue: data.data.value
                                        }
                                    }
                                }
                                im.sendMsg(res);
                                $("ul[data-groupidx=" + groupidx + "] #" + friend_id).attr('gagtime', gagTime);
                            }
                            layer.msg(data.msg);
                        });
                    });
                }
            }
        },
        menuLiftGroupMemberGag: function () {
            return data = {
                text: "取消禁言",
                icon: "&#xe60f;",
                callback: function (ele) {
                    var friend_id = ele.parent().data('id');//要禁言的id
                    friend_name = ele.parent().data('name');
                    groupidx = ele.parent().data('groupidx');
                    $.get('class/doAction.php?action=liftGroupMemberGag', {
                        groupidx: groupidx,
                        friend_id: friend_id
                    }, function (resp) {
                        var data = eval('(' + resp + ')');
                        if (data.code == 1) {
                            var res = {
                                mine: {
                                    content: '0',
                                    timestamp: data.data.time
                                },
                                to: {
                                    type: 'group',
                                    id: groupidx + "",
                                    cmd: {
                                        id: friend_id,
                                        cmdName: 'liftGag',
                                        cmdValue: data.data.value
                                    }
                                }
                            }
                            im.sendMsg(res);
                            $("ul[data-groupidx=" + groupidx + "] #" + friend_id).attr('gagtime', 0);
                        }
                        layer.msg(data.msg);
                    });
                }
            }
        },

    };
    exports('menu', im);
});
