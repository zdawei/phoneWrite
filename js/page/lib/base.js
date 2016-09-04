_sec.pre = function(main) {

	var it = {};

	var parseDOM = function() {
		var canvas = document.createElement("canvas");
		canvas.id = "writing";
		// document.body.insertBefore(canvas,main.nextSibling);
		// main.appendChild(canvas);
		var ctx = canvas.getContext("2d");
		canvas.width = document.documentElement.clientWidth;
  		canvas.height = document.documentElement.clientHeight - btnBack.offsetHeight-5;
		var image = document.createElement("img");
		image.src = "img/model.png";
  		canvas.style.background = 'black';///////////////
	};

	var handler = {

		init : function () {
			parseDOM();
		}


	};

	//启动
	handler.init();

	//外抛
	return it;
	
};
