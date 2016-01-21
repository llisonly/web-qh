define([
	'utils'
	], function(utils){
	'use strict';

	var getApis = function($http){
		var apis = {};
		
		//员工列表
		apis.getStaffList = function(param, success, error){
			return utils.http($http, 'get', '/api/staff' + param, null, success, error);
		};

		//添加员工
		apis.createStaff = function(param, success, error){
			return utils.http($http, 'post', '/api/staff', param, success, error);
		};

		//删除员工
		apis.deleteStaff = function(param, success, error){
			return utils.http($http, 'delete', '/api/staff/' + param.id, null, success, error);
		};

		//修改员工
		apis.updateStaff = function(id, param, success, error){
			return utils.http($http, 'put', '/api/staff/' + id, param, success, error);
		};

		//设置密码
		apis.updateStaffPassword = function(staffNo, param, success, error){
			return utils.http($http, 'post', '/api/staff/changepassword/' + staffNo, param, success, error);
		};

		//员工详情
		apis.getStaffDetail = function(param, success, error){
			return utils.http($http, 'get', '/api/staff/' + param.id, null, success, error);
		};

		//员工角色
		apis.getStaffRoleList = function(param, success, error){
			return utils.http($http, 'get', '/api/staffRole', {params: param}, success, error);
		};

		//创建员工角色
		apis.createStaffRole = function(param, success, error){
			return utils.http($http, 'post', '/api/staffRole', param, success, error);
		};

		//更新员工角色
		apis.updateStaffRole = function(id, param, success, error){
			return utils.http($http, 'put', '/api/staffRole/' + id, param, success, error);
		};

		//员工门店
		apis.getStaffStoreList = function(param, success, error){
			return utils.http($http, 'get', '/api/staffStore', {params: param}, success, error);
		};

		//创建员工门店
		apis.createStaffStore = function(param, success, error){
			return utils.http($http, 'post', '/api/staffStore', param, success, error);
		};

		//更新员工门店
		apis.updateStaffStore = function(param, success, error){
			return utils.http($http, 'post', '/api/staffStore/update', param, success, error);
		};

		//角色列表
		apis.getRoleList = function(param, success, error){
			return utils.http($http, 'get', '/api/role', {params: param}, success, error);
		};

		//门店列表
		apis.getStoreList = function(param, success, error){
			return utils.http($http, 'get', '/api/store', {params: param}, success, error);
		};

		return apis;
	};	

	var services = {
		module: 'staffManage',
		name: 'staffManageService',
		getApis: getApis
	};

	return services;
});