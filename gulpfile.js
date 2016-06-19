'use strict';

var gulp = require('gulp'),
	watch = require('./semantic/tasks/watch'),
	clean = require('./semantic/tasks/clean'),
	build = require('./semantic/tasks/build'),
	bundle = require('gulp-bundle-assets'),
	del = require('del'),
	imagemin = require('gulp-imagemin'),
	pngquant = require('imagemin-pngquant'),
	awspublish = require('gulp-awspublish'),
	fs = require('fs');

var config = {
	frontend: {
		useCDN: false
	}
};
if(fs.existsSync('./config/config.js')) config = require('./config/config');

gulp.task('watch', watch);
gulp.task('clean', clean);
gulp.task('build', build);

gulp.task('wipe', function(){
	del.sync(['public/**']);
});

gulp.task('refresh', ['clean', 'wipe']);

gulp.task('compile', function(){
	return gulp.src('./bundle.config.js')
		.pipe(bundle())
		.pipe(bundle.results({
			dest:'./',
			pathPrefix: config.frontend.useCDN ? ('//' + config.frontend.staticFilesURI + config.frontend.staticFilesPath + '/') : '/'
		}))
		.pipe(gulp.dest(config.frontend.useCDN ? ('./public' + config.frontend.staticFilesPath) : './public'));
});

gulp.task('bundle', ['build'], function(){
	gulp.start('compile');
});

gulp.task('optimise', function () {
	return gulp.src('./src/images/**/*.*')
		.pipe(imagemin({
			optimizationLevel: 7,
			progressive: true,
			multipass: true,
			svgoPlugins: [{removeViewBox: false}],
			use: [pngquant()]
		}))
		.pipe(gulp.dest(config.frontend.useCDN ? ('./public' + config.frontend.staticFilesPath + '/images') : './public/images'));
});


gulp.task('publish', function() {
	if (config.frontend.useCDN){
		// create a new publisher using S3 options
		// http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#constructor-property
		var publisher = awspublish.create({
			accessKeyId: config.cloudFrontS3.key,
			secretAccessKey: config.cloudFrontS3.secret,
			params: {
				Bucket: config.cloudFrontS3.bucket,
				DistributionId: config.cloudFrontS3.distributionId
			},
			region: config.cloudFrontS3.region,
			maxRetries: 3
		});
		// define custom headers
		var headers = {
			"Cache-Control": "max-age=315360000, no-transform, public"
			// ...
		};
		return gulp.src('./public/**')
			// gzip, Set Content-Encoding headers and add .gz extension
			.pipe(awspublish.gzip()) // { ext: '.gz' }
			// publisher will add Content-Length, Content-Type and headers specified above
			// If not specified it will set x-amz-acl to public-read by default
			.pipe(publisher.publish(headers))
			// create a cache file to speed up consecutive uploads
			.pipe(publisher.cache())
			.pipe(publisher.sync(config.frontend.staticFilesPath.slice(1)))
			// print upload updates to console
			.pipe(awspublish.reporter());
	}
	else console.log("\nPublishing disabled, `config.frontend.useCDN` is false\n")
});

gulp.task('default', ['refresh'], function(){
	gulp.start('bundle');
	gulp.start('optimise');
});
