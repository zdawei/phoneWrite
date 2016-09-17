(function() {
	_sec.init();
	var Z = _sec.Z;

	var btnBack = function() {
		history.go(-1);
	};
	
	var setchar = function() {
		alert(1);
	};

	var insertPic = function() {
		console.log(_sec);
	};

	var picShare = function() {
		alert(1);
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
	
})();