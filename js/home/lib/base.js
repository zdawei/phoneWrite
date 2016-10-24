_.pre = function(){
  //毛笔字的库，比较长，所以单独拿出来

  document.body.addEventListener('touchmove', function (event) {event.preventDefault();}, false);//固定页面
  var image = document.createElement("img");
  image.src = "img/model.png";//笔刷模型
  var canvas = document.getElementById("writing");
  var ctx = canvas.getContext("2d");
  var countChar = document.getElementById("tip").firstChild.firstChild;//提示的文本
  var currentChar = 0,totalchar = 15;//currentChar 当前的汉子个数,totalchar总汉子个数
  var charDatas = [],charCount = 1;//charDatas 写汉字的保存数组,charCount 汉字保存数组的当前下标值
  var drawCount = 0;//新加了draw函数的计数暂存
  var $ = {
  	x : [],//x坐标
  	y : [],//y坐标
  	time : [],//时间
    count : 0,//数组索引
    locks : [],//汉字锁数组，用来防止笔画之间的链接,还可以用来计算出笔画数
  	speed : [],//速度
  	pressure : [],//压力
  	distance : [],//距离
    a : [],
  	//以下是参数设置
  	gaoss : 1.3,//高斯初始值
  	minPress : 0.05,
  	maxPress : 0.2,
  	width : 50,
    density : 0.5,
    //增加了draw函数后的参数
    draw_wmin : 3.0,
    draw_wmax : 11,
    draw_sigmoid : 0.3
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

  setTimeout(function(){
    screencanvas();
  },500);//cordova的莫名bug，不出米字格，无语死了

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

  var setAcceleration = function() {
    var acceleration, v1, v2;
    var distance = function(x1,y1,x2,y2) {
      return (Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)));
    };
    if($.count == 1) {
      acceleration = 0;
    }else {
      var distance = distance($.x[$.count - 1], $.y[$.count - 1], $.x[$.count - 2], $.y[$.count - 2]);
      v1 = $.speed[$.count - 2];
      v2 = $.speed[$.count - 1];
      var deltatime = $.time[$.count - 1] - $.time[$.count - 2];
      acceleration = distance < 3 ? 0 : (v2 - v1) / deltatime;
    }
    $.a.push(acceleration);
  };

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
    setAcceleration();
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
    $.a=[];
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
    $.a=[];
  }

  function clearScreen(){
    //只清除画板，不清楚数据
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
  };

  // function draw() {
  function drawPoint() {
    var d1, sampleNumber;
    var point, prePoint;
    var color;
    var w1, wFirst, wSecond;
    var i;
    var tempX, tempY, tempW;
    var c_a = 4;
    var x1,x2,x3,x4,
        y1,y2,y3,y4,
        w1,w2,w3,w4;
    //三次贝塞尔曲线的控制点
    var a1,a2,a3,b1,b2,b3;
    var wmin = $.draw_wmin;
    var wmax = $.draw_wmax;
    var sigmoid = $.draw_sigmoid;

    var distance = function(x1,y1,x2,y2) {
      return (Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2)));
    };

    if(!$.locks[$.count - 2]) {
      drawCount = $.count;     
      return ;
    }

    if($.count - drawCount > 1) {

      d1 = distance($.x[$.count - 1], $.y[$.count - 1], $.x[$.count - 2], $.y[$.count - 2]);
      sampleNumber = parseInt(d1 * 50);

      if ($.count - drawCount < 3 ) {return;}
      //当大于等于三个个点的时候，再绘制。
      x2 = $.x[$.count - 3];
      x3 = $.x[$.count - 2];
      x4 = $.x[$.count - 1];
    
      y2 = $.y[$.count - 3];
      y3 = $.y[$.count - 2];
      y4 = $.y[$.count - 1];
        
      v2 = $.speed[$.count - 3];
      v3 = $.speed[$.count - 2];
      v4 = $.speed[$.count - 1];

      var controlAcc2 = Math.pow(Math.E, -c_a * $.a[$.count - 3]);
      var controlAcc3 = Math.pow(Math.E, -c_a * $.a[$.count - 2]);
      var controlAcc4 = Math.pow(Math.E, -c_a * $.a[$.count - 1]);
      controlAcc2 = Math.max(Math.min(controlAcc2, 1.2), 0.8);  
      controlAcc3 = Math.max(Math.min(controlAcc2, 1.2), 0.8);  
      controlAcc4 = Math.max(Math.min(controlAcc2, 1.2), 0.8);  


      w2 = wmax * 2 / (1 + Math.pow(Math.E, sigmoid * v2)) * controlAcc2;
      w3 = wmax * 2 / (1 + Math.pow(Math.E, sigmoid * v3)) * controlAcc3;
      w4 = wmax * 2 / (1 + Math.pow(Math.E, sigmoid * v4)) * controlAcc4;

      var dis23 = Math.sqrt( (x3 - x2) * (x3 - x2) + (y3 - y2) * (y3 - y2));
      var dis34 = Math.sqrt( (x4 - x3) * (x4 - x3) + (y4 - y3) * (y4 - y3));
      var dis24 = Math.sqrt( (x4 - x2) * (x4 - x2) + (y4 - y2) * (y4 - y2));


      if( $.count - drawCount == 3){       
        var disAvg = dis23/(3.0 * dis24); 
        b2 = {
          x: x3 - disAvg *(x4 - x2),
          y: y3 - disAvg *(y4 - y2),
          v: v3 - (v4 - v2) / 6,
          w: w3 - (w4 - w2) / 6 
        };
        a2 = {
          x: b2.x - (x3 - x2) / 3,
          y: b2.y - (y3 - y2) / 3,
          v: b2.v - (v3 - v2) / 3,
          w: b2.w - (w3 - w2) / 3
        };
      } else {
        x1 = $.x[$.count - 4];
        y1 = $.y[$.count - 4];
        v1 = $.speed[$.count - 4];
        var gaussian = 12;
        w1 = 11 * Math.pow(Math.E, -v1 * v1 / (2 * gaussian * gaussian)); 
        var dis13 = Math.sqrt( (x3-x1) * (x3-x1) + (y3 - y1) * (y3 - y1));
        var dis12 = Math.sqrt( (x2-x1) * (x2-x1) + (y2 - y1) * (y2 - y1));
        var disAvg = dis23 / (3.0 * dis13); 
        //每次都绘制第二条线段
        //Note that the v is acutally an independent dimension
        // so the cubic Bezier here is one dimensonal. that is why times 1/6
        var factor = 1 / 6;          
        a2 = {
          x : x2 + disAvg * (x3 - x1) ,
          y : y2 + disAvg * (y3 - y1),
          w : w2 + (w3 - w1) * factor,
          v : v2 + (v3 - v1) * factor
        };
        disAvg = dis34 / (3.0 * dis24);
        b2 = {
          x : x3 - disAvg * (x4 - x2),
          y : y3 - disAvg * (y4 - y2),
          w : w3 - (w4 - w2) * factor,
          v : v3 - (v4 - v2) * factor
        };
    //Here comes the tricky part, to make sure the central control segment parallel to the xy2-xy3

        var perpA = ((x3 - x1) * (x3 - x2) + (y3 - y1) * (y3 - y2)) / (dis23 * dis13); //cosine of the angle
        var perpB = ((x2 - x4) * (x2 - x3) + (y2 - y4) * (y2 - y3)) / (dis23 * dis24);
        if( perpA > perpB ){
        
        //sine value                      
          perpA = (dis23 / 3) * Math.sqrt(1 - perpA * perpA);
          perpA = perpA / Math.sqrt(1 - perpB * perpB);
          b2.x = x3 - perpA * (x4 - x2) / dis24;
          b2.y = y3 - perpA * (y4 - y2) / dis24;
        } else {
        //sine value                      
          perpB = (dis23 / 3) * Math.sqrt(1 - perpB * perpB);
          perpB = perpB /  Math.sqrt(1 - perpA * perpA);
          a2.x = x2 + perpA * (x3 - x1) / dis13;
          a2.y = y2 + perpA * (y3 - y1) / dis13;
        }
      }

      
      for(var u=0; u < sampleNumber; u++) {
        var t = u / (sampleNumber - 1);
        tempX = (1-t)*(1-t)*(1-t)*x2
              +t*(1-t)*(1-t)*3*a2.x
              +t*t*(1-t)*3*b2.x
              +t*t*t*x3;
        tempY = (1-t)*(1-t)*(1-t)*y2
              +t*(1-t)*(1-t)*3*a2.y
              +t*t*(1-t)*3*b2.y
              +t*t*t*y3;
        tempW = (1-t)*(1-t)*(1-t)*w2
              +t*(1-t)*(1-t)*3*a2.w
                +t*t*(1-t)*3*b2.w
              +t*t*t*w3;
        tempW = Math.min(Math.max(tempW, wmin), wmax);
        ctx.drawImage(image, tempX - tempW, tempY - tempW, 2 * tempW, 2 * tempW);
      }
      // if(!$.locks[$.count - 1]) {
      // //绘制最后一条线段
      // //如果是最后一个线段，则x5=x4,y5=y4
      //   var disAvg = dis34 / (3.0 * dis24); 
            
      //   a3 = {
      //     x : x3 + ( x4 - x2) * disAvg,
      //     y : y3 + ( y4 - y2) * disAvg,
      //     w : w3 + ( w4 - w3) / 3,
      //     v : v3 + ( v4 - v3) / 3
      //   };
      //   b3 = {
      //     x : a3.x + (x4 - x3) / 3,
      //     y : a3.y + (y4 - y3) / 3,
      //     v : a3.v + (v4 - v3) / 3,
      //     w : a3.w + (w4 - w3) / 3
      //   };
      //   for(var u=0; u < sampleNumber; u++) {
      //     var t = u / (sampleNumber - 1);
      //     tempX = (1-t)*(1-t)*(1-t)*x3
      //             +t*(1-t)*(1-t)*3*a3.x
      //             +t*t*(1-t)*3*b3.x
      //             +t*t*t*x4;
      //     tempY = (1-t)*(1-t)*(1-t)*y3
      //             +t*(1-t)*(1-t)*3*a3.y
      //             +t*t*(1-t)*3*b3.y
      //             +t*t*t*y4;
      //     tempW = (1-t)*(1-t)*(1-t)*w3
      //             +t*(1-t)*(1-t)*3*a3.w
      //             +t*t*(1-t)*3*b3.w
      //             +t*t*t*w4;
      //     tempW = Math.min(Math.max(tempW, wmin), wmax);
      //     ctx.drawImage(image, tempX - tempW, tempY - tempW, 2 * tempW, 2 * tempW);
      //   }
      // }       
    }
  }


  function drawPoint123(){
  //count是数组索引,注意count是从当前节点开始的,是从count-1到count的节点绘画
    var sampleNumber = parseInt($.distance[$.count - 1] / $.density);
    for ( var u = 0 ; u < sampleNumber ; u++ ){
      var t = u / (sampleNumber - 1);
      var x = ( 1.0 - t ) * $.x[$.count - 2] + t * $.x[$.count - 1];
      var y = ( 1.0 - t ) * $.y[$.count - 2] + t * $.y[$.count - 1];
      var w = ( 1.0 - t ) * $.pressure[$.count - 2] * $.width + t * $.pressure[$.count - 1] * $.width;
      ctx.drawImage( image , x - w , y - w , w * 2 , w * 2 );
    }
  }

  // function processFanal() {
  //   // 添加一个专门处理笔画结尾的函数
  //   if($.pressure[$.count - 1] <= $.pressure[$.count - 2] && 
  //     $.pressure[$.count - 2] <= $.pressure[$.count - 3]) {
  //     // ctx.drawImage( image , x - w , y - w , w * 2 , w * 2 );      
  //     var slope = ($.y[$.count - 1] - $.y[$.count - 2]) / ($.x[$.count - 1] - $.x[$.count - 2]);
  //     var xDistance = 20;
  //     var yDistance = slope * ($.x[$.count - 1] - $.x[$.count - 2] + xDistance);
  //     console.log(xDistance, yDistance, slope);
  //     var sampleNumber = parseInt($.distance[$.count - 1] / $.density);
  //     for ( var u = 0 ; u < sampleNumber ; u++ ){
  //       var t = u / (sampleNumber - 1);
  //       var x = ( 1.0 - t ) * $.x[$.count - 1] + t * (slope < 0 ? $.x[$.count - 1] + xDistance : $.x[$.count - 1] - xDistance);
  //       var y = ( 1.0 - t ) * $.y[$.count - 1] + t * ($.y[$.count - 1] + yDistance);
  //       var w = ( 1.0 - t ) * $.pressure[$.count - 1] * $.width + 0;
  //       ctx.drawImage( image , x - w , y - w , w * 2 , w * 2 );
  //     }      
  //   }
  // }

  function drawPointAll(){
    // d是$对象，r是数组索引
    for(var r = 0;r < $.count;r++){
      if($.locks[r]){
        var sampleNumber = parseInt($.distance[r] / $.density);
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

  function animation(){
    //动画写字函数
    var reWrite = function(count){
      //根据animation动画播放汉字而写的函数
      var sampleNumber = parseInt($.distance[count] / 0.5);
      for ( var u = 0 ; u < sampleNumber ; u++ ){
        var t = u / (sampleNumber - 1);
        var x = ( 1.0 - t ) * $.x[count - 1] + t * $.x[count];
        var y = ( 1.0 - t ) * $.y[count - 1] + t * $.y[count];
        var w = ( 1.0 - t ) * $.pressure[count - 1] * $.width + t * $.pressure[count] * $.width;
        ctx.drawImage( image , x - w , y - w , w * 2 , w * 2 );
      }
    }
    clearScreen();
    var count = 0;
    // var handle = setInterval(function(){
    //   if(count++ >= $.count){
    //     clearInterval(handle);
    //   }
    //   reWrite(count);
    // },17);
    var time = $.time[count + 1] - $.time[count];
    var animfunc = function(){
      if(count++ >= $.count){
        clearTimeout(handle);
      }else{
        reWrite(count);
        time = $.time[count + 1] - $.time[count];
        setTimeout(animfunc,time);   
      }
    }
    var handle = setTimeout(animfunc,time);
  }

  function framework(){
    //顶导的笔画框架
    var draw = function(){
      // d是$对象，r是数组索引
      ctx.beginPath();
      for(var r = 0 ; r < $.count ; r++){
        if($.locks[r]){
          var distant = Math.max(parseInt($.pressure[r] * 60) , 5) ;
          ctx.moveTo($.x[r - 1],$.y[r - 1]);
          ctx.lineTo($.x[r],$.y[r]);
          ctx.moveTo($.x[r] + distant - 2,$.y[r] + distant - 2);
          ctx.arc($.x[r],$.y[r],distant,0,2 * Math.PI,false);
        }
      }
      ctx.stroke();
    }
    clearScreen();
    draw();
  }

  function logData(){
    console.log(charCount,currentChar);
    console.log($);
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

  var setChar = function(){
    var data = getData("charDatas");
    if(data.length){
      var dataChar = JSON.stringify(data);
      localStorage.removeItem("dataChars");
      localStorage.setItem("dataChars",dataChar);
      var w = window.open("second.html","_self");
    }else{
      alert("没有汉字");
    }
  };

  var writeOpen = function(){
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
        drawPoint();
      }
    }, false);
    canvas.addEventListener("mouseout", function() {
      lock = false;
    }, false);
    canvas.addEventListener(EndEvent, function(e) {
      lock = false;
    }, false);
  }

  return {
    canvas : canvas
    ,ctx : ctx
    // $ : $,我这里犯下了严重的错误，这里赋值的是以前$值，如果$变更，我在外层引用的还是以前$的值，所以有些汉字写不出来是由原因的
    ,pushAll : pushAll
    ,clearPrint : clearPrint
    ,clearScreen : clearScreen
    ,cloneCharData : cloneCharData
    ,setCountChar : setCountChar
    ,drawPoint : drawPoint
    ,drawPointAll : drawPointAll
    ,nextchar : nextChar
    ,preChar : preChar
    ,getData : getData
    ,setArg : setArg
    ,logData : logData 
    ,setChar : setChar
    ,animation : animation
    ,framework : framework
    ,writeOpen : writeOpen
  };//return

};

