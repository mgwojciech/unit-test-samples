'use strict';
const gulp = require('gulp');
const stringReplace = require('gulp-string-replace');
const build = require('@microsoft/sp-build-web');

build.initialize(require('gulp'));

gulp.task('replace-import-meta', () => {
    return gulp.src(['./lib/**/*.js'])
        .pipe(stringReplace('import.meta', 'process'))
        .pipe(gulp.dest('./lib'));
});

gulp.task('default', gulp.series('replace-import-meta'));