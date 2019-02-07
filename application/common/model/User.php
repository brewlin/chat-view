<?php

namespace app\common\model;

use app\api\service\Token;

class User extends BaseModel
{
    protected $hidden = ['password'];
    public function getHeadImgAttr($value)
    {
        return str_replace('\\','/',$value);

    }
    /**
     * 标签自动转换
     */
    public function setUserExpertAttr($value)
    {
        return implode(',',$value);
    }
    public function getUserExpertAttr($value)
    {
        if($value == '')
        {
            return [];
        }
        return explode(',',$value);
    }
    /**
     *通过user_id获取list
     */
    public function getAllListByUserId($id ,$where = [] , $limit = 0)
    {
        return $this->where('status' , 1)
                    ->where($where)
                    ->where('user_id',$id)
                    ->limit($limit)->select();
    }
    /**
     * 查看他人信息
     */
    public function getListById($id,$predictionNum = 4 , $userpredictionNum = 0)
    {
        $list =  $this->where('status',1)->find($id);
        return $list;
    }
    /**
     * 关联聊天数据
     */
    public function record()
    {
        return $this->hasMany('chatRecord','uid','id');
    }
    /**
     * 关联预测表数据
     * @return [type] [description]
     */
    public function prediction()
    {
        return $this->belongsTo('Prediction','id','user_id');
    }
    /**
     * 修改个人信息
     */
    public function edit()
    {
        $data = input('post.');
        return $this->allowField(true)->save($data,['id' => Token::getCurrentUid()]); 
    }
    public function getByOpenID($openid)
    {
        return $this->where('openid',$openid)->find();
    }
    /**
     * 添加关注
     */
    public function attention()
    {
        $this->where('id',input('get.id'))->setInc('attention');
    }
    /**
     * 取消关注
     */
    public function cancelAttention()
    {
        $this->where('id',input('get.id'))->setDec('attention');
    }

}
