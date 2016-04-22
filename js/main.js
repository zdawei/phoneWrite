function parameter(){
	this.x=[];
	this.y=[];
	this.time=[];
	this.pressure=[];
	this.count=0;
}
parameter.prototype={
	constructor:parameter,
	pushAll:function(x,y,time){
		this.x.push(x);
		this.y.push(y);
		this.time.push(time);
		this.count++;
		if(this.x.length>1){
			this.pressure.push(Math.sqrt(Math.pow(this.x[this.x.length-1]-this.x[this.x.length-2],2)+Math.pow(this.y[this.y.length-1]-this.y[this.y.length-2],2))/(this.time[this.count-1]-this.time[this.count-2]));
		}else{
			this.pressure.push(0);
		}
	},
	clearAll:function(){
		this.x=[];
		this.y=[];
		this.time=[];
		this.pressure=[];
		this.count=0;
	}
};
/************************************************************/
var canvas=document.getElementById("writing");
var ctx=canvas.getContext("2d");
function screencanvas(){	
	canvas.width=document.documentElement.clientWidth;
	canvas.height=document.documentElement.clientHeight-55;
	qt();
}
window.addEventListener("load",screencanvas,true);
window.addEventListener("resize",screencanvas,true);
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
function qt(){
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
/****************************************************************/
var image=document.getElementById("model");
document.body.addEventListener('touchmove', function (event) {event.preventDefault();}, false);//固定页面
touch =("createTouch" in document);
StartEvent = touch ? "touchstart" : "mousedown";
MoveEvent = touch ? "touchmove" : "mousemove";
EndEvent = touch ? "touchend" : "mouseup";
var charData=new parameter();
var lock=false;
canvas['on'+StartEvent]=function(e){
 	var t=touch ? e.touches[0] : e; 
	var x=t.pageX-t.target.offsetLeft;
	var y=t.pageY-t.target.offsetTop;
	var time=new Date().getTime();
	charData.pushAll(x,y,time);
	lock=true;
}
canvas['on'+MoveEvent]=function(e){
	if(lock){
	  var t=touch ? e.touches[0] : e;
		var x=t.pageX-t.target.offsetLeft;
		var y=t.pageY-t.target.offsetTop;	  
		var time=new Date().getTime();
		charData.pushAll(x,y,time);
		drawPoint(charData.count-1,charData);
	}
}
canvas.onmouseout=function(e){
	lock=false;
}
canvas['on'+EndEvent]=function(e){
	lock=false;
}
/*****************************************************************/
function drawPoint(r,d){
		var a1=jl(d.x[r-1],d.y[r-1],d.x[r],d.y[r]);
		var sampleNumber=parseInt(a1/0.5);
	if(locks[r-1]&& r ==1){
		for(var u=0;u<sampleNumber;u++){
			var t=u/(sampleNumber-1);
			var x1=(1.0-t)*x[r-1]+t*x[r];
			var y1=(1.0-t)*y[r-1]+t*y[r];
			var w1=(1.0-t)*w[r-1]+t*w[r];	
			ctx.drawImage(image,x1-w1,y1-w1,w1*2,w1*2);  		
		}
	}
if(locks[r-2] && r>1&&locks[r-1]){	
		var xFirst = (x[r-2] + x[r-1]) * 0.5; 
		var yFirst = (y[r-2] + y[r-1]) * 0.5; 
		var wFirst = (w[r-2] + w[r-1]) * 0.5; 

		var xSecond = (x[r] + x[r-1]) * 0.5; 
		var ySecond = (y[r] + y[r-1]) * 0.5; 
		var wSecond = (w[r] + w[r-1]) * 0.5; 
			//Now we perform a Beizer evaluation 	
		for(var u = 0; u < sampleNumber; u++){
			var t = u/(sampleNumber-1);
				
			var x1=(1.0-t)*(1.0-t)*xFirst + 2 * t * (1-t) * x[r-1] + t * t * xSecond;
			var y1=(1.0-t)*(1.0-t)*yFirst + 2 * t * (1-t) * y[r-1] + t * t * ySecond;
			var w1=(1.0-t)*(1.0-t)*wFirst + 2 * t * (1-t) * w[r-1] + t * t * wSecond;
				
			ctx.drawImage(image,x1-w1,y1-w1,w1*2,w1*2);  		
		}
	}
}	
function jl(x1,y1,x2,y2){//距离函数
	return (Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)));
}///////////////距离函数	
//use gaussian function to simulate the distribution 	
function sudu1(v1){
	return ((1/(Math.sqrt(2*Math.PI)*r1))*Math.pow(Math.E,-(v1*v1)/(2*r1*r1)));
}