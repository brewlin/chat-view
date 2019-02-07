<?php
/**
 * Created by PhpStorm.
 * User: bob
 * Date: 2018/8/30
 * Time: 20:52
 */

namespace app\index\controller;


class Group extends Base
{
    /**
     * 加入的群组
     */
    public function join()
    {
        $keywords = input('get.keywords');
        $where = [];
        if($keywords)
        {
            $where['nickname'] = ['like',"%{$keywords}%"];
        }
        $list = model('GroupMember')->getJoinGroup($this->user['number']);
        return $this->fetch('',[
            'title' => '加入的群',
            'list' => $list,
            'keywords' => $keywords
        ]);
    }

    /**
     * 创建的群组
     */
    public  function create()
    {
         $keywords = input('get.keywords');
        $where = [];
        if($keywords)
        {
            $where['nickname'] = ['like',"%{$keywords}%"];
        }
        $list = $this->obj->getCreateGroup($this->user['number']);
        return $this->fetch('',[
            'title' => '创建的群',
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
    /**
     * 编辑
     */
    public function edit()
    {
        //post 逻辑
        if(request()->isPost())
        {
            //validate(request()->controller())->doCheck('edit');
            $id = input('post.id');
            $data = input('post.');
            unset($data['id']);
            $res = model(request()->controller())->doEdit($id,$data);
            if($res)
            {
                return success('更新成功');
            }
            return error('更新失败',config('json.commonError'),10021);
        }
        $id = input('get.id');
        $list = model(request()->controller())->getListByIdByAdmin($id);
        return $this->fetch('',[
            'title' => '编辑',
            'list' => $list
        ]);
    }
}