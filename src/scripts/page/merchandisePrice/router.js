define([], function(){
	'use strict';

	var router = {};

	router = {
		list: {
			url: '/merchandisePrice/list',
			templateUrl: qhConfig.staticUrl + '/views/merchandisePrice/list.html',
			controller: 'merchandisePriceListController'
		}	
	};

	return router;
});