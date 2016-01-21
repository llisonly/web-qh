define([
	'jquery',
	'bootstrap',
	'underscore',
	'angular',
	'uiRouter',
	'angularCookies',			
	'./core/constant',
	'./core/factory',
	'./core/filter',
	'./core/directive',
	'./core/services',
	'./core/routers',	
	'./core/controllers'
	], function($, bootstrap, _, angular, uiRouter, angularCookies, constant, factory, filter, directive, services, routers, controllers){
		'use strict';

		//通用模块
		angular.module('common', []);

		//商品管理
		angular.module('merchandiseManage', ['common']);

		//商品价格
		angular.module('merchandisePrice', ['common']);

		//门店管理
		angular.module('storeManage', ['common']);

		//会员管理
		angular.module('memberManage', ['common']);

		//员工管理
		angular.module('staffManage', ['common']);

		//主应用
		var app = angular.module('qh-website', ['ui.router', 'ngCookies', 'common', 'merchandiseManage', 'merchandisePrice', 'storeManage', 'memberManage', 'staffManage']);

		//常量
		constant.init();

		//方法
		factory.init();

		//过滤
		filter.init();

		//指令
		directive.init();

		//服务
		services.init();

		//路由引导
		routers.init(app);

		//控制器引导
		controllers.init();		

		angular.bootstrap(window.document, ['qh-website']);
	}
);