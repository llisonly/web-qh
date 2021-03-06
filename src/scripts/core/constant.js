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

					var getUnitOfAccount = function(){
						return [
							{key: 1, value: '公斤'},
							{key: 2, value: '箱'}
						];
					};

					var getUnitList = function(){
						return [
							{key: 1, value: '公斤'}
						];
					};					
					
					var getDateType = function(){
						return [
							{key: 'year', value: '年'},
							{key: 'month', value: '月'},
							{key: 'week', value: '周'},
							{key: 'day', value: '天'},
							{key: 'hour', value: '小时'}
						];
					};

					var getSellType = function(){
						return [
							{key: 0, value: '正常'},
							{key: 1, value: '取消'},
							{key: 2, value: '退货'},
							{key: 9, value: '异常'}
						];
					};

					var getPayType = function(){
						return [
							{key: 0, value: '现金'},
							{key: 1, value: '储值卡'},
							{key: 2, value: '支付宝'},
							{key: 3, value: '微信'}
						];
					};

					var getCustomerType = function(){
						return [
							{key: 0, value: '会员'},
							{key: 1, value: '非会员'}
						];
					};

					return {
						getGenderList: getGenderList,
						getUnitOfAccount: getUnitOfAccount,
						getUnitList: getUnitList,										
						getDateType: getDateType,
						getSellType: getSellType,
						getPayType: getPayType,
						getCustomerType: getCustomerType
					};
				});
		};

		return {
			init: init
		};	
	}
);2