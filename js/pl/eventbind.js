(function() {
	var W = _.W;
	var strokesArray = [];//将来可能添加设置参数，所以把这个提出来了
	var script = document.createElement("script");
	document.body.appendChild(script);

	var loadXML = function (xmlFile) {
		// 加载xml文档
		var xmlDoc;
	    var xmlhttp = new XMLHttpRequest();
	    xmlhttp.open("get",xmlFile,false);
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
	};

	var loadJsonp = function(file){
		// 跨域访问JSONP
		document.body.removeChild(script);
		script.src = file;
		if("undefined" != typeof data){ data = [];}
		document.body.appendChild(script);
	};

	var xmlcharacter = function(){
		var char = prompt("请输入一个汉字","张");
		if(!char) return ;
		if(!char.length || char.length > 1){alert("输入有误!"); return arguments.callee();}
		// var path = "datajs\/"+char+".js";
		var path = "http://202.112.195.243/canvas/phoneWrite/datajs/"+char+".js";
		// var docXML = loadXML(path);
		loadJsonp(path);
		setTimeout(function(){
			if("undefined" == typeof data) {alert("输入有误!");return ;}
			changeXY(data,{
			charBoxWidth : W.canvas.width ,
			charRatio : 0.85 ,
			aspectRatio : 4 / 3 ,
			startPosition : {x : 0 , y : 0}
			},500);
			// drawPoint (docXML);
			W.clearScreen();
			W.drawPointAll();
		},500);//为了cordova加入了时间延迟，要不然会有读取汉字库显示出以前的汉字的bug
	};

	var changeXY = function(strokeArray, opts) {
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
	};

	var drawPoint = function(docXML){
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
			aspectRatio : 4 / 3 ,
			startPosition : {x : 0 , y : 0}
		});

	};

	var handwriting = function(){
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
			div.innerHTML = _.template.parameter ;
		}
		var form = document.forms[0];
		form.addEventListener("change",function(e){
			W.setArg(e.target.name,e.target.value);
			console.log(e.target.name,e.target.value);
		},false);
	};




	document.body.addEventListener("click",function(evt){
		//添加事件代理
		switch(evt.target.id){
			case "xmlcharacter" : xmlcharacter();break;
			case "handwriting" : handwriting();break;
			case "animation" : W.animation();break;
			case "framework" : W.framework();break;
			case "prechars" : W.preChar();break;
			case "btnClear" : W.clearPrint();break;
			case "nextchars" : W.nextchar();break;
			case "setChar" : W.setChar();break;
		}
	},false);
})();