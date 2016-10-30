_sec.pre = function() {

	var it = {}
	,	canvas = document.getElementById('canvas')
	,	ctx = canvas.getContext("2d")
	,	btnBack = document.getElementById("btnBack")
	,	setchar = document.getElementById("setChar")
	,	insertPic = document.getElementById("insertPic")
	,	picShare = document.getElementById("picShare")
	,	image = document.createElement("img")
	,	dataChars = JSON.parse(localStorage.dataChars)
	;

	var screenCanvas = function() {  
	  canvas.width = document.documentElement.clientWidth;
	  canvas.height = document.documentElement.clientHeight - btnBack.offsetHeight - 5;
	};

	function clearPrint() {
  	  ctx.clearRect(0,0,canvas.width,canvas.height);
  	}

	var drawPointAll = function(d,i) {
	  var col = 3, row = 5, beishu = 90, widthbeishu = 3, permY = parseInt(i / col), permX = i % col;
	  var width = canvas.width / col, height = canvas.height / row;
	  for(var r = 0; r < d.count; r++) {
	    if(d.locks[r]) {
	      var sampleNumber = parseInt(d.distance[r] / 0.5);
	      for(var u = 0; u < sampleNumber; u++) {
	        var t = u / (sampleNumber - 1);
	        var x = ((1.0 - t) * d.x[r - 1] + t * d.x[r]) / canvas.width * beishu + permX * width;//x/canvas.with = X / beishu
	        var y = ((1.0 - t) * d.y[r - 1] + t * d.y[r]) / canvas.height * 1.5 * beishu + permY * height;
	        var w = ((1.0 - t) * d.pressure[r - 1] * d.width + t * d.pressure[r] * d.width) / widthbeishu;  
	        ctx.drawImage(image, x - w, y - w, w * 2, w * 2);

	      }
	    }
	  }
	};

	var writingChar = function(opt) {
		if(!opt) {
		  	for(var i = 0; i < dataChars.length; i++) {
		    	drawPointAll(dataChars[i], i);     
		  	}
		} else { 
			var min = Math.min(opt.sum, dataChars.length);
			for(var i = 0; i < min; i++) {
				drawPointAll(dataChars[i], opt.pos[i]);     
			}
		}
	};

	var bindDOM = function() {
		image.src = "img/model-black.png";
		$(screenCanvas);
		image.onload = function() {
			writingChar();
		}
		$(window).on('resize', screenCanvas);
	};

	var handler = {

		init : function () {
			bindDOM();
		}

		,setBtnFunc : function (btn, callback) {
			switch (btn) {
				case 'btnBack' : btnBack.addEventListener("click",callback,true);break;
				case 'setchar' : setchar.addEventListener("click",callback,true);break;
				case 'insertPic' : insertPic.addEventListener("click",callback,true);break;
				case 'picShare' : picShare.addEventListener("click",callback,true);break;
				default : $('#shape').on("click",callback);
				// default : throw ('btn error in page\\lib\\base.js');
			}
		}

	};

	//启动
	handler.init();

	//外抛
	it.setBtnFunc = handler.setBtnFunc;
	it.ctx = ctx;
	it.canvas = canvas;
	it.writingChar = writingChar;
	it.clearPrint = clearPrint;

	return it;
	
};
