layui.config({
    base: '/im/ws/src/js/' //扩展 JS 所在目录
}).extend({
    menu: 'menu'
});
layui.use(['layim','menu'], function(layim){
    $ = layui.jquery;
    //基础配置
    layim.config({

        //初始化接口
        init: {
            url: ajaxUrl+'/api/im/init?token='+token,
            data: {}
        }
        //查看群员接口
        ,members: {
            url: ajaxUrl+'/api/im/members?token='+token
            ,data: {}
        }
        //上传图片接口
        ,uploadImage: {
            url: ajaxUrl+'/api/im/image?token='+token //（返回的数据格式见下文）
            ,type: 'post' //默认get
        }
        //上传文件接口
        ,uploadFile: {
            url: ajaxUrl+'/api/im/image?token='+token //（返回的数据格式见下文）
            ,type: 'post' //默认get
        }
        //自定义皮肤
        ,uploadSkin: {
            url: 'class/doAction.php?action=uploadSkin'
            , type: 'post' //默认post
        }
        //选择系统皮肤
        ,systemSkin: {
            url: 'class/doAction.php?action=systemSkin'
            , type: 'post' //默认post
        }
        //获取推荐好友
        ,getRecommend:{
            url: ajaxUrl+'/api/im/user/friend/recommend?token='+token
            , type: 'get' //默认
        }
        //查找好友总数
        ,findFriendTotal:{
            url: ajaxUrl+'/api/im/user/find/total?token='+token
            , type: 'get' //默认
        }
        //查找好友列表
        ,findFriend:{
            url: ajaxUrl+'/api/im/user/find/friend?token='+token
            , type: 'get' //默认
        }
        //获取好友资料
        ,getInformation:{
            url: ajaxUrl+'/api/im/user/friend/info'
            , type: 'get' //默认
        }
        //保存我的资料
        ,saveMyInformation:{
            url: 'class/doAction.php?action=saveMyInformation'
            , type: 'post' //默认
        }
        //提交建群信息
        ,commitGroupInfo:{
            url: ajaxUrl+'/api/im/team/group/create?token='+token
            , type: 'get' //默认
        }
        //获取系统消息
        ,getMsgBox:{
            url: ajaxUrl+'/api/im/msg/box/info?token='+token
            , type: 'get' //默认post
        }
        //获取总的记录数
        ,getChatLogTotal:{
            url: 'class/doAction.php?action=getChatLogTotal'
            , type: 'get' //默认post
        }
        //获取历史记录
        ,getChatLog:{
            url: 'class/doAction.php?action=getChatLog'
            , type: 'get' //默认post
        }
        , isAudio: true //开启聊天工具栏音频
        , isVideo: true //开启聊天工具栏视频
        ,isfriend:true
        ,isgroup:true
        , groupMembers: true
        //扩展工具栏
        ,tool: [{
            alias: 'code'
            ,title: '代码'
            ,icon: '&#xe64e;'
        }]

        // ,brief: true //是否简约模式（若开启则不显示主面板）

        ,title: '我的面板' //自定义主面板最小化时的标题
        //,right: '100px' //主面板相对浏览器右侧距离
        //,minRight: '90px' //聊天面板最小化时相对浏览器右侧距离
        ,initSkin: '1.jpg' //1-5 设置初始背景
        //,skin: ['aaa.jpg'] //新增皮肤
        //,isfriend: false //是否开启好友
        //,isgroup: false //是否开启群组
        //,min: true //是否始终最小化主面板，默认false
        ,notice: true //是否开启桌面消息提醒，默认false
        //,voice: false //声音提醒，默认开启，声音文件为：default.wav

        ,msgbox: layui.cache.dir + 'html/msgbox/msgbox.html' //消息盒子页面地址，若不开启，剔除该项即可
        ,find: layui.cache.dir + 'html/find/find.html' //发现页面地址，若不开启，剔除该项即可
        ,chatLog: layui.cache.dir+'html/chatlog/chatlog.html' //聊天记录页面地址，若不开启，剔除该项即可
        , createGroup: layui.cache.dir + 'html/group/createGroup.html' //创建群页面地址，若不开启，剔除该项即可
        , Information: layui.cache.dir + 'html/info/getInformation.html' //好友群资料页面

    });

    // layim.chat({
    //     name: '在线客服-小苍'
    //     ,type: 'kefu'
    //     ,avatar: 'http://tva3.sinaimg.cn/crop.0.0.180.180.180/7f5f6861jw1e8qgp5bmzyj2050050aa8.jpg'
    //     ,id: -1
    // });
    // layim.chat({
    //     name: '在线客服-心心'
    //     ,type: 'kefu'
    //     ,avatar: 'http://tva1.sinaimg.cn/crop.219.144.555.555.180/0068iARejw8esk724mra6j30rs0rstap.jpg'
    //     ,id: -2
    // });
    // layim.setChatMin();

    //监听在线状态的切换事件
    layim.on('online', function(data){
        console.log(data);
    });

    //监听签名修改
    layim.on('sign', function(value){
        $.get(ajaxUrl+'/api/im/user/user/sign?token='+token, {sign:value}, function (res) {
                layer.msg('修改成功');
        });
    });

    //监听自定义工具栏点击，以添加代码为例
    layim.on('tool(code)', function(insert){
        layer.prompt({
            title: '插入代码'
            ,formType: 2
            ,shade: 0
        }, function(text, index){
            layer.close(index);
            insert('[pre class=layui-code]' + text + '[/pre]'); //将内容插入到编辑器
        });
    });

    // //监听layim建立就绪
    layim.on('ready', function(res){
    //
        layui.menu.init(); //更新右键点击事件
        console.log(res.mine);
    //
    //     layim.msgbox(5); //模拟消息盒子有新消息，实际使用时，一般是动态获得
    //
    //     //添加好友（如果检测到该socket）
    //     // layim.addList({
    //     //   type: 'group'
    //     //   ,avatar: "http://tva3.sinaimg.cn/crop.64.106.361.361.50/7181dbb3jw8evfbtem8edj20ci0dpq3a.jpg"
    //     //   ,groupname: 'Angular开发'
    //     //   ,id: "12333333"
    //     //   ,members: 0
    //     // });
    //     layim.addList({
    //         type: 'friend'
    //         ,avatar: "http://tp2.sinaimg.cn/2386568184/180/40050524279/0"
    //         ,username: '冲田杏梨'
    //         ,groupid: 2
    //         ,id: "1233333312121212"
    //         ,remark: "本人冲田杏梨将结束AV女优的工作"
    //     });
    //
    //     setTimeout(function(){
    //         //接受消息（如果检测到该socket）
    //         layim.getMessage({
    //             username: "Hi"
    //             ,avatar: "http://qzapp.qlogo.cn/qzapp/100280987/56ADC83E78CEC046F8DF2C5D0DD63CDE/100"
    //             ,id: "10000111"
    //             ,type: "friend"
    //             ,content: "临时："+ new Date().getTime()
    //         });
    //     }, 3000);
    //
    //
    //
    });

    //监听发送消息
    layim.on('sendMessage', function(res){
        var To = res.to;
        console.log(res);
        console.log(To.type);
        if(To.type === 'friend'){
            // layim.setChatStatus('<span style="color:#FF5722;">对方正在输入。。。</span>');
            // 好友消息
            var data = {
                "controller":'Chat',
                "action":"personalChat",
                "content":{"token":token,"id":To.id,"data":res.mine.content}
            };
            var data = JSON.stringify(data);
            ws.send(data);
        }else if(To.type == 'group')//群消息
        {
            console.log(To);
            var data = {
                "controller":'Chat',
                "action":"groupChat",
                "content":{"token":token,"gnumber":To.gnumber,"data":res.mine.content}
            };
            var data = JSON.stringify(data);
            ws.send(data);
        }
    });

    //监听查看群员
    layim.on('members', function(data){
        console.log(data);
    });

    //监听聊天窗口的切换
    layim.on('chatChange', function(res){
        var type = res.data.type;
        if(type === 'friend'){
            //模拟标注好友状态
            console.log(res.data);
            var data = {
                "token":token,
                "type":type,
                "uid":res.data.id
            };
            noResponseRequest("post",ajaxUrl+'/api/im/chat/record/read',data);
            //layim.setChatStatus('<span style="color:#FF5722;">在线</span>');

        } else if(type === 'group'){
            //模拟系统消息
            // layim.getMessage({
            //     system: true
            //     ,id: res.data.id
            //     ,type: "group"
            //     ,content: '模拟群员'+(Math.random()*100|0) + '加入群聊'
            // });
        }
    });




});
