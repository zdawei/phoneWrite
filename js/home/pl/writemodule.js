(function(){
  //书写模块
  var W = _.W;
  var touch = ("createTouch" in document);
  var StartEvent = touch ? "touchstart" : "mousedown";
  var MoveEvent = touch ? "touchmove" : "mousemove";
  var EndEvent = touch ? "touchend" : "mouseup";
  var lock = false;
  W.canvas['on' + StartEvent] = function(e){
    var t = touch ? e.touches[0] : e;
    var x = t.pageX - t.target.offsetLeft;
    var y = t.pageY - t.target.offsetTop;
    var time = new Date().getTime();
    W.pushAll(x,y,time,false);
    lock = true;
  }
  W.canvas['on' + MoveEvent] = function(e){
    if(lock){
      var t = touch ? e.touches[0] : e;
      var x = t.pageX - t.target.offsetLeft;
      var y = t.pageY - t.target.offsetTop;
      var time = new Date().getTime();
      W.pushAll(x,y,time,true);
      W.drawPoint();
    }
  }
  W.canvas.onmouseout = function(e){
    lock = false;
  }
  W.canvas['on' + EndEvent] = function(e){
    lock = false;
  }
})();