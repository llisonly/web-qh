define([
	'utils'
	], function(utils){
		'use strict';
		
		var ctrl = ['$scope', 'factory', 'merchandiseManageService', function($scope, factory, merchandiseManageService){
			//默认显示搜索栏
			$scope.isShowSearchbar = true;
			$scope.defaults = {};

			//搜索
			$scope.search = {};

			//一级分类数据
			$scope.firstPluGroupList = [];

			//二级分类数据
			$scope.secondPluGroupListTemp = [];
			$scope.secondPluGroupList = [];

			//获取全部分类数据
			$scope.getPluGroup = function(condition){
				condition = condition ? utils.toQuery(condition) : '';
				merchandiseManageService.getPlugroup(condition, function(data){
					$scope.pluGroupList = data.items;
				});
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
				merchandiseManageService.getTare(condition, function(data){
					$scope.tareList = data.items;
				});
			};

			$scope.findTare = function(tareList, tareId){
				var o = _.find(tareList, function(ele){
					return ele.tareId == tareId;
				});

				return o;				
			};

			$scope.throttledSearch = _.throttle(function(){
				var condition = angular.copy($scope.search);

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
			},true);

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
							$scope.loadingStatus = false;
							$scope.$apply();
						}
					}
				});
			};

			$scope.showConfirm = function(o){
				factory.showDialog({
					type: 'confirm',
					okCallback: function(e){
						merchandiseManageService.deletePlu({id: o.pluId}, function(data){
							factory.showDialog({
								type: 'success',
								text: '删除成功'
							});
							$scope.defaults.pluCount = $scope.defaults.pluCount - 1;
							$scope.generatePage({filter: $scope.search});
						});
					}					
				});
			};

			$scope.init = function(){
				$scope.getTare();				
				$scope.getPluGroup();
				$scope.generatePage();
			};

			$scope.init();	
		}];

		var controller = {
			module: 'merchandiseManage',
			name: 'merchandiseManageListController',
			ctrl: ctrl
		};

		return controller;
	}
);