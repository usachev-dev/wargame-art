var gulp = require('gulp'),
    sass = require('gulp-sass');
var browserSync = require('browser-sync');
var nodemon = require('gulp-nodemon');


gulp.task('sass',function() {
    return gulp.src(['public/stylesheets/*.sass'])
        .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(gulp.dest('public/stylesheets/'))
});

gulp.task('watch', function(){
    gulp.watch(['public/stylesheets/*.sass'],['sass']);
});


