define([], function(){
	'use strict';

	var router = {};

	router = {		
		list: {
			url: '/memberManage/list',
			templateUrl: qhConfig.staticUrl + '/views/memberManage/list.html',
			controller: 'memberManageListController'
		}
	};

	return router;
});