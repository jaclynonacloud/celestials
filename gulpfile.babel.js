// LESSON PLAN NOTE
// use module approach to require gulp and other dev dependencies
// gulp is a toolkit that will help you automate time consuming tasks in your workflow
var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var wait = require('gulp-wait');
var merge = require('merge-stream');

// for transpiling Sass to CSS
gulp.task('styles', function() {
    // transpile all sass files and concatenate together
    var scssStream = gulp.src('sass/**/*.scss')
        .pipe(wait(500))
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('scss-files.scss'))
    ;
    // concatenate all css together
    var cssStream = gulp.src(['sass/**/*.css','lib/**/*.css'])
        .pipe(concat('css-files.css'))
    ;
    // merge them all together
    merge(scssStream, cssStream)
        .pipe(concat('main.css'))
        .pipe(gulp.dest('./styles/'));

    console.log(">>> I am busy transpiling and merging CSS :)");
});

// no need to use Watchify as gulp has gulp.watch built in (although not as efficient)
gulp.task('watch', function () {
  // watching all Sass files
  gulp.watch('sass/**/*.scss',['styles']);
  gulp.watch('sass/**/*.css',['styles']);
});

gulp.task('default', ['watch','styles']);