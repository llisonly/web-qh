define([], function(){
		'use strict';

		var init = function(){
			angular.module('common')
				.filter('sex', function(){
					var map = {
						'1': '男', 
						'2': '女'									
					};

					return function(input){
						return map[input];
					};
				})
				.filter('unit', function(){
					var map = {
						'1': '公斤', 
						'2': '箱'									
					};

					return function(input){
						return map[input];
					};
				})
				.filter('customerType', function(){
					var map = {
						'0': '会员', 
						'1': '非会员'									
					};

					return function(input){
						return map[input];
					};
				})
				.filter('sellType', function(){
					var map = {
						'0': '正常', 
						'1': '取消',							
						'2': '退货',							
						'9': '异常',							
					};

					return function(input){
						return map[input];
					};
				})
				.filter('substring8', function(){		

					return function(input){
						return input ? (input.length > 8 ? (input.substring(0,8) + '...') : input) : '';
					};
				})				
		};

		return {
			init: init
		};	
	}
);