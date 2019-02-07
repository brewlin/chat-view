<?php
/**
 * Created by PhpStorm.
 * User: bob
 * Date: 2018/8/31
 * Time: 0:29
 */

namespace app\common\model;


class UserRecord extends BaseModel
{
    public function mine()
    {
        return $this->belongsTo('User','uid');
    }
    public function  to()
    {
        return $this->belongsTo('User','to_id');
    }
    public function getChatRecord($current ,$toId)
    {
        return $this->where(function($query)use($current,$toId){
            $query->where('uid',$current)->where('to_id',$toId);
        })
            ->whereOr(function($query)use($current , $toId){
                $query->where('uid',$toId)->where('to_id',$current);
            })
            ->with('mine','to')
            ->paginate(config('setting.pageSize'));
    }
}