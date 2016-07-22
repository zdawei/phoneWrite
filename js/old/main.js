//parameter对象保存着一个汉字的所有信息
function parameter(){
	this.x=[];//x坐标
	this.y=[];//y坐标
	this.time=[];//时间
	this.speed=[];//速度
	this.pressure=[];//压力
	this.count=0;//数组索引
	this.distance=[];//距离
	this.locks=[];//汉字锁数组，用来防止笔画之间的链接
	//以下是参数设置
	this.gaoss=1.3;//高斯初始值
	this.minPress=0.05;
	this.maxPress=0.2;
	this.width=50;
}
parameter.prototype={
	constructor:parameter,
	pushAll:function(x,y,time){
		this.x.push(x);
		this.y.push(y);
		this.time.push(time);
		this.count++;
		if(!(this.locks[this.count-1])){//加入初试值
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
		this.locks=[];
	}
};
/************************************************************/
var canvas=document.createElement("canvas");
canvas.id="writing";
document.body.insertBefore(canvas,document.body.lastChild);
var ctx=canvas.getContext("2d");
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
	//var canvas=document.getElementById("writing");
	var btnClear=document.getElementById("btnClear");
	canvas.width=parseInt(document.body.clientWidth);
	canvas.height=parseInt(document.body.offsetHeight)-parseInt(btnClear.offsetHeight)*2-5;
	qt(ctx);
}
window.addEventListener("load",screencanvas,true);
window.addEventListener("resize",screencanvas,true);
/****************************************************************/
(function(){
//var image=document.getElementById("model");
//image.crossOrigin="Anonymous";
var image =document.createElement("img");
image.src="img/model.png";
var btnClear=document.getElementById("btnClear");
var btnSave=document.getElementById("btnSave");
//var renew=document.getElementById("tip");
var nextchars=document.getElementById("nextchars");
var renew=document.getElementById("renew");
//var tip=document.getElementById("tip");
var currentChar=0,totalchar=15;
var div=document.getElementById("tip");
var count=div.firstChild.firstChild;
var canvasURLArray=[],charDatas=[];
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
	charData.locks.push(false);
	charData.pushAll(x,y,time);
	lock=true;
}
canvas['on'+MoveEvent]=function(e){
	if(lock){
	  var t=touch ? e.touches[0] : e;
		var x=t.pageX-t.target.offsetLeft;
		var y=t.pageY-t.target.offsetTop;
		var time=new Date().getTime();
		charData.locks.push(true);
		charData.pushAll(x,y,time);
		drawPoint(charData.count-1,charData);
		//console.log(charData);
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
			var x=(1.0-t)*d.x[r-1]+t*d.x[r];
			var y=(1.0-t)*d.y[r-1]+t*d.y[r];
			var w=(1.0-t)*d.pressure[r-1]*d.width+t*d.pressure[r]*d.width;
			ctx.drawImage(image,x-w,y-w,w*2,w*2);
		}
}
function drawPointAll(d){
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
btnClear.addEventListener("click",function (){
	ctx.clearRect(0,0,canvas.width,canvas.height);
	charData.clearAll();qt(ctx);
},false);
btnSave.addEventListener("click",function(){
	//ctx.clearRect(0,0,canvas.width,canvas.height);
	//drawPointAll(charData);
	//var image=canvas.toDataURL("image/png");
	if(W.getchars()){
		//dataURL = image.replace("image/png", "image/octet-stream");
		//document.location.href = dataURL;
		var dataChar=JSON.stringify(charDatas);
		localStorage.removeItem("dataChars");
		localStorage.setItem("dataChars",dataChar);
		var w=window.open("second.html","_self");//,tmp="";
		/*w.onload=function(){
			var wDiv=w.document.getElementById("secWriting");
			for(var i=0;i<charDatas.length;i++){
				//tmp+="<img src='"+canvasURLArray[i]+"' width=\"20%\" height=\"20%\" />";
				//tmp+="<div><canvas></canvas></div>"
			}
			wDiv.innerHTML=tmp;
		}*/
	}else{
		alert("没有汉字");
	}
},false);
/*prechars.addEventListener("click",function(){
	if(currentChar>1){
		currentChar--;
		count.nodeValue=currentChar+"/"+(totalchar);
	}else{
		alert("已经到达第一个汉字了！");
	}
},false);*/
nextchars.addEventListener("click",function(){
	currentChar++;
	if(currentChar<=totalchar){
		count.nodeValue="第"+currentChar+"个汉字";
		//ctx.clearRect(0,0,canvas.width,canvas.height);
		//charData.clearAll();qt(ctx);
	}else if(currentChar>totalchar){
		count.nodeValue="第"+(--currentChar)+"个汉字";
		return alert("字数超过限制");
	}
	ctx.clearRect(0,0,canvas.width,canvas.height);
	//charData.clearAll();
	//drawPointAll(charData);
	//var image=canvas.toDataURL("image/png");
	// ctx.clearRect(0,0,canvas.width,canvas.height);
	//charData.clearAll();
	qt(ctx);
	//canvasURLArray.push(image);
	charDatas.push(charData);
	charData=new parameter();
	//console.log(charDatas.length);

},false);
renew.addEventListener("click",function(){
	canvasURLArray=[];
	charData.clearAll();
	charDatas=[];
	ctx.clearRect(0,0,canvas.width,canvas.height);
	qt(ctx);currentChar=0;
	count.nodeValue="当前没写汉字";
},false);

/*****************************************************************/
// xml选择汉字
(function (){
	var xmlChar = document.getElementById("xmlcharacter");
	var tmplate = "<form style=\"width:100%;height:50%;position:absolute;top:25%;\" ><lable style=\"position:relative;left:10%;display:block;\">请输入一个汉字:</lable><input id=\"input\" required style=\"display:block;position:relative;left:10%;width:80%;\" type= \"text\" />"+
				"<input id=\"yes\" type=\"button\" style=\"position : absolute;bottom:10%;left:10%;width:30%;height:20%\" value= \"确认\" /><input  id = \"cancel\" style=\"position : absolute;bottom:10%;left:60%;width:30%;height:20%;\" type=\"button\" value=\"取消\" /></form>";

// 加载xml文档
       var loadXML = function (xmlFile) {
            var xmlDoc;
            if (window.ActiveXObject) {
                xmlDoc = new ActiveXObject('Microsoft.XMLDOM');//IE浏览器
                xmlDoc.async = false;
                xmlDoc.load(xmlFile);
            }
            else if (isFirefox=navigator.userAgent.indexOf("Firefox")>0) { //火狐浏览器
            //else if (document.implementation && document.implementation.createDocument) {//这里主要是对谷歌浏览器进行处理
                xmlDoc = document.implementation.createDocument('', '', null);
                xmlDoc.load(xmlFile);
            }
            else{ //谷歌浏览器
              var xmlhttp = new window.XMLHttpRequest();
                xmlhttp.open("GET",xmlFile,false);
                xmlhttp.send(null);
                if(xmlhttp.readyState == 4){
                xmlDoc = xmlhttp.responseXML.documentElement;
                }
            }

            return xmlDoc;
        }


	xmlChar.addEventListener('click',function(e){
		var divBubble = createElement("div",{
			position : "absolute",
			top : "30%",
			left : "30%",
			width : "40%",
			height : "40%",
			backgroundColor : "green",
			opacity : "0.8"
		})
		document.body.appendChild(divBubble);
		divBubble.innerHTML = tmplate;
		var divCancel = document.getElementById("cancel");

		divCancel.addEventListener('click',function(e){
			document.body.removeChild(divBubble);
			divBubble = null;
		},false);

		var idYes = document.getElementById("yes");
		yes.addEventListener("click",function(e){
			var input = document.getElementById("input");
			if(input.value){
				var chars = input.value.split("");
				if(chars.length == 1){
					var path = "data\\"+chars[0]+".xml";
					var docXML = loadXML(path);
					// console.log(docXML.length);
					var curchar = new parameter();
					var strokes = docXML.getElementsByTagName("Stroke");
					for(var i = 0;i < strokes.length;i++){
						var startTime = +(strokes[i].getAttribute("startSecond") + strokes[i].getAttribute("startMillisecond"));
						for(var j = 0;j < strokes[i].childNodes.length;j++){
							var tmp = +strokes[i].childNodes[j].getAttribute("deltaTime");
							startTime += tmp;
							curchar.pushAll(+strokes[i].childNodes[j].getAttribute("x"),+strokes[i].childNodes[j].getAttribute("y"),startTime);
						}
					}
					console.log(curchar);
					// drawPointAll(curchar);
					


////////////////////////////////////////////
//这里面在整整
/////////////////////////////////////////////








				document.body.removeChild(divBubble);
				divBubble = null;
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
			case "div" : for(var key in attr){
							element.style[key] = attr[key];
						 }
						 break;
		}
		return element;
	}//createElement


})();
})();
