define(['jquery', 'homeLib/template', 'homeLib/setcanvas', 'homeLib/bindEvt'], function($, t, s, b) {

	$('head').prepend(t.head);
	$('body').prepend(t.nav);
	
	return function() {
		var image = new Image();
		image.src = "img/model-black.png";//笔刷模型
		var canvas = $('#writing')[0];

		var init = function() {
			s.start(canvas);
			b(canvas, image).init();
		};

		init();
	};
});