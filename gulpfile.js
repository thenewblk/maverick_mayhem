// gulpfile.js
// Include gulp
var gulp = require('gulp');

// Include Our Plugins
var jshint = require('gulp-jshint'),
    path = require('path'),
    buffer = require('vinyl-buffer');
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
  // folders = require('gulp-folders'),
  // srcFolder = './components',
  // destFolder = './public/js/';

// gulp.task('build-reacts', folders(srcFolder, function(folder){
//     //This will loop over all folders inside srcFolder main, secondary
//     //Return stream so gulp-folders can concatenate all of them
//     //so you still can use safely use gulp multitasking

//     // return gulp.src(path.join(srcFolder, folder, '*.js'))
//     //     .pipe(concat(folder + '.js'))
//     //     .pipe(gulp.dest(destFolder))
//     //     .pipe(uglify())
//     //     .pipe(rename(folder+'.min.js'))
//     //     .pipe(gulp.dest(destFolder));

//     return browserify('./components/' + folder + '/new.jsx')
//         .transform(reactify)
//         .bundle()
//         .pipe(source(folder+'.js'))
//         .pipe(gulp.dest('public/js/'))
//         .pipe(rename(folder+'.min.js'))
//         .pipe(gulp.dest(destFolder));;
// }));

gulp.task('build-reacts', function(){

    return browserify('./components/pages/all.jsx')
        .transform(reactify)
        .bundle()
        .pipe(source('pages.js'))
        .pipe(gulp.dest('public/js/'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(rename('pages.min.js'))
        .pipe(gulp.dest('./public/js/'));
});

// gulp.task('scripts', function(){
//   var bundler = browserify('./assets/js/main.js');

//   return bundler
//     .transform(reactify)
//     .bundle({standalone: 'noscope'})
//     .pipe(source('main.js'))
//     .pipe(buffer())
//     .pipe(uglify())
//     .pipe(gulp.dest('./static/js'));
// });


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

// Concatenate JS
gulp.task('build-scripts', function() {
    return gulp.src(['./public/js/vendors/jquery-2.1.3.js', './public/js/vendors/video.js', './public/js/vendors/bigvideo.js', './public/js/site.js'])
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./public/js'))
        .pipe(uglify())
        .pipe(rename('all.min.js'))
        .pipe(gulp.dest('./public/js'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('components/**/*.jsx', ['build-reacts']);
    gulp.watch('public/scss/**/*.scss', ['stylesheets']);
    gulp.watch('public/js/site.js', ['build-scripts']);
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
gulp.task('default', ['stylesheets', 'watch', 'develop', 'build-scripts', 'build-reacts' ]);
// Stylesheets
gulp.task('stylesheets', ['build-styles', 'autoprefixer']);
