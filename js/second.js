var wDiv=document.getElementById("secWriting");
var btnBack=document.getElementById("btnBack");
var btnClear=document.getElementById("btnClear");
var setchar=document.getElementById("setchar");
/////////////////////////////////////////////
var canvas=document.createElement("canvas");
canvas.id="writing";
document.body.insertBefore(canvas,document.body.lastChild);
var ctx=canvas.getContext("2d");
var image =document.createElement("img");
image.src="img/model.png";
function screencanvas(){  
  //var canvas=document.getElementById("writing");
  var btnClear=document.getElementById("btnClear");
  canvas.width=document.documentElement.clientWidth;
  canvas.height=document.documentElement.clientHeight-btnClear.offsetHeight-5;
}
window.addEventListener("load",screencanvas,true);
window.addEventListener("resize",screencanvas,true);
/////////////////////////////////////////////////
function drawPointAll(d,i){
  var col=3,row=6,beishu=90,widthbeishu=2,permY=parseInt(i/col),permX=i%col;
  var width=canvas.width/col,height=canvas.height/row;
  for(var r=0;r<d.count;r++){
    if(d.locks[r]){
      var sampleNumber=parseInt(d.distance[r]/0.5);
      for(var u=0;u<sampleNumber;u++){
        var t=u/(sampleNumber-1);
        var x=((1.0-t)*d.x[r-1]+t*d.x[r])/canvas.width*beishu+permX*width;//x/canvas.with=X/beishu
        var y=((1.0-t)*d.y[r-1]+t*d.y[r])/canvas.height*beishu+permY*height;
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
window.addEventListener("load",writingChar,false);
btnClear.addEventListener("click",function (){
  if(wDiv.childNodes.length>0){
    wDiv.removeChild(wDiv.lastChild); 
  }else{
    alert("已经是最后一个汉字了");
  }     
},false);
btnBack.addEventListener("click",function (){
  //window.close();
  history.go(-1);
},false);
/*setchar.addEventListener("click",function (){
  var divObj=document.getElementById("secWriting").firstChild;
  var moveFlag=false;
  divObj.style.position="relative";
    divObj.ontouchstart=function(e){
    moveFlag=true;
    var clickEvent=window.event||e;
    var mwidth=clickEvent.clientX-divObj.offsetLeft;
    var mheight=clickEvent.clientY-divObj.offsetTop;
    divObj.ontouchmove=function(e){
      var moveEvent=window.event||e;
      if(moveFlag){
        divObj.style.left=moveEvent.clientX-mwidth+"px";
        divObj.style.top=moveEvent.clientY-mheight+"px";
        divObj.ontouchend=function(){
          moveFlag=false;
        };
      }
    };
  };
},false);*/
//////////////////////////////////////////

    //console.log(localStorage.dataChars);
////////////////////////////////////////////