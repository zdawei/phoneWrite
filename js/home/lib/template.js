define(['bootstrap'], {
	head : 	'<meta charset="UTF-8" name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=0">'+
			'<title>writing</title>'+
			'<link rel="shortct icon" type="image/ico" href="img/favicon.ico">'+
			'<link rel="stylesheet" href="css/bootstrap.css" type="text/css">'+
			'<link rel="stylesheet" href="css/main.css" type="text/css">',

	nav : 	'<div class="container bindEvt">'+
 				'<div class="row">'+
 					'<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">'+
 						'<div class="btn-toolbar" role="toolbar">'+
 							'<div class="btn-group">'+
								'<button  id = "xmlcharacter" class =  "btn btn-default" type = "button"  title = "汉字库">字库</button>'+
								'<button  id = "animation" class =  "btn btn-default" type = "button"  title = "动态笔画">动画</button>'+
								'<button  id = "framework" class =  "btn btn-default" type = "button"  title = "笔画框架">框架</button>'+
								'<button  id = "handwriting" type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" title = "调整参数">'+
								'	参数 <span class="caret"></span>'+
								'</button>'+
								'<form role="menu" class="dropdown-menu" style="right:0;width:100%">'+
									'<ul class="list-group">'+
										'<li class="list-group-item"><p>gaoss<input name = \"gaoss\"  type = \"range\" max = \"2.0\"  min = \"1.0\"  step = \"0.1\" value = \"1.3\"  /></p></li>'+
										'<li class="list-group-item"><p>minPress<input name = \"minPress\"  type = \"range\" max = \"0.1\"  min = \"0.01\"  step = \"0.01\"  value = \"0.05\" /></p></li>'+
										// '<li><p>maxPress<input name = \"maxPress\"  type = \"range\" max = \"0.5\"  min = \"0.1\"  step = \"0.01\"  value = \"0.2\" /></p></li>'+
										'<li class="list-group-item"><p>width<input name = \"width\"  type = \"range\" max = \"100\"  min = \"10\"   step = \"1\"  value = \"50\"  /></p></li>'+
										'<li class="list-group-item"><p>density<input name = \"density\"  type = \"range\" max = \"2\"  min = \"0.1\"   step = \"0.1\"  value = \"0.5\"  /></p></li>'+
										// '<li><p>draw_wmin<input name = \"draw_wmin\"  type = \"range\" max = \"6\"  min = \"1\"   step = \"1\"  value = \"3.0\"  /></p></li>'+
										// '<li><p>draw_wmax<input name = \"draw_wmax\"  type = \"range\" max = \"14\"  min = \"7\"   step = \"1\"  value = \"11\"  /></p></li>'+
										// '<li><p>draw_sigmoid<input name = \"draw_sigmoid\"  type = \"range\" max = \"0.6\"  min = \"0.1\"   step = \"0.1\"  value = \"0.3\"  /></p></li>'+
									'</ul>								'+
								'</form>'+
							'</div>'+
						'</div>'+
					'</div>'+
					'<div class="col-lg-12 col-md-12 col-sm-12 col-xs-12">'+
 						'<div class="btn-toolbar" role="toolbar">'+
 							'<div class="btn-group">'+
								'<button  id = "prechars" class =  "btn btn-default" type = "button"  title = "上一个汉字">上一个</button>'+
								'<button  id = "btnClear" class =  "btn btn-default" type = "button"  title = "清除画布">清除</button>'+
								'<button  id = "nextchars" class =  "btn btn-default" type = "button"  title = "下一个汉字">下一个</button>'+
								'<button  id = "setChar" class =  "btn btn-default" type = "button" title = "调整汉字">调整</button>'+
							'</div>'+
						'</div>'+
					'</div>'+
 				'</div>'+
			'</div>'+
			'<canvas id="writing"></canvas>'
});