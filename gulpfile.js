const gulp = require('gulp');

gulp.task('default', function () {
  return gulp.src('node_modules/dragula/dist/dragula.min.css')
    .pipe(gulp.dest('public/css'));
  gulp.src('node_modules/dragula/dist/dragula.min.js')
    .pipe(gulp.dest('public/js')); 
});
