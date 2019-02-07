<?php
/**
 * @author xiaodong
 * @date(2018.6.29 9.57)
 */
namespace app\index\controller;

class UserGroup extends Base
{
    /**
     * 分组列表
     */
    public function index()
    {
        $keywords = input('get.keywords');
        $co = input('get.status',1);
        $list = $this->obj->getAllList(['status' => $co,'user_id' => $this->user['id']]);
        return $this->fetch('',[
            'title' => '好友分组列表',
            'list' => $list,
            'status' => config('status.status'),
            'key' => $keywords == '' ?'请输入关键词':$keywords,
            'co' => $co
        ]);
    }
    /**
     * 删除
     */
    public function del()
    {
        (validate(request()->controller())->doCheck('del'));
        $user = model('UserGroup')->getListByGroupId(['groupid' => input('get.id'),'status' => 1]);
        if($user)
            return error('操作失败,该分组下有好友',config('json.serverError'),20081);
        $res = model(request()->controller())->doDel();
        if(!$res)
        {
            return error('操作失败',config('json.serverError'),20081);
        }
        return success('操作成功');
    }
    /**
     * 审核列表
     */
    public function apply()
    {
        $list = $this->obj->getAllListRelateUser(['status' => 0]);
        return $this->fetch('',[
            'title' => '经验申请',
            'list' => $list
        ]);
    }
}
