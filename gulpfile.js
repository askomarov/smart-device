const gulp = require('gulp');
const path = require('path');
const plumber = require('gulp-plumber');
const sourcemap = require('gulp-sourcemaps');
const sass = require('gulp-sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const server = require('browser-sync').create();
const stripCssComments = require('gulp-strip-css-comments');
const csso = require('gulp-csso');
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const svgstore = require('gulp-svgstore');
const htmlmin = require('gulp-htmlmin');
const posthtml = require('gulp-posthtml');
const include = require('posthtml-include');
const del = require('del');

const ghPages = require('gh-pages');

// gh-pages
gulp.task("deploy", (cb) => {
  return ghPages.publish(path.join(process.cwd(), './build'), cb);
});

gulp.task('css', () => gulp.src('source/sass/style.scss')
  .pipe(stripCssComments(false))
  .pipe(plumber())
  .pipe(sourcemap.init())
  .pipe(sass())
  .pipe(postcss([autoprefixer()]))
  .pipe(gulp.dest('build/css'))
  .pipe(csso())
  .pipe(rename('style.min.css'))
  .pipe(sourcemap.write('.'))
  .pipe(gulp.dest('build/css'))
  .pipe(server.stream()));

gulp.task('js', () => gulp.src('source/js/*.js')
  .pipe(gulp.dest('build/js')));

gulp.task('server', () => {
  server.init({
    server: 'build/',
    notify: false,
    open: true,
    cors: true,
    ui: false,
  });

  gulp.watch('source/sass/**/*.{scss,sass}', gulp.series('css'));
  gulp.watch('source/img/icon-*.svg', gulp.series('sprite', 'html', 'refresh'));
  gulp.watch('source/**/*.html', gulp.series('html', 'refresh'));
  gulp.watch('source/js/*.js', gulp.series('js', 'refresh'));
});

gulp.task('refresh', (done) => {
  server.reload();
  done();
});

gulp.task('images', () => gulp.src('source/img/**/*.{png,jpg,svg}')
  .pipe(imagemin([
    imagemin.optipng({ optimizationLevel: 3 }),
    imagemin.jpegtran({ progressive: true }),
    imagemin.svgo(),
  ]))

  .pipe(gulp.dest('build/img')));

gulp.task('webp', () => gulp.src('source/img/**/*.{png,jpg}')
  .pipe(webp({ quality: 90 }))
  .pipe(gulp.dest('source/img')));

gulp.task('sprite', () => gulp.src('source/img/icons/*.svg')
  .pipe(svgstore({ inlineSvg: true }))
  .pipe(rename('sprite_auto.svg'))
  .pipe(gulp.dest('build/img')));

gulp.task('html', () => gulp.src('source/*.html')
  .pipe(htmlmin({
    removeComments: true
  }))
  .pipe(posthtml([
    include(),
  ]))
  .pipe(gulp.dest('build')));

gulp.task("copy", function () {
  return gulp.src([
    "source/fonts/**/*.{woff,woff2}",
    "source/img/**",
    "source/js/**",
    "source//*.ico"
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"));
});


gulp.task('clean', () => del('build'));

gulp.task('build', gulp.series(
  'clean',
  'copy',
  'css',
  'sprite',
  'html',
  // 'images',
  // 'webp'
));

gulp.task('start', gulp.series('build', 'server'));
