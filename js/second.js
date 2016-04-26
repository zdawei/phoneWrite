var wDiv=document.getElementById("secWriting");
var btnBack=document.getElementById("btnBack");
var btnClear=document.getElementById("btnClear");
var setchar=document.getElementById("setchar");
btnClear.addEventListener("click",function (){
  if(wDiv.childNodes.length>0){
    wDiv.removeChild(wDiv.lastChild); 
  }else{
    alert("已经是最后一个汉字了");
  }     
},false);
btnBack.addEventListener("click",function (){
  window.close();
},false);
setchar.addEventListener("click",function (){
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
},false);