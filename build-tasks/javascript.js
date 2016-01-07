module.exports = function (gulp, tools, defaultTasks, env, moduleType) {
  "use strict";

  // TODO es6 default param does not work (06/01/2016)
  if (!env) {
    env = 'development';
  }

  if (!moduleType) {
    moduleType = 'amd'; // (amd, commonjs, systemjs)
  }

  const PATHS = {
    src: 'src/**/*.js',
    browserSupport: 'src/**/browser-support/*.js'
  }

  const babel = require('gulp-babel');

  // Any babel config
  let babelConfig = {
      presets: ['es2015'],
      plugins: []
  };

  if (moduleType === 'systemjs') {
      babelConfig.plugins.push('transform-es2015-modules-systemjs');
  }
  else if (moduleType === 'commonjs') {
      babelConfig.plugins.push('transform-es2015-modules-commonjs');
  }
  else if (moduleType === 'amd') {
      Object.assign(babelConfig, {
          moduleIds: true
      });
      babelConfig.plugins.push('transform-es2015-modules-amd');
  }

  // Add task to gulp's default task
  defaultTasks.push('build-js');

  gulp.task('build-js', () => {
    return gulp.src([PATHS.src, `!${PATHS.browserSupport}`])
      .pipe(tools.sourcemaps.init())
      .pipe(babel(babelConfig))
      .pipe(tools.concat('util.js'))
      .pipe(env === 'production' ? tools.uglify() : tools.gutil.noop())
      .pipe(tools.sourcemaps.write('.'))
      .pipe(gulp.dest('dist'))
      .pipe(tools.debug({title: 'Compiling using Babel:'}));
  });

  // For IE8+ support
  gulp.task('browser-support', () => {
    return gulp.src(PATHS.browserSupport)
      .pipe(tools.concat('browser-support.js'))
      .pipe(gulp.dest('dist'))
      .pipe(tools.debug({title: 'Building browser support file:'}));
  });
}
