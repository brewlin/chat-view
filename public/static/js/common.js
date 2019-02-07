function enter_from(){
    if(event.keyCode == 13){
        //回车提交
        login();
    }
}
function dialogmsg(str){
    layer.msg(str);
}
// 注册请求
function register(){
    url = SCOPE.register_url;
    data = $("#x-form").serializeArray();
    request(url,data,'post','back');
}
// 登陆请求
function login(){
    url = SCOPE.login_url;
    data = $("#x-form").serializeArray();
    $.ajax({
        type:"post",
        url:url,
        data:data,
        success:function(data){
            var token = data.data;
            sessionStorage.setItem('token', token);
            layer.msg(data.msg,{icon:1,time: 1000}, () => {
                location.href = SCOPE.index_url;
         });
        },
        'error':function(data){
            layer.msg(data.responseJSON.msg);
        }
    })
}
// 封装公用的请求函数
function request(url,data,type,action)
{
     $.ajax({
         type:type,
         url:url,
         data:data,
         success:function(data){
            if (action == 'back')
            {
                layer.msg(data.msg,{icon:1,time: 1000}, () => {
                    window.history.go(-1);
                });
            } else
            {
                layer.msg(data.msg,{icon:1,time: 1000}, () => {
                    location.reload();
                });
            }
              
         },
         'error':function(data){
            layer.msg(data.responseJSON.msg);
        }
    })    
}
//公用修改状态
function updateStatus(value)
{
    url = SCOPE.status_url;
    data = {'id':$(value).attr('x-id'),'status':$(value).attr('x-status')};
    request(url,data,'get');    
}
//公用修改
function editData(type)
{
    url = SCOPE.edit_url;
    data = $("#x-form").serializeArray();
    request(url,data,'post','back');
}
//公用修改
function endData()
{
    url = SCOPE.end_url;
    data = $("#x-form").serializeArray();
    request(url,data,'post','back');
}
//公用添加
function addData()
{
    url = SCOPE.add_url;
    data = $("#x-form").serializeArray();
    request(url,data,'post','back');

}
//公共删除
function delData(value)
{
    url = SCOPE.del_url;
    data = {'id':$(value).attr('x-id')}
    layer.confirm('确认要删除么？', {
        btn: ['确认','取消'] //按钮
    }, function(){
        request(url,data,'get');
    },function(){
    });
}
//公用layer弹出层
function open_s(url)
{
    layer.open({
      type: 1,
      skin: 'layui-layer-rim', //加上边框
      area: ['420px', '240px'], //宽高
      content: url
    });    
}
/*添加或者编辑缩小的屏幕*/
function o2o_s_edit(title,url,w,h){
    layer_show(title,url,w,h);
}
function open_s_small(title,url)
{
    layer.open({
        type: 2,
        title: title,
        shadeClose: true,
        shade: false,
        maxmin: true, //开启最大化最小化按钮
        area: ['893px', '600px'],
        content: url
    });
}