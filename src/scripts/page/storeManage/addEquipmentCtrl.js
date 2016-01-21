define([
	'utils'	
	], function(utils){
		'use strict';
		
		var ctrl = ['$scope', 'factory', 'storeManageService', '$stateParams', '$state', function($scope, factory, storeManageService, $stateParams, $state){
			$scope.scale = {};
			$scope.isEditPage = false;
			$scope.defaults = {};
			$scope.copy = {};
			$scope.validator = {};

			$scope.validator.scaleKeyMap = false;

			$scope.defaults.storeNo = $stateParams.storeNo;

			$scope.doSaveScale = function(scale, $event){
				if($event && $event.which != 13) return;
				factory.validateForm($scope, $scope.addScaleForm);
				if($scope.addScaleForm.$valid){
					scale.storeNo = $scope.defaults.storeNo;
					storeManageService.createScale(scale, function(data){
						var scaleId = data;

						if(_.isNumber(scaleId)){
							storeManageService.createScaleRunningText({scaleId: scaleId, text: scale.scaleRunningText}, function(data){
								factory.showDialog({
									type: 'success',
									text: '添加成功',
									closeCallback: function(e){
										$state.go('main.storeManage.equipmentList', {storeNo: $scope.defaults.storeNo});
									}
								});
							});
						}						
					});
				}
			};

			$scope.doSaveAndAddScale = function(scale){
				factory.validateForm($scope, $scope.addScaleForm);
				if($scope.addScaleForm.$valid){
					scale.storeNo = $scope.defaults.storeNo;
					storeManageService.createScale(scale, function(data){
						var scaleId = data;

						if(_.isNumber(scaleId)){
							storeManageService.createScaleRunningText({scaleId: scaleId, text: scale.scaleRunningText}, function(data){
								factory.showDialog({
									type: 'success',
									text: '添加成功'									
								});
							});
						}
					});
				}
			};

			$scope.init = function(){
				
			};

			$scope.init();
		}];

		var controller = {
			module: 'storeManage',
			name: 'storeManageAddEquipmentController', 
			ctrl: ctrl
		};

		return controller;
	}
);