<?php
/**
 * Created by PhpStorm.
 * User: Administrator
 * Date: 2018/12/14 0014
 * Time: 上午 10:22
 */

namespace app\common\model;


class UserGroup extends BaseModel
{
    /**
     * 获取所有列表
     */
    public function getAllList($where = ['status' => 1],$order = ['id' => 'asc'])
    {
        return $this->where($where)
            ->order($order)
            ->paginate();
    }

}