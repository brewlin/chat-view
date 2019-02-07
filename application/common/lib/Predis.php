<?php
/**
 * Created by PhpStorm.
 * User: liuxiaodong
 * Date: 2018/8/23
 * Time: 22:08
 */

namespace app\common\lib;

/**
 * Class Predis
 * redis 类库
 * @package app\common\lib
 */
class Predis
{
    public $redis = '';
    private static $_instance = null;

    /**
     * 单例模式
     */
    public static function getInstance()
    {
        if(empty(self::$_instance))
        {
            self::$_instance = new self();
        }
        return self::$_instance;
    }
    private function __construct()
    {
        $this->redis = new \Redis();
        $res = $this->redis->connect(config('redis.host'),config('redis.port'),config('redis.timeOut'));
        if($res == false)
        {
            throw new \Exception('redis error');
        }
    }

    /**
     * 公用魔术方法
     * @param $name
     * @param $arguments
     * @return string
     */
    public function __call($name,$arguments)
    {
        //set operation
        if(count($arguments) == 2)
        {
            return $this->redis->$name($arguments[0],$arguments[1]);
        }else if(count($arguments) == 1)//get operation
        {
            return $this->redis->$name($arguments[0]);
        }
        return '';
    }
}