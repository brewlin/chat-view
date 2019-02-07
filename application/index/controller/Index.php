<?php
namespace app\index\controller;
use think\Cache;
class Index extends Base
{
	public function index()
	{
		return $this->fetch('',[
			'title' => '首页'
		]);
	}
	public function main()
	{
	    //注册人数
        $registerNum = db('user')->count();
        //聊天记录数量
        $userRecord = db('user_record')->count();
        $groupRecord = db('group_record')->count();
        $chatRecordNum = $userRecord + $groupRecord;
        //群数量
        $groupNum = db('group')->count();
        //操作事件
        $msgNum = db('msg')->count();
		return $this->fetch('',[
			'title' => '首页',
            'registerNum' => $registerNum,
            'chatRecordNum' => $chatRecordNum,
            'groupNum' => $groupNum,
            'msgNum' => $msgNum
		]);
	}
	public function flush()
    {
        Cache::clear();

    }

}