define(['jquery', 'data', 'homeLib/setcanvas'], function($, d, s) {

	var $data = d();

	return function(canvas, image) {

		var ctx = canvas.getContext("2d");
		var data = $data.getData();

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

		function pushAll(x,y,time,lock, widthValue) {
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

		var drawFrameWork = function(boolen) {
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

		var nextChar = function() {
			if(data.count == 0) {alert('请输入汉字！'); return ;}
			$data.push();
			clearPrint();
			data = $data.next();
			data && data.count && drawPointAll();
		};

		function preChar() {
			if(data.count == 0) {alert('请输入汉字！'); return ;}
			$data.push();
			clearPrint();
			data = $data.pre();
			data && data.count && drawPointAll();
  		}

		var animation = function(boolen) {
		  //动画写字函数
		  clearScreen();
		  var count = 0;
		  if(boolen) {
			  var time = data.time[count + 1] - data.time[count];
			  var animfunc = function() {
			    if(count++ >= data.count) {
			      	clearTimeout(handle);
			    } else {
			      	drawPoint(count);
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
				drawPoint(count);
			},17);
		  }
		};

		function clearPrint() {
  		//清除画板，清空对象
			$data.clear();  		  
  			ctx.clearRect(0,0,canvas.width,canvas.height);
  			s.qt(ctx);
  		}

		function clearScreen() {
  		//清除画板，清空对象
  			ctx.clearRect(0,0,canvas.width,canvas.height);
  			s.qt(ctx);
  		}

		function setArg(name,value, boolen) {
		  //这个是通过滑动条设置参数的
		  // boolen是用来判断是从宽度函数过来的还是从参数过来的,最后判断是否应该转换为数字
		  data[name] = boolen ? parseFloat(value) : value;
		  var original = cloneCharData(data);
		  clearPrint();
		  for(var i = 0 ; i < original.count ; i++) {
		    pushAll(original.x[i],original.y[i],original.time[i],original.locks[i]);
		    drawPoint(i);
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
		
		var writeOpen = function() {
		  //canvas上书写的事件绑定函数
		  var touch = ("ontouchstart" in document);
		  var StartEvent = touch ? "touchstart" : "mousedown";
		  var MoveEvent = touch ? "touchmove" : "mousemove";
		  var EndEvent = touch ? "touchend" : "mouseup";
		  var lock = false;
		  canvas.addEventListener(StartEvent, function(e) {
		    var t = touch ? e.touches[0] : e;
		    var x = t.pageX - t.target.offsetLeft;
		    var y = t.pageY - t.target.offsetTop;
		    var time = new Date().getTime();
		    pushAll(x,y,time,false);
		    lock = true;
		  }, false);
		  canvas.addEventListener(MoveEvent, function(e) {
		    if(lock){
		      var t = touch ? e.touches[0] : e;
		      var x = t.pageX - t.target.offsetLeft;
		      var y = t.pageY - t.target.offsetTop;
		      var time = new Date().getTime();
		      pushAll(x,y,time,true);
		      drawPoint(data.count);
		    }
		  }, false);
		  canvas.addEventListener("mouseout", function() {
		    lock = false;
		  }, false);
		  canvas.addEventListener(EndEvent, function(e) {
		    lock = false;
		  }, false);
		};

		var init = function() {
			writeOpen();
		};

		var that = {
			init : init,
			pushAll : pushAll,
			drawFrameWork : drawFrameWork,
			animation : animation,
			nextChar : nextChar,
			preChar : preChar,
			drawPoint : drawPoint,
			drawPointAll : drawPointAll,
			setArg : setArg,
			setChar : setChar,
			clearPrint : clearPrint,
			clearScreen : clearScreen
		};

		return that;

	};
});