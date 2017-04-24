// -----------------------------------------
// 1. Dependencies
// -----------------------------------------
var gulp      = require('gulp'),
    concat    = require('gulp-concat'),
    csso      = require('gulp-csso'),
    exec      = require('gulp-exec'),
    plumber   = require('gulp-plumber'),
    sass      = require('gulp-sass'),
    uglify    = require('gulp-uglify'),
    watch     = require('gulp-watch'),
    fs        = require('fs');


// -----------------------------------------
// 2. Clean Public Directory
// -----------------------------------------
gulp.task('clean', function() {
  return gulp.src('.')
  .pipe(exec('rm -Rf public'));
});


// -----------------------------------------
// 4. Assets
// -----------------------------------------
function _(file) {
  return gulp.src('pages/' + file + '.html')
  .pipe(gulp.dest('public/'));
}

gulp.task('page.index', function(){
  return _('index');
});


// -----------------------------------------
// 4. Assets
// -----------------------------------------
gulp.task('assets.css', function(){
  return gulp.src('assets/scss/app.scss')
    .pipe(plumber())
    .pipe(sass({
      includePaths: [
        './node_modules/foundation-sites/'
      ]
    }))
    .pipe(csso())
    .pipe(gulp.dest('public/assets/'));
});

gulp.task('assets.js', function(){
  return gulp.src([
    'node_modules/foundation-sites/vendor/jquery/dist/jquery.min.js',
    'node_modules/foundation-sites/dist/js/foundation.min.js',
    'assets/js/app.js'])
  .pipe(concat('app.js'))
  .pipe(uglify())
  .pipe(gulp.dest('public/assets/'));
});

gulp.task('assets.images', function(){
  return gulp.src('assets/images/*.*')
  .pipe(gulp.dest('public/assets/images/'));
});

gulp.task('assets.fonts', function(){
  return gulp.src('assets/fonts/*.*')
  .pipe(gulp.dest('public/assets/fonts/'));
});


// -----------------------------------------
// 5. Combine Tasks
// -----------------------------------------
gulp.task('assets', [
  'assets.css',
  'assets.js',
  'assets.images',
  'assets.fonts'
]);

gulp.task('pages', [
  'page.index'
]);

gulp.task('all', [
  'clean',
  'assets',
  'pages'
]);

gulp.task('default', ['watch']);


// -----------------------------------------
// 6. Deploy
// -----------------------------------------
gulp.task('cname', function(cb){
  fs.writeFile('public/CNAME', 'kendallshq.com', cb);
});

gulp.task('deploy', function(){
  return gulp.src('.').pipe(exec('rm -Rf public/assets'));
});


// -----------------------------------------
// 7. Watch
// -----------------------------------------
gulp.task('watch', function(){
  gulp.watch([
    'assets/scss/*.scss',
    'assets/scss/config/*.scss'
  ], ['assets.css']);
  gulp.watch(['assets/js/*.js'], ['assets.js']);
  gulp.watch(['assets/images/*.*'], ['assets.images', 'assets.css']);
  gulp.watch(['pages/**/*.html'], ['pages']);
});
