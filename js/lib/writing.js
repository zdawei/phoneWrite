/*
* @fileoverview 此文件用于初始化毛笔字项目
* @author dawei | weiweicat333@gmail.com
* @describe 外抛方法：
* 运行模块 需要传递两个参数，canvas 用于写毛笔的node节点，image笔刷模型
* init : 初始化
* pushAll : push和计算剩余的节点，参数： 坐标点，时间值，lock笔画锁
* drawFrameWork : 汉字的框架点，参数：布尔值，true：绘制带有压力感应的框架点，false：绘制无压力感应的框架点
* animation : 汉字动画，参数：布尔值，true:绘制带有时间感应的动画，false：绘制无时间感应的动画
* nextChar : 获取下一个汉字数据，如果没有，就获取初始化的数据，并更新当前画板数据
* preChar : 获取前一个汉字数据，并更新当前画板数据
* setDraw : 绘制汉字（真正的绘制），参数，1.布尔值：true：按点绘制，false：按整字绘制，2.count值，如果第一个参数为true，需要此参数
* setArg : 通过页面的参数调节节点，设置汉字数据的初始值的综合方法，参数：1.需要修改初始值的名称，2.需要修改初始值的值
*          如果修改curve值的话，第3,4参数为setDraw所需的参数，
*		   如果修改color值的话，第3个参数为true,给setDraw传递值所需。
*		   如果修改其他值的话，第3个参数为：true，传递数值，false，传递字符串
* setChar : 把所有汉字数据存放到localstorage里
* revertChar : 撤销汉字一个笔画
* strokeAnalysis : 笔画分析，用不同的彩色绘制不同的笔画
* charMessage : 汉字数据的二维图信息
* writeChar : 打开画板写字权限，绘制当前汉字数据
* clearPrint : 清空画板并且清空当前汉字数据
* clearScreen : 清空画板
* writeParam : 更新参数表单的值
*/

