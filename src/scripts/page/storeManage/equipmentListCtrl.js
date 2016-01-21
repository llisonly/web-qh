define([
	'utils'
	], function(utils){
		'use strict';
		
		var ctrl = ['$scope', 'factory', 'storeManageService', '$stateParams', '$q', function($scope, factory, storeManageService, $stateParams, $q){
			//默认显示搜索栏
			$scope.isShowSearchbar = true;
			$scope.defaults = {};
			$scope.search = {};

			$scope.defaults.storeNo = $stateParams.storeNo;

			$scope.getStoreList = function(condition){
				var deferred = $q.defer();
				storeManageService.getStoreList(condition, function(data){
					$scope.storeList = data.items;
					deferred.resolve();
				});
				return deferred.promise;
			};

			$scope.findStore = function(storeNo){
				var	o = _.find($scope.storeList, function(ele){
					return ele.storeNo == storeNo;
				});

				return o;
			};

			$scope.getScaleList = function(condition){
				$scope.loadingStatus = true;
				condition = condition ? utils.toQuery({filter: condition}) : '';
				storeManageService.getScaleList(condition, function(data){
					data = data.items;
					$scope.scaleList = _.filter(data, function(ele){
						return ele.storeNo == $scope.defaults.storeNo;
					});
					$scope.loadingStatus = false;
				});
			};

			$scope.getScaleRunningTextList = function(condition){
				var deferred = $q.defer();
				storeManageService.getScaleRunningTextList(condition, function(data){
					$scope.scaleRunningTextList = data.items;
					deferred.resolve();
				});
				return deferred.promise;
			};

			$scope.findScaleRunningText = function(scaleId){
				var o = _.find($scope.scaleRunningTextList, function(element, index, list){
					return element.scaleId == scaleId;
				});
				return o;
			};

			$scope.throttledSearch = _.throttle(function(){
				var condition= angular.copy($scope.search);

				if(_.isEmpty(condition)) return;
				//模糊搜索
				if(condition.scaleId) condition.scaleId = utils.addPercent(condition.scaleId);				
				if(condition.networkIPAddress) condition.networkIPAddress = utils.addPercent(condition.networkIPAddress);
				if(condition.serverPort) condition.serverPort = utils.addPercent(condition.serverPort);

				$scope.getScaleList(condition);
			}, 500);

			$scope.$watch('search', function(){
				$scope.throttledSearch();
			}, true);

			$scope.doDeleteScale = function(o){
				factory.showDialog({
					type: 'confirm',
					okCallback: function(e){
						storeManageService.deleteScale({id: o.id}, function(data){
							factory.showDialog({
								type: 'success',
								text: '删除成功',
								closeCallback: function(e){
									$scope.getScaleList($scope.search);
								}
							});
						});
					}
				});				
			};

			$scope.init = function(){
				$q.all([$scope.getScaleRunningTextList(), $scope.getStoreList()]).then(function(){
					$scope.getScaleList({storeNo: $scope.defaults.storeNo});
					$scope.defaults.storeName = $scope.findStore($scope.defaults.storeNo).name;
				});
			};

			$scope.init();
								
		}];

		var controller = {
			module: 'storeManage',
			name: 'storeManageEquipmentListController', 
			ctrl: ctrl
		};

		return controller;
	}
);