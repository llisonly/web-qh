var gulp = require('gulp'),
	stylus = require('gulp-stylus'),
	imerge = require('gulp-imerge'),
	promise = require('bluebird'),
	tap = require('gulp-tap'),
	rimraf = promise.promisify(require('rimraf')),
	uglify = require('gulp-uglify'),
	minifyCss = require('gulp-minify-css'),
	nobone = require('nobone'),
	path = require('path'),
	_ = require('lodash'),	
	nocache = require('gulp-nocache'),
	port = 3000;

process.env.NODE_ENV = 'development'//'product' //'development'

var basePath = './src',
	paths = {
		css: basePath + '/styles/**/*.@(css|styl)',
		js: basePath + '/scripts/**/*.js',
		images: basePath + '/images/**/*',	
		index: basePath + '/index.html',	
		tpl: basePath + '/views/**/*.html',
		staticDest: './dist'
	},
	nocacheConf = {
		sourceContext: 'src',
		outputContext: './dist'
	};

gulp.task('clean', function(){
	return promise.all([		
		rimraf(paths.staticDest)	
	]);
});

gulp.task('build:css', ['clean'], function(){
	var nocacheSprite = _.once(function(){
		return gulp.src(paths.sprites)
			.pipe(nocache(_.extend({
				type: 'media',
				dest: paths.staticDest + (process.env.NODE_ENV == 'development' ? '/images/sprites/[name].[hash:6].[ext]' : '/images/sprites/[name].[hash:8].[ext]')
			}, nocacheConf)))
			.pipe(gulp.dest(function(file){
				return file.base;
			}));
	});

	return gulp.src(paths.css)
		.pipe(stylus())
		.pipe(imerge({
			spriteTo: basePath + '/images/sprites',
			sourceContext: 'src',
			outputContext: 'src',
			defaults: {
				padding: 5
			}
		}))
		// .pipe(tap(nocacheSprite))
		// .pipe(nocache(_.extend({
		// 	type: 'css',
		// 	dest: paths.staticDest + (process.env.NODE_ENV == 'development' ? '/styles/[name].[hash:6].[ext]' : '/styles/[name].[hash:8].[ext]')
		// }, nocacheConf)))
		.pipe(minifyCss({
			compatibility: 'ie8'
		}))
		// .pipe(gulp.dest(function(file){
		// 	return file.base;
		// }));
		.pipe(gulp.dest(paths.staticDest + '/styles'));
});

gulp.task('build:media', ['build:css'], function(){
	return gulp.src(paths.images)
		// .pipe(nocache(_.extend({
		// 	type: 'media',
		// 	dest: paths.staticDest + (process.env.NODE_ENV == 'development' ? '/images/[name].[hash:6].[ext]' : '/images/[name].[hash:8].[ext]')	
		// }, nocacheConf)))
		// .pipe(gulp.dest(function(file){
		// 	return file.base;
		// }));
		.pipe(gulp.dest(paths.staticDest + '/images'));
});

gulp.task('build:js', ['build:css'], function(){
	return gulp.src(paths.js)
		.pipe(uglify())
		.pipe(gulp.dest(paths.staticDest + '/scripts'));
});

gulp.task('build:tpl', ['build:js'], function(){

	gulp.src(paths.index)
		.pipe(gulp.dest(paths.staticDest));

	return gulp.src(paths.tpl)
		.pipe(gulp.dest(paths.staticDest + '/views'));	
});

gulp.task('watch', function(){
	gulp.watch(paths.css, ['build:css']);
});

gulp.task('build', ['build:css', 'build:media', 'build:js', 'build:tpl']);


gulp.task('server', function(){
	var nb = nobone({
		proxy: {},
		renderer: {},
		service: {}
	});

	var staticDirectory = process.env.NODE_ENV == 'development' ? 'src' : 'dist';
	
	nb.service.use(nb.renderer.static(staticDirectory));

	nb.service.use(function(req, res){
		nb.proxy.url(req, res, 'http://www.getqh.com/unicorn.webapi' + req.url);
	});

	nb.service.listen(port, function(){
		nb.kit.log('server is listening port ' + port);
	});

});

gulp.task('default', ['server']);