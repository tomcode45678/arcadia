'use strict';

// Gulp plugins
import gulp from 'gulp';
import sourcemaps from 'gulp-sourcemaps';
import concat from 'gulp-concat';
import debug from 'gulp-debug';
import gutil from 'gulp-util';
import uglify from 'gulp-uglify';
import del from 'del';
import runSequence from 'run-sequence';
import changed from 'gulp-changed';
import plumber from 'gulp-plumber';
import watch from 'gulp-watch';

import JavaScriptTasks from './build-tasks/javascript';

let env = gutil.env.env;

gulp.task('clean', () => del(['dist/**/*']));

let defaultTasks = [];

const tools = {
  sourcemaps,
  concat,
  debug,
  gutil,
  uglify,
  runSequence,
  changed,
  plumber
};

JavaScriptTasks(gulp, tools, defaultTasks, env);

gulp.task('default', done => {
  runSequence('clean', defaultTasks, done);
});
