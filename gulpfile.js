let gulp 		= require('gulp')
let watch 		= require('node-watch')
let less 		= require('gulp-less')
let combiner 	= require('stream-combiner2')
let os 			= require('os')
let cleanCSS 	= require('gulp-clean-css')
let execSync 	= require('child_process').execSync
let fs 			= require('fs')

function taskError(e) {
    console.error(e)
}

function taskCSS() {
    return combiner.obj([
        gulp.src('./app/stylesheets/less/main.less'),
        less(),
        cleanCSS(),
        gulp.dest('./app/stylesheets')
    ]).on('error', console.error.bind(console))
}

function taskWatch() {
    watch('./app/stylesheets/less', { recursive: true }, function (evt, name) {
        console.log(`Updated: ${name}`)
        taskCSS()
    })
}

function taskRebuildElectron() {
    let cmd = ''
    if (os.platform() === 'win32') {
        cmd = '.\\node_modules\\.bin\\electron-rebuild -p -t "dev,prod,optional"'
    } else {
        cmd = './node_modules/.bin/electron-rebuild -p -t "dev,prod,optional"'
    }
    execSync(cmd, { stdio: 'inherit' })
}

gulp.task('default', function (cb) {
    taskWatch()
    cb()
})

gulp.task('build', function (cb) {
    taskCSS()
    cb()
})

gulp.task('rebuild-electron', function (cb) {
    taskRebuildElectron()
    cb()
})

