define([], function(){
		'use strict';
		
		var ctrl = ['$scope', '$state', 'commonService', '$cookies', '$location', '$rootScope', 'factory', function($scope, $state, commonService, $cookies, $location, $rootScope, factory){
			//初始配置：
			//用户对象
			$scope.user = {};
			//登录-是否记录此次登录
			$scope.isRememberLogin = false;
			//
			$scope.$state = $state;
			
			//设置用户对象参数
			$scope.setRemember = function(isRememberLogin){
				$scope.user.remember = isRememberLogin ? 1: 0;
			};			

			//记住此次登录
			$scope.doRememberLogin = function(){
				$scope.isRememberLogin = !$scope.isRememberLogin;
				$scope.setRemember($scope.isRememberLogin);
			};

			//登录
			$scope.doLogin = function(user){
				var params = user || {};
				
				factory.validateForm($scope, $scope.loginForm);
				if($scope.loginForm.$valid){
					$state.go('main.merchandiseManage.list');

					// commonService.login(params, function(data){
						
					// });
				}
			};

			$scope.goBack = function(){
				window.history.back();
			};

			//菜单数据
			$scope.navList = [
				{id: 1, name: '首页', className: '', state: 'main.home', includeState: 'main.home'},
				{id: 2, name: '商品管理', className: 'sidebar-nav__item--merchandiseManage', state: 'main.merchandiseManage.list', includeState: 'main.merchandiseManage.*'},
				{id: 3, name: '商品价格', className: 'sidebar-nav__item--merchandisePrice', state: 'main.merchandisePrice', includeState: 'main.merchandisePrice'},
				{id: 4, name: '门店管理', className: 'sidebar-nav__item--storeManage', state: 'main.storeManage.storeList', includeState: 'main.storeManage.*'},
				{id: 5, name: '会员管理', className: 'sidebar-nav__item--memberManage', state: 'main.memberManage', includeState: 'main.memberManage.*'},
				{id: 6, name: '员工管理', className: 'sidebar-nav__item--staffManage', state: 'main.staffManage.list', includeState: 'main.staffManage.*'},
				{id: 7, name: '报表管理', className: 'sidebar-nav__item--reportManage', state: 'main.reportManage', includeState: 'main.reportManage.*'}
			];			

			$scope.init = function(){
				$scope.setRemember($scope.isRememberLogin);
			};

			$scope.init();
			
		}];

		var controllers = [
			{module: 'qh-website', name: 'commonController', ctrl: ctrl}
		];

		return controllers;
	}
);