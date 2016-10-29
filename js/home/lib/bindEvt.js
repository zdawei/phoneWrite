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

			changeXY : function(data) {
				var x = [], y = [], t = [], l = [];
				var width = canvas.width;
				var height = canvas.height;
				var ratio = 30;
				for(var i = 0; i < data.length; i++) {
					for(var j = 0; j < data[i].length; j++) {
						x.push(data[i][j].x);
						y.push(data[i][j].y);
						t.push(data[i][j].t);
						l.push(data[i][j].l);
					}
				}
				var maxX = Math.max.apply(Math, x);
				var minX = Math.min.apply(Math, x);
				var maxY = Math.max.apply(Math, y);
				var minY = Math.min.apply(Math, y);
				for(var r = 0; r < x.length; r++) {
					x[r] -= minX;
					y[r] -= minY;
				}
				var xGap = maxX - minX;
				var yGap = maxY - minY;
				for(var k = 0; k < x.length; k++) {
					var x1 = (width - 2 * ratio) / xGap * x[k] + ratio;
					var y1 = (height - 2 * ratio) / yGap * y[k] + ratio;
					write.pushAll(x1, y1, t[k], l[k]);
				}
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
						fn.changeXY(data);
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