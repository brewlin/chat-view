<?php
namespace app\common\enum;

class ScopeEnum{
	const User = 16;
	const Super = 32;
	//操作类型
    const comment = 0;
    const attention = 1;
    const love = 2;
	//评论类型
	const PredictionComment = 0;
	const ExperienceComment = 1;
	const CourseComment = 2;
	//点赞类型
    const CommentOperate = 1;
    const UserOperate = 2;
    //评论类型
}