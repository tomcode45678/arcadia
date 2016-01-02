module.exports = function (gulp, tools, defaultTasks) {
  "use strict";

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

  // Add task to default
  defaultTasks.push('build-js');

  gulp.task('build-js', () => {
    return gulp.src('src/**/*.js')
      .pipe(tools.sourcemaps.init())
      .pipe(babel(babelConfig))
      .pipe(tools.concat('util.js'))
      .pipe(tools.sourcemaps.write('.'))
      .pipe(gulp.dest('dist'))
      .pipe(tools.debug({title: 'compiling using Babel:'}));
  });
}
