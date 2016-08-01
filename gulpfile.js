var gulp = require('gulp');
var ts = require('gulp-typescript');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');

var tsProject = ts.createProject('tsconfig.json', {noEmitOnError: false, noEmitHelpers: false});

gulp.task('default', ['watch']);

gulp.task('watch', function() {
    gulp.watch('app/**/*.ts', ['typescript']);
});

gulp.task('typescript', function() {
    var tsResult = tsProject.src('app/**/*.ts')
        .pipe(ts(tsProject));

    return tsResult.js.pipe(uglify()).pipe(gulp.dest('app'));
});