'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _ = require('lodash');

var browserSync = require('browser-sync');

gulp.task('inject-reload', ['inject'], function() {
  browserSync.reload();
});

gulp.task('inject', ['scripts', 'styles', 'styles-rtl'], function () {
  var injectStyles = gulp.src([
    // Font CSS file for icomoon
    path.join(conf.paths.src, '/assets/css/icons/icomoon/styles.css'),
    // CSS files compilied from LESS
    path.join(conf.paths.tmp, '/serve/app/**/bootstrap.css'),
    path.join(conf.paths.tmp, '/serve/app/**/core.css'),
    path.join(conf.paths.tmp, '/serve/app/**/components.css'),
    path.join(conf.paths.tmp, '/serve/app/**/lollibond.css'),
    path.join(conf.paths.tmp, '/serve/app/**/colors.css'),
    path.join('!' + conf.paths.tmp, '/serve/app/vendor.css')
  ], { read: false });

  var injectScripts = gulp.src([
    path.join(conf.paths.src, '/app/**/*.module.js'),
    path.join(conf.paths.src, '/app/**/*.js'),
    path.join('!' + conf.paths.src, '/app/**/*.spec.js'),
    path.join('!' + conf.paths.src, '/app/**/*.mock.js'),
  ])
  .pipe($.angularFilesort()).on('error', conf.errorHandler('AngularFilesort'));

  var injectOptions = {
    ignorePath: [conf.paths.src, path.join(conf.paths.tmp, '/serve')],
    addRootSlash: false
  };

  return gulp.src(path.join(conf.paths.src, '/*.html'))
    .pipe($.inject(injectStyles, injectOptions))
    .pipe($.inject(injectScripts, injectOptions))
    .pipe(wiredep(_.extend({devDependencies: false}, conf.wiredep)))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
});
