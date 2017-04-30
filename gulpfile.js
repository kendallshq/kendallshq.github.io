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
var clean = function(){
  return gulp.src('.').pipe(exec('rm -Rf public'));
}


// -----------------------------------------
// 3. Pages
// -----------------------------------------
var page = function(file){
  return gulp.src('pages/' + file + '.html')
  .pipe(gulp.dest('public/'));
}

var index = function(){
  return page('index');
}


// -----------------------------------------
// 4. Assets
// -----------------------------------------
var styles = function() {
  return gulp.src('assets/scss/app.scss')
    .pipe(plumber())
    .pipe(sass({
      includePaths: [
        './node_modules/foundation-sites/'
      ]
    }))
    .pipe(csso())
    .pipe(gulp.dest('public/assets/'));
}

var scripts = function() {
  return gulp.src([
    'node_modules/foundation-sites/vendor/jquery/dist/jquery.min.js',
    'node_modules/foundation-sites/dist/js/foundation.min.js',
    'assets/js/app.js'])
  .pipe(concat('app.js'))
  .pipe(uglify())
  .pipe(gulp.dest('public/assets/'));
}

var images = function() {
  return gulp.src('assets/images/*.*')
  .pipe(gulp.dest('public/assets/images/'));
}

var fonts = function() {
  return gulp.src('assets/fonts/*.*')
  .pipe(gulp.dest('public/assets/fonts/'));
}

var assets = function(){
  return gulp.parallel(styles, scripts, images, fonts);
}


// -----------------------------------------
// 5. Deploy
// -----------------------------------------
var cname = function(cb) {
  return fs.writeFile('public/CNAME', 'kendallshq.com', cb);
}

var cleanAssets = function() {
  return gulp.src('.').pipe(exec('rm -Rf public/assets'));
}

var deploy = function() {
  return gulp.series(cname, cleanAssets);
}


// -----------------------------------------
// 6. Watch
// -----------------------------------------
var watch = function(){
  gulp.watch(['assets/scss/**/*.scss'], styles);
  gulp.watch(['assets/js/*.js'], scripts);
  gulp.watch(['assets/images/*.*'], gulp.parallel(images, styles));
  gulp.watch(['pages/index.html'], index);
}


// -----------------------------------------
// 7. Combine Tasks
// -----------------------------------------
var test = function() {
  return gulp.parallel(clean, assets(), index);
}

var commit = function() {
  return gulp.series(test(), deploy(), index);
}

gulp.task('assets',       assets());
gulp.task('pages.index',  index);
gulp.task('deploy',       deploy());
gulp.task('commit',       commit());
gulp.task('test',         test());
gulp.task('default',      watch);
