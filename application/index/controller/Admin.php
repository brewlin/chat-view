<?php
namespace app\index\controller;
use app\common\lib\Request;

class Admin extends Base
{
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