<?php
namespace app\index\controller;
use app\common\enum\TokenEnum;
use app\common\lib\Request;
use think\Controller;
class Register extends Controller
{
	/**
	 * [admin 添加管理员]
	 * @return [type] [json]
	 */
	public function index()
	{
		if(request()->isPost())
		{
			validate('Register')->doCheck();
			$data = input('post.');
			if($data['password'] != $data['repassword'])
			{
				return error('两次填写的密码不一致',config('json.commonError'),10061);
			}
            $loginUrl = config('setting.ajaxUrl').'/register';
            $res = Request::post($loginUrl , $data);
            if(!empty($res) && $res->code == TokenEnum::Success)
            {
                return success('注册成功' ,$res->msg);
            }
            return error($res->msg);

		}
		return $this->fetch('',[
			'title' => 'swoole-注册'
		]);
	}
}