<?php
/**
 * Created by PhpStorm.
 * User: bob
 * Date: 2018/8/30
 * Time: 20:56
 */

namespace app\common\model;

class UserGroupMember extends BaseModel
{
    public function user()
    {
        return $this->belongsTo('User','friend_id');
    }
    /**
     * 根据用户id获取所有好友
     */
    public function getFriendByUserId($userId,$where = [])
    {
        return $this->with('user')->where($where)->where('user_id',$userId)->select();
    }
    /**
     * 根据分组id获取好友
     */
    public function getListByGroupId($where = [])
    {
        return $this->where($where)->select();
    }
}