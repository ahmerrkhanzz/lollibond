'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');
var rtlcss = require('gulp-rtlcss');
var rename = require('gulp-rename');

var browserSync = require('browser-sync');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _ = require('lodash');

gulp.task('styles-reload', ['styles', 'styles-rtl'], function() {
  return buildStyles()
    .pipe(browserSync.stream());
});

gulp.task('styles', function() {
  return buildStyles();
});

gulp.task('styles-rtl', function() {
  return buildStylesRTL();
});

var buildStyles = function() {
  var lessOptions = {
    paths: [
      'bower_components',
      path.join(conf.paths.src, '/assets/styles')
    ],
    relativeUrls: true
  };

  return gulp.src([
      path.join(conf.paths.src, '/assets/styles/_main/*.less')
    ])
    .pipe(wiredep(_.extend({}, conf.wiredep)))
    .pipe($.sourcemaps.init())
    .pipe($.less(lessOptions)).on('error', conf.errorHandler('Less'))
    .pipe($.autoprefixer()).on('error', conf.errorHandler('Autoprefixer'))
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve/app/')));
};

var buildStylesRTL = function() {
  var lessOptions = {
    paths: [
      'bower_components',
      path.join(conf.paths.src, '/assets/styles')
    ],
    relativeUrls: true
  };

  return gulp.src([
      path.join(conf.paths.src, '/assets/styles/_main/*.less')
    ])
    .pipe(wiredep(_.extend({}, conf.wiredep)))
    .pipe($.sourcemaps.init())
    .pipe($.less(lessOptions)).on('error', conf.errorHandler('Less'))
    .pipe($.autoprefixer()).on('error', conf.errorHandler('Autoprefixer'))
    .pipe(rtlcss())
    .pipe(rename({ suffix: '-rtl' })) // Append "-rtl" to the filename.
    .pipe($.sourcemaps.write())
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve/app/')));
};
