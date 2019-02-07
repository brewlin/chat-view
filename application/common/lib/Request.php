<?php
/**
 * Created by PhpStorm.
 * User: liuxiaodong
 * Date: 2018/8/23
 * Time: 22:31
 */

namespace app\common\lib;


class Request
{
    public static function post($url , $postData = null , $timeOut = 5)
    {
        $ch = curl_init();
        curl_setopt($ch , CURLOPT_URL ,$url);
        curl_setopt($ch , CURLOPT_POST ,1);
        if($postData != null)
        {
            curl_setopt($ch , CURLOPT_POSTFIELDS , $postData);
        }
        curl_setopt($ch , CURLOPT_RETURNTRANSFER ,1);
        curl_setopt($ch , CURLOPT_CONNECTTIMEOUT ,$timeOut);
        curl_setopt($ch , CURLOPT_HEADER ,false);
        $file_contents = curl_exec($ch);
        return json_decode($file_contents);
    }
}