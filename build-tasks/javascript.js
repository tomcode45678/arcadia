module.exports = function (gulp, tools, defaultTasks, env) {
  "use strict";

  // Destructuring not supported
  //var {sourcemaps, concat, debug, gutil, uglify, gutil, source, runSequence, changed} = tools;

  // Default params not supported
  if (!env) {
    env = 'development';
  }

  const PATHS = {
    src: 'src/**/*.js',
    browserSupport: 'src/**/browser-support/*.js'
  };

  const babel = require('gulp-babel');
  const DIST = 'dist';

  // Any babel config
  const babelConfig = {
    moduleIds: true,
    plugins: ['transform-es2015-modules-systemjs']
  };

  let buildDeps = ['esl'];

  function compile (watch) {
    return gulp.src([PATHS.src, `!${PATHS.browserSupport}`])
      .pipe(watch ? tools.changed(DIST) : tools.gutil.noop())
      .pipe(watch ? tools.plumber() : tools.gutil.noop())
      .pipe(tools.sourcemaps.init())
      .pipe(babel(babelConfig))
      .pipe(tools.concat('util.js'))
      .pipe(env === 'production' ? tools.uglify() : tools.gutil.noop())
      .pipe(tools.sourcemaps.write('.'))
      .pipe(gulp.dest(DIST))
      .pipe(tools.debug({title: 'Compiling using Babel:'})
    );
  }

  gulp.task('esl', compile);

  gulp.task('watch-esl', () => gulp.watch(PATHS.src, ['esl']));

  // For IE8+ support
  gulp.task('browser-support', () => {
    return gulp.src(PATHS.browserSupport)
      .pipe(tools.concat('browser-support.js'))
      .pipe(gulp.dest(DIST))
      .pipe(tools.debug({title: 'Building browser support file:'}));
  });

  // Add task to gulp's default task
  defaultTasks.push('build-js');

  // ...buildDeps not supported
  gulp.task('build-js', () => tools.runSequence.apply(this, buildDeps));
}
