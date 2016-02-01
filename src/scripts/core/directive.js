define([	
	'datetimepicker'	
	], function(){
		'use strict';

		var init = function(){	
			angular.module('common')
    			.directive('uiDatetimepicker', function(){  

        			return {            	
            			restrict: 'A',             
            			require: '?ngModel',			              
			            link: function(scope, element, attrs, ngModel){
			                if(!ngModel) return;  
			                  
			                var optionsObj = {
			                	lang: 'ch',
			                	timepicker: false,
			                	format: 'Y-m-d',
			                	formatDate:'Y-m-d',			                
			                	scrollInput: false
			                };
			                
			                element.datetimepicker(optionsObj);  
			            }  
			        };  
    			})
    			.directive('uiPriceFormat', function($parse){
    				return {
    					restrict: 'A',
    					require: '?ngModel',
    					link: function(scope, element, attrs, ngModel){    						
    						var model = $parse(attrs.ngModel),
    							reg = /([0-9]+\.[0-9]{2})[0-9]*/;

    						if(!ngModel) return;

    						scope.$watch(attrs.ngModel, function(newVal, oldVal){
    							if(!newVal || isNaN(newVal)) return model.assign(scope, '');
								return model.assign(scope,newVal.replace(reg,'$1'));
    						});
    					}
    				}
    			})
    			.directive('loading', function(){
    				return {
    					restrict: 'E',
    					replace: true,
    					template: '<div class="c-loading"></div>',
    					link: function(scope, element, attrs){
    						
    					}
    				}
    			})
    			
		};

		return {
			init: init
		};	
	}
);