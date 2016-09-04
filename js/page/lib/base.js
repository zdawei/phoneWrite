_sec.pre = function(main) {

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

	var parseDOM = function() {
		image.src = "img/model.png";
		window.addEventListener("load",screenCanvas,true);
		window.addEventListener("resize",screenCanvas,true);
  		// canvas.style.background = 'black';///////////////
	};

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
	        ctx.drawImage(image, x - w, y - w, w * 2, w * 2);     console.log(x,y,w);
	        // ctx.drawImage(image, 10, 100, 20, 30);
	      }
	    }
	  }
	}

	var writingChar = function() {console.log(dataChars);
	  for(var i = 0; i < dataChars.length; i++) {
	    drawPointAll(dataChars[i], i);     
	  }
	}


	var handler = {

		init : function () {
			parseDOM();
			writingChar();
		}


	};

	//启动
	handler.init();

	//外抛
	return it;
	
};
