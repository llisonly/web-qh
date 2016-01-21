define([
	'utils'	
	], function(utils){
		'use strict';
		
		var ctrl = ['$scope', '$state', 'memberManageService', '$cookies', 'factory', 'constants', function($scope, $state, memberManageService, $cookies, factory, constants){
			//默认显示搜索栏
			$scope.isShowSearchbar = true;			
			$scope.search = {};
			$scope.addMember = {};
			$scope.editMember = {};
			$scope.isShowAddMemberForm = false;
			$scope.defaults = {};

			//form data
			$scope.recharge = {};
			$scope.password ={};

			$scope.genderList = constants.getGenderList();
			
			$scope.getMemberList = function(condition){				
				$scope.loadingStatus = true;
				condition = condition ? utils.toQuery({filter: condition}) : '';			
				memberManageService.getMemberList(condition, function(data){
					$scope.memberList = data.items;
					$scope.getMemberCountOnce(data.totalCount);
					$scope.loadingStatus = false;
				});
			};

			$scope.getMemberCountOnce = _.once(function(totalCount){
				$scope.defaults.memberCount = totalCount;
			});

			$scope.throttledSearch = _.throttle(function(){
				var condition= angular.copy($scope.search);

				if(_.isEmpty(condition)) return;
				//模糊搜索
				if(condition.name) condition.name = utils.addPercent(condition.name);
				if(condition.phone) condition.phone = utils.addPercent(condition.phone);				

				for(var o in condition){
					if(!condition[o]) delete condition[o];
				}

				$scope.getMemberList(condition);
			}, 500);

			$scope.$watch('search', function(){
				$scope.throttledSearch();
			},true);

			$scope.showEditMember = function(o, index){
				$scope.editIndex = index;
				$scope.editMember = angular.copy(o);
				if($scope.editMember.birthday) $scope.editMember.birthday = factory.formatISODate($scope.editMember.birthday);
			};

			$scope.doEditMember = function(editMember, $event){
				if($event && $event.which !== 13) return;
				factory.validateForm($scope, $scope.editMemberForm);
				if($scope.editMemberForm.$valid){
					memberManageService.updateMember(editMember.customerId, editMember, function(data){
						factory.showDialog({
							type: 'success',
							text: '修改成功',
							closeCallback: function(e){
								$scope.doCancelEditMember();
								$scope.getMemberList($scope.search);
							}
						});
					});
				}
			};

			$scope.doCancelEditMember = function(){
				$scope.editIndex = -1;
			};

			$scope.deleteMember = function(o){
				factory.showDialog({
					type: 'confirm',
					okCallback: function(e){
						memberManageService.deleteMember({id: o.customerId}, function(data){
							factory.showDialog({
								type: 'success',
								text: '删除成功',
								closeCallback: function(e){
									$scope.defaults.memberCount -= 1;
									$scope.getMemberList($scope.search);
								}
							})
						});
					}
				})
			};

			$scope.showAddMemberForm = function(){
				$scope.addMemberForm.$setPristine();
				$scope.isShowAddMemberForm = true;				
			};

			$scope.doSaveMember = function(member, $event){
				if($event && $event.which !== 13) return;
				factory.validateForm($scope, $scope.addMemberForm);
				if($scope.addMemberForm.$valid){
					memberManageService.createMember(member, function(data){
						factory.showDialog({
							type: 'success',
							text: '添加成功',
							closeCallback: function(e){
								$scope.defaults.memberCount += 1;
								$scope.doCancelSaveMember();
								$scope.getMemberList($scope.search);
							}
						});
					});			
				}
			};

			$scope.doCancelSaveMember = function(){
				$scope.isShowAddMemberForm = false;
				$scope.addMember = {};
			};

			$scope.showRechargeForm = function(o){
				$scope.rechargeForm.$setPristine();
				$scope.recharge = angular.copy(o);		
				$('#J_modal-rechargeForm').modal('show');				
			};

			$scope.doSaveRecharge = function(recharge, $event){
				var params = {};

				if($event && $event.which !== 13) return;
				factory.validateForm($scope, $scope.rechargeForm);
				if($scope.rechargeForm.$valid){
					params.customerId = recharge.customerId;
					params.changeValue = recharge.changeValue;
					params.changetype = 'deposit';

					memberManageService.recharge(params, function(data){
						$('#J_modal-rechargeForm').modal('hide');						
						factory.showDialog({
							type: 'success',
							text: '充值成功',
							closeCallback: function(e){
								$scope.getMemberList($scope.search);
							}
						});
					});
				}				
			};

			$scope.showPasswordForm = function(o){
				$scope.updatePasswordForm.$setPristine();
				$scope.password = angular.copy(o);
				$('#J_modal-updatePasswordForm').modal('show');				
			};

			$scope.doSavePassword = function(password, $event){
				var params = {};

				if($event && $event.which !== 13) return;
				factory.validateForm($scope, $scope.updatePasswordForm);
				if($scope.updatePasswordForm.$valid){
					params.id = password.customerId;
					params.clearPassword = password.clearPassword;

					memberManageService.updatePassword(params.id, params, function(data){
						$('#J_modal-updatePasswordForm').modal('hide');						
						factory.showDialog({
							type: 'success',
							text: '修改成功'
						});
					});
				}
			};

			$scope.init = function(){
				$scope.getMemberList();
			};

			$scope.init();
			
		}];

		var controllers = [
			{module: 'memberManage', name: 'memberManageListController', ctrl: ctrl}
		];

		return controllers;
	}
);