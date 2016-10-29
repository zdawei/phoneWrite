define(['jquery', 'lib/writing'], function($, w) {

	return function(canvas, image) {

		var write = w(canvas, image);
		var script;

		var fn = {
			loadJsonp : function(file) {
				// 跨域访问JSONP
				script = document.body.removeChild(script);
				script = null;
				script = document.createElement("script");//用于jsonp
				script.src = file;
				document.body.appendChild(script);
			},

			changeXY : function(strokeArray, opts) {
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
						write.pushAll( strokeArray[i][j].x , strokeArray[i][j].y , strokeArray[i][j].t , strokeArray[i][j].l );
						
					}
				}
			},

			drawPoint : function(docXML){
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
		
			},

			xmlcharacterLocal : function() {
				var char = prompt("请输入一个汉字","张");
				if(!char) return ;
				if(!char.length || char.length > 1){alert("输入有误!"); return arguments.callee();}
				var path = "data\/datajs\/datajs\/"+char+".js";
				// var path = "http://202.112.195.243/canvas/phoneWrite/datajs/"+char+".js";
				// var docXML = loadXML(path);
				fn.loadJsonp(path);
				script.onload = function() {
					setTimeout(function() {
						if("undefined" == typeof data) {alert("输入有误!");return ;}
						fn.changeXY(data, {
							charBoxWidth : canvas.width ,
							charRatio : 0.85 ,
							aspectRatio : 4 / 3 ,
							startPosition : {x : 0 , y : 0}
						},500);
						// drawPoint (docXML);
						write.clearScreen();
						write.setDraw(false);
					},500);//为了cordova加入了时间延迟，要不然会有读取汉字库显示出以前的汉字的bug
				}
			},

			outlinecharacterLocal : function() {
				var char = prompt("请输入一个汉字","张");
				if(!char) return ;
				if(!char.length || char.length > 1){alert("输入有误!"); return arguments.callee();}
				var path = "data\/datajs\/datajs\/"+char+".js";
				// var path = "http://202.112.195.243/canvas/phoneWrite/datajs/"+char+".js";
				// var docXML = loadXML(path);
				fn.loadJsonp(path);
				script.onload = function() {
					setTimeout(function() {
						if("undefined" == typeof data) {alert("输入有误!");return ;}
						fn.changeXY(data, {
							charBoxWidth : canvas.width ,
							charRatio : 0.85 ,
							aspectRatio : 4 / 3 ,
							startPosition : {x : 0 , y : 0}
						},500);
						// drawPoint (docXML);
						write.clearScreen();
						write.setDraw(false);
					},500);//为了cordova加入了时间延迟，要不然会有读取汉字库显示出以前的汉字的bug
				}
			},

			formProcess : function(idStr) {
				var paramNode = $('#widthParam');
				switch(idStr) {
					case 'gaussian' : paramNode.html('<p>gaoss<input name = \"gaoss\"  type = \"range\" max = \"2.0\"  min = \"1.0\"  step = \"0.1\" value = \"1.3\"  /></p>'); break;
					case 'sigmoid' : paramNode.html('<p>sigmoid<input name = \"sigmoid\"  type = \"range\" max = \"10.0\"  min = \"1.0\"  step = \"1\" value = \"3\"  /></p>'); break;
					case 'cos' : paramNode.html('<p>cos<input name = \"cos\"  type = \"range\" max = \"2.0\"  min = \"0.1\"  step = \"0.1\" value = \"1\"  /></p>'); break;
					case 'acceleration' : paramNode.html('<p>acceleration<input name = \"acceleration\"  type = \"range\" max = \"10.0\"  min = \"0.1\"  step = \"0.1\" value = \"0.5\"  /></p>'); break;
				}
			},

			formFunc : function() {
				var forms = document.forms;
				forms[0].addEventListener("click",function(e) {
					switch($(e.target).text()) {
						case "time" : write.animation(true);break;
						case "normal" : write.animation(false);break;
					}
				},false);				
				forms[1].addEventListener("click",function(e) {
					switch($(e.target).text()) {
						case "pressure" : write.drawFrameWork(true);break;
						case "normal" : write.drawFrameWork(false);break;
					}
				},false);				
				forms[2].addEventListener("change",function(e) {
					write.setArg(e.target.name,e.target.value, true);
				},false);
				forms[3].addEventListener("click",function(e) {
					fn.formProcess($(e.target).text());
					write.setArg('widthFunc', $(e.target).text(), false);
				},false);
				forms[4].addEventListener("click",function(e) {
					write.setArg('curve', $(e.target).text(), false);
				},false);
				forms[5].addEventListener("click",function(e) {
					write.setArg('color', $(e.target).text(), false);
				},false);
			},

			animation : function() {
  			  //动画写字函数
  				$('#whichCanvas p').text('动画');
  			},

  			clearPrint : function() {
  				write.clearPrint();
  			},

			framework : function() {
			  //顶导的笔画框架
			  	$('#whichCanvas p').text('框架');
				write.drawFrameWork();
			},

			nextChar : function() {
				write.nextChar();
  			},

  			preChar : function() {
  				write.preChar();
  			},

  			setChar : function() {
  				if(write.setChar()) {
					var w = window.open("second.html","_self");
  				}
  			},

  			reload : function() {
  				location.reload();
  			},

  			revertChar : function() {
  				write.revertChar();
  			},

  			strokeAnalysis : function() {
  				$('#whichCanvas p').text('笔画');
  				write.strokeAnalysis();
  			},

  			charMessage : function() {
  				$('#whichCanvas p').text('二维信息');
  				write.charMessage();
  			},

  			writeChar : function() {
  				$('#whichCanvas p').text('写字');
  				write.writeChar();
  			}

		};

		var init = function() {
			//添加事件代理
			write.init();//write模块的初始化
			script = document.createElement("script");//用于jsonp
			document.body.appendChild(script);
			fn.formFunc();//表单绑定事件
			$('.bindEvt').on('click', function(evt) {
				switch($(evt.target).attr('id')) {
					case "xmlcharacter" : fn.xmlcharacterLocal();break;
					case "prechars" : fn.preChar();break;
					case "btnClear" : fn.clearPrint();break;
					case "nextchars" : fn.nextChar();break;
					case "setChar" : fn.setChar();break;
					case "reload" : fn.reload();break;
					case "revertChar" : fn.revertChar();break;
					case "strokeAnalysis" : fn.strokeAnalysis();break;
					case "charMessage" : fn.charMessage();break;
					case "writeChar" : fn.writeChar();break;
					case "animation" : fn.animation();break;
					case "framework" : fn.framework();break;
				}
			});
		};

		var that = {init : init}
		return that;
	};
});