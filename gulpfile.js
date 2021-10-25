const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');

gulp.task('babel', () => {
  return gulp.src('./src/components/**/*.js')
    .pipe(babel())
    .pipe(gulp.dest('lib'))
});

gulp.task('copy-css', function () {
  return gulp.src('./src/components/**/*.css').pipe(gulp.dest('./lib'));
});
gulp.task('copy-less', function () {
  return gulp.src('./src/components/**/*.less').pipe(gulp.dest('./lib'));
});
gulp.task('copy-png', function () {
  return gulp.src('./src/components/**/*.png').pipe(gulp.dest('./lib'));
});

const copyResources = gulp.parallel('copy-css', 'copy-less', 'copy-png');

gulp.task('concat-css', () => {
  return gulp.src('./src/components/**/*.css')
    .pipe(concat('index.css'))
    .pipe(gulp.dest('dist'));
});

gulp.task('default',
  gulp.series(
    'babel',
    copyResources,
    // 'concat-css',
  ));