"use strict";

// Gulp plugins
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const debug = require('gulp-debug');
const gutil = require('gulp-util');
const uglify = require('gulp-uglify');
const source = require('vinyl-source-stream');
const del = require('del');
const runSequence = require('run-sequence');

let env = gutil.env.env;

gulp.task('clean', () => {
  return del('dist/**/*');
});

let defaultTasks = [];

const tools = {
  sourcemaps: sourcemaps,
  concat: concat,
  debug: debug,
  gutil: gutil,
  uglify: uglify,
  gutil: gutil,
  source: source,
  runSequence: runSequence
};

require('./build-tasks/javascript')(gulp, tools, defaultTasks, env);

gulp.task('default', (done) => {
  runSequence('clean', defaultTasks, done);
});
