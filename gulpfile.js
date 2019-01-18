var gulp 		= require('gulp');
var watch 		= require('node-watch');
var less 		= require('gulp-less');
let cleanCSS 	= require('gulp-clean-css');
var combiner = require('stream-combiner2');

function taskError(e) {
	console.error(e);
}

function taskCSS(){
	return combiner.obj([
		gulp.src('./app/stylesheets/less/main.less'),
		less(),
		cleanCSS(),
		gulp.dest('./app/stylesheets')
	]).on('error', console.error.bind(console));
}

function taskWatch() {
	watch('./app/stylesheets/less', { recursive: true }, function(evt, name) {
		console.log(`Updated: ${name}`);
		taskCSS()
	});
}

gulp.task('default', function(cb) {
	taskWatch();
	cb();
});
