/**
* author : dawei
* fileoverview : 这个文件是毛笔字库，主要用于在canvas上实时书写出毛笔字的效果，
* 毛笔字的笔触模型参考的互联网上的图样，包含pre和base，其中base作为重点另成一文件。
* 启动库的方法是_.init();此后在_.W中使用
* history : 2016年7月22日 重构了整个框架。
* 这个库涉及的方面过多(比如要插入html，一些按钮的事件处理函数)，所以通用性不强。
*/

var _ = {
	template : {
		html : 
		'<button  id = "xmlcharacter" class =  "total" type = "button"  title = "汉字库">字库</button>'+
		'<button  id = "animation" class =  "total" type = "button"  title = "动态笔画">动画</button>'+
		'<button  id = "framework" class =  "total" type = "button"  title = "笔画框架">框架</button>'+
		'<button  id = "handwriting" class =  "total" type = "button"  title = "调整参数">参数</button>'+
		'<button  id = "prechars" type = "button"  title = "上一个汉字">上一个</button>'+
		'<button  id = "btnClear" type = "button"  title = "清除画布">清除</button>'+
		'<button  id = "nextchars" type = "button"  title = "下一个汉字">下一个</button>'+
		'<button  id = "setChar" type = "button" title = "调整汉字">调整</button>'+
		'<div id = "tip"><p>当前没写汉字!</p></div>'+
		'<canvas id="writing" ></canvas>'
		,parameter : 
		'<form>'+
			'<ul style = \"padding : 5% 10% \">'+
				'<li><p>gaoss<input name = \"gaoss\"  type = \"range\" max = \"2.0\"  min = \"1.0\"  step = \"0.1\" value = \"1.3\"  /></p></li>'+
				'<li><p>minPress<input name = \"minPress\"  type = \"range\" max = \"0.1\"  min = \"0.01\"  step = \"0.01\"  value = \"0.05\" /></p></li>'+
				// '<li><p>maxPress<input name = \"maxPress\"  type = \"range\" max = \"0.5\"  min = \"0.1\"  step = \"0.01\"  value = \"0.2\" /></p></li>'+
				'<li><p>width<input name = \"width\"  type = \"range\" max = \"100\"  min = \"10\"   step = \"1\"  value = \"50\"  /></p></li>'+
				'<li><p>density<input name = \"density\"  type = \"range\" max = \"2\"  min = \"0.1\"   step = \"0.1\"  value = \"0.5\"  /></p></li>'+
				'<li><p>draw_wmin<input name = \"draw_wmin\"  type = \"range\" max = \"6\"  min = \"1\"   step = \"1\"  value = \"3.0\"  /></p></li>'+
				'<li><p>draw_wmax<input name = \"draw_wmax\"  type = \"range\" max = \"14\"  min = \"7\"   step = \"1\"  value = \"11\"  /></p></li>'+
				'<li><p>draw_sigmoid<input name = \"draw_sigmoid\"  type = \"range\" max = \"0.6\"  min = \"0.1\"   step = \"0.1\"  value = \"0.3\"  /></p></li>'+
			'</ul>'+
		'</form>'
	}

	,init : function(){
		document.getElementById("main").innerHTML = _.template.html;
		_.W = _.pre();	
		_.W.writeOpen();	
	}
};

