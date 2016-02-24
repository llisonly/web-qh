require([],function(){
	$(function(){
		var $sidebar = $('#J_sidebar'),
			$sidebarBtn = $('#J_sidebar-control'),
			$goTop = $('#J_goTop');	

		function init(){
			initSidebar();
			bindEvent();
		}

		function initSidebar(){
			$sidebar.addClass('sidebar--off');
			$sidebarBtn.addClass('btn-sidebar--off');
		}

		function bindEvent(){
			$sidebar.on('click', '#J_sidebar-control', slideHandler);
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

		function initToolbar(){
			
		}

		init();
	});
});