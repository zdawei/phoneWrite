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
		alert(1);
	};

	var picShare = function() {
		alert(1);
	};

	Z.setBtnFunc('btnBack', btnBack);	
	Z.setBtnFunc('setchar', setchar);	
	Z.setBtnFunc('insertPic', insertPic);	
	Z.setBtnFunc('picShare', picShare});
	
})();