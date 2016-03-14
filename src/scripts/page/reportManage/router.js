define([], function(){
	'use strict';

	var router = {};

	router = {		
		summary: {
			url: '/reportManage/summary',
			templateUrl: qhConfig.staticUrl + '/views/reportManage/summary.html',
			controller: 'reportManageSummaryController'
		}
	};

	return router;
});