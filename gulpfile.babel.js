import babelify from 'babelify';
import browserify from 'browserify';
import buffer from 'vinyl-buffer';
import cssnano from 'gulp-cssnano';
import gulp from 'gulp';
import livereload from 'gulp-livereload';
import minify from 'gulp-minify';
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

gulp.task('script:minifier', () => {
  return gulp.src(`${distDir}/scripts/bundle.js`)
    .pipe(minify())
    .pipe(gulp.dest(`${distDir}/scripts`))
});

gulp.task('script:minify', gulp.series('script', 'script:minifier'));

// CSS
gulp.task('style', () => {
  return gulp.src(`${srcDir}/scss/**/*.scss`)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(`${distDir}/css`))
    .pipe(livereload());
});

gulp.task('style:minify', function() {
  return gulp.src(`${srcDir}/scss/**/*.scss`)
    .pipe(sass().on('error', sass.logError))
    .pipe(cssnano())
    .pipe(gulp.dest(`${distDir}/css`));
});

// HTML
gulp.task('html', (done) => {
  gulp.src('./*.html')
    .pipe(livereload());
  done();
});

// SVG
gulp.task('svg', (done) => {
  gulp.src(`${srcDir}/svg/**/*.svg`)
    .pipe(gulp.dest(`${distDir}/svg`))
    .pipe(livereload());
  done();
});

// Watch
gulp.task('watch', () => {
  livereload.listen();
  gulp.watch(`${srcDir}/scss/**/*.scss`, gulp.series('style'));
  gulp.watch(`${srcDir}/scripts/script.js`, gulp.series('script'));
  gulp.watch('*.html', gulp.series('html'));
  gulp.watch(`${srcDir}/svg/**/*.svg`, gulp.series('svg'));
});

// Default
gulp.task('default', gulp.series(gulp.parallel('style', 'script', 'svg'), 'watch'));
gulp.task('compile', gulp.parallel('style:minify', 'script:minify', 'svg'));