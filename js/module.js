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
  	var handwriting = document.getElementById("handwriting");
	var xmlChar = document.getElementById("xmlcharacter");
	var tmplate = "<form style=\"width:100%;height:50%;position:absolute;top:25%;\" ><lable style=\"position:relative;left:10%;display:block;\">请输入一个汉字:</lable><input id=\"input\" required style=\"display:block;position:relative;left:10%;width:80%;\" type= \"text\" />"+
				"<input id=\"yes\" type=\"button\" style=\"position : absolute;bottom:10%;left:10%;width:30%;height:20%\" value= \"确认\" /><input  id = \"cancel\" style=\"position : absolute;bottom:10%;left:60%;width:30%;height:20%;\" type=\"button\" value=\"取消\" /></form>";
	var divBubble = createElement("div",{
		position : "absolute",
		top : "30%",
		left : "30%",
		width : "40%",
		height : "40%",
		backgroundColor : "green",
		opacity : "0.8"
	});
	divBubble.id = "divBubble";

  	var loadXML = function (xmlFile) {
	// 加载xml文档
    	var xmlDoc;
	    var xmlhttp = new window.XMLHttpRequest();
        xmlhttp.open("GET",xmlFile,false);
        xmlhttp.send(null);
        if(xmlhttp.readyState == 4){
            xmlDoc = xmlhttp.responseXML.documentElement;
        }
    	return xmlDoc;
    }


	xmlChar.addEventListener('click',function(e){
		var xArray =[] , yArray = [], timeArray = [] , lockArray = [];
		if(!(document.getElementById("divBubble"))){
			document.body.appendChild(divBubble);
			divBubble.innerHTML = tmplate;
		}else{
			return ;
		} 
		var divCancel = document.getElementById("cancel");
		var divYes = document.getElementById("yes");
		divCancel.addEventListener('click',function(e){
			document.body.removeChild(divBubble);
		},false);

		divYes.addEventListener("click",function(e){
			var input = document.getElementById("input");
			if(input.value){
				var chars = input.value.split("");
				if(chars.length == 1){
					var path = "data\\"+chars[0]+".xml";
					var docXML = loadXML(path);
					var strokes = docXML.getElementsByTagName("Stroke");
					var lock = false;
					for(var i = 0;i < strokes.length;i++){
						var startMillisecond = strokes[i].getAttribute("startMillisecond").split("");
						while(startMillisecond.length < 3){
							startMillisecond.unshift(0);
						}
						var timeMillisecond = startMillisecond.join("");
						var startTime = +(strokes[i].getAttribute("startSecond") + timeMillisecond);
						for(var j = 0;j < strokes[i].childNodes.length;j++){
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
					///////////////////////////////
					W.logData();
					W.clearScreen();
					W.drawPointAll(W.$);
					// Math.max.apply(Math,a);
					
					document.body.removeChild(divBubble);


////////////////////////////////////////////
//这里面在整整
/////////////////////////////////////////////








				}else{
					alert("请输入一个汉字!");
					input.value = "";
				}
			}else{
				return ;
			}
		},false);

	},false);


	function createElement (el,attr){
		var element = document.createElement(el);
		switch(el){
			case "div" :
				for(var key in attr){
					element.style[key] = attr[key];
				}
			break;
		}
		return element;
	}//createElement

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
	
})();