define([
	'utils'
	], function(utils){
	'use strict';

	var getApis = function($http){
		var apis = {};
		
		//门店列表数据
		apis.getStoreList = function(param, success, error){
			return utils.http($http, 'get', '/api/store', {params: param}, success, error);
		};

		//门店商品
		apis.getStorePlu = function(param, success, error){
			return utils.http($http, 'get', '/api/storeplu' + param, null, success, error);
		};

		//plu
		apis.getPluList = function(param, success, error){
			return utils.http($http, 'get', '/api/plu', {params: param}, success, error);
		};

		//添加零售价
		apis.createPrice = function(param, success, error){
			return utils.http($http, 'post', '/api/storeplu', param, success, error);
		};

		//修改当前零售价
		apis.updatePrice = function(id, param, success, error){
			return utils.http($http, 'put', '/api/storeplu/' + id, param, success, error);
		};

		//门店会员价
		apis.getStorePluVipPrice = function(param, success, error){
			return utils.http($http, 'get', '/api/storepluvipprice' + param, null, success, error);
		};

		//添加会员
		apis.createVipPrice = function(param, success, error){
			return utils.http($http, 'post', '/api/storepluvipprice', param, success, error);
		};

		//修改当前会员
		apis.updateVipPrice = function(id, param, success, error){
			return utils.http($http, 'put', '/api/storepluvipprice/' + id, param, success, error);
		};

		return apis;
	};	

	var services = {
		module: 'merchandisePrice',
		name: 'merchandisePriceService',
		getApis: getApis
	};

	return services;
});