/*
 * 登录部分
 * */

$('.toggle').on('click', function() {
  $('.container').stop().addClass('active');
});

$('.close').on('click', function() {
  $('.container').stop().removeClass('active');
});

/*登录*/
$(".btn-login").on("click",function(){
	if(inputNotEmpty(".login .input-no-empty")==1){
		$.ajax({
           url : ajaxUrl+"/login",
           type : "POST",
           dataType : "json",
           data : {'email':$(".login input[name='email']").val(),'password':$(".login input[name='password']").val()},
           success : function(result) {
           		var token = result.result;
           		sessionStorage.setItem('token', JSON.stringify(token));
             	location.href = indexUrl;
           },
           error:function(msg){
             	if(msg.responseJSON.msg.password!==undefined){
             		layer.msg(msg.responseJSON.msg.password.message);
             	}else if(msg.responseJSON.msg.email!==undefined){
					layer.msg(msg.responseJSON.msg.email.message);
             	}else if(msg.responseJSON.msg!==undefined){
             		layer.msg(msg.responseJSON.msg);
             	}

           }
        })
	}
});


/*注册*/
$(".btn-register").on("click",function(){
	if(inputNotEmpty(".register .input-no-empty")==1){
		var registerPassword = $(".register input[name='password']").val();
		var repeatPassword = $(".register input[name='repeatPassword']").val();
		if(registerPassword == repeatPassword){
			$.ajax({
	           url : ajaxUrl+"/register",
	           type : "POST",
	           dataType : "json",
	           data : {
	           		'email':$(".register input[name='email']").val(),
	           		'nickname':$(".register input[name='nickname']").val(),
	           		'password':$(".register input[name='password']").val(),
	           		'repassword' : $(".register input[name='repeatPassword']").val()
	           	},
	           success:function(result){
	           		layer.msg("注册成功！");
	           		setTimeout(reurl, 2000); 
	           },
	           error:function(msg){
	             	if(msg.responseJSON.msg.password!==undefined){
	             		layer.msg(msg.responseJSON.msg.password.message);
	             	}else if(msg.responseJSON.msg.email!==undefined){
						layer.msg(msg.responseJSON.msg.email.message);
	             	}else if(msg.responseJSON.msg!==undefined){
	             		layer.msg(msg.responseJSON.msg);
	             	}
	           }
	        })
		} else{
			layer.msg("两次密码不一致");
		}
	}
});

function reurl(){
	location.href = loginUrl;
}
