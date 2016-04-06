define([
	'utils'
	], function(utils){
	'use strict';

	var getApis = function($http){
		var apis = {};

		//门店列表
		apis.getStoreList = function(param, success, error){
			return utils.http($http, 'get', '/api/store', {params: param}, success, error);
		};

		//秤列表
		apis.getScaleList = function(param, success, error){
			return utils.http($http, 'get', '/api/scale' + param, null, success, error);
		};
		
		//销售类型报表
		apis.getReportDataBySellType = function(param, success, error){
			return utils.http($http, 'post', '/api/trade/plusummary', param, success, error);
		};

		//支付类型报表
		apis.getReportDataByPayType = function(param, success, error){
			return utils.http($http, 'post', '/api/trade/paymentsummary', param, success, error);
		};

		//交易明细
		apis.getTradeTotal = '/api/trade/total';

		//商品明细
		apis.getPluDetail = function(param, success, error){
			return utils.http($http, 'post', '/api/trade/pluDetail', param, success, error);
		};

		//支付明细
		apis.getPaymentDetail = function(param, success, error){
			return utils.http($http, 'post', '/api/trade/paymentDetail', param, success, error);
		};

		return apis;
	};	

	var services = {
		module: 'reportManage',
		name: 'reportManageService',
		getApis: getApis
	};

	return services;
});