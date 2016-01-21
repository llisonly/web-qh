define([
	'utils'	
	], function(utils){
		'use strict';
		
		var ctrl = ['$scope', 'factory', 'storeManageService', '$stateParams', function($scope, factory, storeManageService, $stateParams){			
			$scope.defaults = {};
			$scope.scaleKeyMapList = [];
			$scope.scaleKeyMap = {};			

			$scope.defaults.scaleId = $stateParams.scaleId;

			$scope.generateScaleKeyMapList = function(){
				for(var i = 1; i <= 80; i += 1){
					if(i >= 1 && i <= 40){
						$scope.scaleKeyMapList.push({
							scaleId: $scope.defaults.scaleId,
							keyNo: i,
							pluNo: '',
							pluName: '',
							level: 1
						});
					}

					if(i >= 41 && i <= 80){
						$scope.scaleKeyMapList.push({
							scaleId: $scope.defaults.scaleId,
							keyNo: i,
							pluNo: '',
							pluName: '',
							level: 2
						});
					}					
				}
			};

			$scope.getScaleKeyMapList = function(condition){
				storeManageService.getScaleKeyMapList(condition, function(data){
					if(!data.items && data.items.length) return;
					_.each(data.items, function(element, index, list){
						$scope.scaleKeyMapList[element.keyNo - 1] = element;
					});
				});
			};

			$scope.showSearchProgramme = function($event, o){
				$event.stopPropagation();
				_.each($scope.scaleKeyMapList, function(element, index, list){
					element.focus = false;
				});
				o.focus = true;
				$scope.scaleKeyMap = o;
				$scope.searchIndex = 0;
			};

			$scope.getPluList = function(condition){
				condition = condition ? utils.toQuery({filter: condition}) : '';
				storeManageService.getPluList(condition, function(data){
					$scope.pluList = data.items;
				});
			};

			$scope.debounceGetPluList = _.debounce($scope.getPluList, 300);

			$scope.$watch('scaleKeyMap.pluName', function(newVal, oldVal){
				if(typeof newVal === 'undefined') return;
				$scope.debounceGetPluList({pluNo: utils.addPercent(newVal) });
			});

			$scope.doSelectPlu = function(o, $event){
				if($event && $event.which != 13) return;
				$scope.scaleKeyMap.pluNo = o.pluNo;
				$scope.scaleKeyMap.pluName = o.pluName;
				if($scope.scaleKeyMap.id){
					storeManageService.updateScaleKeyMap($scope.scaleKeyMap.id, $scope.scaleKeyMap, function(data){
						$scope.scaleKeyMap.focus = false;						
					});
				}else{
					storeManageService.createScaleKeyMap($scope.scaleKeyMap, function(data){
						$scope.scaleKeyMap.focus = false;						
					});
				}
			};

			$scope.doSelectProgramme = function($event){
				var len = $scope.pluList.length;

				if(!len) return $scope.searchIndex = 0;
				switch($event.which){
					case 38:
						if($scope.searchIndex <= 0) return;
						$scope.searchIndex -= 1;
						break;
					case 40:
						if($scope.searchIndex >= len-1) return;
						$scope.searchIndex += 1;
						break;
					case 13:
						$scope.doSelectPlu($scope.pluList[$scope.searchIndex]);
						break;
					default:
				}
			};

			$scope.init = function(){
				$scope.generateScaleKeyMapList();
				$scope.getScaleKeyMapList({scaleId: $scope.defaults.scaleId});
			};

			$scope.init();		
		}];

		var controller = {
			module: 'storeManage',
			name: 'storeManageAddPresetKeyController',
			ctrl: ctrl
		};

		return controller;
	}
);