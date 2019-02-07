<?php
/**
 * Created by PhpStorm.
 * User: bob
 * Date: 2018/8/30
 * Time: 20:42
 */

namespace app\index\controller;


class UserRecord extends Base
{
    public function detail()
    {
        if(request()->isGet())
        {
            $user = model('User');
            $userId = input('get.id');
            $list = $this->obj->getChatRecord($userId)->toArray();
            $list['to'] = $user->find($userId);
            $list['mine'] = $this->user;
            $this->assign('list' ,$list);
            return $this->fetch();
        }
    }
}