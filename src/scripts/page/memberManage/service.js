define([
	'utils'
	], function(utils){
	'use strict';

	var getApis = function($http){
		var apis = {};
		
		//会员列表数据
		apis.getMemberList = function(param, success, error){
			return utils.http($http, 'get', '/api/compoundCustomer' + param, null, success, error);
		};

		//添加会员
		apis.createMember = function(param, success, error){
			return utils.http($http, 'post', '/api/compoundCustomer', param, success, error);
		};		

		//删除会员
		apis.deleteMember = function(param, success, error){
			return utils.http($http, 'delete', '/api/compoundCustomer/' + param.id, null, success, error);
		};

		//修改会员
		apis.updateMember = function(id, param, success, error){
			return utils.http($http, 'put', '/api/compoundCustomer/' + id, param, success, error);
		};

		//充值
		apis.recharge = function(param, success, error){
			return utils.http($http, 'post', '/api/savingRecord', param, success, error);
		};

		//修改密码
		apis.updatePassword = function(id, param, success, error){
			return utils.http($http, 'patch', '/api/compoundCustomer/' + id, param, success, error);
		};

		return apis;
	};	

	var services = {
		module: 'memberManage',
		name: 'memberManageService',
		getApis: getApis
	};

	return services;
});