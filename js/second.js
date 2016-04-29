var btnBack=document.getElementById("btnBack");
var setchar=document.getElementById("setChar");
var insertPic=document.getElementById("insertPic");
var picShare=document.getElementById("picShare");
var setCharNum=0,picInsert=0,totalcount=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14];
/*var style=document.querySelector(".setChar");
with(style.style){
  //display="none";
  position="absolute";
  left="-100%";//35%
  top="25%";
  backgroundColor="RGBA(200,200,200,0.7)";
  height="25%";
  width="25%";
}*/
/////////////////////////////////////////////
var canvas=document.createElement("canvas");
canvas.id="writing";
document.body.insertBefore(canvas,document.body.lastChild);
var ctx=canvas.getContext("2d");
var image =document.createElement("img");
image.src="img/model.png";
/////////////////////////////////////////
var img1 =document.createElement("img");
img1.src="img/1.png";
var img2 =document.createElement("img");
img2.src="img/2.png";
var img3 =document.createElement("img");
img3.src="img/3.png";
var img4 =document.createElement("img");
img4.src="img/4.png";
//////////////////////////////////////////
function screencanvas(){  
  //var canvas=document.getElementById("writing");
  canvas.width=document.documentElement.clientWidth;
  canvas.height=document.documentElement.clientHeight-btnBack.offsetHeight-5;
}
window.addEventListener("load",screencanvas,true);
window.addEventListener("resize",screencanvas,true);
/////////////////////////////////////////////////
function drawPointAll(d,i){
  var col=3,row=5,beishu=90,widthbeishu=3,permY=parseInt(i/col),permX=i%col;
  var width=canvas.width/col,height=canvas.height/row;
  for(var r=0;r<d.count;r++){
    if(d.locks[r]){
      var sampleNumber=parseInt(d.distance[r]/0.5);
      for(var u=0;u<sampleNumber;u++){
        var t=u/(sampleNumber-1);
        var x=((1.0-t)*d.x[r-1]+t*d.x[r])/canvas.width*beishu+permX*width;//x/canvas.with=X/beishu
        var y=((1.0-t)*d.y[r-1]+t*d.y[r])/canvas.height*1.5*beishu+permY*height;
        var w=((1.0-t)*d.pressure[r-1]*d.width+t*d.pressure[r]*d.width)/widthbeishu;  
        ctx.drawImage(image,x-w,y-w,w*2,w*2);     
      }
    }
  }
}
function writingChar(){
    var dataChars=JSON.parse(localStorage.dataChars);
  for(var i=0;i<dataChars.length;i++){
    drawPointAll(dataChars[i],i);     
  }
}
function setCharfunc(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  switch(picInsert){
    case 1:ctx.drawImage(img1,0,0,canvas.width,canvas.height);break;
    case 2:ctx.drawImage(img2,0,0,canvas.width,canvas.height);break;
    case 3:ctx.drawImage(img3,0,0,canvas.width,canvas.height);break;
    case 4:ctx.drawImage(img4,0,0,canvas.width,canvas.height);break;
    default:;
  }
  switch(++setCharNum){
    case 0:writingChar();totalcount=[1,2,3,4,5,6,7,8,9,10,11,12,13,14];break;
    case 1:var dataChars=JSON.parse(localStorage.dataChars);
            var count=[0,3,6,9,12,1,4,7,10,13,2,5,8,11,14];totalcount=count;
            for(var i=0;i<dataChars.length;i++){
                drawPointAll(dataChars[i],count[i]);
            }break;
    case 2:var dataChars=JSON.parse(localStorage.dataChars);
            var count=[2,5,8,11,14,1,4,7,10,13,0,3,6,9,12];totalcount=count;
            for(var i=0;i<dataChars.length;i++){
                drawPointAll(dataChars[i],count[i]);
            }break;
    case 3:var dataChars=JSON.parse(localStorage.dataChars);
            var count=[2,1,5,0,4,8,3,7,11,6,10,14,9,13,12];totalcount=count;
            for(var i=0;i<dataChars.length;i++){
                drawPointAll(dataChars[i],count[i]);
            }break;
    default:var dataChars=JSON.parse(localStorage.dataChars);
            var count=[0,1,2,5,8,11,14,13,12,9,6,3,4,7,10];totalcount=count;
            for(var i=0;i<dataChars.length;i++){
                drawPointAll(dataChars[i],count[i]);
            }setCharNum=-1;
  } 
}
function setpicInsert(){//picInsert=0
  ctx.clearRect(0,0,canvas.width,canvas.height);
  var dataChars=JSON.parse(localStorage.dataChars);
  switch(++picInsert){
    case 1:ctx.drawImage(img1,0,0,canvas.width,canvas.height); 
    for(var i=0;i<dataChars.length;i++){
                drawPointAll(dataChars[i],totalcount[i]);
            }break;
    case 2:ctx.drawImage(img2,0,0,canvas.width,canvas.height);
        for(var i=0;i<dataChars.length;i++){
                drawPointAll(dataChars[i],totalcount[i]);
            }break;
    case 3:ctx.drawImage(img3,0,0,canvas.width,canvas.height);
        for(var i=0;i<dataChars.length;i++){
                drawPointAll(dataChars[i],totalcount[i]);
            }break;
    case 4:ctx.drawImage(img4,0,0,canvas.width,canvas.height);
        for(var i=0;i<dataChars.length;i++){
                drawPointAll(dataChars[i],totalcount[i]);
            }break;
    default:
        for(var i=0;i<dataChars.length;i++){
                drawPointAll(dataChars[i],totalcount[i]);
            }picInsert=0;
  }  
}
window.addEventListener("load",writingChar,false);
btnBack.addEventListener("click",function (){
  history.go(-1);
},false);
setchar.addEventListener("click",setCharfunc,false);
insertPic.addEventListener("click",setpicInsert,false);
picShare.addEventListener("click",function(){
  alert("感谢分享");
},false);


//////////////////////////////////////////
////////////////////////////////////////////