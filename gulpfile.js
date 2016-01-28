var gulp = require('gulp'),
    ghPages = require('gulp-gh-pages'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    livereload = require('gulp-livereload'),
    newer = require('gulp-newer'),
    globbing = require('gulp-css-globbing'),
    combineMq = require('gulp-combine-mq');


// ROOT TASKS // ---------------------------------------------------------
// Main style task  
gulp.task('css', function() {
  return gulp.src('dev/sass/application.scss')
    .pipe(globbing({extensions: '.scss'}))
    .pipe(sass())
    .on('error', handleError)
    .pipe(combineMq({beautify: false}))
    .pipe(autoprefixer({cascade: false})) // auto prefix
    .pipe(cssnano()) // minify everything
    .pipe(gulp.dest('public/css'));
});

// Main Javascript task
gulp.task('js', function() {  
  return gulp.src('dev/js/**/*.js')
    .pipe(newer('public/js'))
    .pipe(uglify())
    .on('error', handleError)
    .pipe(gulp.dest('public/js'));
});

// Main image task
gulp.task('img', function() {
  return gulp.src('dev/img/**/*.{jpg,jpeg,png,gif,svg,ico}')
    .pipe(newer('public/img'))
    .pipe(imagemin({ 
      optimizationLevel: 5,
      progressive: true, 
      interlaced: true,
      svgoPlugins: [{
        collapseGroups: false,
        removeViewBox: false
      }]
    }))
    .on('error', handleError)
    .pipe(gulp.dest('public/img'));
});

// Publish github page
gulp.task('deploy', function() {
  return gulp.src('public/**/*')
    .pipe(ghPages());
});


// FUNCTIONS // ---------------------------------------------------------
// Initial start function
gulp.task('start', ['img'], function() {
  gulp.start('js', 'css');
});

// Watch function
gulp.task('watch', ['start'], function() {
  gulp.watch('dev/sass/**/*.scss', ['css']);
  gulp.watch('dev/js/**/*.js', ['js']);
  gulp.watch('dev/img/**/*.{jpg,jpeg,png,gif,svg,ico}', ['img']);
 
  livereload.listen();
  gulp.watch(['public/*.html', 'public/js/**/*.js', 'public/img/**/*.{jpg,jpeg,png,gif,svg,ico}', 'public/css/*.css']).on('change', livereload.changed);
});

// Default function
gulp.task('default', ['watch']);

// Error reporting function
function handleError(err) {
  console.log(err.toString());
  this.emit('end');
}