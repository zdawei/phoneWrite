var _sec = {
	template : {
		html : 
		'<button  id="btnBack" type="button"   title="返回画布">返回</button>'+
		'<button  id="setChar" type="button" title="调整汉字">调整</button>'+
		'<button  id="insertPic" type="button" title="背景图片">插画</button>'+
		'<button  id="picShare" type="button" title="分享汉字">分享</button>'+
		'<canvas  id="canvas"></canvas>'
		,insertPic : 
		'<div id="slider" class="swipe" style="visibility:visible;">  '+
		    '<div class="swipe-wrap">  '+
		        '<figure>  '+
		            '<div class="face faceInner">  '+
		                '<img src="img/1.JPG" width="100%" height="100%" />  '+
		            '</div>  '+
		        '</figure>  '+
		        '<figure>  '+
		            '<div class="face faceInner">  '+
		                '<img src="img/2.JPG" width="100%" height="100%" />  '+
		            '</div>  '+
		        '</figure>  '+
		        '<figure>  '+
		            '<div class="face faceInner">  '+
		                '<img src="img/3.JPG" width="100%" height="100%" />  '+
		            '</div>  '+
		        '</figure>  '+
		    '</div>  '+
		'</div>  '
	}
	,init : function() {
		var main = document.getElementById('main');
		main.innerHTML = _sec.template.html;
		_sec.Z = _sec.pre();
	}
}