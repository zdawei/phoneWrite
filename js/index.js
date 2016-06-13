var handwritting = function(){

  var image =document.createElement("img");
  image.src="img/model.png";
  var btnClear=document.getElementById("btnClear");
  var btnSave=document.getElementById("btnSave");
  var nextchars=document.getElementById("nextchars");
  var renew=document.getElementById("renew");
  var canvas=document.createElement("canvas");
  canvas.id="writing";
  document.body.insertBefore(canvas,document.body.lastChild);
  var ctx=canvas.getContext("2d");
  var currentChar=0,totalchar=15;
  var div=document.getElementById("tip");
  var countChar=div.firstChild.firstChild;
  var canvasURLArray=[],charDatas=[];
  document.body.addEventListener('touchmove', function (event) {event.preventDefault();}, false);//固定页面
  var $ = {
  	x = [],//x坐标
  	y = [],//y坐标
  	time = [],//时间
    count = 0,//数组索引
    locks = [],//汉字锁数组，用来防止笔画之间的链接,还可以用来计算出笔画数
  	speed = [],//速度
  	pressure = [],//压力
  	distance = [],//距离
  	//以下是参数设置
  	gaoss = 1.3,//高斯初始值
  	minPress = 0.05,
  	maxPress = 0.2,
  	width = 50
  };

  var gaussian = function(v, gauss) {
		return ((1 / (Math.sqrt(2 * Math.PI) * gauss)) * Math.pow(Math.E,-(v * v) / (2 * gauss * gauss)));
	}
	var parameter = function(){
		var ratio = $.maxPress / gaussian(0,$.gaoss);
		var time = $.time[$.count - 1] - $.time[$.count - 2];
		var distance = Math.sqrt(Math.pow($.x[$.count - 1] - $.x[$.count - 2],2) +
			Math.pow($.y[$.count - 1] - $.y[$.count - 2],2));
		$.distance.push(distance);
		if(time == 0){
			$.speed[$.count - 1] = $.speed[$.count - 2];
		}else{
			$.speed[$.count - 1] = distance / time;
		}
		if($.count > 2){
			$.speed[$.count - 1] = $.speed[$.count - 1] * 0.6 + $.speed[$.count - 2] * 0.3 + $.speed[$.count - 3] * 0.1;
		}
		var speed = gaussian($.speed[$.count - 1],$.gaoss);
		$.pressure[$.count - 1] = (ratio * speed);
		if($.pressure[$.count - 1] < $.minPress){
			$.pressure[$.count - 1] = $.minPress;
		}
		$.pressure[$.count - 1] = ($.pressure[$.count - 1] + $.pressure[$.count - 2]) / 2;
	}

  function dl(context,x1,y1,x2,y2,dashLength){
  	dashLength=dashLength===undefined?5:dashLength;
  	var deltaX=x2-x1;
  	var deltaY=y2-y1;
  	var numDashes=Math.floor(Math.sqrt(deltaX*deltaX+deltaY*deltaY)/dashLength);
  	for(var i=0;i<numDashes;++i){
  		context[i%2===0?'moveTo':'lineTo']
  		(x1+(deltaX/numDashes)*i,y1+(deltaY/numDashes)*i);
  	}
  	context.stroke();
  }
  function qt(ctx){
  ctx.beginPath();
  ctx.strokeStyle='black';
  ctx.lineWidth=1.5;
  ctx.moveTo(0,ctx.canvas.height/2);
  ctx.lineTo(ctx.canvas.width,ctx.canvas.height/2);
  ctx.moveTo(ctx.canvas.width/2,0);
  ctx.lineTo(ctx.canvas.width/2,ctx.canvas.height);
  ctx.stroke();
  ctx.lineWidth=0.5;
  dl(ctx,0,0,ctx.canvas.width,ctx.canvas.height,10);
  dl(ctx,0,ctx.canvas.height,ctx.canvas.width,0,10);
  ctx.closePath();
  }
  function screencanvas(){
  	var btnClear=document.getElementById("btnClear");
  	canvas.width=parseInt(document.body.clientWidth);
  	canvas.height=parseInt(document.body.offsetHeight)-parseInt(btnClear.offsetHeight)*2-5;
  	qt(ctx);
  }
  window.addEventListener("load",screencanvas,true);
  window.addEventListener("resize",screencanvas,true);

  function clearPrint(){
    $.x=[];
    $.y=[];
    $.time=[];
    $.speed=[];
    $.pressure=[];
    $.count=0;
    $.distance=[];
    $.locks=[];
    ctx.clearRect(0,0,canvas.width,canvas.height);
    qt(ctx);
  }

  function cloneCharData(obj){
    var result = {};
    for(var key in obj){
      result[key] = obj[key];
    }
    return result;
  }

  btnClear.addEventListener("click",clearPrint,false);
  nextchars.addEventListener("click",function(){
  	currentChar++;
  	if(currentChar<=totalchar){
  		countChar.nodeValue="第"+currentChar+"个汉字";
  	}else if(currentChar>totalchar){
  		countChar.nodeValue="第"+(--currentChar)+"个汉字";
  		return alert("字数超过限制");
  	}
    var tmpCharData = cloneCharData($);
    charDatas.push(tmpCharData);
    clearPrint();
  },false);

  return {

    ctx:ctx,

    pushAll:function(x,y,time,lock){
      //只提供x,y,time,lock自动计算所有参数，并全部压入
      $.x.push(x);
      $.y.push(y);
      $.time.push(time);
      $.locks.push(lock);
      $.count++;
      if(!($.locks[$.count - 1]) || $.count - 1 == 0){//加入每个笔画头一节点的初试值
        $.speed.push(0);
        $.pressure.push($.maxPress);
        $.distance.push(0);
      }else{
        parameter();//速度计算函数，包括计算距离并且加入了距离的值
      }
    },

    clearCharData:function(){
  		$.x=[];
  		$.y=[];
  		$.time=[];
  		$.speed=[];
  		$.pressure=[];
  		$.count=0;
  		$.distance=[];
  		$.locks=[];
  	},

    clearPrint:clearPrint,

    function drawPoint(count,d){
      // d是charData对象,count是数组索引
    		var sampleNumber=parseInt(d.distance[count]/0.5);
    		for(var u=0;u<sampleNumber;u++){
    			var t=u/(sampleNumber-1);
    			var x=(1.0-t)*d.x[count-1]+t*d.x[count];
    			var y=(1.0-t)*d.y[count-1]+t*d.y[count];
    			var w=(1.0-t)*d.pressure[count-1]*d.width+t*d.pressure[count]*d.width;
    			ctx.drawImage(image,x-w,y-w,w*2,w*2);
    		}
    },

    function drawPointAll(d){
      // d是charData对象，r是数组索引
    	for(var r=0;r<d.count;r++){
    		if(d.locks[r]){
    			var sampleNumber=parseInt(d.distance[r]/0.5);
    			for(var u=0;u<sampleNumber;u++){
    				var t=u/(sampleNumber-1);
    				var x=(1.0-t)*d.x[r-1]+t*d.x[r];
    				var y=(1.0-t)*d.y[r-1]+t*d.y[r];
    				var w=(1.0-t)*d.pressure[r-1]*d.width+t*d.pressure[r]*d.width;
    				ctx.drawImage(image,x-w,y-w,w*2,w*2);
    			}
    		}
    	}
    }

  };//return
}();
