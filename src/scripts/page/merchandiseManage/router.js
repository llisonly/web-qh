define([], function(){
	'use strict';

	var router = {};

	router = {
		index: {
			url: '/merchandiseManage',
			templateUrl: qhConfig.staticUrl + '/views/merchandiseManage/index.html'
		},
		list: {
			url: '/list',
			templateUrl: qhConfig.staticUrl + '/views/merchandiseManage/list.html',
			controller: 'merchandiseManageListController'
		},
		add: {
			url: '/add',
			templateUrl: qhConfig.staticUrl + '/views/merchandiseManage/add.html',
			controller: 'merchandiseManageAddController'
		},
		edit: {
			url: '/edit/:id',
			templateUrl: qhConfig.staticUrl + '/views/merchandiseManage/add.html',
			controller: 'merchandiseManageEditController'
		}
	};

	return router;
});