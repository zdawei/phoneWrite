define(['jquery', 'lib/writing'], function($, w) {

	return function(canvas, image) {

		var write = w(canvas, image);

		var fn = {
			handwriting : function() {
				// var setArguments = document.getElementById("setArguments");
				// if(setArguments){document.body.removeChild(setArguments); setArguments = null ;return ;}
				// else{
				// 	var div = document.createElement("div");
				// 	div.id = "setArguments";
				// 	div.style.position = "absolute";
				// 	div.style.width = "50%";
				// 	div.style.right = "3%";
				// 	div.style.top = "150px";
				// 	div.style.backgroundColor = "rgba(240,239,136,0.5)";
				// 	document.body.appendChild(div);
				// 	div.innerHTML = _.template.parameter ;
				// }
				// var form = document.forms[0];
				// form.addEventListener("change",function(e){
				// 	W.setArg(e.target.name,e.target.value);
				// 	console.log(e.target.name,e.target.value);
				// },false);
			},

			animation : function() {
  			  //动画写字函数
  				write.animation();
  			},

  			clearPrint : function() {
  				write.clearPrint();
  			},

			framework : function() {
			  //顶导的笔画框架
				write.drawFrameWork();
			},

			nextChar : function() {
				write.nextChar();
  			},

  			preChar : function() {
  				write.preChar();
  			},

  			setChar : function() {

  			}

		};

		var init = function() {
			//添加事件代理
			$('.bindEvt').on('click', function(evt) {
				switch($(evt.target).attr('id')) {
					case "handwriting" : fn.handwriting();break;
					case "animation" : fn.animation();break;
					case "framework" : fn.framework();break;
					case "prechars" : fn.preChar();break;
					case "btnClear" : fn.clearPrint();break;
					case "nextchars" : fn.nextChar();break;
					case "setChar" : fn.setChar();break;
				}
			});
		};

		var that = {init : init}
		return that;
	};
});