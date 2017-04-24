import babel from 'gulp-babel';

const JavaScriptTasks = (gulp, tools, defaultTasks, watchTasks, env) => {
  const { sourcemaps, concat, debug, uglify, gutil, changed, plumber } = tools;

  // Default params not supported
  if (!env) {
    env = 'development';
  }

  const PATH = 'src/**/*.js';
  const DIST = 'dist';

  // Any babel config
  const babelConfig = {
    moduleIds: true,
    plugins: ['transform-es2015-modules-systemjs']
  };

  function compile (watch) {
    return gulp.src(PATH)
      .pipe(watch ? changed(DIST) : gutil.noop())
      .pipe(watch ? plumber() : gutil.noop())
      .pipe(sourcemaps.init())
      .pipe(babel(babelConfig))
      .pipe(concat('util.js'))
      .pipe(env === 'production' ? uglify() : gutil.noop())
      .pipe(sourcemaps.write('.'))
      .pipe(gulp.dest(DIST))
      .pipe(debug({ title: 'Compiling using Babel:' })
    );
  }

  gulp.task('build-js', compile);
  gulp.task('build-js-watch', () => gulp.watch(PATH, () => compile(true)));

  defaultTasks.push('build-js');
  watchTasks.push('build-js-watch');
};

export { JavaScriptTasks as default };
