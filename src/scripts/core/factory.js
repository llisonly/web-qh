define([
	'utils',
	'components/dialog',
	'pagination'
	], function(utils, dialog){
		'use strict';

		var init = function(){
			angular.module('common')
				.factory('factory', function(){

					var service = {};

					service.validateForm = function($scope, ngForm){
						if(ngForm.$valid){
							return true;
						}else{
							ngForm.$dirty = true;

							for(var i in ngForm){
								if(ngForm[i] && ngForm[i].hasOwnProperty && ngForm[i].hasOwnProperty('$dirty')){
									ngForm[i].$setDirty();
								}
							}
						}
						return true;
					};

					/**
					*@param id 生成分页DOM				
					*@param options 分页配置
					*@param callback 处理分页数据
					**/
					service.generatePagination = function(options){
						var params = {},
							defaults = {};					

						defaults = {
							dataSource: '',
							pageNumber: 1,
							showPageSizes: true,
							pageRange: 5,
							showPrevious: true,
							showNext: true,
							showGoInput: true,
							showGoButton: true,
							prevText: '上一页',
							nextText: '下一页',
							goButtonText: '跳转',
							hideWhenLessThanOnePage: true,
							triggerPagingOnInit: false,	
							locator: 'items',					
							alias: {
								pageNumber: 'Page',
								pageSize: 'Size'
							},
							callback: function(){}
						};

						if(options.options) {
							options.options.dataSource = utils.preUrl + options.options.dataSource;
							$.extend(defaults, options.options);
						}

						params[defaults.alias.pageSize] = defaults.pageSize;
						params[defaults.alias.pageNumber] = defaults.pageNumber;

						if(defaults.ajax && defaults.ajax.data) $.extend(params, defaults.ajax.data);

						$.ajax({
							type: (defaults.ajax && defaults.ajax.type) || 'GET',
							url: defaults.dataSource,
							data: params,
							success: function(data){
								defaults.totalNumber = data.totalCount;
								defaults.callback(data.items, data.totalCount);

								if(options.id) $('#' + options.id).pagination(defaults);
							}
						});
					};

					//dialog
					service.showDialog = function(options){
						new dialog(options);									
					};

					service.formatISODate = function(date){
						var dateTemp,
							oDate = {},
							sDate = '';

						if(!date) return '';
						
						dateTemp = new Date(date);

						oDate.y = dateTemp.getFullYear();
						oDate.m = dateTemp.getMonth() + 1;
						oDate.d = dateTemp.getDate();

						oDate.m = oDate.m <= 9 ? ('0' + oDate.m) : oDate.m;
						oDate.d = oDate.d <= 9 ? ('0' + oDate.d) : oDate.d;

						sDate = oDate.y + '-' + oDate.m + '-' + oDate.d;

						return sDate;
					}

					return service;
				});
		};

		return {
			init: init
		};	
	}
);