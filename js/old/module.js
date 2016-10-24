(function(){
	//次顶导4个按钮点击事件模块
	var btnClear = document.getElementById("btnClear");
	var setChar = document.getElementById("setChar");//暂时没用
	var nextchars = document.getElementById("nextchars");
	var prechars = document.getElementById("prechars");
	// 以上四个获取四个按钮  

  	btnClear.addEventListener("click",W.clearPrint,false);

  	nextchars.addEventListener("click",W.nextchar,false);

	prechars.addEventListener("click",W.preChar,false);

	setChar.addEventListener("click",function(){
		var data = W.getData("charDatas");
		if(data.length){
			var dataChar = JSON.stringify(data);
			localStorage.removeItem("dataChars");
			localStorage.setItem("dataChars",dataChar);
			var w = window.open("second.html","_self");
		}else{
			alert("没有汉字");
		}
	},false);

})();

(function(){
  //书写模块
  var touch = ("createTouch" in document);
  var StartEvent = touch ? "touchstart" : "mousedown";
  var MoveEvent = touch ? "touchmove" : "mousemove";
  var EndEvent = touch ? "touchend" : "mouseup";
  var lock = false;
  W.canvas['on' + StartEvent] = function(e){
    var t = touch ? e.touches[0] : e;
    var x = t.pageX - t.target.offsetLeft;
    var y = t.pageY - t.target.offsetTop;
    var time = new Date().getTime();
    W.pushAll(x,y,time,false);
    lock = true;
  }
  W.canvas['on' + MoveEvent] = function(e){
    if(lock){
      var t = touch ? e.touches[0] : e;
      var x = t.pageX - t.target.offsetLeft;
      var y = t.pageY - t.target.offsetTop;
      var time = new Date().getTime();
      W.pushAll(x,y,time,true);
      W.drawPoint();
    }
  }
  W.canvas.onmouseout = function(e){
    lock = false;
  }
  W.canvas['on' + EndEvent] = function(e){
    lock = false;
  }
})();

(function(){
	//顶导两个按钮点击事件模块
	var xmlChar = document.getElementById("xmlcharacter");
  	var handwriting = document.getElementById("handwriting");
  	var strokesArray = [];//将来可能添加设置参数，所以把这个提出来了

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

	function changeXY(strokeArray, opts) {
		var charAspectRatio;

		var minX=strokeArray[0][0].x;
		var minY=strokeArray[0][0].y;
		var maxX=strokeArray[0][0].x;
		var maxY=strokeArray[0][0].y;
		
		//Find the global bounding box
		for(var i=0;i<strokeArray.length;i++){
			for(var j=0;j<strokeArray[i].length;j++){
				if(minX>strokeArray[i][j].x){minX=strokeArray[i][j].x;}
				if(minY>strokeArray[i][j].y){minY=strokeArray[i][j].y;}
				if(maxX<strokeArray[i][j].x){maxX=strokeArray[i][j].x;}
				if(maxY<strokeArray[i][j].y){maxY=strokeArray[i][j].y;}
			}
		}
		var widthX=maxX-minX;
		var heightY=maxY-minY;
		var centerX=(minX+maxX)*0.5;
		var centerY=(minY+maxY)*0.5;
		// 保存长宽比，不然显示出来的就是1：1
		
		var	charAspectRatio=widthX/heightY;
		

		//字在区域内显示的比例
		var scale= opts.charRatio;
		//if the width is larger, make sure it is within range
		if( charAspectRatio > 1.0){
			scale/=charAspectRatio;
		}

		var charBoxWidth = opts.charBoxWidth;
		var charBoxHeight =  opts.charBoxWidth * opts.aspectRatio;

		for(var i=0;i<strokeArray.length;i++){
			for(var j=0;j<strokeArray[i].length;j++){
				//normalize the coordinates into [-0.5,0.5]	
				strokeArray[i][j].x=(strokeArray[i][j].x-centerX)*scale/widthX;
				strokeArray[i][j].y=(strokeArray[i][j].y-centerY)*scale/heightY;
				//map to canvas space
				// 缩放需要对应字的比例，固定比例为字的原始比例。
				strokeArray[i][j].x=(strokeArray[i][j].x*charAspectRatio+0.5)*charBoxWidth+ opts.startPosition.x;
				//字要缩放一样的倍数，然后平移1/2画布高度。
				strokeArray[i][j].y=strokeArray[i][j].y*charBoxWidth+0.5*charBoxHeight+ opts.startPosition.y;
				// arr[i][j].y=(arr[i][j].y+0.5)*charBoxHeight;
				// 
				W.pushAll( strokeArray[i][j].x , strokeArray[i][j].y , strokeArray[i][j].t , strokeArray[i][j].l );
				
			}
		}
	}
	
	function drawPoint (docXML){
		var strokes = docXML.getElementsByTagName("Stroke");
		var lock = false;
		for(var i = 0;i < strokes.length;i++){
			strokesArray[i] = [];
			var startMillisecond = strokes[i].getAttribute("startMillisecond").split("");
			while(startMillisecond.length < 3){
				startMillisecond.unshift(0);
			}
			var timeMillisecond = startMillisecond.join("");
			var startTime = +(strokes[i].getAttribute("startSecond") + timeMillisecond);
			for(var j = 0 , length = strokes[i].childNodes.length ;j < length;j++){
					strokesArray[i][j] = {};
				if(j == 0){
					lock = false;
				}else{
					lock = true;
				}
				var duration = +strokes[i].childNodes[j].getAttribute("deltaTime");
				startTime += duration;
				strokesArray[i][j].x = +strokes[i].childNodes[j].getAttribute("x") ;
				strokesArray[i][j].y = +strokes[i].childNodes[j].getAttribute("y") ;
				strokesArray[i][j].t = startTime ;
				strokesArray[i][j].l = lock ;
			}
		}
		changeXY(strokesArray,{
			charBoxWidth : W.canvas.width ,
			charRatio : 0.85 ,
			aspectRatio : 3 / 3 ,
			startPosition : {x : 0 , y : 0}
		});

	}

	var tamplate = 
	"<form>"+
		"<ul style = \"padding : 5% 10% \">"+
			"<li><p>gaoss<input name = \"gaoss\"  type = \"range\" max = \"2.0\"  min = \"1.0\"  step = \"0.1\" value = \"1.3\"  /></p></li>"+
			"<li><p>minPress<input name = \"minPress\"  type = \"range\" max = \"0.1\"  min = \"0.01\"  step = \"0.01\"  value = \"0.05\" /></p></li>"+
			"<li><p>maxPress<input name = \"maxPress\"  type = \"range\" max = \"0.5\"  min = \"0.1\"  step = \"0.01\"  value = \"0.2\" /></p></li>"+
			"<li><p>width<input name = \"width\"  type = \"range\" max = \"100\"  min = \"10\"   step = \"1\"  value = \"50\"  /></p></li>"+
		"</ul>"+
	"</form>";
	handwriting.addEventListener("click",function(){
		var setArguments = document.getElementById("setArguments");
		if(setArguments){document.body.removeChild(setArguments); setArguments = null ;return ;}
		else{
			var div = document.createElement("div");
			div.id = "setArguments";
			div.style.position = "absolute";
			div.style.width = "50%";
			div.style.right = "3%";
			div.style.top = "150px";
			div.style.backgroundColor = "rgba(240,239,136,0.5)";
			document.body.appendChild(div);
			div.innerHTML = tamplate ;
		}
		var form = document.forms[0];
		form.addEventListener("change",function(e){
			W.setArg(e.target.name,e.target.value);
			console.log(e.target.name,e.target.value);
		},false);
	},false);

})();