define([], function(){
	'use strict';

	var router = {};

	router = {
		login: {
			url: '/login',
			templateUrl: qhConfig.staticUrl + '/views/common/login.html',
			controller: 'commonController'
		},
		main: {
			url: '/main',
			templateUrl: qhConfig.staticUrl + '/views/common/main.html',
			controller: 'commonController'
		}	
	};

	return router;
});