<?php
/**
 * Created by PhpStorm.
 * User: bob
 * Date: 2018/8/30
 * Time: 20:52
 */

namespace app\index\controller;


class UserGroupMember extends Base
{
    /**
     * 规则列表
     */
    public function index()
    {
        $keywords = input('get.keywords');
        $where = [];
        if($keywords)
        {
            $where['nickname'] = ['like',"%{$keywords}%"];
        }
        $list = $this->obj->getFriendByUserId($this->user['id'],$where);
        return $this->fetch('',[
            'title' => '好友列表',
            'list' => $list,
            'keywords' => $keywords
        ]);
    }
    /**
     * 详细信息
     */
    public function detail()
    {
        $id = input('get.id');
        if(empty($id))
        {
            return $this->error('缺少id');
        }
        $list = model('User')->getListById(input('get.id'));
        $record = model('UserRecord')->getChatRecord($this->user['id'],input('get.id'));
        return $this->fetch('',[
                'list' => $list,
                'title' => '个人资料',
                'record' => $record,
            ]
        );
    }
}