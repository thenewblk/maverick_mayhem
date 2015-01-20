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
    source = require('vinyl-source-stream');

// Lint Task
gulp.task('lint', function() {
    return gulp.src('public/javascripts/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Compile Our Sass
gulp.task('sass', function() {
    return gulp.src('public/stylesheets/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('public/stylesheets'));
});

// Compile Our React Stuff
gulp.task('react', function() {
    // Browserify/bundle the JS.
    browserify('./public/javascripts/raw/app.jsx')
        .transform(reactify)
        .bundle()
        .pipe(source('bundle.js'))
        .pipe(gulp.dest('public/javascripts/'));
});

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
    gulp.watch('public/javascripts/raw/**/*.jsx', ['react']);
    gulp.watch('public/stylesheets/*.scss', ['sass']);
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
gulp.task('default', ['sass', 'react', 'watch', 'develop']);