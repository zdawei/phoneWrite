define(['jquery'], function($) {
	var datas = [];
	var data = {
	  	x : [],//x坐标
  		y : [],//y坐标
  		time : [],//时间
    	locks : [],//汉字锁数组，用来防止笔画之间的链接,还可以用来计算出笔画数
    	count : 0,//数组索引
  		distance : [],//距离
  		speed : [],//速度
  		pressure : [],//压力
    	a : []
	};
	var account = 0;

	return function() {
		var that = {
			clear : function() {
				data.x=[];
		  		data.y=[];
		  		data.time=[];
		  		data.locks=[];
		  		data.count=0;
		  		data.speed=[];
		  		data.pressure=[];
		  		data.distance=[];
		  		data.a=[];
			},

			push : function() {
				datas[account] = $.extend(true, {}, data);
				that.clear();
			},

			next : function() {
				that.clear();
				data = datas[++account] || data;
				return data;
			},

			pre : function() {
				if(--account < 0) {account = 0;}
				that.clear();				
				data = datas[account] || data;
				return data;
			},

			pop : function(pos) {
				that.clear();
				data = datas[pos];
				that.getData();
			},

			setData : function(opt) {
				$.extend(data, opt);
			},

			getData : function() {
				return data;
			},

			logData : function() {
				console.log(data,account);
			}
		};

		return that;
	}
});