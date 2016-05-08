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

			$scope.summarySearch.byInterval = $scope.dateTypeList[3].key;

			//顾客类型
			$scope.customerTypeList = constants.getCustomerType();

			//销售类型数据
			$scope.sellTypeList = constants.getSellType();

			$scope.summarySearch.sellType = $scope.sellTypeList[0].key;

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

			$scope.$watch('detailSearch.storeNo', function(newVal, oldVal){
				if(typeof newVal === 'undefined') return;
				$scope.getScaleList({storeNo: newVal}, newVal);
			});

			$scope.$watch('summarySearch.sellType', function(newVal, oldVal){				
				if(typeof newVal === 'number') $scope.summarySearch.payTypeNo = '';
			});

			$scope.$watch('summarySearch.payTypeNo', function(newVal, oldVal){
				if(typeof newVal === 'number') $scope.summarySearch.sellType = ''
			});

			$scope.$watch('detailSearch.detailSellType', function(newVal, oldVal){				
				if(typeof newVal === 'number') $scope.detailSearch.payType = '';
			});

			$scope.$watch('detailSearch.payType', function(newVal, oldVal){
				if(typeof newVal === 'number') $scope.detailSearch.detailSellType = '';
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
				var params = angular.copy(detailSearch);

				if(_.isNumber($scope.detailSearch.detailSellType)) return generatePage(params);
				if(_.isNumber($scope.detailSearch.payType)) return generatePage(params);				
			};

			function generatePage(params){									
				factory.generatePagination({
					id: 'pagination',
					options: {
						dataSource: reportManageService.getTradeTotal,
						ajax:{
							type: 'POST',
							data: params
						},
						pageSize: 10,
						callback: function(data, totalCount){
							$scope.trades = data;							
							$scope.$apply();
						}
					}
				});

			}

			function buildUpSummaryData(data){
				var chartCats = [
						{
							title: '金额',
							type: 'totalPrice',
							name: '金额',
							yAxisTitle: '元'
						},
						{
							title: '重量',
							type: 'totalWeight',
							name: '重量',
							yAxisTitle: 'kg'
						},
						{
							title: '次数',
							type: 'totalCount',
							name: '次数',
							yAxisTitle: '次'
						},
						{
							title: '数量',
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
						config.xAxisCat.push(utils.formatDate(e.tradeTime));
					});

					config.series.push(o);
					config.yAxisTitle = cat.yAxisTitle;
					config.title = cat.title;
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
								text: config.yAxisTitle,
								align: 'high',
								rotation: 0
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

			$scope.showTradeDetail = function(o){
				var flowNos = [];

				//checkPlu
				$scope.defaults.isShowTradeDetail = true;

				_.each($scope.trades, function(ele, index){
					ele.isChecked = false;
				});

				o.isChecked = true;

				flowNos.push(o.flowNo);

				reportManageService.getPluDetail(flowNos, function(data){
					$scope.tradeDetailPlus = data;
				});

				reportManageService.getPaymentDetail(flowNos, function(data){
					$scope.paymentCats = data;
					$scope.defaults.codeValue =  data[0].flowNo;				
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