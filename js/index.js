'use strict'
;(function (win,doc){
	function change(){
		doc.documentElement.style.fontSize=50*doc.documentElement.clientWidth/320+'px';
	}
	change();
	win.addEventListener('resize',change,false);
})(window,document);

var app=angular.module('app',[]);
// //天气
app.controller('weather',function ($scope,$http){
	// if(navigator.geolocation){
	// 	navigator.geolocation.getCurrentPosition(function (ev){
	// 		console.log(ev.coords.longitude);
	// 	},function (ev){
	// 		alert('获取失败：'+ev.code+'-'+ev.message);
	// 	});
	// }else{
	// 	alert('此设备不支持');
	// }
	$scope.t1= '北京';
	$scope.$watch('t1',function (){
		$http.jsonp('http://api.map.baidu.com/telematics/v3/weather?location='+$scope.t1+'&output=json&ak=tQydkkwXfEtSNgvAEHUr1v6u0GbXUvZo&&callback=JSON_CALLBACK').success(function (data){
			$scope.lightNight='';
			$scope.city=data.results[0].currentCity;
			$scope.temperature = data.results[0].weather_data[0].temperature;
			//白天黑夜
			var oDate = new Date();
			var oH = oDate.getHours();
			if (oH > 6 && oH < 18) {
				$scope.lightNight = data.results[0].weather_data[0].dayPictureUrl;
			}else{
				$scope.lightNight = data.results[0].weather_data[0].nightPictureUrl;
			}
		});
	});
});
//banner
$(function(){
	var oBanner = $('.banner');
	var aSpan = $('.banner .banner-box span')
	var iNow = 0;

	//避免过多操作
	var bReady = false;
	function ready(){
		var timer = setTimeout(function(){
			return bReady=false;
			if (!bReady) {
				clearTimeout(timer)
			}
		},1500)
	};
	//加载页面 给第一个span 样式
	$('.banner .banner-box span').first().css({
		transition:'2s all ease',
		transform:'translate3d(0,0,0)',
		opacity:1,
	})
	oBanner.swipeLeft(function(){

		if (bReady)return;
		bReady = true;
		//清除js添加的行间style
		for (var i = 0; i < aSpan.length; i++) {
			aSpan[i].removeAttribute('style');
		}
		iNow++;
		if (iNow == 4) {
			iNow =3;
		}
		tab();
		ready()
	});

	oBanner.swipeRight(function(){
		if (bReady)return;
		bReady = true;
		//清除js添加的行间style
		for (var i = 0; i < aSpan.length; i++) {
			aSpan[i].removeAttribute('style');
		}
		iNow--;
		if (iNow == -1) {
			iNow = 0;
		};
		tab();
		ready();
	});
	function tab(){
		var x = -iNow*25+'%';
		//给当前span 添加样式
		aSpan[iNow].style.transform = 'translate3d(0,0,0) rotateY(180deg) scale(-1,1)';
		aSpan[iNow].style.opacity = 1;
		oBanner.css('-webkit-transform','translate3d('+x+',0,0)');
	}
});
//on scroll
$(function(){
	var aLi = $('nav ul li')
	//获取content 模块
	var arr = [$('header'),$('.case'),$('.project'),$('.article'),$('.learn'),$('.about')]
	//循环添加事件
	$.each($('nav ul li'),function(index,item){
		$(this).tap(function(){
			for (var i = 0; i < aLi.length; i++) {
				aLi[i].style.background = 'none';
				aLi[i].style.color = '#d1d39e';
			}
			$(this).css({
				background:'skyblue',
				color:'#fff'
			});
			// 点击导航 滚动
			var start = $('body').scrollTop();
			var end = arr[index].offset().top;
			var dis = end - start;
			var n = 0;
			var count = Math.floor(1000/30);
			clearInterval(timer);
			var timer = setInterval(function(){
				n++;
				var a = 1-n/count;
				var cur = start+dis*(1-Math.pow(a,3));
				$('body').scrollTop(cur);
				if (n == count) {
					clearInterval(timer);
				}
			},30)
		})
	})
});

//content-案例展示
//创意时钟
document.addEventListener('DOMContentLoaded',function(){
	function d2a(n){
		return n*Math.PI/180;
	};
	function ran(n,m){
		return Math.floor(Math.random()*(m-n)+n);
	};
	function toDouble(n){
		if (n < 10) {
			return '0'+n;
		}else{
			return ''+n;
		};
	};
	var winX = document.documentElement.clientWidth;
	var oC = document.querySelector('.clock');
	var oCase1 = document.querySelector('.case1')
	oC.width =  oCase1.offsetWidth;
	oC.height =  oCase1.offsetWidth;
	var gd = oC.getContext('2d');
	//坐标点
	var cx = 100/320*oC.width;
	var cy =100/320*oC.height;
	//画
	function drawArc(start,end,r,color) {
		start = start-90;
		end = end-90;

		gd.beginPath();
		gd.lineWidth = 15/320*oC.width;
		gd.strokeStyle = color || '#000';
		gd.arc(cx,cy,r,d2a(start),d2a(end),false);
		gd.stroke();
	};

	function clock(){
		//清除 指定范围内的矩形的 像素
		gd.clearRect(0,0,oC.width,oC.height);

		var oDate = new Date();
		var oH = oDate.getHours();
		var oM = oDate.getMinutes();
		var oS = oDate.getSeconds();
		var oMs = oDate.getMilliseconds();

		var scal1 = 70/320*oC.width;
		var scal2 = 50/320*oC.width;
		var scal3 = 30/320*oC.width;
		//oS/60*360  求出秒 当前时间 度数
		drawArc(0,oS*6+oMs/1000*6,scal1,'#f00');
		drawArc(0,oM*6+oS/60*6,scal2,'#399');
		drawArc(0,oH%12*30+oM/60*30,scal3,'#000');

		//文本信息
		var font = 0.3/320*oC.width; //字体
		var direction = 200/320*oC.width;
		gd.beginPath();
		gd.lineWidth = 1;
		gd.textAlign = '';
		gd.font = +font+'rem Microsoft YaHei';
		gd.fillText('创意时钟',20/320*oC.width,50/320*oC.height)
		gd.fillStyle='skyblue'
		// style
		gd.shadowOffsetX = 5;
		gd.shadowColor = 'red';
		gd.shadowBlur = 5;

		gd.beginPath();
		gd.fillText(toDouble(oH)+':'+toDouble(oM)+':'+toDouble(oS),210/320*oC.width,120/320*oC.height);
		gd.fillStyle = '#fff';
	}
	setInterval(clock,16);
},false)
	


