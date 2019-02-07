<?php
namespace app\common\validate;
class Login extends BaseValidate
{
	protected $rule=[
		['username' ,'require|max:25','请填写用户名'],
        ['email','require|email','请填写邮箱|邮箱格式错误'],
		['password' ,'require|max:25','请填写密码'],
	];
    protected $scene = [
        'login' => ['email','password'],
    ];
}