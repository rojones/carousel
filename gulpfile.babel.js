import babelify from 'babelify';
import browserify from 'browserify';
import buffer from 'vinyl-buffer';
import gulp from 'gulp';
import livereload from 'gulp-livereload';
import sass from 'gulp-sass';
import source from 'vinyl-source-stream';
import sourcemaps from 'gulp-sourcemaps';

const srcDir = './src';
const distDir = './dist';

// JavaScript
gulp.task('script', () => {
  return browserify({
    'entries': [`${srcDir}/scripts/script.js`],
    'debug': true,
    'transform': [
      babelify.configure({
        'presets': ['@babel/env']
      })
    ]
  })
  .bundle()
  .on('error', function (error) {
    console.log(error.message);
    this.emit('end');
  })
  .pipe(source('bundle.js'))
  .pipe(buffer())
  .pipe(sourcemaps.init({'loadMaps': true}))
  .pipe(sourcemaps.write('.'))
  .pipe(gulp.dest(`${distDir}/scripts`))
  .pipe(livereload());
});

// CSS
gulp.task('style', () => {
  return gulp.src(`${srcDir}/scss/**/*.scss`)
  .pipe(sourcemaps.init())
  .pipe(sass().on('error', sass.logError))
  .pipe(sourcemaps.write())
  .pipe(gulp.dest(`${distDir}/css`))
  .pipe(livereload());
});

// HTML
gulp.task('html', (done) => {
  gulp.src('./*.html')
  .pipe(livereload());
  done();
});

// Watch
gulp.task('watch', () => {
  livereload.listen();
  gulp.watch(`${srcDir}/scss/**/*.scss`, gulp.series('style'));
  gulp.watch(`${srcDir}/scripts/script.js`, gulp.series('script'));
  gulp.watch('*.html', gulp.series('html'));
});

// Default
gulp.task('default', gulp.series(gulp.parallel('style', 'script'), 'watch'));