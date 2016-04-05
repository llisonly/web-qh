define([
	'components/dialog'
	], function(Dialog){
	'use strict';

	var qh = {};

	qh.preUrl = qhConfig.svcUrl;

	qh.http = function($http, method, url, param, success, error){	
		$http[method](qh.preUrl + url, param, {headers: {
			'Content-Type': 'application/json;charset=UTF-8'//'application/x-www-form-urlencoded'
		}})
		.success(function(data){
			if(success && typeof success == 'function')	return success(data);
		})
		.error(function(data, status, headers, config){
			var text = '';

			if(status >= 400 && status < 499){
				text = data.errorMessage;
			}else if(status == 500){
				text = '服务器发生错误';
			}
			new Dialog({
				type: 'error',
				text: text
			});
			if(error && typeof error == 'function') return error(data);
		});
	};

	qh.formatDate = function(date){
		if(!date) return;

		var oDate = {},
			o = {};			

		oDate = new Date(date);

		o.y = oDate.getFullYear();
		o.M = oDate.getMonth() + 1;
		o.d = oDate.getDate();
		o.h = oDate.getHours();
		o.m = oDate.getMinutes();
		o.s = oDate.getSeconds();

		return o.y + '-' + (o.M < 10 ? '0'+o.M : o.M) + '-' +  (o.d < 10 ? '0'+o.d : o.d) + ' ' +  (o.h < 10 ? '0'+o.h : o.h) + ':' +  (o.m < 10 ? '0'+o.m : o.m) + ':' + (o.s < 10 ? '0'+o.s : o.s)
	}

	qh.addPercent = function(value){
		return (value ? value + '%' : '');
	};

	//转化对象成参数
	//约定obj
	// {
	// 		filter: {
	// 			a: 'b'
	// 		},
	// 		sort: {
	// 			sortBy: 'c'
	// 		},
	//		direction: {
	//      	direction: 'd'
	//  	}
	// }	
	qh.toQuery = function(obj){
		var filterObj,
			filterArr = [],
			filterStr = '',					
			sortObj,			
			sortStr = '',
			directionObj,
			directionStr = '',
			arrParams = [],
			strParams = '';

		if(_.isEmpty(obj)) return '';

		_.each(obj, function(value, key, object){
			if(key == 'filter'){
				filterObj = value;
			}else if(key == 'sort'){
				sortObj = value;
			}
		});

		if(filterObj){
			_.each(_.pairs(filterObj), function(ele, index, list){
				var str = '';

				str += 'f=' + ele[0];
				str += '&t=' + ele[1];

				filterArr.push(str);
			});

			filterStr = filterArr.join('&');
			arrParams.push(filterStr);
		}		
		
		if(sortObj){
			_.each(sortObj, function(value, key, object){
				if(key == 'sortBy'){
					sortStr = 's=' + value;
				}
			});
			arrParams.push(sortStr);
		}

		if(directionObj){
			_.each(directionObj, function(value, key, object){
				if(key == 'direction'){
					directionStr = 'd=' + value;
				}
			});
			arrParams.push(directionStr);
		}

		if(arrParams.length) strParams = '?' + arrParams.join('&');

		return strParams;
	};

	return qh;
});