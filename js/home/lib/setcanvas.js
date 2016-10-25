define(['jquery'], function($) {
	var that = {
		dl : function(context,x1,y1,x2,y2,dashLength){
      		dashLength=dashLength===undefined?5:dashLength;
      		var deltaX=x2-x1;
      		var deltaY=y2-y1;
      		var numDashes=Math.floor(Math.sqrt(deltaX*deltaX+deltaY*deltaY)/dashLength);
      		for(var i=0;i<numDashes;++i){
      		  context[i%2===0?'moveTo':'lineTo']
      		  (x1+(deltaX/numDashes)*i,y1+(deltaY/numDashes)*i);
      		}
      		context.stroke();
		},

		qt : function(ctx) {
  			//米字格以上 qt=======直接用qt(ctx)即可画出米字格
    		ctx.beginPath();
    		ctx.strokeStyle='black';
    		ctx.lineWidth=1.5;
    		ctx.moveTo(0,ctx.canvas.height/2);
    		ctx.lineTo(ctx.canvas.width,ctx.canvas.height/2);
    		ctx.moveTo(ctx.canvas.width/2,0);
    		ctx.lineTo(ctx.canvas.width/2,ctx.canvas.height);
    		ctx.stroke();
    		ctx.lineWidth=0.5;
    		that.dl(ctx,0,0,ctx.canvas.width,ctx.canvas.height,10);
		  	that.dl(ctx,0,ctx.canvas.height,ctx.canvas.width,0,10);
		  	ctx.closePath();
		},

		start : function(canvas) {
			$('body').on('touchmove', function(evt) {
				// 固定页面
				evt.preventDefault();
			})
			var ctx = canvas.getContext("2d");
			var screencanvas = function(){
				var nav = $('.container');
				canvas.width = nav.innerWidth() - 1;
				canvas.height = $('body').height() - nav.height() - 5;
				that.qt(ctx);
			};
			setTimeout(function() {
				//cordova的莫名bug，不出米字格，无语死了
				screencanvas();
			}, 500);
			$(window).resize(function() {
			  screencanvas();
			});
		}
	};
	return that;
});