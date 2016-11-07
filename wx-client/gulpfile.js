var gulp = require('gulp')
var manifest = require('gulp-manifest')
var exec = require('child_process').exec;

gulp.task('default', function() {
  var build = exec('node build/build.js')
  build.stdout.on('data', function (data) {
    console.log(data)
  })
  build.on('exit', function (code) {
    gulp.src([
      'dist/index.html',
      'dist/static/css/*',
      'dist/static/fonts/*',
      'dist/static/img/*',
      'dist/static/js/*'
      ], { base: './dist/' })
      .pipe(manifest({
        hash: true,
        preferOnline: true,
        network: ['*'],
        filename: 'store.manifest',
        exclude: 'store.manifest'
       }))
      .pipe(gulp.dest('dist'))
  })
})
