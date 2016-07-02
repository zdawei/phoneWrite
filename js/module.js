(function(){
  //次顶导4个按钮点击事件模块
  var btnClear = document.getElementById("btnClear");
  var btnSave = document.getElementById("btnSave");//暂时没用
  var nextchars = document.getElementById("nextchars");
  var prechars = document.getElementById("prechars");
  // 以上四个获取四个按钮  

  btnClear.addEventListener("click",W.clearPrint,false);

  nextchars.addEventListener("click",W.nextchar,false);

  prechars.addEventListener("click",W.preChar,false);

  // btnSave.addEventListener("click",function	(){
  // 	var test = prompt("a a a ","d d d ");
  // 	alert(test)
  // },false);

})();

(function(){
  //书写模块
  var touch =("createTouch" in document);
  var StartEvent = touch ? "touchstart" : "mousedown";
  var MoveEvent = touch ? "touchmove" : "mousemove";
  var EndEvent = touch ? "touchend" : "mouseup";
  var lock=false;
  W.canvas['on'+StartEvent]=function(e){
    var t=touch ? e.touches[0] : e;
    var x=t.pageX-t.target.offsetLeft;
    var y=t.pageY-t.target.offsetTop;
    var time=new Date().getTime();
    W.pushAll(x,y,time,false);
    lock=true;
  }
  W.canvas['on'+MoveEvent]=function(e){
    if(lock){
      var t=touch ? e.touches[0] : e;
      var x=t.pageX-t.target.offsetLeft;
      var y=t.pageY-t.target.offsetTop;
      var time=new Date().getTime();
      W.pushAll(x,y,time,true);
      W.drawPoint();
    }
  }
  W.canvas.onmouseout=function(e){
    lock=false;
  }
  W.canvas['on'+EndEvent]=function(e){
    lock=false;
  }
})();

(function(){
	//顶导两个按钮点击事件模块
	var xmlChar = document.getElementById("xmlcharacter");
  	var handwriting = document.getElementById("handwriting");

  	var loadXML = function (xmlFile) {
	// 加载xml文档
    	var xmlDoc;
	    var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET",xmlFile,false);
        try{
        	xmlhttp.send(null);
        }catch (ex){
        	return 0;
        }
        if(xmlhttp.readyState == 4){
        	if((xmlhttp.status >= 200 && xmlhttp.status < 300 ) || xmlhttp.status == 304 ){
	            xmlDoc = xmlhttp.responseXML.documentElement;
	    		return xmlDoc;
        	}else{
        		alert("网络有问题!");
        		return 1;
        	}
        }
    }

	xmlChar.addEventListener("click",function(){
		var char = prompt("请输入一个汉字","张");
		if(!char.length || char.length > 1){alert("输入有误!"); return arguments.callee();}
		var path = "data\\"+char+".xml";
		var docXML = loadXML(path);
		if(!docXML) {alert("输入有误!");return  arguments.callee();}
		drawPoint (docXML);
		W.clearScreen();
		W.drawPointAll();
	},false);


	function changeXY(X,Y,T,L){
		var maxX = Math.max.apply(Math,X);
		var maxY = Math.max.apply(Math,Y);
		var minX = Math.min.apply(Math,X);
		var minY = Math.min.apply(Math,Y);
		var widthChar = maxX - minX ;
		var heightChar = maxY - minY ;
		var canvasWidth = W.canvas.width ;
		var canvasHeight = W.canvas.height ;
		var ratioChar = widthChar / heightChar;
		for(var i = 0 ; i < X.length;i++){
			X[i] -= minX ;
			Y[i] -= minY ;
			X[i] = canvasWidth / widthChar * X[i] ;
			Y[i] = canvasHeight / heightChar * Y[i] ;
			W.pushAll(X[i],Y[i],T[i],L[i]);
		}
	}
	
	function drawPoint (docXML){
		var xArray =[] , yArray = [], timeArray = [] , lockArray = [];
		var strokes = docXML.getElementsByTagName("Stroke");
		var lock = false;
		for(var i = 0;i < strokes.length;i++){
			var startMillisecond = strokes[i].getAttribute("startMillisecond").split("");
			while(startMillisecond.length < 3){
				startMillisecond.unshift(0);
			}
			var timeMillisecond = startMillisecond.join("");
			var startTime = +(strokes[i].getAttribute("startSecond") + timeMillisecond);
			for(var j = 0 , length = strokes[i].childNodes.length ;j < length;j++){
				if(j == 0){
					lock = false;
				}else{
					lock = true;
				}
				var duration = +strokes[i].childNodes[j].getAttribute("deltaTime");
				startTime += duration;
				xArray.push(+strokes[i].childNodes[j].getAttribute("x"));
				yArray.push(+strokes[i].childNodes[j].getAttribute("y"));
				timeArray.push(startTime); 
				lockArray.push(lock);
			}
		}
		changeXY(xArray,yArray,timeArray,lockArray);
	}

})();