require.config({
	paths : {
		'jquery' : 'lib/jquery-3.1.1.min',
		'bootstrap' : 'lib/bootstrap',
		'homeLib' : 'home/lib'
	}
});

require(['jquery', 'home/init'], function($, init) {
	init();
});