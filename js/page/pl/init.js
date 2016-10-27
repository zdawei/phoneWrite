$(function($) {
	_sec.init();
	var Z = _sec.Z;
	var shapeValue = {
		two : {
			sum : 7,
			pos : [6, 8, 1, 4, 7, 10, 13]
		},
		three : {
			sum : 11,
			pos : [12, 9, 6, 3, 0, 1, 2, 5, 8, 11, 14]
		}
	};
	var imgTarget = null, shapeObj = null;

	var btnBack = function() {
		history.go(-1);
	};
	
	var shape = function(evt) {
		Z.clearPrint();
		var value = evt.target.getAttribute("data-shape");
		if(value == '0') {
			value = Math.max(Math.min(parseInt(Math.random() * 4), 3), 1).toString();
		}
		if(imgTarget) {
			var dataChars=JSON.parse(localStorage.dataChars);
			Z.ctx.drawImage(imgTarget, 0, 0, Z.canvas.width, Z.canvas.height); 
		}
		switch(value) {
			case '1' :  shapeObj = null;Z.writingChar(); break;
			case '2' :  shapeObj = shapeValue.two;Z.writingChar(shapeValue.two); break;
			case '3' :  shapeObj = shapeValue.three;Z.writingChar(shapeValue.three); break;
			default :  break;
		}
	};

	var insertPic = function(evt) {		
		$('#myModal').on('click', function(evt) {
			imgTarget = evt.target;
			if(imgTarget.nodeName == 'IMG' || imgTarget.nodeName == 'img') {
				Z.clearPrint();
				var dataChars=JSON.parse(localStorage.dataChars);
				Z.ctx.drawImage(imgTarget, 0, 0, Z.canvas.width, Z.canvas.height); 
				Z.writingChar(shapeObj);
				$('#myModal').modal('hide');
			}
		});
	};

	var picShare = function() {
		$('#picShare').popover({
			animation : true,
			placement : 'bottom',
			title : "分享成功",
			delay : 500
		});
		setTimeout(function() {
			$('#picShare').popover('hide');
		}, 2000);
	};

	var handler = {

		init : function () {
			Z.setBtnFunc('btnBack', btnBack);	
			Z.setBtnFunc('shape', shape);	
			Z.setBtnFunc('insertPic', insertPic);	
			Z.setBtnFunc('picShare', picShare);
		}

	};

	// 启动
	handler.init();
	
});
