<?php

namespace app\index\controller;

use think\Controller;
use app\common\lib\Predis;
class Base extends Controller
{
    protected $menu = null;//目录菜单
    public $account;
    public $user;
    public $token;
    public $obj;//公用模型
    //隐藏默认的模型加载
    protected $hiddenModel = ['index','admin'];
    /**
     * 基类初始化
     */
    public function _initialize()
    {
        $this->loadPool();
        $this->menu = config('menu.menu');
        $this->assign('menu',$this->menu);
        $this->isLogin();
        $this->assign('token',$this->token);
        $this->init();
    }
    public function init()
    {
        $this->assign('title','swoole-im');
    }
    public function loadPool()
    {
        //加载模型
        if(in_array(strtolower(request()->controller()),$this->hiddenModel))
        {
            return true;
        }
        $this->obj = model(request()->controller());
    }
    /**
     * 判断是否登录
     */
    public function isLogin()
    {
        $user = $this->getLoginUser();
        if(empty($user))
        {
            return $this->redirect(url('Login/index'));
        }
        if(!$user && !$user->id)
        {
            return $this->redirect(url('Login/index'));
        }
    }
    /**
     * 获取当前登录用户
     */
    public function getLoginUser()
    {
        $token = session(config('token.user'));
        $this->token = $token;
        $user = Predis::getInstance()->hgetall(sprintf(config('token.token_user'),$token));
        $this->user = $user;
        $this->assign('currentUser',$user);
        return $user;
    }
    /**
     * 更新状态
     */
    public function status()
    {
        (validate(request()->controller())->doCheck('status'));
        $res = model(request()->controller())->updateStatus();
        if(!$res)
        {
            return error('操作失败',config('json.serverError'),20081);
        }
        return success('操作成功');
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
        return $this->fetch('',[
            'list' => $list,
            'title' => '意见详情',
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
            $id = $this->user['id'];
            $data = input('post.');
            $res = model(request()->controller())->doEdit($id,$data);
            if($res)
            {
               return success('更新成功');
            }
            return error('更新失败',config('json.commonError'),10021);
        }
        $id = $this->user['id'];
        $list = model(request()->controller())->getListByIdByAdmin($id);
        return $this->fetch('',[
            'title' => '编辑',
            'list' => $list
        ]);
    }
    /**
     * 添加
     */
    public function add()
    {
        //post 逻辑
        if(request()->isPost())
        {
            validate(request()->controller())->doCheck('add');
            $data = input('post.');
            $data['user_id'] = $this->user['id'];
            $res = model(request()->controller())->doAdd($data);
            if($res)
            {
                return success('添加成功');
            }
            return error('添加失败',config('json.commonError'),10022);
        }
        $list = model(request()->controller())->getAddData();
        return $this->fetch('',[
            'title' => '添加',
            'list' => $list
        ]);
    }
    /**
     * 更新状态
     */
    public function del()
    {
        (validate(request()->controller())->doCheck('del'));
        $res = model(request()->controller())->doDel();
        if(!$res)
        {
            return error('操作失败',config('json.serverError'),20081);
        }
        return success('操作成功');
    }
    /**
     * 审核申请
     */
    public function apply()
    {
        $list = model(request()->controller())->getAllListByAdmin(['status' => 0]);
        return $this->fetch('',[
            'title' => '审核申请',
            'list' => $list
        ]);
    }
    /**
     *退出登录
     * */
    public function logOut()
    {
        $token = session(config("token.user"));
        $quitUrl = config('setting.ajaxUrl').'/api/im/user/user/quit?token='.$token;
        curl_get($quitUrl);
        session(config("token.user"), null);
        return $this->redirect(url('Login/index'));
    }
}
