define([
	'utils'
	], function(utils){
		'use strict';
		
		var ctrl = ['$scope', 'factory', 'staffManageService', 'merchandisePriceService', '$q', function($scope, factory, staffManageService, merchandisePriceService, $q){
			//默认显示搜索栏
			$scope.isShowSearchbar = true;
			$scope.defaults = {};
			$scope.staffListTemp = [];
			$scope.staffList = [];
			$scope.search = {};

			$scope.getStaffStoreList = function(condition){
				var deferred = $q.defer();
				staffManageService.getStaffStoreList(condition, function(data){
					$scope.staffStoreList = data.items;
					deferred.resolve();
				});
				return deferred.promise;
			};

			$scope.getStaffCountOnce = _.once(function(data){
				$scope.defaults.staffCount = data.totalCount;
			});

			$scope.getStaffList = function(condition){
				var deferred = $q.defer();

				$scope.loadingStatus = true;
				condition = condition ? utils.toQuery({filter: condition}) : '';
				staffManageService.getStaffList(condition, function(data){
					$scope.staffListTemp = data.items;
					$scope.staffList = data.items;
					$scope.getStaffCountOnce(data);
					$scope.loadingStatus = false;
					deferred.resolve();
				});
				return deferred.promise;
			};

			$scope.getStoreList = function(condition){
				var deferred = $q.defer();
				
				merchandisePriceService.getStoreList(condition, function(data){
					$scope.storeList = data.items;					
					deferred.resolve();
				});
								
				return deferred.promise;
			};

			$scope.$watch('defaults.storeId', function(newVal, oldVal){
				var condition;

				if(typeof newVal === 'undefined') return;
				if(newVal == undefined){
					condition = $scope.search;
					if(condition.name) condition.name = utils.addPercent(condition.name);
					return $scope.getStaffList(condition);
				}
				$scope.getStoreStaffIdList(newVal);
				$scope.findStoreStaffList();
			});

			$scope.getStoreStaffIdList = function(storeId){
				$scope.storeStaffIdList = _.filter($scope.staffStoreList, function(ele){
					return ele.storeId == storeId;
				});
			};

			$scope.findStoreStaffList = function(){
				$scope.staffList = [];			
				_.each($scope.storeStaffIdList, function(ele, index, list){
					_.each($scope.staffListTemp, function(e, i, l){
						if(ele.staffId == e.staffId) $scope.staffList.push(e);
					});
				});	 
			};

			$scope.getStaffRoleList = function(condition){
				var deferred = $q.defer();
				staffManageService.getStaffRoleList(condition, function(data){
					$scope.staffRoleList = data.items;
					deferred.resolve();
				});
				return deferred.promise;
			};

			$scope.getRoleList = function(condition){
				var deferred = $q.defer();
				staffManageService.getRoleList(condition, function(data){
					$scope.roleList = data.items;
					deferred.resolve();
				});
				return deferred.promise;
			};

			//员工角色
			$scope.findStaffRole = function(staffId){
				var staffRole = _.find($scope.staffRoleList, function(ele){
					return ele.staffId == staffId;
				});

				var o = _.find($scope.roleList, function(ele){
					return ele.roleId == staffRole.roleId;
				});

				return o;
			};

			//员工所在的门店
			$scope.findStaffStoreList = function(staffId){
				var staffStoreList = [];
				$scope.staffStoreIdList = _.filter($scope.staffStoreList, function(ele){
					return ele.staffId == staffId;
				});
				_.each($scope.staffStoreIdList, function(element, index, list){
					_.each($scope.storeList, function(e, i, l){
						if(element.storeId == e.id) staffStoreList.push(e);
					});
				});
				return staffStoreList;
			};

			$scope.throttledSearch = _.throttle(function(){
				var condition= angular.copy($scope.search);

				if(_.isEmpty(condition)) return;
				//模糊搜索
				if(condition.name) condition.name = utils.addPercent(condition.name);

				$scope.getStaffList(condition);
			}, 500);

			$scope.$watch('search', function(){
				$scope.throttledSearch();
			}, true);

			$scope.deleteStaff = function(staffList, index){
				var params = {};

				params.id = staffList[index].staffId;
				factory.showDialog({
					type: 'confirm',
					okCallback: function(e){
						staffManageService.deleteStaff(params, function(data){
							factory.showDialog({
								type: 'success',
								text: '删除成功'
							});
							staffList.splice(index, 1);
						});
					}
				});
			};

			$scope.init = function(){
				$q.all([$scope.getStaffStoreList(), $scope.getStoreList(), $scope.getStaffRoleList(), $scope.getRoleList()]).then(function(){					
					$scope.getStaffList();
				});												
			};

			$scope.init();
							
		}];

		var controller = {
			module: 'staffManage',
			name: 'staffManageListController', 
			ctrl: ctrl
		};

		return controller;
	}
);