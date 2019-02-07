<?php
namespace app\api\controller;
use think\Request;
use think\File;
use think\Controller;
class Tool extends Controller
{
	public function upload(){
		//通过tp5 request的方法获得上传的文件
		$files=Request::instance()->file('file');
		//
		$files_path=$files->move('upload');

		if($files_path && $files_path->getPathname())
		{

			return success('success','\\'.$files_path->getPathname());

		}else
		{
			return error('upload error',config('commonError'),10091);
		}


		}
}