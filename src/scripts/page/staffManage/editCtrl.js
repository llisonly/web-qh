define([], function(){
		'use strict';
		
		var ctrl = ['$scope', 'factory', 'staffManageService', '$stateParams', '$state', '$q', function($scope, factory, staffManageService, $stateParams, $state, $q){

			$scope.staff = {};			
			$scope.isEditPage = true;			
			//是否全选门店/默认为否
			$scope.isCheckedAllStore = false;

			$scope.defaults = {};
			$scope.defaults.storeIds = [];
			$scope.defaults.staffId = $stateParams.staffId;

			$scope.validator = {};
			$scope.validator.role = false;
			$scope.validator.store = false;

			//角色列表
			$scope.getRoleList = function(condition){
				var deferred = $q.defer();
				staffManageService.getRoleList(condition, function(data){
					$scope.roleList = data.items;
					deferred.resolve();
				});
				return deferred.promise;
			};

			//员工角色
			$scope.getStaffRoleList = function(condition){
				var deferred = $q.defer();
				staffManageService.getStaffRoleList(condition, function(data){
					$scope.staffRoleList = data.items;
					deferred.resolve();
				});
				return deferred.promise;
			};

			$scope.getStaffRoleId = function(staffId){
				var o = _.find($scope.staffRoleList, function(ele){
					return ele.staffId == staffId;
				});

				return o.id;
			};

			//门店列表
			$scope.getStoreList = function(condition){
				var deferred = $q.defer();
				staffManageService.getStoreList(condition, function(data){
					$scope.storeList = data.items;
					deferred.resolve();
				});
				return deferred.promise;
			};

			//员工门店
			$scope.getStaffStoreList = function(condition){
				var deferred = $q.defer();
				staffManageService.getStaffStoreList(condition, function(data){
					$scope.staffStoreList = data.items;
					deferred.resolve();
				});
				return deferred.promise;
			};

			//员工详情
			$scope.getStaffDetail = function(condition){							
				staffManageService.getStaffDetail(condition, function(data){
					$scope.staff = data;
					$scope.findStaffRole($scope.staff.staffId);
					$scope.findStaffStore($scope.staff.staffId);
				});
			};

			$scope.findStaffRole = function(staffId){
				$q.all([$scope.getRoleList(), $scope.getStaffRoleList()]).then(function(){
					var o = _.find($scope.staffRoleList, function(ele){
						return ele.staffId == staffId;
					});

					$scope.displayRole(o.roleId);					
				});		
			};

			$scope.findStaffStore = function(staffId){
				$q.all([$scope.getStoreList(), $scope.getStaffStoreList()]).then(function(){
					var arr = _.filter($scope.staffStoreList, function(ele){
						return ele.staffId == staffId;
					});
					$scope.displayStore(arr);
				});					
			};

			$scope.displayRole = function(roleId){
				_.each($scope.roleList, function(ele, index, list){
					ele['checked'] = false;
					if(ele.roleId == roleId){
						ele.checked = true;
						$scope.defaults.roleId = ele.roleId;
					}						
				});
			};

			$scope.displayStore = function(arr){
				var isCheckedAll = true;

				if(!arr.length) return $scope.isCheckedAllStore = false;
				//arr 用户选择的门店				
				_.each(arr, function(ele, index){
					_.each($scope.storeList, function(e, i){
						if(e.id == ele.storeId) e.checked = true;
					});
				});

				_.each($scope.storeList, function(ele, index){
					if(!ele.checked) return isCheckedAll = false;
				});
				
				$scope.isCheckedAllStore = isCheckedAll ? true : false;
			};

			$scope.doCheckRole = function(index){
				var role = $scope.roleList[index];

				_.each($scope.roleList, function(ele, index, list){
					ele['checked'] = false;
				});
				role.checked = !role.checked;
				$scope.defaults.roleId = role.roleId;
			};

			$scope.$watch('defaults.roleId', function(newVal, oldVal){
				if(typeof newVal === 'undefined') return;
				$scope.validator.role = false;
			});

			$scope.doCheckAllStore = function(){
				$scope.isCheckedAllStore = !$scope.isCheckedAllStore;

				_.each($scope.storeList, function(ele, index, list){
					ele['checked'] = $scope.isCheckedAllStore;
				});
				$scope.getCheckedStore();
			};

			$scope.doCheckStore = function(index){
				var store = $scope.storeList[index],
					isCheckedAll = true;

				$scope.isManualControl = true;
				store.checked = !store.checked;
				_.each($scope.storeList, function(ele, index, list){
					if(!ele.checked) return isCheckedAll = false;
				});

				$scope.isCheckedAllStore = isCheckedAll ? true : false;
				$scope.getCheckedStore();
			};

			$scope.getCheckedStore = function(){
				var aId = [];

				_.each($scope.storeList, function(ele, index, list){
					if(ele['checked']) aId.push(ele.id);
				});

				return $scope.defaults.storeIds = aId;
			};

			$scope.$watch('defaults.storeIds', function(newVal, oldVal){
				if(!newVal.length) return ($scope.validator.store = $scope.isManualControl ? true : false);				
				$scope.validator.store = false;
			}, true);

			$scope.doSave = function(staff, $event){
				var staffId = staff.staffId,
					staffRoleId = $scope.getStaffRoleId(staffId);

				if($event && $event.which != 13) return;
				$scope.getCheckedStore();
				factory.validateForm($scope, $scope.staffForm);

				if(!$scope.defaults.roleId) $scope.validator.role = true;
				if(!$scope.defaults.storeIds.length) $scope.validator.store = true;

				if($scope.validator.role || $scope.validator.store) return;

				if($scope.staffForm.$valid){
					staffManageService.updateStaff(staffId, staff, function(data){
						if(_.isNumber(staffId)){
							staffManageService.updateStaffRole(staffRoleId, {staffId: staffId, roleId: $scope.defaults.roleId}, function(data){});
							staffManageService.updateStaffStore({staffId: staffId, stores: $scope.defaults.storeIds}, function(data){});
							staffManageService.updateStaffPassword(staff.staffNo, {staffNo: staff.staffNo, clearPassword: staff.clearPassword}, function(data){});
						}
						factory.showDialog({
							type: 'success',
							text: '修改成功',
							closeCallback: function(e){
								$state.go('main.staffManage.list');
							}
						});
					});
				}			
			};

			$scope.init = function(){
				$scope.getRoleList();
				$scope.getStoreList();				
				$scope.getStaffDetail({id: $scope.defaults.staffId});
			};

			$scope.init();
		}];

		var controller = {
			module: 'staffManage',
			name: 'staffManageEditController', 
			ctrl: ctrl
		};

		return controller;
	}
);