define([
	'../page/common/router',
	'../page/merchandiseManage/router',
	'../page/merchandisePrice/router',
	'../page/storeManage/router',
	'../page/memberManage/router',
	'../page/staffManage/router',
	'../page/reportManage/router'
	], function(commonRouter, merchandiseManageRouter, merchandisePriceRouter, storeManageRouter, memberManageRouter, staffManageRouter, reportManageRouter){
		'use strict';

		var init = function(app){
			app.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', function($stateProvider, $urlRouterProvider, $locationProvider){
				
				$urlRouterProvider.otherwise("/login");

				$stateProvider
					.state('login', commonRouter.login)
					.state('main', commonRouter.main)
					.state('main.merchandiseManage', merchandiseManageRouter.index)
					.state('main.merchandiseManage.list', merchandiseManageRouter.list)
					.state('main.merchandiseManage.add', merchandiseManageRouter.add)
					.state('main.merchandiseManage.edit', merchandiseManageRouter.edit)
					.state('main.merchandisePrice', merchandisePriceRouter.list)
					.state('main.storeManage', storeManageRouter.index)
					.state('main.storeManage.storeList', storeManageRouter.storeList)
					.state('main.storeManage.equipmentList', storeManageRouter.equipmentList)
					.state('main.storeManage.addEquipment', storeManageRouter.addEquipment)
					.state('main.storeManage.editEquipment', storeManageRouter.editEquipment)
					.state('main.storeManage.addPresetKey', storeManageRouter.addPresetKey)
					.state('main.memberManage', memberManageRouter.list)
					.state('main.staffManage', staffManageRouter.index)
					.state('main.staffManage.list', staffManageRouter.list)
					.state('main.staffManage.add', staffManageRouter.add)
					.state('main.staffManage.edit', staffManageRouter.edit)
					.state('main.reportManage', reportManageRouter.summary)

				//$locationProvider.html5Mode(true);
			}]);
		};

		return {
			init: init
		};	
	}
);