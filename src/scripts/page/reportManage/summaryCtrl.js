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
			*@param t type sellType payType			
			*@param 0 amount
			*@param 1 weight
			*@param 2 count
			*@param 3 quantity
			*@param 0 'bar'
			*@param 1 'line'
			*/
			$scope.defaults.chart = {};			

			$scope.defaults.chart.t00 = {};
			$scope.defaults.chart.t01 = {};
			$scope.defaults.chart.t10 = {};
			$scope.defaults.chart.t11 = {};
			$scope.defaults.chart.t20 = {};
			$scope.defaults.chart.t21 = {};
			$scope.defaults.chart.t30 = {};
			$scope.defaults.chart.t31 = {};

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
					$scope.pluList = data;					
					buildUpSummaryData(data);
				})
			};

			//支付类型报表
			$scope.getReportDataByPayType = function(param){
				reportManageService.getReportDataByPayType(param, function(data){
					$scope.pluList = data;
				})
			};

			$scope.doSearchSummary = function(summarySearch){
				if(_.isNumber($scope.summarySearch.sellType)) return $scope.getReportDataBySellType(summarySearch);
				if(_.isNumber($scope.summarySearch.payTypeNo)) return $scope.getReportDataByPayType(summarySearch);
			};

			$scope.doSearchDetail = function(detailSearch){
				reportManageService.getTradeTotal(detailSearch, function(data){
					console.log(data);
				});
			};

			function buildUpSummaryData(data){
				var chartCats = [
						{
							type: 'totalPrice',
							name: '金额',
							yAxisTitle: '元'
						},
						{
							type: 'totalWeight',
							name: '重量',
							yAxisTitle: 'kg'
						},
						{
							type: 'totalCount',
							name: '次数',
							yAxisTitle: '次'
						},
						{
							type: 'totalQuantity',
							name: '数量',
							yAxisTitle: '个'
						}	
					];
					

				_.each(chartCats, function(cat, index){
					var config = {},
						o = {};

					config.series = [];
					config.xAxisCat = [];
					o.data = [];
					o.name = cat.name;

					_.each(data, function(e,i){
						o.data.push(e[cat.type]);
						config.xAxisCat.push(e.tradeTime);
					});

					config.series.push(o);
					config.yAxisTitle = cat.yAxisTitle;
					config.chartType = 'column';

					if(cat.type == 'totalPrice'){						
						$scope.defaults.chart.t00 = generateReportConfig(config);
						config = angular.copy(config);
						config.chartType = 'line';
						$scope.defaults.chart.t01 = generateReportConfig(config);
					}else if(cat.type == 'totalWeight'){						
						$scope.defaults.chart.t10 = generateReportConfig(config);
						config = angular.copy(config);
						config.chartType = 'line';
						$scope.defaults.chart.t11 = generateReportConfig(config);
					}else if(cat.type == 'totalCount'){						
						$scope.defaults.chart.t20 = generateReportConfig(config);
						config = angular.copy(config);
						config.chartType = 'line';
						$scope.defaults.chart.t21 = generateReportConfig(config);
					}else if(cat.type == 'totalQuantity'){						
						$scope.defaults.chart.t30 = generateReportConfig(config);
						config = angular.copy(config);
						config.chartType = 'line';
						$scope.defaults.chart.t31 = generateReportConfig(config);
					}
				});
			}

			function generateReportConfig(config){
				config =  config || {};

				return {
					title: {
						text: config.title
					},
					series: config.series,
					options: {
						chart: {
							width: '1185',
							type: config.chartType,
							zoomType: 'x'
						},
						tooltip: {

						},
						xAxis: {
							categories: config.xAxisCat
						},
						yAxis: {
							title: {
								text: config.yAxisTitle
							},
							plotLines: [{
				            	value: 0,
				                width: 1,
				                color: '#808080'
				            }]
						}
					}
				};
			}

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