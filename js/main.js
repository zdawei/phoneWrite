//parameter对象保存着一个汉字的所有信息
function parameter(){
	this.x=[];//x坐标
	this.y=[];//y坐标
	this.time=[];//时间
	this.speed=[];//速度
	this.pressure=[];//压力
	this.count=0;//数组索引
	this.distance=[];//距离
	//以下是初始值
	this.gaoss=1.3;//高斯初始值
	this.minPress=0.05;
	this.maxPress=0.3;
}
parameter.prototype={
	constructor:parameter,
	pushAll:function(x,y,time){
		this.x.push(x);
		this.y.push(y);
		this.time.push(time);
		this.count++;
		if(this.count<=1){//加入初试值
			this.pressure.push(this.maxPress);
			this.speed.push(0);
			this.distance.push(0);
		}else{
			this.chars();//速度计算函数，包括计算距离并且加入了距离的值
		}
	},//压入x,y,time进入parameter对象
	gaussian: function(v, gauss) {
		return ((1/(Math.sqrt(2*Math.PI)*gauss))*Math.pow(Math.E,-(v*v)/(2*gauss*gauss)));
	},
	chars:function(){
		var ratio=this.maxPress/this.gaussian(0,this.gaoss);
		var time=this.time[this.count-1]-this.time[this.count-2];
		var distance=Math.sqrt(Math.pow(this.x[this.count-1]-this.x[this.count-2],2)+
			Math.pow(this.y[this.count-1]-this.y[this.count-2],2));
		this.distance.push(distance);
		if(time==0){
			this.speed[this.count-1]=this.speed[this.count-2]
		}else{
			this.speed[this.count-1]=distance/time;
		}
		if(this.count>2){
			this.speed[this.count-1]=this.speed[this.count-1]*0.6+this.speed[this.count-2]*0.3+this.speed[this.count-3]*0.1;
		}
		var speed=this.gaussian(this.speed[this.count-1],this.gaoss);
		this.pressure[this.count-1]=(ratio*speed);
		if(this.pressure[this.count-1]<this.minPress){
			this.pressure[this.count-1]=this.minPress;
		}
		this.pressure[this.count-1]=(this.pressure[this.count-1]+this.pressure[this.count-2])/2;
	},
	clearAll:function(){
		this.x=[];
		this.y=[];
		this.time=[];
		this.speed=[];
		this.pressure=[];
		this.count=0;
		this.distance=[];
	}
};
/************************************************************/
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
(function (){
function screencanvas(){	
	var canvas=document.getElementById("writing");
	var ctx=canvas.getContext("2d");
	canvas.width=document.documentElement.clientWidth;
	canvas.height=document.documentElement.clientHeight-55;
	qt(ctx);
}
window.addEventListener("load",screencanvas,true);
window.addEventListener("resize",screencanvas,true);
})();
/****************************************************************/
(function(){
var canvas=document.getElementById("writing");
var ctx=canvas.getContext("2d");
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
		console.log(charData);
	}
}
canvas.onmouseout=function(e){
	lock=false;
}
canvas['on'+EndEvent]=function(e){
	lock=false;
}
function drawPoint(r,d){
		var sampleNumber=parseInt(d.distance[r]/0.5);
		for(var u=0;u<sampleNumber;u++){
			var t=u/(sampleNumber-1);
			var x1=(1.0-t)*d.x[r-1]+t*d.x[r];
			var y1=(1.0-t)*d.y[r-1]+t*d.y[r];
			var w1=(1.0-t)*d.pressure[r-1]+t*d.pressure[r];	
			ctx.drawImage(image,x1-w1*50,y1-w1*50,w1*100,w1*100);  		
		}
}	
var btn=document.getElementById("btnClear");
btn.addEventListener("click",function(){
	ctx.clearRect(0,0,canvas.width,canvas.height);
	charData.clearAll();qt(ctx);
},false);
})();
/*****************************************************************/
