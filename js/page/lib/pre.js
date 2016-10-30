var _sec = {
	template : {
		html : 
		'<button class="btn btn-primary"  id="btnBack" type="button"   title="返回画布"><span class="h2">返回</span></button>'+
		'<button class="btn btn-primary dropdown-toggle" data-toggle="dropdown" id="setChar" type="button" title="调整汉字"><span class="h2">调整<span class="caret"></span></span></button>'+
		'<button class="btn btn-primary" data-toggle="modal" data-target="#myModal" id="insertPic" type="button" title="背景图片"><span class="h2">插画</span></button>'+
		'<button class="btn btn-primary" id="picShare" type="button" ><span class="h2">分享</span></button>'+
		'<canvas id="canvas"></canvas>'
		,insertPic : 
		// 以下插图
		'<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'+
			'<div class="modal-dialog">'+
				'<div class="modal-content">'+
					'<div class="modal-header">'+
						'<button type="button" class="close" data-dismiss="modal" aria-hidden="true">'+
							'&times;'+
						'</button>'+
						'<h4 class="modal-title" id="myModalLabel">'+
							'选择插图'+
						'</h4>'+
					'</div>'+
					'<div class="modal-body">'+
						'<ul class="list-unstyled list-inline">'+
							'<li><img class="img-rounded" width="100px" height="100px" src="img/1.png"></li>'+
							'<li><img class="img-rounded" width="100px" height="100px" src="img/2.png"></li>'+
							'<li><img class="img-rounded" width="100px" height="100px" src="img/3.png"></li>'+
							'<li><img class="img-rounded" width="100px" height="100px" src="img/4.png"></li>'+
						'</ul>'+
					'</div>'+
					'<div class="modal-footer">'+
						'<button type="button" class="btn btn-default" data-dismiss="modal">关闭'+
						'</button>'+
						'<button type="button" class="btn btn-primary">'+
							'提交更改'+
						'</button>'+
					'</div>'+
				'</div><!-- /.modal-content -->'+
			'</div><!-- /.modal -->'+
		'</div>'+
		//以下调整
		'<ul class="dropdown-menu" style="position:absolute;top:8%;left:25%"  role="menu" id="shape">'+
			'<li><a href="javascript:void(0);" data-shape="1" >普通形</a></li>'+
			'<li><a href="javascript:void(0);" data-shape="2">十字形</a></li>'+
			'<li><a href="javascript:void(0);" data-shape="3">门字形</a></li>'+
			'<li class="divider"></li>'+
			'<li><a href="javascript:void(0);" data-shape="0">随机</a></li>'+
		'</ul>'
	}
	,init : function() {
		$('#main').append(_sec.template.html, _sec.template.insertPic);
		_sec.Z = _sec.pre();
	}
}