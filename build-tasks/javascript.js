module.exports = function (gulp, tools, defaultTasks, env) {
  "use strict";

  // Destructuring not supported
  //var {sourcemaps, concat, debug, gutil, uglify, gutil, source, runSequence, changed} = tools;

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
  const DIST = 'dist';

  // Any babel config
  let babelConfig = {
    presets: ['es2015'],
    plugins: []
  };

  let buildDeps = ['esl'];

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

  function compile (watch) {
    return gulp.src([PATHS.src, `!${PATHS.browserSupport}`])
      .pipe(tools.changed(DIST))
      .pipe(tools.plumber())
      .pipe(tools.sourcemaps.init())
      .pipe(babel(babelConfig))
      .pipe(output !== 'commonjs' ? tools.concat('util.js') : tools.gutil.noop())
      .pipe(env === 'production' ? tools.uglify() : tools.gutil.noop())
      .pipe(tools.sourcemaps.write('.'))
      .pipe(gulp.dest(DIST))
      .pipe(tools.debug({title: 'Compiling using Babel:'})
    );
  }

  gulp.task('esl', () => compile());

  gulp.task('watch-esl', () => gulp.watch(PATHS.src, ['compile']));

  gulp.task('commonjs', () => {
    return browserify(`${DIST}/main.js`)
      .bundle()
      .on('error', e => tools.gutil.log(e))
      .pipe(tools.source('index.js'))
      .pipe(gulp.dest('examples/commonjs')
    );
  });

  // For IE8+ support
  gulp.task('browser-support', () => {
    return gulp.src(PATHS.browserSupport)
      .pipe(tools.concat('browser-support.js'))
      .pipe(gulp.dest(DIST))
      .pipe(tools.debug({title: 'Building browser support file:'}));
  });

  // Add task to gulp's default task
  defaultTasks.push('build-js');

  gulp.task('build-js', () => {
    // ...buildDeps not supported
    tools.runSequence.apply(this, buildDeps);
  });
}
