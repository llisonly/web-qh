define([], function(){
		'use strict';
		
		var ctrl = ['$scope', 'homeService', '$cookies', '$location', '$rootScope', 'factory', function($scope, commonService, $cookies, $location, $rootScope, factory){
			
			
		}];

		var controllers = [
			{module: 'qh-website', name: 'homeController', ctrl: ctrl}
		];

		return controllers;
	}
);