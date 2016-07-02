var W = function(){

  document.body.addEventListener('touchmove', function (event) {event.preventDefault();}, false);//固定页面
  var image = document.createElement("img");
  image.src = "img/model.png";//笔刷模型
  var canvas = document.createElement("canvas");
  canvas.id = "writing";
  document.body.insertBefore(canvas,document.body.lastChild);
  var ctx = canvas.getContext("2d");
  var countChar = document.getElementById("tip").firstChild.firstChild;//提示的文本
  var currentChar = 0,totalchar = 15;//currentChar 当前的汉子个数,totalchar总汉子个数
  var charDatas = [],charCount = 1;//charDatas 写汉字的保存数组,charCount 汉字保存数组的当前下标值
  var $ = {
  	x : [],//x坐标
  	y : [],//y坐标
  	time : [],//时间
    count : 0,//数组索引
    locks : [],//汉字锁数组，用来防止笔画之间的链接,还可以用来计算出笔画数
  	speed : [],//速度
  	pressure : [],//压力
  	distance : [],//距离
  	//以下是参数设置
  	gaoss : 1.3,//高斯初始值
  	minPress : 0.05,
  	maxPress : 0.2,
  	width : 50
  };

  var qt = function(ctx){
  //米字格以上 qt=======直接用qt(ctx)即可画出米字格
    var dl = function(context,x1,y1,x2,y2,dashLength){
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

  var screencanvas = function(){
    var btnClear = document.getElementById("btnClear");
    canvas.width = parseInt(document.body.clientWidth);
    canvas.height = parseInt(document.body.offsetHeight) - parseInt(btnClear.offsetHeight) * 2 - 5;
    qt(ctx);
  }
  window.addEventListener("load",screencanvas,true);
  window.addEventListener("resize",screencanvas,true);

  var parameter = function(){
  //剩余参数的计算函数
    var gaussian = function(v, gauss) {
    //高斯计算公式
      return ((1 / (Math.sqrt(2 * Math.PI) * gauss)) * Math.pow(Math.E,-(v * v) / (2 * gauss * gauss)));
    }
    var ratio = $.maxPress / gaussian(0,$.gaoss);
    var timeGap = $.time[$.count - 1] - $.time[$.count - 2];
    var distance = Math.sqrt(Math.pow($.x[$.count - 1] - $.x[$.count - 2],2) +
      Math.pow($.y[$.count - 1] - $.y[$.count - 2],2));
    $.distance.push(distance);
    if(timeGap == 0){
      $.speed[$.count - 1] = $.speed[$.count - 2];
    }else{
      $.speed[$.count - 1] = distance / timeGap;
    }
    if($.count > 2){
      $.speed[$.count - 1] = $.speed[$.count - 1] * 0.6 + $.speed[$.count - 2] * 0.3 + $.speed[$.count - 3] * 0.1;
    }
    var speed = gaussian($.speed[$.count - 1],$.gaoss);
    $.pressure[$.count - 1] = (ratio * speed);
    $.pressure[$.count - 1] = Math.max(Math.min($.pressure[$.count - 1],$.maxPress),$.minPress);
    $.pressure[$.count - 1] = ($.pressure[$.count - 1] + $.pressure[$.count - 2]) / 2;
  }

  function pushAll(x,y,time,lock){
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
  }

  function clearPrint(){
  //清除画板，清空对象
    $.x=[];
    $.y=[];
    $.time=[];
    $.locks=[];
    $.count=0;
    $.speed=[];
    $.pressure=[];
    $.distance=[];
    ctx.clearRect(0,0,canvas.width,canvas.height);
    qt(ctx);
  }

  function clearCharData(){
  //只清除数据，不清除画板
    $.x = [];
    $.y = [];
    $.time = [];
    $.speed = [];
    $.pressure = [];
    $.count = 0;
    $.distance = [];
    $.locks = [];
  }

  function clearScreen(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    qt(ctx);
  }

  function cloneCharData(obj){
  //深度复制对象
    var result = {};
    for(var key in obj){
      result[key] = obj[key];
    }
    return result;
  }

  function setCountChar(vari){
  //设置汉字提示符 
    charCount += vari;
    if(charCount <= totalchar + 1 && charCount > 0){
      if(vari > 0 && charCount > currentChar + 1){
        currentChar++;
      }
      countChar.nodeValue = "当前:" +charCount + "/已写:" + currentChar + "/总共:" + totalchar ;
    }else if(charCount > totalchar + 1){
      --charCount;
      return alert("字数超过限制");
    }else if(charCount <= 0){
      ++charCount;
      return alert("已经是第一个字了!");
    }
  }

  function drawPoint(){
  //count是数组索引,注意count是从当前节点开始的,是从count-1到count的节点绘画
    var sampleNumber = parseInt($.distance[$.count - 1] / 0.5);
    for ( var u = 0 ; u < sampleNumber ; u++ ){
      var t = u / (sampleNumber - 1);
      var x = ( 1.0 - t ) * $.x[$.count - 2] + t * $.x[$.count - 1];
      var y = ( 1.0 - t ) * $.y[$.count - 2] + t * $.y[$.count - 1];
      var w = ( 1.0 - t ) * $.pressure[$.count - 2] * $.width + t * $.pressure[$.count - 1] * $.width;
      ctx.drawImage( image , x - w , y - w , w * 2 , w * 2 );
    }
  }

  function drawPointAll(){
    // d是$对象，r是数组索引
    for(var r = 0;r < $.count;r++){
      if($.locks[r]){
        var sampleNumber = parseInt($.distance[r] / 0.5);
        for(var u = 0;u < sampleNumber;u++){
          var t = u / (sampleNumber - 1);
          var x = (1.0 - t) * $.x[r - 1] + t * $.x[r];
          var y = (1.0 - t) * $.y[r - 1] + t * $.y[r];
          var w = (1.0 - t) * $.pressure[r - 1] * $.width + t * $.pressure[r] * $.width;
          ctx.drawImage(image,x - w,y - w,w * 2,w * 2);
        }
      }
    }
  }

  function nextChar(){
    if($.count == 0){
      alert("请写汉字!");
      return ;
    }
    charDatas[charCount - 1] = null;
    charDatas[charCount - 1] = cloneCharData($);
    clearPrint();
    if(charDatas[charCount]){
      $ = cloneCharData(charDatas[charCount]);
      drawPointAll($);
    }
    setCountChar(1);
  }

  function preChar(){
    if(charCount <= 1){
      alert("已经是第一个字了!");
      return ;
    }
    if($.count == 0 && charCount <= currentChar){
      //防止中间汉字清空后点击上一个汉字时，数据会回滚到以前版本
      alert("请写汉字!");
      return ;
    }
    if($.count != 0){
      charDatas[charCount - 1] = null;
      charDatas[charCount - 1] = cloneCharData($);
    }
    setCountChar(-1);
    // charDatas[charCount] = cloneCharData($);
    clearPrint();
    $ = cloneCharData(charDatas[charCount-1]);
    drawPointAll($);
  }

  function reWrite(){
    charDatas[charCount - 1] = cloneCharData($);
    clearPrint();
    $ = cloneCharData(charDatas[charCount - 1]);
    drawPointAll($);
  }

  function logData(){
    console.log(charCount,currentChar);
  }

  function getData(str){
    //这里就可以实时的调用$等变量啦
    switch (str){
      case "charDatas" : return charDatas ;
      case "$" : return $ ;
      default : throw("argument 1 of getData is error!");
    }
  }

  function setArg(name,value){
    //这个是通过滑动条设置参数的
    $[name] = value;
    var original = cloneCharData($);
    clearPrint();
    for(var i = 0 ; i < original.count ; i++){
      pushAll(original.x[i],original.y[i],original.time[i],original.locks[i]);
      drawPoint();
    }
    original = null;

  }

  return {
    canvas : canvas,
    ctx : ctx,
    // $ : $,我这里犯下了严重的错误，这里赋值的是以前$值，如果$变更，我在外层引用的还是以前$的值，所以有些汉字写不出来是由原因的
    pushAll : pushAll,
    clearPrint : clearPrint,
    cloneCharData : cloneCharData,
    setCountChar : setCountChar,
    drawPoint : drawPoint,
    drawPointAll : drawPointAll,
    nextchar : nextChar,
    preChar : preChar,
    reWrite : reWrite,//有问题
    clearScreen : clearScreen,
    getData : getData,
    setArg : setArg,
    logData : logData

  };//return
}();

