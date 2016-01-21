define([
	'utils'
	], function(utils){
	'use strict';

	var getApis = function($http){
		var apis = {};

		//获取plu
		apis.getPluList = '/api/plu';

		//添加plu
		apis.createPlu = function(param, success, error){
			return utils.http($http, 'post', '/api/plu', param, success, error);
		};

		//修改plu
		apis.updatePlu = function(id, param, success, error){
			return utils.http($http, 'put', '/api/plu/' + id, param, success, error);
		};

		//删除plu
		apis.deletePlu = function(param, success, error){
			return utils.http($http, 'delete', '/api/plu/'+ param.id, null, success, error);
		};

		//分类
		apis.getPlugroup = function(param, success, error){
			return utils.http($http, 'get', '/api/plugroup' + param, null, success, error);
		};

		//新增分类
		apis.createPluGroup = function(param, success, error){
			return utils.http($http, 'post', '/api/plugroup', param, success, error);
		};

		//修改分类
		apis.updatePluGroup = function(id, param, success, error){
			return utils.http($http, 'put', '/api/plugroup/'+ id, param, success, error);
		};

		//删除分类
		apis.deletePluGroup = function(param, success, error){
			return utils.http($http, 'delete', '/api/plugroup/'+ param.id, null, success, error);
		};

		//皮重
		apis.getTare = function(param, success, error){
			return utils.http($http, 'get', '/api/tare', {params: param}, success, error);
		};

		//添加皮重
		apis.createTare = function(param, success, error){
			return utils.http($http, 'post', '/api/tare', param, success, error);
		};

		//修改皮重
		apis.updateTare = function(id, param, success, error){
			return utils.http($http, 'put', '/api/tare/' + id, param, success, error);
		};

		//删除皮重
		apis.deleteTare = function(param, success, error){
			return utils.http($http, 'delete', '/api/tare/'+ param.id, null, success, error);
		};
		
		//plu详情
		apis.getPluDetail = function(param, success, error){
			return utils.http($http, 'get', '/api/plu/' + param.id, null, success, error);
		};	

		return apis;
	};	

	var services = {
		module: 'merchandiseManage',
		name: 'merchandiseManageService',
		getApis: getApis
	};

	return services;
});