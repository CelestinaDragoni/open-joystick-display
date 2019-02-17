var gulp 		= require('gulp');
var watch 		= require('node-watch');
var less 		= require('gulp-less');
var combiner 	= require('stream-combiner2');
var os 			= require('os');
let cleanCSS 	= require('gulp-clean-css');
var execSync 	= require('child_process').execSync;
let fs 			= require('fs');

function taskError(e) {
	console.error(e);
}

function sectionOutput(message) {
	const time = new Date().toUTCString();
	console.log('----------------------------------------------------');
	console.log(`[${time}]	${message}`);
	console.log('----------------------------------------------------');
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

function taskBuildLinux() {

	if (os.platform() !== 'linux') {
		taskError("Try this command again while you're in linux chief.");
		return;
	}

	sectionOutput('Start Building (Linux)');

	let version = 0;
	let unstable = '';

	sectionOutput('Transforming LESS Files');
	taskCSS();

	sectionOutput('Rebuilding Electron');
	taskRebuildElectron();

	const versionFile = fs.openSync('app/version', 'r');
	version = fs.readFileSync(versionFile, 'UTF-8');
	fs.closeSync(versionFile);

	sectionOutput('Cleaning Artifacts');
	execSync('rm -Rfv ./dist/', {stdio: 'inherit'});
	sectionOutput('Building Package');
	execSync('yarn build', {stdio: 'inherit'});
	if (process.arch === 'x64') {
		execSync('mv ./dist/linux-unpacked ./dist/open-joystick-display', {stdio: 'inherit'});
	} else {
		execSync('mv ./dist/linux-ia32-unpacked ./dist/open-joystick-display', {stdio: 'inherit'});
	}
	
	sectionOutput('Copying Icon');
	execSync('cp ./app/icons/icon.png ./dist/open-joystick-display/icon.png', {stdio: 'inherit'});
	sectionOutput('Compressing Package');

	if (process.arch === 'x64') {
		execSync(`tar czvf ./dist/open-joystick-display-${version}${unstable}-x64-linux.tar.gz -C ./dist open-joystick-display`, {stdio: 'inherit'});
	} else {
		execSync(`tar czvf ./dist/open-joystick-display-${version}${unstable}-x86-linux.tar.gz -C ./dist open-joystick-display`, {stdio: 'inherit'});
	}

	sectionOutput('Build Finished');

}

function taskBuildWindows() {

	if (os.platform() !== 'win32') {
		taskError("Try this command again while you're in windows chief.");
		return;
	}

	sectionOutput('Start Building (Win32)');

	let version = 0;
	let unstable = '';

	sectionOutput('Transforming LESS Files');
	taskCSS();

	sectionOutput('Rebuilding Electron');
	taskRebuildElectron();

	const versionFile = fs.openSync('app/version', 'r');
	version = fs.readFileSync(versionFile, 'UTF-8');
	fs.closeSync(versionFile);

	sectionOutput('Cleaning Artifacts');
	try {
		execSync('rmdir /S /Q .\\dist', {stdio: 'inherit'});
	} catch {
		console.log('No dist directory to delete. Moving on...');
	}
	sectionOutput('Building Package');
	execSync('yarn build', {stdio: 'inherit'});
	if (process.arch === 'x64') {
		execSync('rename .\\dist\\win-unpacked open-joystick-display', {stdio: 'inherit'});
	} else {
		execSync('rename .\\dist\\win-ia32-unpacked open-joystick-display', {stdio: 'inherit'});
	}
	sectionOutput('Compressing Package');

	if (process.arch === 'x64') {
		execSync(`tools\\windows\\7zip\\7za.exe a -r .\\dist\\open-joystick-display-${version}${unstable}-x64-windows.zip .\\dist\\open-joystick-display`, {stdio: 'inherit'});
	} else {
		execSync(`tools\\windows\\7zip\\7za.exe a -r .\\dist\\open-joystick-display-${version}${unstable}-x86-windows.zip .\\dist\\open-joystick-display`, {stdio: 'inherit'});
	}

	sectionOutput('Build Finished');

}

function taskBuildDarwin() {

	if (os.platform() !== 'darwin') {
		taskError("Try this command again while you're in macOS chief.");
		return;
	}

	sectionOutput('Start Building (Darwin/macOS)');

	let version = 0;
	let unstable = '';

	sectionOutput('Transforming LESS Files');
	taskCSS();

	sectionOutput('Rebuilding Electron');
	taskRebuildElectron();

	const versionFile = fs.openSync('app/version', 'r');
	version = fs.readFileSync(versionFile, 'UTF-8');
	fs.closeSync(versionFile);

	sectionOutput('Cleaning Artifacts');
	execSync('rm -Rfv ./dist/', {stdio: 'inherit'});
	sectionOutput('Building Package');
	execSync('yarn build', {stdio: 'inherit'});
	sectionOutput('Renaming Package');
	execSync(`mv ./dist/*.dmg ./dist/open-joystick-display-${version}${unstable}-x64-mac.dmg`, {stdio: 'inherit'});

	sectionOutput('Build Finished');

}

function taskRebuildElectron() {

	let cmd = '';
	if (os.platform() === 'win32') {
		cmd = '.\\node_modules\\.bin\\electron-rebuild -p -t "dev,prod,optional"';
	} else {
		cmd = './node_modules/.bin/electron-rebuild -p -t "dev,prod,optional"';
	}
	execSync(cmd, {stdio: 'inherit'});

}

gulp.task('default', function(cb) {
	taskWatch();
	cb();
});

gulp.task('build', function(cb) {
	const platform = os.platform();
	if (platform === 'win32') {
		taskBuildWindows();
	} else if (platform === 'linux') {
		taskBuildLinux();
	} else if (platform === 'darwin') {
		taskBuildDarwin();
	} else {
		console.error('Unsupported Platform');
	}
	cb();
});

gulp.task('rebuild-electron', function(cb) {
	taskRebuildElectron();
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

gulp.task('build-darwin', function(cb) {
	taskBuildDarwin();
	cb();
});