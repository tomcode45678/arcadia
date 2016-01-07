"use strict";

// Gulp plugins
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const debug = require('gulp-debug');
const gutil = require('gulp-util');
const uglify = require('gulp-uglify');

let env = gutil.env.env;

let defaultTasks = [];

const tools = {
  sourcemaps: sourcemaps,
  concat: concat,
  debug: debug,
  gutil: gutil,
  uglify: uglify
};

require('./build-tasks/javascript')(gulp, tools, defaultTasks, env, 'amd');

gulp.task('default', defaultTasks);
