define([], function(){
	'use strict';

	var router = {};

	router = {
		main: {
			url: '/main',
			templateUrl: qhConfig.staticUrl + '/views/home/home.html',
			controller: 'homeController'
		}		
	};

	return router;
});