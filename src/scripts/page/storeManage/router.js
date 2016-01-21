define([], function(){
	'use strict';

	var router = {};

	router = {
		index: {
			url: '/storeManage',
			templateUrl: qhConfig.staticUrl + '/views/storeManage/index.html'
		},
		storeList: {
			url: '/storeList',
			templateUrl: qhConfig.staticUrl + '/views/storeManage/storeList.html',
			controller: 'storeManageStoreListController'
		},
		equipmentList: {
			url: '/equipmentList/:storeNo',
			templateUrl: qhConfig.staticUrl + '/views/storeManage/equipmentList.html',
			controller: 'storeManageEquipmentListController'
		},
		addEquipment: {
			url: '/addEquipment/:storeNo',
			templateUrl: qhConfig.staticUrl + '/views/storeManage/addEquipment.html',
			controller: 'storeManageAddEquipmentController'
		},
		editEquipment: {
			url: '/editEquipment/:storeNo/:scaleId',
			templateUrl: qhConfig.staticUrl + '/views/storeManage/addEquipment.html',
			controller: 'storeManageEditEquipmentController'
		},
		addPresetKey: {
			url: '/addPresetKey/:scaleId',
			templateUrl: qhConfig.staticUrl + '/views/storeManage/addPresetKey.html',
			controller: 'storeManageAddPresetKeyController'
		}
	};

	return router;
});