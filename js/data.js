define(['jquery'], function($) {
	var datas = [];
	// var data = {
	window.data = {
	  	x : [],//x坐标
  		y : [],//y坐标
  		time : [],//时间
    	locks : [],//汉字锁数组，用来防止笔画之间的链接,还可以用来计算出笔画数
    	count : 0,//数组索引
  		distance : [],//距离
  		speed : [],//速度
  		pressure : [],//压力
    	//参数设置
    	widthFunc : 'gaussian',//处理宽度函数的初始值
  		gaoss : 1.3,//高斯初始值
  		sigmoid : 3,//sigmoid初始值
  		cos : 1,//余弦初始值
    	acceleration : 0.5,
  		minPress : 0.05,
  		maxPress : 0.2,
  		width : 50,
    	density : 0.5,
    	//增加了draw函数后的参数
    	draw_wmin : 3.0,
    	draw_wmax : 11,
    	draw_sigmoid : 0.3
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

			saveLocalStorage : function() {
			    var dataChar = JSON.stringify(datas);
      			localStorage.removeItem("dataChars");
      			localStorage.setItem("dataChars",dataChar);
			},

			getLocalStorage : function() {
				var dataChar = localStorage.getItem("dataChars");	
				datas = JSON.parse(dataChar);
				data = datas[0];
				dataChar = null;
			},

			getDatasLength : function() {
				return datas.length;
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