define([		
	'underscore',
	'../page/common/service',
	'../page/merchandiseManage/service',
	'../page/merchandisePrice/service',
	'../page/storeManage/service',
	'../page/memberManage/service',
	'../page/staffManage/service'
	], function(commonService, merchandiseManageService, merchandisePriceService, storeManageService, memberManageService, staffManageService){
		'use strict';

		//获取全部service
		var args = Array.prototype.slice.call(arguments, 1);

		//services[]
		var services = args;

		//创建service
		var init = function(){
			_.each(services, function(service, index, services){
				angular.module(service.module).factory(service.name,['$http', function($http){
					return service.getApis($http);
				}]);
			});
		};

		return {
			init: init
		};
	}
);