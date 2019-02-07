var fileM=document.querySelector("#file_upload");
	$("#file_upload").on("change",function() {
	    var fileObj = fileM.files[0];
	    var formData = new FormData();
	    formData.append('file', fileObj);
	    $.ajax({
	        url: SCOPE.image_url,
	        type: "post",
	        dataType: "json",
	        data: formData,
	        async: false,
	        cache: false,
	        contentType: false,
	        processData: false,
	        success: function (data) {
              $("#file_upload_image").attr("value",data.data);
              $("#upload_org_code_img").attr("src",data.data);
              $("#upload_org_code_img_pre").attr("href",data.data);
              $("#upload_org_code_img").show();

	        },
	    });
	});


    // $("#file_upload").click(function () {
    //     $.ajaxFileUpload({
    //         url:COMMON.image_url,
    //         fileElementId: "file_upload", //文件上传域的ID，这里是input的ID，而不是img的
    //         dataType: 'json', //返回值类型 一般设置为json
    //         contentType: "application/x-www-form-urlencoded; charset=utf-8",
    //         success: function (data) {
    //           $("#file_upload_image").attr("value",data.result.data);
    //           $("#upload_org_code_img").attr("src",data.result.data);
    //           $("#upload_org_code_img").show();
    //         }

    //     });


    // });
