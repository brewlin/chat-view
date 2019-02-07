<?php
// +----------------------------------------------------------------------
// | ThinkPHP [ WE CAN DO IT JUST THINK ]
// +----------------------------------------------------------------------
// | Copyright (c) 2006-2016 http://thinkphp.cn All rights reserved.
// +----------------------------------------------------------------------
// | Licensed ( http://www.apache.org/licenses/LICENSE-2.0 )
// +----------------------------------------------------------------------
// | Author: 流年 <liu21st@gmail.com>
// +----------------------------------------------------------------------

// 应用公共文件
//公用json返回
function error($msg='',$code = 404 ,$errorcode = 0,$requestUrl = ''){
    if(empty($requestUrl))
    {
        $requestUrl = request()->url();
    }
	return json([
		'msg' => $msg,
		'errorcode' => $errorcode,
        'request_url'=> $requestUrl
	],$code);
}
function success($msg='',$data = [], $requestUrl = ''){
    if(empty($requestUrl))
    {
        $requestUrl = request()->url();
    }
	return json([
		'msg' => $msg,
		'data' => $data,
		'errorcode' => 0,
        'request_url'=> $requestUrl
	],202);
}
//分页函数
function pagination($obj)
{
    if($obj)
    {
        $params = request()->param();
        return '<div class="row">'.$obj->appends($params)->render().'</div>';
    }
    else
    {
        return '';
    }
}
/**
 * 产生随机盐值
*/
function code()
{
    return mt_rand(100,10000);
}
// 请求
function curl_get($url,$httpCode=0){
    $ch=curl_init();
    curl_setopt($ch,CURLOPT_URL,$url);
    curl_setopt($ch,CURLOPT_RETURNTRANSFER,1);
    //不做证书校验，部署在linux下需改为true
    curl_setopt($ch,CURLOPT_SSL_VERIFYPEER,false);
    curl_setopt($ch,CURLOPT_CONNECTTIMEOUT,10);
    $file_contents=curl_exec($ch);
    $httpCode=curl_getinfo($ch,CURLINFO_HTTP_CODE);
    curl_close($ch);
    return $file_contents;
}
//生成唯一字符串
function getRandChars($length){
    $str=null;
    $strPol="ABCDEFGHIJKOPQRSTUVWXYZ0123456789abcdefghijkopqrstuvwxyz";
    $max=strlen($strPol)-1;
    for ($i=0; $i < $length; $i++) {
        # code...
        $str.=$strPol[rand(0,$max)];
    }
    return $str;
}
//解析图片
function parse($content = '')
{
    if(substr($content,0,3) == 'img')
    {
       $pattern = '/\[(.*)\]/';
       $res = preg_match($pattern,$content,$match);
       if($res)
       {
          $str = "<img src='{$match[1]}' style='width: 100%'/>";
          return $str;
       }
       return $content;
    }
    return $content;
}