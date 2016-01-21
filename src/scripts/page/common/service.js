define([
	'utils'
	], function(utils){
	'use strict';

	var getApis = function($http){
		var apis = {};
		
		apis.login = _.partial(utils.http, $http, 'post', '/passport/login');

		return apis;
	};	

	var services = {
		module: 'qh-website',
		name: 'commonService',
		getApis: getApis
	};

	return services;
});