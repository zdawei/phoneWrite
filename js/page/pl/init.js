$(function($) {
	_sec.init();
	var Z = _sec.Z;

	var btnBack = function() {
		history.go(-1);
	};
	
	var setchar = function() {
	};

	var insertPic = function(evt) {		
		$('#myModal').on('click', function(evt) {
			var target = evt.target;
			if(target.nodeName == 'IMG' || target.nodeName == 'img') {
				Z.ctx.clearRect(0, 0, Z.canvas.width, Z.canvas.height);
				var dataChars=JSON.parse(localStorage.dataChars);
				Z.ctx.drawImage(target, 0, 0, Z.canvas.width, Z.canvas.height); 
				Z.writingChar();
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
			Z.setBtnFunc('setchar', setchar);	
			Z.setBtnFunc('insertPic', insertPic);	
			Z.setBtnFunc('picShare', picShare);
		}

	};

	// 启动
	handler.init();
	
});
