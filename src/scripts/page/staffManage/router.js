define([], function(){
	'use strict';

	var router = {};

	router = {
		index: {
			url: '/staffManage',
			templateUrl: qhConfig.staticUrl + '/views/staffManage/index.html'
		},
		list: {
			url: '/list',
			templateUrl: qhConfig.staticUrl + '/views/staffManage/list.html',
			controller: 'staffManageListController'
		},
		add: {
			url: '/add',
			templateUrl: qhConfig.staticUrl + '/views/staffManage/add.html',
			controller: 'staffManageAddController'
		},
		edit: {
			url: '/edit/:staffId',
			templateUrl: qhConfig.staticUrl + '/views/staffManage/add.html',
			controller: 'staffManageEditController'
		}
	};

	return router;
});