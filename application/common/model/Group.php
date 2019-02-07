<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2019/1/4 0004
 * Time: 下午 14:06
 */

namespace app\common\model;


use app\common\enum\GroupEnum;

class Group extends BaseModel
{
    /**
     * 获取创建的群
     * @param $userNumber
     */
    public function getCreateGroup($userNumber)
    {
        return $this->where(['user_number' => $userNumber,'status' => GroupEnum::Normal])
                     ->select();
    }

}