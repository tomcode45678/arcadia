module.exports = function (gulp, tools, defaultTasks, env) {
  "use strict";

  // Destructuring not supported
  //var {sourcemaps, concat, debug, gutil, uglify, gutil, source, runSequence} = tools;

  // Default params not supported
  if (!env) {
    env = 'development';
  }

  let output = tools.gutil.env.output;
  if (!output) {
    output = 'systemjs'; // default
  }

  const PATHS = {
    src: 'src/**/*.js',
    browserSupport: 'src/**/browser-support/*.js'
  }

  const babel = require('gulp-babel');
  const browserify = require('browserify');

  // Any babel config
  let babelConfig = {
    presets: ['es2015'],
    plugins: []
  };

  let buildDeps = ['babel'];

  if (output === 'systemjs' || output === 'amd') {
    Object.assign(babelConfig, {
      moduleIds: true
    });
    babelConfig.plugins.push(`transform-es2015-modules-${output}`);
  }
  else if (output === 'commonjs') {
    buildDeps.push('commonjs');
    babelConfig.plugins.push('transform-es2015-modules-commonjs');
  }

  // Add task to gulp's default task
  defaultTasks.push('build-js');

  gulp.task('build-js', () => {
    // ...buildDeps not supported
    tools.runSequence.apply(this, buildDeps);
  });

  gulp.task('babel', () => {
    return gulp.src([PATHS.src, `!${PATHS.browserSupport}`])
      .pipe(tools.sourcemaps.init())
      .pipe(babel(babelConfig))
      .pipe(output !== 'commonjs' ? tools.concat('util.js') : tools.gutil.noop())
      .pipe(env === 'production' ? tools.uglify() : tools.gutil.noop())
      .pipe(tools.sourcemaps.write('.'))
      .pipe(gulp.dest('dist'))
      .pipe(tools.debug({title: 'Compiling using Babel:'})
    );
  });

  gulp.task('commonjs', () => {
    return browserify('dist/main.js')
    .bundle()
    .on('error', (e) => {
      tools.gutil.log(e);
    })
    .pipe(tools.source('index.js'))
    .pipe(gulp.dest('examples/commonjs'))
  });

  // For IE8+ support
  gulp.task('browser-support', () => {
    return gulp.src(PATHS.browserSupport)
      .pipe(tools.concat('browser-support.js'))
      .pipe(gulp.dest('dist'))
      .pipe(tools.debug({title: 'Building browser support file:'}));
  });
}
