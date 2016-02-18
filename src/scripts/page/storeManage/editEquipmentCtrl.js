define([
	'utils'	
	], function(utils){
		'use strict';
		
		var ctrl = ['$scope', 'factory', 'storeManageService', '$stateParams', '$q', '$state', function($scope, factory, storeManageService, $stateParams, $q, $state){
			$scope.scale = {};
			$scope.isEditPage = true;
			$scope.defaults = {};
			$scope.copy = {};
			$scope.validator = {};

			$scope.validator.scaleKeyMap = false;

			$scope.defaults.storeNo = $stateParams.storeNo;
			$scope.defaults.scaleId = $stateParams.scaleId;

			$scope.getScaleKeyMapList = function(condition){
				storeManageService.getScaleKeyMapList(condition, function(data){
					$scope.scaleKeyMapList = data.items;
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

			$scope.getScaleDetail = function(condition){
				var deferred = $q.defer();
				storeManageService.getScaleDetail(condition, function(data){
					$scope.scale = data;
					$scope.scale.scaleRunningText = $scope.findScaleRunningText($scope.scale.id).text;
					$scope.scale.scaleRunningTextId = $scope.findScaleRunningText($scope.scale.id).id;
					deferred.resolve();				
				});
				return deferred.promise;
			};

			$scope.getStoreList = function(condition){
				storeManageService.getStoreList(condition, function(data){
					$scope.storeList = data.items;
				});
			};

			$scope.$watch('copy.storeNo', function(newVal, oldVal){
				var condition = newVal ? utils.toQuery({filter: {storeNo: newVal}}) : '';

				storeManageService.getScaleList(condition, function(data){
					$scope.scaleList = data.items;
				});
			});

			$scope.showCopyForm = function(type){
				if(type == 'scaleKeyMap') $scope.copyScaleKeyMap = true;			
				$('#J_modal-copyForm').modal('show');
			};

			$scope.doCopy = function(copy){
				factory.validateForm($scope, $scope.copyForm);

				if($scope.copyForm.$valid){
					if($scope.copyScaleKeyMap){
						storeManageService.cloneScaleKeyMap({
							sourceScaleId: $scope.scale.scaleId,
							destScaleId: copy.scaleId
						}, function(data){
							$('#J_modal-copyForm').modal('hide');
							$scope.copyForm.$setPristine();
							factory.showDialog({
								type: 'success',
								text: '复制成功'
							});
						});
					}else{
						storeManageService.cloneScale({
							sourceScaleId: $scope.scale.scaleId,
							destScaleId: copy.scaleId
						}, function(data){
							$('#J_modal-copyForm').modal('hide');
							$scope.copyForm.$setPristine();
							factory.showDialog({
								type: 'success',
								text: '复制成功'
							});
						});
					}					
				}							
			};

			$scope.doSaveScale = function(scale, $event){
				var scaleId = scale.id,
					params = {};

				if($event && $event.which != 13) return;
				factory.validateForm($scope, $scope.addScaleForm);
				if(!$scope.scaleKeyMapList.length) return $scope.validator.scaleKeyMap = true;
				if($scope.addScaleForm.$valid){
					params.id = scaleId;
					params.storeNo = $scope.defaults.storeNo;
					params.scaleIdInStore = scale.scaleIdInStore;
					params.scaleRunningText = scale.scaleRunningText;										
					params.serverPort = '8001';
					params.serverIPAddr = '127.0.0.1';

					storeManageService.updateScale(scaleId, params, function(data){
						storeManageService.updateScaleRunningText(scale.scaleRunningTextId, {id: scale.scaleRunningTextId,scaleId: scaleId, text: scale.scaleRunningText}, function(data){
							factory.showDialog({
								type: 'success',
								text: '修改成功',
								closeCallback: function(e){
									$state.go('main.storeManage.equipmentList', {storeNo: $scope.defaults.storeNo});
								}
							});
						});
					});
				}
			};

			$scope.init = function(){
				$scope.getScaleRunningTextList().then(function(){
					$scope.getScaleDetail({id: $scope.defaults.scaleId}).then(function(){
						$scope.getScaleKeyMapList({scaleId: $scope.scale.scaleId});
					});
				});
				$scope.getStoreList();
			};

			$scope.init();	
		}];

		var controller = {
			module: 'storeManage',
			name: 'storeManageEditEquipmentController', 
			ctrl: ctrl
		};

		return controller;
	}
);