define(['jquery', 'data', 'homeLib/setcanvas'], function($, d, s) {

	var $data = d();

	return function(canvas, image) {

		var ctx = canvas.getContext("2d");
		var data = $data.getData();
		var charMess = {
			curve : '1 order Bézier',
	  		gaoss : 1.3,//高斯初始值
	  		sigmoid : 3,//sigmoid初始值
	  		cos : 1,//余弦初始值
	    	acceleration : 0.5,
	  		minPress : 0.05,
	  		maxPress : 0.2,
	  		width : 50,
	    	density : 0.5,
	    	widthFunc : 'gaussian'
		};
		var opts = {
			setPosMess : null,
			threeCurve : 0,
			isWriteOpen : true,
		};

		var changeColorModel = function(color) {
			image.src = "img/model-" + color + ".png";//笔刷模型
		};

		var gaussian = function(v, gauss) {
		//高斯计算公式
		  return ((1 / (Math.sqrt(2 * Math.PI) * gauss)) * Math.pow(Math.E,-(v * v) / (2 * gauss * gauss)));
		};

		var gaussianPressure = function() {
			var ratio = data.maxPress / gaussian(0, data.gaoss);
			var speed = gaussian(data.speed[data.count - 1], data.gaoss);
			data.pressure[data.count - 1] = (ratio * speed);
			data.pressure[data.count - 1] = Math.max(Math.min(data.pressure[data.count - 1], data.maxPress), data.minPress);
			data.pressure[data.count - 1] = (data.pressure[data.count - 1] + data.pressure[data.count - 2]) / 2;
		};

		var sigmoidPressure = function() {
			var speed = data.width * 2 / (1 + Math.pow(Math.E, data.sigmoid * data.speed[data.count - 1]));
			data.pressure[data.count - 1] = speed;
			data.pressure[data.count - 1] = Math.max(Math.min(data.pressure[data.count - 1], data.maxPress), data.minPress);
			data.pressure[data.count - 1] = (data.pressure[data.count - 1] + data.pressure[data.count - 2]) / 2;	
		};

		var cosPressure = function() {
			// var v = Math.min(Math.max(data.speed[data.count - 1], 0), Math.PI / (4 * data.cos));
			// var speed = data.width * Math.cos(data.cos * v);console.log(speed / 300);
			var speed = data.width * Math.cos(data.cos * data.speed[data.count - 1]);
			data.pressure[data.count - 1] = speed;
			data.pressure[data.count - 1] = Math.max(Math.min(data.pressure[data.count - 1], data.maxPress), data.minPress);
			// data.pressure[data.count - 1] = Math.max(Math.min(data.pressure[data.count - 1] / 300, data.maxPress), data.minPress);
			data.pressure[data.count - 1] = (data.pressure[data.count - 1] + data.pressure[data.count - 2]) / 2;	
		};

		var accelerationPressure = function() {
			// var a = (data.speed[data.count - 1] - data.speed[data.count - 2]) / (data.time[data.count - 1] - data.time[data.count - 2]);
			// var g = Math.pow(Math.E, -data.acceleration * a);
			// var speed = data.width * g * Math.pow(Math.E, -Math.pow(data.speed[data.count - 1], 2) / (2 * Math.pow(data.acceleration, 2)));
			// console.log(speed);
			// data.pressure[data.count - 1] = speed;
			// data.pressure[data.count - 1] = Math.max(Math.min(data.pressure[data.count - 1], data.maxPress), data.minPress);
			// console.log(data.pressure[data.count - 1]);
			// data.pressure[data.count - 1] = (data.pressure[data.count - 1] + data.pressure[data.count - 2]) / 2;	
			var a = (data.speed[data.count - 1] - data.speed[data.count - 2]) / (data.time[data.count - 1] - data.time[data.count - 2]);
			var g = Math.pow(Math.E, -data.acceleration * a);
			var ratio = data.maxPress / gaussian(0, data.acceleration);
			var speed = gaussian(data.speed[data.count - 1], data.acceleration) * g;
			data.pressure[data.count - 1] = (ratio * speed);
			data.pressure[data.count - 1] = Math.max(Math.min(data.pressure[data.count - 1], data.maxPress), data.minPress);
			data.pressure[data.count - 1] = (data.pressure[data.count - 1] + data.pressure[data.count - 2]) / 2;
		};

	    var distance = function(x1, y1, x2, y2) {
			return (Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)));
	    };

		var parameter = function(x, y, t) {
		//剩余参数的计算函数
			var count = data.count;
			var distent = distance(data.x[count - 1], data.y[count - 1], data.x[count - 2], data.y[count - 2]);
			data.distance.push(distent);
			var timeGap = data.time[data.count - 1] - data.time[data.count - 2];
			if(timeGap == 0) {
				data.speed[data.count - 1] = data.speed[data.count - 2];
			} else {
				data.speed[data.count - 1] = distent / timeGap;
			}
			if(data.count > 2) {
				data.speed[data.count - 1] = data.speed[data.count - 1] * 0.6 + data.speed[data.count - 2] * 0.3 + data.speed[data.count - 3] * 0.1;
			}
		};

		function pushAll(x,y,time,lock) {
		  //只提供x,y,time,lock自动计算所有参数，并全部压入
		  data.x.push(x);
		  data.y.push(y);
		  data.time.push(time);
		  data.locks.push(lock);
		  data.count++;
		  if(!(data.locks[data.count - 1]) || data.count - 1 == 0){//加入每个笔画头一节点的初试值
		    data.speed.push(0);
		    data.pressure.push(data.maxPress);
		    data.distance.push(0);
		  }else{
		    parameter(x,y,time);//速度计算函数，包括计算距离并且加入了距离的值
		  	switch(data.widthFunc) {
		  		case "gaussian" : gaussianPressure(); break;
		  		case "sigmoid" : sigmoidPressure(); break;
		  		case "cos" : cosPressure(); break;
		  		case "acceleration" : accelerationPressure(); break;
		  	}
		  }
		}

		function drawPoint(count) {
  		//count是数组索引,注意count是从当前节点开始的,是从count-1到count的节点绘画
  		  var sampleNumber = parseInt(data.distance[count - 1] / data.density);
  		  for ( var u = 0 ; u < sampleNumber ; u++ ) {
  		    var t = u / (sampleNumber - 1);
  		    var x = ( 1.0 - t ) * data.x[count - 2] + t * data.x[count - 1];
  		    var y = ( 1.0 - t ) * data.y[count - 2] + t * data.y[count - 1];
  		    var w = ( 1.0 - t ) * data.pressure[count - 2] * data.width + t * data.pressure[count - 1] * data.width;
  		    ctx.drawImage( image , x - w , y - w , w * 2 , w * 2 );
  		  }
  		}

  		function drawPointAll() {
  		  for(var r = 0;r < data.count;r++) {
  		    if(data.locks[r]) {
  		      var sampleNumber = parseInt(data.distance[r] / data.density);
  		      for(var u = 0;u < sampleNumber;u++){
  		        var t = u / (sampleNumber - 1);
  		        var x = (1.0 - t) * data.x[r - 1] + t * data.x[r];
  		        var y = (1.0 - t) * data.y[r - 1] + t * data.y[r];
  		        var w = (1.0 - t) * data.pressure[r - 1] * data.width + t * data.pressure[r] * data.width;
  		        ctx.drawImage(image,x - w,y - w,w * 2,w * 2);
  		      }
  		    }
  		  }
  		}

  		function countSlope(x1, y1, x2, y2, x3, y3, x4, y4, count) {
  			var a = {}, b = {};
  			if(x3 - x1 == 0) {x3 += 0.1;}
  			if(x2 - x4 == 0) {x2 += 0.1;}
  			var preSlope = (y3 - y1) / (x3 - x1);//这点有点问题,无穷大的问题
  			var howlong = distance(x2, y2, x3, y3) / data.threeCurveDistance;
  			var pressureGap = (data.pressure[count - 2] - data.pressure[count -3]) / 3;
  			// y = preSlope * (x - x2) + y2;
  			// (y - y2) * (y - y2) + (x - x2) * (x - x2) = howlong * howlong;
  			// 两个式子代入，消去y
  			a.x = Math.sqrt((howlong * howlong) / (preSlope * preSlope + 1)) + x2;
  			a.y = preSlope * (a.x - x2) + y2;
  			a.w = data.pressure[count - 3] + pressureGap;
  			var endSlope = (y2-y4)/(x2-x4);
			b.x = Math.sqrt((howlong * howlong) / (endSlope * endSlope + 1)) + x3;
  			b.y = endSlope * (b.x - x3) + y3;  			
  			b.w = data.pressure[count -2] - pressureGap;
  			return {
  				a : a,
  				b : b
  			}
  		};

		var threeDraw = function(count) { 
			if(count < 4 || !data.locks[count - 2]) {return ;}
			var controlPots = countSlope(
				data.x[count - 4], data.y[count - 4], data.x[count - 3], data.y[count - 3],
				data.x[count - 2], data.y[count - 2], data.x[count - 1], data.y[count - 1], count);
			var sampleNumber, tempX, tempY, tempW;
			var d1 = data.distance[count - 1];
			sampleNumber = parseInt(d1 / data.density);
			for(var u=0; u<sampleNumber; u++) {
				var t = u/(sampleNumber-1);
				tempX = (1-t)*(1-t)*(1-t)*data.x[count - 3]
								+t*(1-t)*(1-t)*3*controlPots.a.x
								+t*t*(1-t)*3*controlPots.b.x
								+t*t*t*data.x[count - 2];
				tempY = (1-t)*(1-t)*(1-t)*data.y[count - 3]
								+t*(1-t)*(1-t)*3*controlPots.a.y
								+t*t*(1-t)*3*controlPots.b.y
								+t*t*t*data.y[count - 2];
				tempW = (1-t)*(1-t)*(1-t)*data.pressure[count - 3]
				 				+t*(1-t)*(1-t)*3*controlPots.a.w
			     				+t*t*(1-t)*3*controlPots.b.w
				 				+t*t*t*data.pressure[count - 2];
 				// tempW = Math.min(Math.max(tempW, data.minPress), data.maxPress);
 				// opts.threeCurve && (tempW = (tempW + opts.threeCurve) / 2);
				ctx.drawImage(image,tempX-tempW,tempY-tempW, data.width*2*tempW,data.width*2*tempW);
 				// opts.threeCurve = tempW
			}
		};

		function threeCurve(boolen, count) {
			if(boolen) {
				threeDraw(count);
			} else {
	  		  for(var r = 0;r < data.count;r++) {
  		    	threeDraw(r);
	  		  }
			}
		}

		var drawFrameWork = function(boolen) {
			writeOpen(false);
			clearScreen();
			ctx.beginPath();
			for(var r = 0 ; r < data.count ; r++) {
				if(data.locks[r]) {
					var distant = Math.max(parseInt(data.pressure[r] * 60) , 5);
					ctx.moveTo(data.x[r - 1],data.y[r - 1]);
					ctx.lineTo(data.x[r],data.y[r]);
					ctx.lineWidth = 1;
					boolen ? ctx.moveTo(data.x[r] + distant - 2,data.y[r] + distant - 2) :
							 ctx.moveTo(data.x[r] + 5 - 2,data.y[r] + 5 - 2);
					boolen ? ctx.arc(data.x[r],data.y[r],distant,0,2 * Math.PI,false) : 
							 ctx.arc(data.x[r],data.y[r],5,0,2 * Math.PI,false);
  				} else {
  					var distant = Math.max(parseInt(data.pressure[r] * 60) , 5);
  					ctx.moveTo(data.x[r],data.y[r]);
  					ctx.lineWidth = 1;
					boolen ? ctx.moveTo(data.x[r] + distant - 2,data.y[r] + distant - 2) :
							 ctx.moveTo(data.x[r] + 5 - 2,data.y[r] + 5 - 2);
					boolen ? ctx.arc(data.x[r],data.y[r],distant,0,2 * Math.PI,false) : 
							 ctx.arc(data.x[r],data.y[r],5,0,2 * Math.PI,false);  					
  				}
			}
			ctx.stroke();
		};

		function setDraw(boolen, count) {
			switch(data.curve) {
				case '1 order Bézier' : boolen ? drawPoint(count) : drawPointAll(); break;
				case '2 order Bézier' : break;
				case '3 order Bézier' : boolen ? threeCurve(boolen, count) : threeCurve(boolen);break;
			}
		}

		function setCountChar() {
  			//设置汉字提示符
  			if(!$('#tip').length) {return ;}
  			var account = $data.getCharsAccount() + 1;
  			var currentChar = $data.getDatasLength();
  			var totalChar = $data.getTotalChar();
  			if(currentChar == 0) {
  				$('#tip p').text('当前没写汉字！');
  			} else {
  				var mess = "当前第：" + account + "个汉字；已写：" + currentChar + "个汉字；总共：" + totalChar ;
  				$('#tip p').text(mess);
  			}
		}

		var nextChar = function() {
			if(data.count == 0) {alert('请输入汉字！'); return ;}
			$data.push();
			clearPrint();
			data = $data.next();
			for(var key in charMess) {
				data[key] = charMess[key];
			}
			data && data.count && setDraw(false);
			setCountChar();
		};

		function preChar() {
			if(data.count == 0) {alert('请输入汉字！'); return ;}
			$data.push();
			clearPrint();
			data = $data.pre();
			for(var key in charMess) {
				data[key] = charMess[key];
			}
			data && data.count && setDraw(false);
			setCountChar();
  		}

		var animation = function(boolen) {
		  //动画写字函数
		  writeOpen(false);
		  clearScreen();
		  var count = 0;
		  if(boolen) {
			  var time = data.time[count + 1] - data.time[count];
			  var animfunc = function() {
			    if(count++ >= data.count) {
			      	clearTimeout(handle);
			    } else {
			      	// drawPoint(count);
			      	setDraw(true, count);
			      	if(data.locks[count + 1]) {
			      		time = data.time[count + 1] - data.time[count];
			      	} else {
			      		count++;
			      		time = data.time[count + 1] - data.time[count];
			      	}
			    	setTimeout(animfunc, time); 
			    }
			  }
			  var handle = setTimeout(animfunc, time);
		  } else {
			var handle = setInterval(function() {
				if(count++ >= data.count) {
				  clearInterval(handle);
				}
				setDraw(true, count);
			},17);
		  }
		};

		function clearPrint() {
  		//清除画板，清空对象
  			if(!opts.isWriteOpen) {return;}
			$data.clear();  		  
  			ctx.clearRect(0,0,canvas.width,canvas.height);
  			s.qt(ctx);
  		}

		function clearScreen() {
  		//清除画板，清空对象
  			ctx.clearRect(0,0,canvas.width,canvas.height);
  			s.qt(ctx);
  		}

		function setArg(name,value, boolen, opt) {
		  //这个是通过滑动条设置参数的
		  // boolen是用来判断是从宽度函数过来的还是从参数过来的,最后判断是否应该转换为数字
		  if(name == 'curve') {
		  	data[name] = value; 
		  	charMess.curve = value;
		  	data['density'] = 0.2;
		  	clearScreen();
		  	setDraw(boolen, opt); 
		  	return ;
		  }
		  if(name == 'color') {changeColorModel(value);image.onload = function(){clearScreen();setDraw(boolen);}; return ;}
		  data[name] = boolen ? parseFloat(value) : value;
		  charMess[name] = boolen ? parseFloat(value) : value;
		  var original = cloneCharData(data);
		  clearPrint();
		  for(var i = 0 ; i < original.count ; i++) {
		    pushAll(original.x[i],original.y[i],original.time[i],original.locks[i]);
		    setDraw(true, i);
		  }
		  original = null;
		}

		var setChar = function() {
    		if($data.getDatasLength()) {
    		  $data.saveLocalStorage();
    		  return true;
    		} else {
    		  alert("没有汉字");
    		  return false;
    		}
		};

  		function cloneCharData(obj) {
  		//深度复制对象
  		  var result = {};
  		  for(var key in obj){
  		    result[key] = obj[key];
  		  }
  		  return result;
  		}

  		function setPositionMess() {
		    if($('#position').length) {
		    	clearTimeout(opts.setPosMess);
		    	var noMess = '当前没有坐标信息！';
		    	var mess = ' x:' + data.x[data.count -1].toFixed(0) + 
		    			   ' y:' + data.y[data.count - 1].toFixed(0) + 
		    			   ' speed:' + data.speed[data.count - 1].toFixed(5) +
		    			   ' pressure:' + data.pressure[data.count - 1].toFixed(5);
		    	$('#position p').text(mess);
		    	opts.setPosMess = setTimeout(function() {
		    		$('#position p').text(noMess);
		    	}, 1000);
		    }
  		}

  		function revertChar() {
  			if(data.count == 0 || !opts.isWriteOpen) {return ;}
  			for(var i = data.count - 1; data.locks[i] && i >= 0; i--) {
  				data.x.pop();
  				data.y.pop();
  				data.time.pop();
  				data.locks.pop();
  				data.distance.pop();
  				data.speed.pop();
  				data.pressure.pop();
    			data.count--;
  			}
			data.x.pop();
			data.y.pop();
			data.time.pop();
			data.locks.pop();
			data.distance.pop();
			data.speed.pop();
			data.pressure.pop();
			data.count--;
			clearScreen();
			setDraw(false);
  		}

  		function strokeAnalysis() {
  			writeOpen(false);
  			var colors = ['black','blue','green','purple','red','yellow','qing','gray1','gray2','gray3'];
  			var count = 0 , i = 0;
  			clearScreen();
  			var process = function() {
  				i++;
	  			for(;i < data.count && data.locks[i]; i++) {
	  					setDraw(true, i);
	  			}
	  			if(i < data.count) {
	  				preProcess();
	  			} else {
	  				changeColorModel(colors[0]);
	  				return ;
	  			}
  			};
  			var preProcess = function() {
  				if(i >= data.count) {changeColorModel(colors[0]);return;}
				changeColorModel(colors[count++ % colors.length]);
				image.onload = function() {
					process();
				}
  			};
  			preProcess();
  		}

  		function charMessage(count) {
  			if(count == 'all') {
  				allChar();
  				return ;
  			}
  			var account = Number(count);
  			var message = 0;
  			var i = 0;
  			var speed = [], pressure = [];
  			for(; i < data.count; i++) {
  				if(!data.locks[i]) {message++;}
  				if(message == account) {break;}
  			}
  			speed[0] = data.speed[i];
  			pressure[0] = data.pressure[i];
  			for(; data.locks[++i]; ) {
  				speed.push(data.speed[i]);
  				pressure.push(data.pressure[i]);
  			}
  			var ctx = canvas.getContext('2d');
  			var totalHeightUp = canvas.height - 100;
  			var totalHeightDown = 100;
  			var totalWidthUp = canvas.width - 20;
  			var totalWidthDown = 20;
  			ctx.clearRect(0,0,canvas.width,canvas.height);
  			writeOpen(false);
  			ctx.beginPath();
  			ctx.moveTo(totalWidthDown, totalHeightDown);
  			ctx.strokeStyle = "black";
  			ctx.lineTo(totalWidthDown, totalHeightUp);
  			ctx.lineTo(totalWidthUp, totalHeightUp);
  			ctx.lineWidth = 1;
  			ctx.stroke();
  			var canvasWidth = totalWidthUp - totalWidthDown;
  			var canvasHeight = totalHeightUp - totalHeightDown;
  			var maxPressure = Math.max.apply(Math, pressure);
  			var minPressure = Math.min.apply(Math, pressure);
  			var pressureGap = maxPressure - minPressure;
  			var maxSpeed = Math.max.apply(Math, speed);
  			var minSpeed = Math.min.apply(Math, speed);
  			var speedGap = maxSpeed - minSpeed;
  			var canvasGap = canvasWidth / speed.length;
  			var pressureX = [], pressureY = [], speedX = [], speedY = [];
  			for(var i = 0; i < speed.length; i++) {
  				pressureY[i] = totalHeightUp - (canvasHeight / pressureGap * pressure[i]);
  				pressureX[i] = i * canvasGap + totalWidthDown;
  				speedY[i] = totalHeightUp - (canvasHeight / speedGap * speed[i]);
  				speedX[i] = i * canvasGap + totalWidthDown;
  			}
  			var maxPressureY = Math.max.apply(Math, pressureY);  			
  			var maxSpeedY = Math.max.apply(Math, speedY);
  			var pressureYGap = totalHeightUp - maxPressureY;
  			var speedYGap = totalHeightUp - maxSpeedY;
  			for(var k = 0; k < speed.length; k++) {
  				pressureY[k] = pressureYGap > 0 ? pressureY[k] + pressureYGap : pressureY[k];
  				speedY[k] = speedYGap > 0 ? speedY[k] + speedYGap : speedY[k];
  				if(k > 0) {
  					ctx.beginPath();
  					ctx.moveTo(pressureX[k - 1], pressureY[k - 1]);
  					ctx.lineTo(pressureX[k], pressureY[k]);
  					ctx.lineWidth = 2;
  					ctx.strokeStyle = "blue";
  					ctx.stroke();
  					ctx.beginPath();
  					ctx.moveTo(speedX[k - 1], speedY[k - 1]);
  					ctx.lineTo(speedX[k], speedY[k]);
  					ctx.lineWidth = 1;
  					ctx.strokeStyle = "red";
  					ctx.stroke();
  				}
  			}
  			ctx.fillText("红线 ：速度", totalWidthUp - 80, totalHeightUp + 50);
  			ctx.fillText("蓝线 ：压力", totalWidthUp - 80, totalHeightUp + 70);

  		}

  		function charGraphicInit(jqNode) {
  			var count = 0, str= '';
  			var canvasW = canvas.width;
  			var canvasH = canvas.height;
  			var ratio = canvasW / canvasH;
  			var canvasWidth = 100;
  			var canvasHeight = canvasWidth / ratio;
  			jqNode.empty();window.data = data;
  			for(var i = 0; i < data.count; i++) {
  				if(!data.locks[i]) {
  					count++; 
  					str += '<canvas count="' + count + '" style="width:' + canvasWidth + 'px;height:' + canvasHeight + 'px;border:1px black solid;"></canvas>';
  				}
  			}
  			if(count != 1) {
  				str += '<canvas count="all" style="width:' + canvasWidth + 'px;height:' + canvasHeight + 'px;border:1px black solid;"></canvas>';
  			}
  			jqNode.append(str);
  			for(var writeCount = 1; writeCount <= count + 1; writeCount++) {
  				var c = (writeCount != count + 1) ? $('[count=' + writeCount + ']')[0] : $('[count=all]')[0];
  				if(count == 1) {c = $('[count=1]')[0];}
  				var ctx = c.getContext('2d');
  				var x = [],y = [],w = [];
  				for(var r = 0; r < data.count; r++) {
  					x[r] = data.x[r];
  					y[r] = data.y[r];
  					// w[r] = data.pressure[r];
  				}
  				var maxX = Math.max.apply(this, x);
	  			var minX = Math.min.apply(this, x);
	  			var maxY = Math.max.apply(this, y);
	  			var minY = Math.min.apply(this, y);
	  			// var minW = Math.min.apply(this, w);
	  			var gapW = maxX - minX;
	  			var gapH = maxY - minY;
	  			var canvasCount = 0;
	  			for(var k = 0; k < x.length; k++) {
	  				x[k] -= minX;
	  				y[k] -= minY;
	  				// w[k] -= minW;
  					x[k] = (x[k] / gapW) * (c.width);
  					y[k] = (y[k] / gapH) * (c.height);
  					// w[k] = (w[k] / (gapW * gapH)) * c.width * c.height;
  					!data.locks[k] && canvasCount++;
	                if(!data.locks[k]) {continue;}
	  		        var sampleNumber = 100;
  					ctx.beginPath();
  					ctx.moveTo(x[k - 1], y[k - 1]);
  					ctx.lineTo(x[k], y[k]);
  					ctx.lineWidth = 5;
  					ctx.strokeStyle = (canvasCount == writeCount) || (writeCount == count + 1)? 'red' : 'black';
  					ctx.stroke();
  		      		// for(var u = 0; u < sampleNumber; u++) {
  		      		//   	var t = u / (sampleNumber - 1);
  		      		//   	var x1 = (1.0 - t) * x[k - 1] + t * x[k];
  		      		//   	var y1 = (1.0 - t) * y[k - 1] + t * y[k];
  		      		//   	var w1 = (1.0 - t) * w[k - 1] + t * w[k];
  		      		//   	ctx.drawImage(image,x1 - w1,y1 - w1,w1 * 100,w1 * 100);
  		      		// }
  				}
  			}
  		}

  		function allChar() {
  			var ctx = canvas.getContext('2d');
  			var totalHeightUp = canvas.height - 100;
  			var totalHeightDown = 100;
  			var totalWidthUp = canvas.width - 20;
  			var totalWidthDown = 20;
  			ctx.clearRect(0,0,canvas.width,canvas.height);
  			writeOpen(false);
  			ctx.beginPath();
  			ctx.moveTo(totalWidthDown, totalHeightDown);
  			ctx.strokeStyle = "black";
  			ctx.lineTo(totalWidthDown, totalHeightUp);
  			ctx.lineTo(totalWidthUp, totalHeightUp);
  			ctx.lineWidth = 1;
  			ctx.stroke();
  			var canvasWidth = totalWidthUp - totalWidthDown;
  			var canvasHeight = totalHeightUp - totalHeightDown;
  			var maxPressure = Math.max.apply(Math, data.pressure);
  			var minPressure = Math.min.apply(Math, data.pressure);
  			var pressureGap = maxPressure - minPressure;
  			var maxSpeed = Math.max.apply(Math, data.speed);
  			var minSpeed = Math.min.apply(Math, data.speed);
  			var speedGap = maxSpeed - minSpeed;
  			var canvasGap = canvasWidth / data.count;
  			var pressureX = [], pressureY = [], speedX = [], speedY = [];
  			for(var i = 0; i < data.count; i++) {
  				pressureY[i] = totalHeightUp - (canvasHeight / pressureGap * data.pressure[i]);
  				pressureX[i] = i * canvasGap + totalWidthDown;
  				speedY[i] = totalHeightUp - (canvasHeight / speedGap * data.speed[i]);
  				speedX[i] = i * canvasGap + totalWidthDown;
  			}
  			var maxPressureY = Math.max.apply(Math, pressureY);  			
  			var maxSpeedY = Math.max.apply(Math, speedY);
  			var pressureYGap = totalHeightUp - maxPressureY;
  			var speedYGap = totalHeightUp - maxSpeedY;
  			for(var k = 0; k < data.count; k++) {
  				pressureY[k] = pressureYGap > 0 ? pressureY[k] + pressureYGap : pressureY[k];
  				speedY[k] = speedYGap > 0 ? speedY[k] + speedYGap : speedY[k];
  				if(k > 0) {
  					ctx.beginPath();
  					ctx.moveTo(pressureX[k - 1], pressureY[k - 1]);
  					ctx.lineTo(pressureX[k], pressureY[k]);
  					ctx.lineWidth = 2;
  					ctx.strokeStyle = "blue";
  					ctx.stroke();
  					ctx.beginPath();
  					ctx.moveTo(speedX[k - 1], speedY[k - 1]);
  					ctx.lineTo(speedX[k], speedY[k]);
  					ctx.lineWidth = 1;
  					ctx.strokeStyle = "red";
  					ctx.stroke();
  				}
  			}
  			ctx.fillText("红线 ：速度", totalWidthUp - 80, totalHeightUp + 50);
  			ctx.fillText("蓝线 ：压力", totalWidthUp - 80, totalHeightUp + 70);
  		}

  		function writeChar() {
  			if(!opts.isWriteOpen) {
  				clearScreen();
  				writeOpen(true);
  				setDraw(false);
  			}
  		}

  		var canvasEvt = {

			lock : false,

			touch : ("ontouchstart" in document),

  			StartEvent : function(e) {
			    var t = canvasEvt.touch ? e.touches[0] : e;
			    var x = t.pageX - t.target.offsetLeft;
			    var y = t.pageY - t.target.offsetTop;
			    var time = new Date().getTime();
			    pushAll(x,y,time,false);
			    canvasEvt.lock = true;
  			},

  			MoveEvent : function(e) {
			    if(canvasEvt.lock){
			      var t = canvasEvt.touch ? e.touches[0] : e;
			      var x = t.pageX - t.target.offsetLeft;
			      var y = t.pageY - t.target.offsetTop;
			      var time = new Date().getTime();
			      pushAll(x,y,time,true);
			      setDraw(true, data.count);
			      setPositionMess();
			    }
  			},

  			mouseout : function(e) {
		    	canvasEvt.lock = false;
  			},

  			EndEvent : function(e) {
		    	canvasEvt.lock = false;
  			}
  		}

		var writeOpen = function(boolen) {
		  //canvas上书写的事件绑定函数
		  opts.isWriteOpen = boolen;
		  var touch = ("ontouchstart" in document);
		  var StartEvent = touch ? "touchstart" : "mousedown";
		  var MoveEvent = touch ? "touchmove" : "mousemove";
		  var EndEvent = touch ? "touchend" : "mouseup";
		  if(boolen) {
			  canvas.addEventListener(StartEvent, canvasEvt.StartEvent, false);
			  canvas.addEventListener(MoveEvent, canvasEvt.MoveEvent, false);
			  canvas.addEventListener("mouseout", canvasEvt.mouseout, false);
			  canvas.addEventListener(EndEvent, canvasEvt.EndEvent, false);
		  } else {
			  canvas.removeEventListener(StartEvent, canvasEvt.StartEvent, false);
			  canvas.removeEventListener(MoveEvent, canvasEvt.MoveEvent, false);
			  canvas.removeEventListener("mouseout", canvasEvt.mouseout, false);
			  canvas.removeEventListener(EndEvent, canvasEvt.EndEvent, false);
		  }
		};

		var writeParam = function(lis) {
			for(var i = 0; i < lis.length; i++) {
				var input = lis[i].querySelector('input');
				input.value = data[input.name];
			}
		};

		var init = function() {
			writeOpen(true);
		};

		var that = {
			init : init,
			pushAll : pushAll,
			drawFrameWork : drawFrameWork,
			animation : animation,
			nextChar : nextChar,
			preChar : preChar,
			setDraw : setDraw,
			setArg : setArg,
			setChar : setChar,
			revertChar : revertChar,
			strokeAnalysis : strokeAnalysis,
			charMessage : charMessage,
			charGraphicInit : charGraphicInit,
			writeChar : writeChar,
			writeParam : writeParam,
			clearPrint : clearPrint,
			clearScreen : clearScreen
		};

		return that;

	};
});