define([], function(){
		'use strict';
		
		var ctrl = ['$scope', 'factory', 'staffManageService', '$state', function($scope, factory, staffManageService, $state){
			
			$scope.staff = {};			
			$scope.isEditPage = false;			
			//是否全选门店/默认为否
			$scope.isCheckedAllStore = false;

			$scope.defaults = {};
			$scope.defaults.storeIds = [];

			$scope.validator = {};
			$scope.validator.role = false;
			$scope.validator.store = false;

			//角色列表
			$scope.getRoleList = function(condition){
				staffManageService.getRoleList(condition, function(data){
					$scope.roleList = data.items;
				});
			};

			//门店列表
			$scope.getStoreList = function(condition){
				staffManageService.getStoreList(condition, function(data){
					$scope.storeList = data.items;
				});
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
				$scope.isManualControl = true;
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
				if($event && $event.which != 13) return;
				$scope.getCheckedStore();
				factory.validateForm($scope, $scope.staffForm);

				if(!$scope.defaults.roleId) $scope.validator.role = true;
				if(!$scope.defaults.storeIds.length) $scope.validator.store = true;

				if($scope.validator.role || $scope.validator.store) return;

				if($scope.staffForm.$valid){
					staffManageService.createStaff(staff, function(data){
						var staffId = data;
						//data新创建的员工的ID
						if(_.isNumber(staffId)){
							staffManageService.createStaffRole({staffId: staffId, roleId: $scope.defaults.roleId}, function(data){});
							_.each($scope.defaults.storeIds, function(ele, index, list){
								staffManageService.createStaffStore({staffId: staffId, storeId: ele}, function(data){});
							});
							staffManageService.updateStaffPassword(staff.staffNo, {staffNo: staff.staffNo, clearPassword: staff.clearPassword}, function(data){});
						}
						factory.showDialog({
							type: 'success',
							text: '添加成功',
							closeCallback: function(e){
								$state.go('main.staffManage.list');
							}
						});
					});
				}			
			};

			$scope.doSaveAndAdd = function(staff){
				$scope.getCheckedStore();
				factory.validateForm($scope, $scope.staffForm);

				if(!$scope.defaults.roleId) $scope.validator.role = true;
				if(!$scope.defaults.storeIds.length) $scope.validator.store = true;

				if($scope.validator.role || $scope.validator.store) return;

				if($scope.staffForm.$valid){
					staffManageService.createStaff(staff, function(data){
						var staffId = data;
						//data新创建的员工的ID
						if(_.isNumber(staffId)){
							staffManageService.createStaffRole({staffId: staffId, roleId: $scope.defaults.roleId}, function(data){});
							_.each($scope.defaults.storeIds, function(ele, index, list){
								staffManageService.createStaffStore({staffId: staffId, storeId: ele}, function(data){});
							});
							staffManageService.updateStaffPassword(staff.staffNo, {staffNo: staff.staffNo, clearPassword: staff.clearPassword}, function(data){});
						}
						factory.showDialog({
							type: 'success',
							text: '添加成功'
						});
					});
				}
			};

			$scope.init = function(){
				$scope.getRoleList();
				$scope.getStoreList();
			};

			$scope.init();
		}];

		var controller = {
			module: 'staffManage',
			name: 'staffManageAddController', 
			ctrl: ctrl
		};

		return controller;
	}
);