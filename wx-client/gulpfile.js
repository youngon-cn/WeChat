var gulp = require('gulp')
var manifest = require('gulp-manifest')

gulp.task('manifest', function () {
  gulp.src([
    'dist/*',
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
    .pipe(gulp.dest('dist'));
});
