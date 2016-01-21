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

		//创建门店
		apis.createStore = function(param, success, error){
			return utils.http($http, 'post', '/api/store', param, success, error);
		};

		//删除门店
		apis.deleteStore = function(param, success, error){
			return utils.http($http, 'delete', '/api/store/' + param.id, null, success, error);
		};

		//修改门店
		apis.updateStore = function(id, param, success, error){
			return utils.http($http, 'put', '/api/store/' + id, param, success, error);
		};

		//标头、脚注列表
		apis.getStoreReceiptList = function(param, success, error){
			return utils.http($http, 'get', '/api/storeReceipt', {params: param}, success, error);
		};

		//添加标头、脚注
		apis.createStoreReceipt = function(param, success, error){
			return utils.http($http, 'post', '/api/storeReceipt', param, success, error);
		};

		//更新标头、脚注
		apis.updateStoreReceipt = function(id, param, success, error){
			return utils.http($http, 'put', '/api/storeReceipt/' + id, param, success, error);
		};

		//秤列表
		apis.getScaleList = function(param, success, error){
			return utils.http($http, 'get', '/api/scale' + param, null, success, error);
		};

		//秤详情
		apis.getScaleDetail = function(param, success, error){
			return utils.http($http, 'get', '/api/scale/' + param.id, null, success, error);
		};

		//添加秤
		apis.createScale = function(param, success, error){
			return utils.http($http, 'post', '/api/scale', param, success, error);
		};

		//更新秤
		apis.updateScale = function(id, param, success, error){
			return utils.http($http, 'put', '/api/scale/' + id, param, success, error);
		};

		//复制秤预置键
		apis.cloneScale = function(param, success, error){
			return utils.http($http, 'post', '/api/scale/clone', param, success, error);
		};

		//删除秤
		apis.deleteScale = function(param, success, error){
			return utils.http($http, 'delete', '/api/scale/' + param.id, null, success, error);
		};

		//获取活动字幕
		apis.getScaleRunningTextList = function(param, success, error){
			return utils.http($http, 'get', '/api/scaleRunningText', {params: param}, success, error);
		};

		//添加活动字幕
		apis.createScaleRunningText = function(param, success, error){
			return utils.http($http, 'post', '/api/scaleRunningText', param, success, error);
		};

		//更新浮动字幕
		apis.updateScaleRunningText = function(id, param, success, error){
			return utils.http($http, 'put', '/api/scaleRunningText/' + id, param, success, error);
		};

		//获取预置键
		apis.getScaleKeyMapList = function(param, success, error){
			return utils.http($http, 'get', '/api/scaleKeyMap', {params: param}, success, error);
		};

		//添加预置键
		apis.createScaleKeyMap = function(param, success, error){
			return utils.http($http, 'post', '/api/scaleKeyMap', param, success, error);
		};

		//修改预制键
		apis.updateScaleKeyMap = function(id, param, success, error){
			return utils.http($http, 'put', '/api/scaleKeyMap/' + id, param, success, error);
		};

		//复制预置键
		apis.cloneScaleKeyMap = function(param, success, error){
			return utils.http($http, 'post', '/api/scaleKeyMap/clone', param, success, error);
		};

		//获取plu
		apis.getPluList = function(param, success, error){
			return utils.http($http, 'get', '/api/plu' + param, null, success, error);
		};

		return apis;
	};	

	var services = {
		module: 'storeManage',
		name: 'storeManageService',
		getApis: getApis
	};

	return services;
});