const gulp = require('gulp');
const gutil = require('gulp-util');
const sass = require('gulp-sass');
const nodemon = require('gulp-nodemon');
const uglify = require('gulp-uglify-es').default;
const concat = require('gulp-concat');

gulp.task('dragula', () => {
  gulp.src('node_modules/dragula/dist/dragula.min.css')
    .pipe(gulp.dest('dist/css/dragula.min.css'));
});

// Compile SASS
gulp.task('sass', () => {
  return new Promise((resolve, reject) => {
    gulp.src('src/sass/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/css'))
    resolve();
  })
});

// Copy icons
gulp.task('copyIcons', () =>
	gulp.src('src/icons/*')
    .pipe(gulp.dest('dist/icons'))
);

// Scripts
gulp.task('scripts', () => {
  return new Promise((resolve, reject) => {
    gulp.src('src/js/*.js')
    .pipe(concat('script.js'))
    .pipe(uglify().on('error', err => {
      gutil.log(gutil.colors.red('[Error]'), err.toString());
      this.emit('end');
    }))
    .pipe(gulp.dest('dist/js'))
    resolve();
  })
});

const server = () => { 
  nodemon({
      'script': 'app.js',
      'ignore': 'dist/js/*.js'
  });
};

const watch = () => {
  gulp.watch('src/js/*.js', gulp.series(['scripts']));
  gulp.watch('src/sass/*.scss', gulp.series(['sass']));
  gulp.watch('src/icons/*', gulp.series(['copyIcons']));
};

gulp.task('serve', gulp.parallel(watch, server));
