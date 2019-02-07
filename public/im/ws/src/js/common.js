/*
 * 公共js文件
 * */

/**
 * 公共请求方法
 * 不需要关注返回结果
 */
function noResponseRequest(type,url,data)
{
    $.ajax({
        type:type,
        url:url,
        data:data,
        success:function(data){
            //layer.msg(data.msg);
        },
        'error':function(data){
        }
    })
}

/*公共的ajax方法执行*/
function ajaxUnifiedEntrance(AUEData) {
	/*	
	 * 传参说明
	 * var AUEData = {
			"type":"get",可不填默认get
			"url":"ajaxUrl",可不填默认空
			"urlApi":"/xx",可不填默认空
			"data":"{}",默认get传参""
			"successFunction":"xx(xx)",成功后执行方法，一般指code200执行，可不填默认空
			"elseFunction":"xx(xx)",失败后执行的方法，一般指所有非code200执行，可不填默认空
			"errorFunction":"xx(xx)",error执行方法，可不填默认空
		}
	*/
	if (AUEData.type == "" || AUEData.type == undefined || AUEData.type == null) {
		AUEData.type = "get";
	}
	if (AUEData.url == "" || AUEData.url == undefined || AUEData.url == null) {
		AUEData.url = "";
	}
	if (AUEData.urlApi == "" || AUEData.urlApi == undefined || AUEData.urlApi == null) {
		AUEData.urlApi = "";
	}
	
	/*type方式，url，接口api，data数据对象，成功后执行的方法，没有传null或是空*/
	jQuery.support.cors = true;/*允许跨域*/
	$.ajax({
		type: AUEData.type,
		url: AUEData.url + AUEData.urlApi,
		dataType: 'json',
		data: AUEData.data,
		success: function(data) {
			if (typeof data != "object") {
				var data = eval('(' + data + ')'); /*将其他不符合json标准字符转化json数据*/
			}
			if(data.code != undefined){
				if (data.code == 200) {
					if (AUEData.successFunction != "" && AUEData.successFunction != undefined && AUEData.successFunction != null) {
						eval(AUEData.successFunction);
					}
				}
//				else if (data.code == 0) {
//					location.href = "#/login";
//				}
				else {
					if (AUEData.elseFunction != "" && AUEData.elseFunction != undefined && AUEData.elseFunction != null) {
						eval(AUEData.elseFunction);
					}
				}
			}
			else if(data.status_code != undefined){
				if (data.status_code == 200) {
					if (AUEData.successFunction != "" && AUEData.successFunction != undefined && AUEData.successFunction != null) {
						eval(AUEData.successFunction);
					}
				}
//				else if (data.status_code == 0) {
//					location.href = "#/login";
//				}
				else {
					if (AUEData.elseFunction != "" && AUEData.elseFunction != undefined && AUEData.elseFunction != null) {
						eval(AUEData.elseFunction);
					}
				}
			}
			else{
				if (AUEData.successFunction != "" && AUEData.successFunction != undefined && AUEData.successFunction != null) {
					eval(AUEData.successFunction);
				}
			}
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) {
			if (AUEData.errorFunction != "" && AUEData.errorFunction != undefined && AUEData.errorFunction != null) {
				eval(AUEData.errorFunction);
			}
		}
	})
}
/*公共的ajax方法执行，唯一的ajax 结束*/

/*清空ajax data对象默认值*/
function ajaxDataInitialization(ajaxObj){
	ajaxObj.type = 'get';
	ajaxObj.url = ajaxUrl;
	ajaxObj.urlApi = '';
	ajaxObj.data = '';
	ajaxObj.successFunction = '';
	ajaxObj.elseFunction = '';
	ajaxObj.errorFunction = '';
}


