// gulpfile.js
// Include gulp
var gulp = require('gulp');

// npm install --save gulp gulp-jshint gulp-sass gulp-concat gulp-uglify gulp-rename gulp-nodemon

// Include Our Plugins
var jshint = require('gulp-jshint'),
	sass = require('gulp-sass'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	nodemon = require('gulp-nodemon'),
    browserify = require('browserify'),
    reactify = require('reactify'),
    source = require('vinyl-source-stream'),
    sourcemaps = require('gulp-sourcemaps'),
    autoprefixer = require('gulp-autoprefixer');

// Lint Task
gulp.task('lint', function() {
    return gulp.src('public/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('build-styles', function() {
  return gulp.src('./public/scss/*.scss')
          .pipe(sourcemaps.init())
            .pipe(sass())
          .pipe(sourcemaps.write())
          .pipe(gulp.dest('./public/css'));
});

gulp.task('autoprefixer', function() {
  return gulp.src('./public/css/main.css')
          .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
          }));
});

// Compile Our React Stuff
// gulp.task('react', function() {
//     // Browserify/bundle the JS.
//     browserify('./public/js/raw/app.jsx')
//         .transform(reactify)
//         .bundle()
//         .pipe(source('bundle.js'))
//         .pipe(gulp.dest('public/js/'));
// });

// Concatenate & Minify JS
// gulp.task('scripts', function() {
//     return gulp.src('js/*.js')
//         .pipe(concat('all.js'))
//         .pipe(gulp.dest('dist'))
//         .pipe(rename('all.min.js'))
//         .pipe(uglify())
//         .pipe(gulp.dest('dist'));
// });

// Watch Files For Changes
gulp.task('watch', function() {
    // gulp.watch('public/js/raw/**/*.jsx', ['react']);
    gulp.watch('public/scss/**/*.scss', ['stylesheets']);
});

gulp.task('develop', function () {
  nodemon({ script: 'app.js', watch: ['routes', 'app.js'] })
    // .on('change', ['lint'])
    .on('restart', function () {
      console.log('restarted!')
    })
})

// Default Task
// gulp.task('default', ['lint', 'sass', 'scripts', 'watch']);
gulp.task('default', ['stylesheets', 'watch', 'develop']);
// Stylesheets
gulp.task('stylesheets', ['build-styles', 'autoprefixer']);
