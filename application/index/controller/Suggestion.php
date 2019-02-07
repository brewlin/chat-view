<?php
/**
 * @author xiaodong
 * @date(2018.7.4 18:01)
 */
namespace app\index\controller;


class Suggestion extends Base
{
    public $obj;
    public function _initialize()
    {
        parent::_initialize();
        $this->obj = model(request()->controller());
    }
    /**
     * 意见反馈
     */
    public function index()
    {
        $co = input('get.status',1);
        $list = $this->obj->getAllListByAdmin(['status' => $co]);
        $this->assign([
            'title' => '意见反馈',
            'list' => $list,
            'status' => config('status.status'),
            'co' => $co
        ]);
        return $this->fetch();
    }
}
