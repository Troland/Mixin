var gulp = require('gulp');
var replace = require('gulp-replace');
var gulpif = require('gulp-if');
var exec = require('child_process').exec;
var srcFiles = ['./src/**/*.less'];
gulp.task('doublepx', function(done) {
  gulp.src(srcFiles).pipe(gulpif(true, replace(/['"](\d+)px['"]|\b(\d+)px\b/g, function(pixel) {
    console.log(pixel, '=>', (parseInt(pixel) * 2) + 'px');
    if (/'|"/.test(pixel) || '0px' == pixel || '1px' == pixel) {
      return pixel;
    }
    return (parseInt(pixel) * 2) + 'px';
  }))).pipe(gulp.dest('./src'));
  done();
});
gulp.task('default', ['doublepx']);
