<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2019/1/4 0004
 * Time: 下午 14:06
 */

namespace app\common\model;


use app\common\enum\GroupEnum;

class GroupMember extends BaseModel
{
    public function group()
    {
        return $this->belongsTo('Group','gnumber','gnumber');
    }
    /**
     * 获取用户加入的群
     */
    public function getJoinGroup($userNumber)
    {
        return $this->with('group')
                    ->where(['user_number' => $userNumber,'status' => GroupEnum::Normal])
                    ->select();
    }

}