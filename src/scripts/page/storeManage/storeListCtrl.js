define([], function(){
		'use strict';
		
		var ctrl = ['$scope', 'factory', 'storeManageService', '$q', function($scope, factory, storeManageService, $q){
			//form data
			$scope.store = {};
				
			$scope.getStoreList = function(condition){
				var deferred = $q.defer();
				$scope.loadingStatus = true;
				storeManageService.getStoreList(condition, function(data){
					$scope.storeList = data.items;
					$scope.loadingStatus = false;
					deferred.resolve();
				});
				return deferred.promise;
			};

			$scope.getStoreReceiptList = function(condition){
				var deferred = $q.defer();
				storeManageService.getStoreReceiptList(condition, function(data){
					$scope.storeReceiptList = data.items;
					deferred.resolve();
				});
				return deferred.promise;
			};

			$scope.findStoreReceipt =  function(storeNo){
				var o = {},
					arr = [];

				arr = _.filter($scope.storeReceiptList, function(ele, index, list){
					return ele.storeNo == storeNo;
				});

				if(!arr.length) return o;
				_.each(arr, function(ele, index, list){
					if(ele.type == 1){
						o.head = ele.text;
						o.headId = ele.id;
					}else if(ele.type == 2){
						o.foot = ele.text;
						o.footId = ele.id;
					}					
				});
				return o;
			};			

			$scope.doDeleteStore = function(o){
				factory.showDialog({
					type: 'confirm',
					okCallback: function(e){
						storeManageService.deleteStore({id: o.id}, function(data){
							factory.showDialog({
								type: 'success',
								text: '删除成功',
								closeCallback: function(e){
									$scope.getStoreList();
								}
							});
						});
					}
				});				
			};			

			$scope.doSaveEditStore = function(editStore, $event){
				if($event && $event.which != 13) return;
				factory.validateForm($scope, $scope.editStoreForm);
				if($scope.editStoreForm.$valid){
					storeManageService.updateStore(editStore.id, editStore, function(data){
						var storeId = editStore.id;
						if(editStore.headId){
							storeManageService.updateStoreReceipt(editStore.headId, {id: editStore.headId, storeNo: storeId, type: 1, text: editStore.head}, function(data){
								if(editStore.footId){
									storeManageService.updateStoreReceipt(editStore.footId, {id: editStore.footId, storeNo: storeId, type: 2, text: editStore.foot}, function(data){
										factory.showDialog({
											type: 'success',
											text: '修改成功',
											closeCallback: function(e){
												$scope.doCancelEditStore();
												$scope.getStoreReceiptList().then(function(){
													$scope.getStoreList();
												});
											}
										});
									});
								}else{
									storeManageService.createStoreReceipt({id: editStore.footId, storeNo: storeId, type: 2, text: editStore.foot}, function(data){
										factory.showDialog({
											type: 'success',
											text: '修改成功',
											closeCallback: function(e){
												$scope.doCancelEditStore();
												$scope.getStoreReceiptList().then(function(){
													$scope.getStoreList();
												});
											}
										});
									});
								}
							});
						}else{
							storeManageService.createStoreReceipt({id: editStore.headId, storeNo: storeId, type: 1, text: editStore.head}, function(data){
								if(editStore.footId){
									storeManageService.updateStoreReceipt(editStore.footId, {id: editStore.footId, storeNo: storeId, type: 2, text: editStore.foot}, function(data){
										factory.showDialog({
											type: 'success',
											text: '修改成功',
											closeCallback: function(e){
												$scope.doCancelEditStore();
												$scope.getStoreReceiptList().then(function(){
													$scope.getStoreList();
												});
											}
										});
									});
								}else{
									storeManageService.createStoreReceipt({id: editStore.footId, storeNo: storeId, type: 2, text: editStore.foot}, function(data){
										factory.showDialog({
											type: 'success',
											text: '修改成功',
											closeCallback: function(e){
												$scope.doCancelEditStore();
												$scope.getStoreReceiptList().then(function(){
													$scope.getStoreList();
												});
											}
										});
									});
								}
							});
						}						
					});
				}	
			};

			$scope.showStoreForm = function(o){
				$scope.storeForm.$setPristine();
				$scope.isEditStore = o ? true : false;
				$scope.store = o ? angular.copy(o) : {};
				if($scope.isEditStore){
					$scope.store.head = $scope.findStoreReceipt(o.id).head;
					$scope.store.headId = $scope.findStoreReceipt(o.id).headId;
					$scope.store.foot = $scope.findStoreReceipt(o.id).foot;
					$scope.store.footId = $scope.findStoreReceipt(o.id).footId;
				}
				$('#J_modal-storeForm').modal('show');
			};

			$scope.doSaveStore = function(store, $event){
				if($event && $event.which != 13) return;
				factory.validateForm($scope, $scope.storeForm);
				if($scope.storeForm.$valid){
					if(!$scope.isEditStore){
						storeManageService.createStore(store, function(data){
							var storeId = data;
							if(_.isNumber(storeId)){
								storeManageService.createStoreReceipt({storeNo: storeId, type: 1, text: store.head}, function(data){
									storeManageService.createStoreReceipt({storeNo: storeId, type: 2, text: store.foot}, function(data){
										$('#J_modal-storeForm').modal('hide');
										factory.showDialog({
											type: 'success',
											text: '添加成功',
											closeCallback: function(e){											
												$scope.getStoreReceiptList().then(function(){
													$scope.getStoreList();
												});
											}
										});
									});
								});
							}
						});
					}else{
						storeManageService.updateStore(store.id, store, function(data){
							var storeId = store.id;
							if(store.headId){
								storeManageService.updateStoreReceipt(store.headId, {id: store.headId, storeNo: storeId, type: 1, text: store.head}, function(data){
									if(store.footId){
										storeManageService.updateStoreReceipt(store.footId, {id: store.footId, storeNo: storeId, type: 2, text: store.foot}, function(data){
											$('#J_modal-storeForm').modal('hide');
											factory.showDialog({
												type: 'success',
												text: '修改成功',
												closeCallback: function(e){													
													$scope.getStoreReceiptList().then(function(){
														$scope.getStoreList();
													});
												}
											});
										});
									}else{
										storeManageService.createStoreReceipt({id: store.footId, storeNo: storeId, type: 2, text: store.foot}, function(data){
											$('#J_modal-storeForm').modal('hide');
											factory.showDialog({
												type: 'success',
												text: '修改成功',
												closeCallback: function(e){													
													$scope.getStoreReceiptList().then(function(){
														$scope.getStoreList();
													});
												}
											});
										});
									}
								});
							}else{
								storeManageService.createStoreReceipt({id: store.headId, storeNo: storeId, type: 1, text: store.head}, function(data){
									if(store.footId){
										storeManageService.updateStoreReceipt(store.footId, {id: store.footId, storeNo: storeId, type: 2, text: store.foot}, function(data){
											$('#J_modal-storeForm').modal('hide');
											factory.showDialog({
												type: 'success',
												text: '修改成功',
												closeCallback: function(e){													
													$scope.getStoreReceiptList().then(function(){
														$scope.getStoreList();
													});
												}
											});
										});
									}else{
										storeManageService.createStoreReceipt({id: store.footId, storeNo: storeId, type: 2, text: store.foot}, function(data){
											$('#J_modal-storeForm').modal('hide');
											factory.showDialog({
												type: 'success',
												text: '修改成功',
												closeCallback: function(e){													
													$scope.getStoreReceiptList().then(function(){
														$scope.getStoreList();
													});
												}
											});
										});
									}
								});
							}						
						});
					}
				}
			};			

			$scope.init = function(){
				$q.when($scope.getStoreReceiptList()).then(function(){
					$scope.getStoreList();
				});
			};

			$scope.init();

		}];

		var controller = {
			module: 'storeManage',
			name: 'storeManageStoreListController', 
			ctrl: ctrl
		};

		return controller;
	}
);