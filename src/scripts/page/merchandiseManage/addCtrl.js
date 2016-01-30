define([
	'utils'	
	], function(utils){
		'use strict';
		
		var ctrl = ['$scope', 'factory', 'merchandiseManageService', '$state', '$q', 'constants', function($scope, factory, merchandiseManageService, $state, $q, constants){			
			$scope.plu = {};
			$scope.defaults = {};
			$scope.validator = {};

			$scope.isEditPage = false;		

			$scope.plu.allowDiscount = false;
			$scope.plu.allowChangePrice = false;

			$scope.defaults.firstPluGroup = {};
			$scope.defaults.secondPluGroup = {};
			$scope.defaults.tare = {};			

			//是否显示一级、二级分类错误提示
			$scope.validator.firstPluGroup = false;
			$scope.validator.secondPluGroup = false;			
			$scope.validator.tare = false;

			//form data
			$scope.firstPluGroup = {};
			$scope.secondPluGroup = {};
			$scope.tare = {};

			//计价单位数据
			$scope.unitOfAccountList = constants.getUnitOfAccount();

			$scope.unitList = constants.getUnitList();

			$scope.resetFirstPluGroup = function(){
				$scope.defaults.firstPluGroup.name = '请选择一级类别';
				$scope.defaults.firstPluGroup.id = '';
				$scope.plu.parentPLUGroupId = '';
			};

			$scope.resetSecondPluGroup = function(){
				$scope.defaults.secondPluGroup.name = '请选择二级类别';
				$scope.defaults.secondPluGroup.id = '';
				$scope.plu.pluGroupId = '';
			};

			$scope.resetTare = function(){				
				$scope.defaults.tare.desc = '请选择皮重';
				$scope.defaults.tare.weight = '';
				$scope.defaults.tare.unit = '';
				$scope.defaults.tare.id = '';
				$scope.plu.tareId = '';
			};
			
			$scope.getPluGroupList = function(condition){
				var deferred = $q.defer();

				condition = condition ? utils.toQuery(condition) : '';
				merchandiseManageService.getPlugroup(condition, function(data){					
					deferred.resolve(data.items);
				});

				return deferred.promise;
			};

			//获取一级分类
			$scope.getFirstPluGroupList = function(){
				var deferred = $q.defer();
				$scope.getPluGroupList({filter: {parentPLUGroupId: 0}}).then(function(data){
					$scope.firstPluGroupList =  data;
					deferred.resolve();
				});
				return deferred.promise;
			};

			//获取二级分类
			$scope.getSecondPluGroupList = function(parentPLUGroupId){
				var deferred = $q.defer();
				$scope.getPluGroupList({filter: {parentPLUGroupId: parentPLUGroupId}}).then(function(data){
					$scope.secondPluGroupList = data;
					deferred.resolve();
				});
				return deferred.promise;
			};

			$scope.$watch('plu.parentPLUGroupId', function(newVal, oldVal){
				if(typeof newVal === 'undefined') return;
				$scope.getSecondPluGroupList(newVal);
			});

			$scope.getTare = function(condition){
				var deferred = $q.defer();
				merchandiseManageService.getTare(condition, function(data){
					$scope.tareList = data.items;
					deferred.resolve();
				});
				return deferred.promise;
			};			

			$scope.selectFirstPluGroup = function(o){
				_.each($scope.firstPluGroupList, function(ele, index){
					ele.checked = false;

					if(ele.pluGroupId == o.pluGroupId){
						ele.checked = true;
						$scope.defaults.firstPluGroup.name = ele.pluGroupName;
						$scope.defaults.firstPluGroup.id = ele.pluGroupId;
						$scope.plu.parentPLUGroupId = ele.pluGroupId;
					}
				});				
			};

			$scope.deleteFirstPluGroup = function($event, index){
				var id = $scope.firstPluGroupList[index].pluGroupId;

				$event.stopPropagation();
				factory.showDialog({
					type: 'confirm',
					okCallback: function(e){
						merchandiseManageService.deletePluGroup({id: id}, function(data){
							factory.showDialog({
								type: 'success',
								text: '删除成功'
							});
							$scope.firstPluGroupList.splice(index, 1);
							if($scope.defaults.firstPluGroup.id == id) $scope.resetFirstPluGroup();
						});
					}
				});
			};

			$scope.showFirstPluGroupForm = function($event, o){
				$event.stopPropagation();
				$scope.isEditFirstPluGroup = o ? true : false;
				$scope.firstPluGroup = o ? angular.copy(o) : {};
				$('#J_modal-firstPluGroupForm').modal('show');
			};

			$scope.doSaveFirstPluGroup = function(firstPluGroup, $event){
				if($event && $event.which != 13) return;
				factory.validateForm($scope, $scope.firstPluGroupForm);
				if($scope.firstPluGroupForm.$valid){
					if(!firstPluGroup.parentPLUGroupId) firstPluGroup.parentPLUGroupId = 0;				
					if(!$scope.isEditFirstPluGroup){
						merchandiseManageService.createPluGroup(firstPluGroup, function(data){
							$('#J_modal-firstPluGroupForm').modal('hide');
							$scope.firstPluGroupForm.$setPristine();
							factory.showDialog({
								type: 'success',
								text: '添加成功',
								closeCallback: function(e){
									$scope.getFirstPluGroupList();
								}
							});
						});
					}else{
						merchandiseManageService.updatePluGroup(firstPluGroup.pluGroupId, firstPluGroup, function(data){
							$('#J_modal-firstPluGroupForm').modal('hide');
							$scope.firstPluGroupForm.$setPristine();

							$scope.getFirstPluGroupList().then(function(){
								$scope.selectFirstPluGroup({pluGroupId: firstPluGroup.pluGroupId});
							});

							factory.showDialog({
								type: 'success',
								text: '修改成功'
							});
						});
					}						
				}
			};

			$scope.selectSecondPluGroup = function(o){
				_.each($scope.secondPluGroupList, function(ele, index){
					ele.checked = false;

					if(ele.pluGroupId == o.pluGroupId){
						ele.checked = true;
						$scope.defaults.secondPluGroup.name = ele.pluGroupName;
						$scope.defaults.secondPluGroup.id = ele.pluGroupId;
						$scope.plu.pluGroupId = ele.pluGroupId;
					}
				});				
			};

			$scope.deleteSecondPluGroup = function($event, index){
				var id = $scope.secondPluGroupList[index].pluGroupId;
				
				$event.stopPropagation();
				factory.showDialog({
					type: 'confirm',
					okCallback: function(e){
						merchandiseManageService.deletePluGroup({id: id}, function(data){
							factory.showDialog({
								type: 'success',
								text: '删除成功'
							});
							$scope.secondPluGroupList.splice(index, 1);
							if($scope.defaults.secondPluGroup.id == id) $scope.resetSecondPluGroup();
						});
					}
				});
			};

			$scope.showSecondPluGroupForm = function($event, o){
				$event.stopPropagation();
				$scope.isEditSecondPluGroup = o ? true : false;
				if(!$scope.isEditSecondPluGroup && !$scope.plu.parentPLUGroupId){
					factory.showDialog({
						type: 'error',
						text: '请选择一级类别'
					});
					return;
				}
				$scope.secondPluGroup = o ? angular.copy(o) : {};
				$('#J_modal-secondPluGroupForm').modal('show');			
			};

			$scope.doSaveSecondPluGroup = function(secondPluGroup, $event){
				if($event && $event.which != 13) return;				
				factory.validateForm($scope, $scope.secondPluGroupForm);
				if($scope.secondPluGroupForm.$valid){
					if(!secondPluGroup.parentPLUGroupId) secondPluGroup.parentPLUGroupId = $scope.plu.parentPLUGroupId;
					if(!$scope.isEditSecondPluGroup){
						merchandiseManageService.createPluGroup(secondPluGroup, function(data){
							$('#J_modal-secondPluGroupForm').modal('hide');
							$scope.secondPluGroupForm.$setPristine();
							factory.showDialog({
								type: 'success',
								text: '添加成功',
								closeCallback: function(e){
									$scope.getSecondPluGroupList(secondPluGroup.parentPLUGroupId);
								}
							});
						});
					}else{
						merchandiseManageService.updatePluGroup(secondPluGroup.pluGroupId, secondPluGroup, function(data){
							$('#J_modal-secondPluGroupForm').modal('hide');
							$scope.secondPluGroupForm.$setPristine();

							$scope.getSecondPluGroupList(secondPluGroup.parentPLUGroupId).then(function(){
								$scope.selectSecondPluGroup({pluGroupId: secondPluGroup.pluGroupId});
							});

							factory.showDialog({
								type: 'success',
								text: '修改成功'
							});
						});
					}					
				}
			};

			$scope.selectTare = function(o){
				_.each($scope.tareList, function(ele, index){
					ele.checked = false;

					if(ele.tareId == o.tareId){
						ele.checked = true;
						$scope.defaults.tare.desc = ele.desc;
						$scope.defaults.tare.weight = ele.weight;
						$scope.defaults.tare.unit = ele.unit;
						$scope.defaults.tare.id = ele.tareId;
						$scope.plu.tareId = ele.tareId;
					}
				});				
			};

			$scope.deleteTare = function($event, index){
				var id = $scope.tareList[index].tareId;
				$event.stopPropagation();
				factory.showDialog({
					type: 'confirm',
					okCallback: function(e){
						merchandiseManageService.deleteTare({id: id}, function(data){
							factory.showDialog({
								type: 'success',
								text: '删除成功'
							});
							$scope.tareList.splice(index, 1);
							if($scope.defaults.tare.id == id) $scope.resetTare();
						});
					}
				})
			};

			$scope.showTareForm = function($event, o){
				$event.stopPropagation();
				$scope.isEditTare = o ? true : false;
				$scope.tare = o ? angular.copy(o) : {};
				$('#J_modal-tareForm').modal('show');
			};
			
			$scope.doSaveTare = function(tare, $event){
				if($event && $event.which != 13) return;							
				factory.validateForm($scope, $scope.tareForm);
				if($scope.tareForm.$valid){
					if(!$scope.isEditTare){
						merchandiseManageService.createTare(tare, function(data){
							$('#J_modal-tareForm').modal('hide');
							$scope.tareForm.$setPristine();
							factory.showDialog({
								type: 'success',
								text: '添加成功',
								closeCallback: function(e){
									$scope.getTare();
								}
							});
						});
					}else{
						merchandiseManageService.updateTare(tare.tareId, tare, function(data){
							$('#J_modal-tareForm').modal('hide');
							$scope.tareForm.$setPristine();

							$scope.getTare().then(function(){
								$scope.selectTare({tareId: tare.tareId});
							});
							
							factory.showDialog({
								type: 'success',
								text: '修改成功'
							});
						});
					}					
				}
			};

			$scope.$watch('plu.parentPLUGroupId', function(newVal, oldVal){
				if(typeof newVal == 'undefined') return;
				$scope.validator.firstPluGroup = false;
			});

			$scope.$watch('plu.pluGroupId', function(newVal, oldVal){
				if(typeof newVal == 'undefined') return;
				$scope.validator.secondPluGroup = false;
			});

			$scope.$watch('plu.tareId', function(newVal, oldVal){
				if(typeof newVal == 'undefined') return;
				$scope.validator.tare = false;
			});

			$scope.doSavePlu = function(plu, $event){				
				if($event && $event.which !== 13) return;
				factory.validateForm($scope, $scope.addPluForm);
				if(!plu.parentPLUGroupId) $scope.validator.firstPluGroup = true;
				if(!plu.pluGroupId) $scope.validator.secondPluGroup = true;
				if(!plu.tareId) $scope.validator.tare = true;

				if($scope.validator.firstPluGroup || $scope.validator.secondPluGroup || $scope.validator.tare) return;

				if($scope.addPluForm.$valid){					
					merchandiseManageService.createPlu(plu, function(data){
						factory.showDialog({
							type: 'success',
							text: '添加成功',
							closeCallback: function(e){
								$state.go('main.merchandiseManage.list');
							}
						});
					});
				}				
			};

			$scope.doSaveAndAddPlu = function(plu){
				factory.validateForm($scope, $scope.addPluForm);

				if(!plu.parentPLUGroupId) $scope.validator.firstPluGroup = true;
				if(!plu.pluGroupId) $scope.validator.secondPluGroup = true;
				if(!plu.tareId) $scope.validator.tare = true;

				if($scope.validator.firstPluGroup || $scope.validator.secondPluGroup || $scope.validator.tare) return;				

				if($scope.addPluForm.$valid){
					merchandiseManageService.createPlu(plu, function(data){
						factory.showDialog({
							type: 'success',
							text: '添加成功'
						});
					});
				}
			};

			$scope.init = function(){
				$scope.resetFirstPluGroup();	
				$scope.resetSecondPluGroup();	
				$scope.resetTare();	
				$scope.getTare();
				$scope.getFirstPluGroupList();
			};

			$scope.init();
		}];

		var controller = {
			module: 'merchandiseManage',
			name: 'merchandiseManageAddController', 
			ctrl: ctrl
		};

		return controller;
	}
);