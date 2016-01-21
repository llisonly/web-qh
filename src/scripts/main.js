requirejs.config({
	baseUrl: qhConfig.staticUrl + '/scripts',
	paths: {
		jquery: 'lib/jquery/jquery-amd',
		bootstrap: 'lib/bootstrap/bootstrap.min',
		underscore: 'lib/underscore/underscore-amd',
		angular: 'lib/angular/angular-amd',
		uiRouter: 'lib/angular-ui-router/angular-ui-router',
		angularCookies: 'lib/angular-cookies/angular-cookies',
		utils: 'core/utils',
		datetimepicker: 'lib/jquery-datetimepicker/jquery.datetimepicker',
		pagination: 'lib/jquery-pagination/jquery-pagination.min'	
	},
	shim: {
		'bootstrap': {
			deps: ['jquery']
		},
		'datetimepicker': {
			deps: ['jquery']
		},
		'pagination': {
			deps: ['jquery']
		},
		'angular': {			
			deps: ['jquery']			
		},
		'uiRouter': {
			deps: ['angular']
		},
		'angularCookies': {
			deps: ['angular']
		}
	}	
});

require(['app']);