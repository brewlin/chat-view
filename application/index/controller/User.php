<?php
/**
 * Created by PhpStorm.
 * User: liuxiaodong
 * Date: 2018/6/27 0027
 * Time: 10:12
 */
namespace app\index\controller;

use app\common\enum\ScopeEnum;

class User extends Base
{
    /**
     * 规则列表
     */
    public function index()
    {
        $userId = $this->user['id'];
        $list = $this->obj->getListById($userId);
        return $this->fetch('',[
            'list' => $list,
            'title' => '个人资料',
            ]
        );
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
        $list = $this->obj->getListById(input('get.id'));
        $record = model('UserRecord')->getChatRecord($this->user['id'],input('get.id'));
        return $this->fetch('',[
            'list' => $list,
            'title' => '个人资料',
            'record' => $record,
            ]
        );
    }

}