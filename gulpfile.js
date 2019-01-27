var gulp 		= require('gulp');
var watch 		= require('node-watch');
var less 		= require('gulp-less');
var combiner 	= require('stream-combiner2');
var os 			= require('os');
let cleanCSS 	= require('gulp-clean-css');
var execSync 	= require('child_process').execSync;

function taskError(e) {
	console.error(e);
}

function taskCSS(errorCallback = false, successCallback=false){
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

function taskBuildLinux() {

	if (os.platform() !== 'linux') {
		taskError("Try this command again while you're in linux chief.");
		return;
	}

	execSync('yarn build');


}

function taskBuildWindows() {
	if (os.platform() !== 'win32') {
		taskError("Try this command again while you're in windows chief.");
		return;
	}


}

gulp.task('default', function(cb) {
	taskWatch();
	cb();
});

gulp.task('build-linux', function(cb) {
	taskBuildLinux();
	cb();
});

gulp.task('build-windows', function(cb) {
	taskBuildWindows();
	cb();
});