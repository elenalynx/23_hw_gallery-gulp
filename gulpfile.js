const {src, dest, series, parallel, watch} = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const clean = require('gulp-clean');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const {path} = require('./gulp/const.js');

function gulpCleanTask() {
    return src(path.distPath, {read: false, allowEmpty: true})
        .pipe(clean());
}

function copyJsTask() {
    return src([
        path.srcGalleryApp,
        path.srcIndexJs])
        .pipe(sourcemaps.init())
        .pipe(concat(path.distAllJs))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(dest(path.distPath));
}

function copyCssTask() {
    return src(path.srcCss)
        .pipe(concat(path.distStyleCss))
        .pipe(cleanCSS())
        .pipe(dest(path.distPath));
}

function copyHtmlTask() {
    return src(path.srcHtml)
        .pipe(dest(path.distPath));
}

function buildTask() {
    return series(gulpCleanTask, parallel(copyJsTask, copyCssTask, copyHtmlTask));
}

function serveTask(done) {
    browserSync.init({
        server: {
            baseDir: path.distPath
        }
    });

    watch(path.srcJs, series(copyJsTask, reloadBrowser));
    watch(path.srcCss, series(copyCssTask, reloadBrowser));
    watch(path.srcHtml, series(copyHtmlTask, reloadBrowser));

    done();
}

function reloadBrowser(done) {
    browserSync.reload();
    done();
}

module.exports = {
    build: buildTask(),
    start: series(buildTask(), serveTask),
}
