define([
	'utils',
	'bootstrap'
	], function(utils){
		'use strict';
		
		var ctrl = ['$scope', '$state', 'merchandisePriceService', 'merchandiseManageService', 'factory', '$q', function($scope, $state, merchandisePriceService, merchandiseManageService, factory, $q){
			//默认显示搜索栏
			$scope.isShowSearchbar = true;
			$scope.defaults = {};
			$scope.search = {};

			$scope.isShowPlu = false;			

			//form data
			$scope.plu = {};

			//一级分类数据
			$scope.firstPluGroupList = [];

			//二级分类数据
			$scope.secondPluGroupListTemp = [];
			$scope.secondPluGroupList = [];

			//门店列表
			$scope.getStoreList = function(condition){
				var deferred = $q.defer();
				merchandisePriceService.getStoreList(condition, function(data){
					$scope.storeList = data.items;
					deferred.resolve();
				});
				return deferred.promise;
			};

			//storePlu
			$scope.getStorePluList = function(condition){
				var deferred = $q.defer();
				merchandisePriceService.getStorePlu(condition, function(data){
					$scope.storePluList = data.items;
					deferred.resolve();
				});
				return deferred.promise;
			};

			//storePluVipPrice
			$scope.getStorePluVipPriceList = function(condition){
				var deferred = $q.defer();
				merchandisePriceService.getStorePluVipPrice(condition, function(data){
					$scope.storePluVipPriceList = data.items;
					deferred.resolve();
				});
				return deferred.promise;
			};

			$scope.$watch('defaults.storeId', function(newVal, oldVal){
				if(newVal == undefined) return;

				$q.all([$scope.getStorePluList($scope.generateParam(newVal)), $scope.getStorePluVipPriceList($scope.generateParam(newVal))]).then(function(){
					$scope.combinePluList();
				});				
			});

			$scope.generateParam = function(storeId){
				var param = '?';

				_.each($scope.pluList, function(ele, index){
					param += 'f=pluId&t=' + ele.pluId + '&';
				});
				param += 'f=storeNo&t=' + storeId;

				return param;
			};

			$scope.combinePluList = function(){				
				_.each($scope.pluList, function(element, index, list){
					//当前零售价
					element.currentPrice = element.price;
					element.storePluId = '';
					//当前会员价
					element.currentVipPrice = '';
					element.storePluVipPriceId = '';

					_.each($scope.storePluList, function(e, i, l){
						if(element.pluId == e.pluId){
							element.currentPrice = e.price;
							element.storePluId = e.id;
							return;
						}
					});

					_.each($scope.storePluVipPriceList, function(e, i, l){
						if(element.pluId == e.pluId){
							element.currentVipPrice = e.vipPrice;
							element.storePluVipPriceId = e.id;
							return;
						}
					});
				});
				$scope.isShowPlu = true;
			};

			//获取全部分类数据
			$scope.getPluGroup = function(condition){
				var deferred = $q.defer();
				condition = condition ? utils.toQuery(condition) : '';
				merchandiseManageService.getPlugroup(condition, function(data){
					$scope.pluGroupList = data.items;
					deferred.resolve();
				});
				return deferred.promise;
			};

			$scope.$watch('pluGroupList', function(newVal, oldVal){
				if(!newVal) return;
				if(!newVal.length) return;
				$scope.firstPluGroupList = _.filter(newVal, function(ele){
					return ele.parentPLUGroupId == 0;
				});
				$scope.secondPluGroupListTemp = _.filter(newVal, function(ele){
					return ele.parentPLUGroupId != 0;
				});
			});

			$scope.$watch('search.parentPLUGroupId', function(newVal, oldVal){
				$scope.secondPluGroupList = _.filter($scope.secondPluGroupListTemp, function(ele){
					return ele.parentPLUGroupId == newVal;
				});
			});

			$scope.findPluGroup = function(pluGroup, pluGroupId){
				var o = _.find(pluGroup, function(ele){
					return ele.pluGroupId == pluGroupId;
				});

				return o;
			};		

			$scope.getTare = function(condition){
				var deferred = $q.defer();
				merchandiseManageService.getTare(condition, function(data){
					$scope.tareList = data.items;
					deferred.resolve();
				});
				return deferred.promise;
			};

			$scope.findTare = function(tareList, tareId){
				var o = _.find(tareList, function(ele){
					return ele.tareId == tareId;
				});

				return o;				
			};			

			$scope.getPluCountOnce = _.once(function(totalCount){
				$scope.defaults.pluCount = totalCount;
			});

			$scope.generatePage = function(condition){
				$scope.loadingStatus = true;			
				condition = condition ? utils.toQuery(condition) : '';					
				factory.generatePagination({
					id: 'pagination',
					options: {
						dataSource: merchandiseManageService.getPluList + condition,
						pageSize: 10,
						callback: function(data, totalCount){
							$scope.getPluCountOnce(totalCount);
							$scope.pluList = data;
							$q.all([$scope.getStorePluList($scope.generateParam($scope.defaults.storeId)), $scope.getStorePluVipPriceList($scope.generateParam($scope.defaults.storeId))]).then(function(){
								$scope.combinePluList();
								$scope.loadingStatus = false;
							});														
							$scope.$apply();
						}
					}
				});				
			};

			$scope.throttledSearch = _.throttle(function(){
				var condition= angular.copy($scope.search);
				
				if(_.isEmpty(condition)) return;
				//模糊搜索
				if(condition.itemId) condition.itemId = utils.addPercent(condition.itemId);
				if(condition.pluNo) condition.pluNo = utils.addPercent(condition.pluNo);
				if(condition.pluName) condition.pluName = utils.addPercent(condition.pluName);
				if(condition.pluShortName) condition.pluShortName = utils.addPercent(condition.pluShortName);

				for(var o in condition){
					if(!condition[o]) delete condition[o];
				}
				
				$scope.generatePage({filter: condition});
			}, 500);

			$scope.$watch('search', function(){
				$scope.throttledSearch();
			}, true);

			$scope.showEditPluForm = function(o){
				$scope.plu = angular.copy(o);
				if($scope.defaults.storeId) $scope.plu.storeNo = $scope.defaults.storeId;						
				$('#J_modal-editPluForm').modal('show');				
			};

			$scope.savePluFormSuccess = function(){
				$('#J_modal-editPluForm').modal('hide');
				$scope.editPluForm.$setPristine();
				factory.showDialog({
					type: 'success',
					text: '操作成功',
					closeCallback: function(e){
						$scope.generatePage({filter: $scope.search});
					}
				});
			};

			$scope.doSavePluForm = function(plu, $event){
				var params = {},
					params2 = {};

				if($event && $event.which != 13) return;

				factory.validateForm($scope, $scope.editPluForm);

				if($scope.editPluForm.$valid){
					params.id = plu.storePluId;
					params.storeNo = plu.storeNo;
					params.pluId = plu.pluId;
					params.price = plu.currentPrice;

					params2.id = plu.storePluVipPriceId;
					params2.storeNo = plu.storeNo;
					params2.pluId = plu.pluId;
					params2.vipPrice = plu.currentVipPrice;
					if(!params.id){
						merchandisePriceService.createPrice(params, function(data){
							if(params2.vipPrice){
								if(params2.id){
									merchandisePriceService.updateVipPrice(params2.id, params2, function(data){
										$scope.savePluFormSuccess();
									});
								}else{
									merchandisePriceService.createVipPrice(params2, function(data){
										$scope.savePluFormSuccess();
									});
								}
							}else{
								$scope.savePluFormSuccess();
							}
						});
					}else{
						merchandisePriceService.updatePrice(params.id, params, function(data){
							if(params2.vipPrice){
								if(params2.id){
									merchandisePriceService.updateVipPrice(params2.id, params2, function(data){
										$scope.savePluFormSuccess();
									});
								}else{
									merchandisePriceService.createVipPrice(params2, function(data){
										$scope.savePluFormSuccess();
									});
								}
							}else{
								$scope.savePluFormSuccess();
							}							
						});
					}					
				}				
			};

			$scope.init = function(){
				$q.all([$scope.getPluGroup(), $scope.getTare(), $scope.getStoreList()]).then(function(){
					$scope.generatePage();
				});				
			};

			$scope.init();			
		}];

		var controllers = [
			{module: 'merchandisePrice', name: 'merchandisePriceListController', ctrl: ctrl}
		];

		return controllers;
	}
);