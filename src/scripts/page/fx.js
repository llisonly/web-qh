require([],function(){
	$(function(){
		var $slideWrapper = $('#J_slide-wrapper'),
			$slideBtn = $('#J_btn-slide');

		function init(){
			bindEvent();
		}

		function bindEvent(){
			$slideWrapper.on('click', '#J_btn-slide', slideHandler);
		}

		function slideHandler(){
			console.log(1)

		}

		init();
	});
});