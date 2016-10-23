define({
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
								'<button  id = "handwriting" class =  "btn btn-default" type = "button"  title = "调整参数">参数</button>'+
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