/*遍历input输入框不为空,只需要给所有不为空的input加入一个特定并且共同的class，
 * 然后将这个class传入inputNotEmpty(inputClassName),
 * 函数方法会进行反馈如果返回1说明全部都不为空了，如果有未填项返回0
 * 如果没有请填null或是空,返回值1
 * 如果希望判断出空的同时返回第一个为空的input的名称，请给input添加data-input-name，可不填，不填不产生提示
 * <input type="text" name="input1" class="input-no-empty" data-input-name="手机号" placeholder="手机号"/>
 * 如过是邮箱或是手机号需要做格式验证的话加入对应的data-input-type="email"或者data-input-type="phone"，不验证格式则不加
 * if(inputNotEmpty(".input-no-empty")==1){如果是class请在前面加“.”，id加“#”
	alert("都填了")
	}
	else{
		alert("还有空的")
	}
*/
function inputNotEmpty(inputClassName) {
	var inputClass = eval("'" + inputClassName + "'");
	var inputLength = $(inputClass).length;
	var sum = 0;
	$(inputClass).each(function() {
		if ($.trim($(this).val()).length > 0 && $(this).val() != "") {
			if ($(this).attr("data-input-type") == 'phone') {
				var phoneReg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
				if (!phoneReg.test($(this).val())) {
					layer.msg($(this).attr("data-input-type") + "格式有误");
					return false;
				} else {
					sum = sum + 1;
				}
			} else if ($(this).attr("data-input-type") == 'email') {
				var emailReg = /^\w+(\.\w+)*@[A-z0-9]+(\.[A-z]{1,9}){1,9}$/ig;
				if (!emailReg.test($(this).val())) {
					layer.msg($(this).attr("data-input-type") + "格式有误");
					return false;
				} else {
					sum = sum + 1;
				}
			} else if ($(this).attr("data-input-type") == 'code') {
				if($.trim($(this).val()).length < 6){
					layer.msg("验证码格式有误");
					return false;
				} else {
					sum = sum + 1;
				}
			} else {
				sum = sum + 1;
			}
		} else {
			if ($(this).attr("data-input-type") != undefined) {
				layer.msg($(this).attr("data-input-type") + "格式有误");
				return false;
			} else if ($(this).attr("data-input-name") != undefined) {
				layer.msg($(this).attr("data-input-name") + "不能为空");
				return false;
				
			}
		}
	})
	if (sum == inputLength) {
		return 1;
	} else {
		return 0;
	}
}

/*
 * 时间戳转日期
 * 参数一，时间戳，参数二输出的时间格式，1只有年月日，2年月日加时分秒
 */
 function timestampConversion(timestamp,id) {
 	if(timestamp != null && timestamp != undefined && timestamp != ""){
 		var newDate = new Date(timestamp);
 	} else {
 		var newDate = new Date();
 	}
    var newYear = newDate.getFullYear();
    var newMonth = newDate.getMonth()+1;
    var newDay = newDate.getDate();
   	var newHour = newDate.getHours();
    var newMin = newDate.getMinutes();
    var newSen = newDate.getSeconds();
    if (id == 1) {
    	var newTime = newYear + '-' + addZero(newMonth) + '-' + addZero(newDay);/*最后拼接时间*/
    } else if (id == 2) {
    	var newTime = newYear + '-' + addZero(newMonth) + '-' + addZero(newDay) + ' ' + addZero(newHour) + ':' + addZero(newMin) + ':' + addZero(newSen);/*最后拼接时间*/
    }
    return newTime;
}; 

/*补0操作*/
function addZero(num) {
    if (parseInt(num) < 10) {
        num = '0'+num;
    }
    return num;
}

/*2017-12-14 00:00:00格式的时间字符串拆分保留年月日*/
function dateSplit(date) {
	var dateArray = date.split(" ");
	return dateArray[0];
}

/*2017-12-14 00:00:00格式的时间字符串拆分 20171214000000*/
function dateFormat(date) {
	var dateNumber = date.replace(/:/g, '');
	dateNumber = dateNumber.replace(/-/g, '');
	return dateNumber;
}

/*2017-12-14 00:00:00格式的时间字符串拆分保留年月日 20171214 000000*/
function dateFormatObj(date) {
	var dateNumber = date.replace(/:/g, '');
	var dateNumberArray = dateNumber.split('-');
	var dateNumberObj = {};
	dateNumberObj.start = dateNumberArray[0];
	dateNumberObj.end = dateNumberArray[1];
	return dateNumberObj;
}

/*
 * 获取当前年与临近两年
 * @return array
 * @author zhangyu
 */
function getYearArr() {
    var myDate = new Date();
    var year = myDate.getFullYear();
    return [year-4,year-3,year-2,year-1,year,year+1,year+2,year+3,year+4];
}
