define([
	'underscore',
	'../page/common/controller',
	'../page/merchandiseManage/controller',
	'../page/merchandisePrice/controller',
	'../page/storeManage/controller',
	'../page/memberManage/controller',
	'../page/staffManage/controller',
	'../page/reportManage/controller'
	], function(commonController, merchandiseManageController, merchandisePriceController, storeManageController, memberManageController, staffManageController, reportManageController){
		'use strict';

		//获取全部controller
		var args = Array.prototype.slice.call(arguments, 1);

		//合并controller
		var controllers = _.reduce(args, function(memo, arg){
			return memo.concat(arg);
		}, []);

		//创建controller
		var init = function(){
			_.each(controllers, function(controller, index, controllers){
				angular.module(controller.module).controller(controller.name, controller.ctrl);
			});
		};

		return {
			init: init
		};
	}
);