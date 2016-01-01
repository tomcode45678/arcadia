"use strict";

// Gulp plugins
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const debug = require('gulp-debug');

var defaultTasks = [];

var tools = {
  sourcemaps: sourcemaps,
  concat: concat,
  debug: debug
};

require('./build-tasks/javascript')(gulp, tools, defaultTasks);

gulp.task('default', defaultTasks);
