require([],function(){
	$(function(){
		var $sidebar = $('#J_sidebar'),
			$sidebarBtn = $('#J_sidebar-control'),
			$win = $(window),			
			$goTop = $('#J_goTop'),
			$affix = $('#J_affix'),
			throttledwinScrollHandler;

		function init(){
			initSidebar();
			bindEvent();
			initAffix();
		}

		function initSidebar(){
			var winWidth = $win.width();

			if(winWidth < 1280){
				$sidebar.addClass('sidebar--off');
				$sidebarBtn.addClass('btn-sidebar--off');
			}else{
				$sidebar.addClass('sidebar--on');
				$sidebarBtn.addClass('btn-sidebar--on');
			}
		}

		function bindEvent(){
			$sidebar.on('click', '#J_sidebar-control', slideHandler);
			$win.on('scroll', throttledwinScrollHandler);
			$goTop.on('click', goTopHandler);
		}

		function slideHandler(){
			if($sidebarBtn.hasClass('btn-sidebar--off')){
				$sidebar.addClass('sidebar--on').removeClass('sidebar--off');
				$sidebarBtn.addClass('btn-sidebar--on').removeClass('btn-sidebar--off');
			}else{
				$sidebar.addClass('sidebar--off').removeClass('sidebar--on');
				$sidebarBtn.addClass('btn-sidebar--off').removeClass('btn-sidebar--on');
			}
		}		

		throttledwinScrollHandler = _.throttle(function(){			
			if($win.scrollTop() > 100){
				$goTop.fadeIn(500);
			}else{
				$goTop.fadeOut(500);
			}			
		},100);

		function goTopHandler(){
			$('body,html').animate({scrollTop: 0}, 100);
			return false;
		}

		function initAffix(){
			$affix.affix({
				offset: {
					top: $affix.offset().top
				}
			});			
		}
		
		init();
	});
});