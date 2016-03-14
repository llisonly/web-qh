define([
	'utils'	
	], function(utils){
		'use strict';
		
		var ctrl = ['$scope', '$state', 'reportManageService', '$cookies', 'factory', 'constants', function($scope, $state, reportManageService, $cookies, factory, constants){
			//默认显示搜索栏
			$scope.isShowSearchbar = true;

			$scope.summarySearch = {};
			$scope.detailSearch = {};

			//存储对象
			$scope.defaults = {};
			/**
			*@param 0 'bar'
			*@param 1 'line'
			*@param 2 'table'
			*/
			$scope.defaults.chartType = 0;

			//报表类型数据
			$scope.reportCatList = [
				{name: '商品汇总报表', conditionUrl: 'summaryCondition.html', resultUrl: 'summaryResult.html'},
				{name: '商品明细报表', conditionUrl: 'detailCondition.html', resultUrl: 'detailResult.html'}
			];

			$scope.defaults.reportCat = $scope.reportCatList[0];

			//时间类型数据
			$scope.dateTypeList = constants.getDateType();

			//顾客类型
			$scope.customerTypeList = constants.getCustomerType();

			//销售类型数据
			$scope.sellTypeList = constants.getSellType();

			//支付类型数据
			$scope.payTypeList = constants.getPayType();

			//门店列表
			$scope.getStoreList = function(){
				reportManageService.getStoreList(null, function(data){
					$scope.storeList = data.items;
				});
			};

			$scope.getScaleList = function(condition, storeNo){
				condition = condition ? utils.toQuery({filter: condition}) : '';
				reportManageService.getScaleList(condition, function(data){
					data = data.items;
					$scope.scaleList = _.filter(data, function(ele){
						return ele.storeNo == storeNo;
					});					
				});
			};

			$scope.$watch('summarySearch.storeNo', function(newVal, oldVal){
				if(typeof newVal === 'undefined') return;
				$scope.getScaleList({storeNo: newVal}, newVal);
			});

			$scope.$watch('summarySearch.sellType', function(newVal, oldVal){				
				if(typeof newVal === 'number') $scope.summarySearch.payTypeNo = '';
			});

			$scope.$watch('summarySearch.payTypeNo', function(newVal, oldVal){
				if(typeof newVal === 'number') $scope.summarySearch.sellType = ''
			});

			//销售类型报表
			$scope.getReportDataBySellType = function(param){
				reportManageService.getReportDataBySellType(param, function(data){
					console.log(data);
				})
			};

			//支付类型报表
			$scope.getReportDataByPayType = function(param){
				reportManageService.getReportDataByPayType(param, function(data){
					console.log(data);
				})
			};

			$scope.doSearchSummary = function(summarySearch){
				if(_.isNumber($scope.summarySearch.sellType)) return $scope.getReportDataBySellType();
				if(_.isNumber($scope.summarySearch.payTypeNo)) return $scope.getReportDataByPayType();
			};

			$scope.doSearchDetail = function(detailSearch){
				reportManageService.getTradeTotal(detailSearch, function(data){
					console.log(data);
				});
			};

			$scope.init = function(){
				$scope.getStoreList();
			};

			$scope.init();
			
		}];

		var controller = {
			module: 'reportManage', 
			name: 'reportManageSummaryController', 
			ctrl: ctrl
		};

		return controller;
	}
);