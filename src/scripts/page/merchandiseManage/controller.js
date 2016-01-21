define([	
	'./listCtrl',
	'./addCtrl',
	'./editCtrl'	
	], function(listCtrl, addCtrl, editCtrl){
		'use strict';		

		//获取模块下全部controller
		var args = Array.prototype.slice.call(arguments);

		var controllers = [];

		//合并controller
		_.each(args, function(arg, index, args){
			controllers.push(arg);
		});		

		return controllers;				
	}
);