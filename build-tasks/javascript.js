import babel from 'gulp-babel';

const JavaScriptTasks = (gulp, tools, defaultTasks, env) => {
  const { sourcemaps, concat, debug, uglify, gutil, runSequence, changed, plumber } = tools;

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

  const buildDeps = ['esl'];

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

  gulp.task('esl', compile);

  gulp.task('watch-esl', () => gulp.watch(PATH, ['esl']));

  // Add task to gulp's default task
  defaultTasks.push('build-js');

  gulp.task('build-js', () => runSequence(...buildDeps));
};

export { JavaScriptTasks as default };
