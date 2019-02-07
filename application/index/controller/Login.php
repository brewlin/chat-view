<?php
/**
 * @author xiaodong
 * @date(2018.6.25)
 */
namespace app\index\controller;
use app\common\enum\TokenEnum;
use app\common\lib\Predis;
use app\common\lib\Request;
use think\Controller;
class Login extends Controller
{
	public function _initialize()
	{
		$token = session(config('token.user'));
		if($token)
		{
		    $tokenIm = config('token.token_user');
		    $user = Predis::getInstance()->hgetall(sprintf($tokenIm,$token));
		    if($user)
            {
			    return $this->redirect(url('Index/index'));
            }

		}
	}
	public function index()
	{
		if(request()->isPost())
		{
			(validate('Login')->doCheck('login'));
			$data = input('post.');
            $loginUrl = config('setting.ajaxUrl').'/login';
            //请求websocket服务器获取token令牌
            $res = Request::post($loginUrl , $data);
            if(!empty($res) && $res->code == TokenEnum::Success)
            {
                session(config('token.user') ,$res->data);
                return success('登录成功' ,$res->data);
            }
            return error($res->msg);
		}
		return $this->fetch('',[
			'title' => 'swoole-登陆'
		]);

	}

}