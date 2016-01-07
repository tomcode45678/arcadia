module.exports = function (gulp, tools, defaultTasks, env) {
  "use strict";

  // TODO es6 default param does not work (06/01/2016)
  if (!env) {
    env = 'development';
  }

  const PATHS = {
    src: 'src/**/*.js',
    browserSupport: 'src/**/browser-support/*.js'
  }

  const babel = require('gulp-babel');

  // Set module output here - blank returns native imports
  const MODULE_TYPE = 'amd'; // (amd, commonjs, systemjs)

  // Any babel config
  let babelConfig = {
      presets: ['es2015'],
      plugins: []
  };

  if (MODULE_TYPE === 'systemjs') {
      babelConfig.plugins.push('transform-es2015-modules-systemjs');
  }
  else if (MODULE_TYPE === 'commonjs') {
      babelConfig.plugins.push('transform-es2015-modules-commonjs');
  }
  else if (MODULE_TYPE === 'amd') {
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
