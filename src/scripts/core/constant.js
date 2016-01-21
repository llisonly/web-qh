define([], function(){
		'use strict';

		var init = function(){
			angular.module('common')
				.factory('constants', function(){
					var getGenderList = function(){
						return [
							{key: 1, value: '男'},
							{key: 2, value: '女'}
						];
					};

					var getUnitList = function(){
						return [
							{key: 1, value: '公斤'}							
						];
					};

					return {
						getGenderList: getGenderList,
						getUnitList: getUnitList
					};
				});
		};

		return {
			init: init
		};	
	}
);2