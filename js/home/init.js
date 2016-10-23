define(['jquery', 'homeLib/template', 'homeLib/setcanvas', 'lib/writing', 'homeLib/bindEvt'], function($, t, s, w, b) {

	$('head').prepend(t.head);
	$('body').prepend(t.nav);

	return function() {
		var image = new Image();
		image.src = "img/model.png";//笔刷模型
		var canvas = $('#writing')[0];

		var init = function() {
			s.start(canvas);
			w(canvas, image).init();
			b(canvas, image).init();
		};

		init();
	};
});