const { src, dest, series, parallel } = require('gulp');

function buildTask(done) {
    src('./src/**/*.js')

    done();
}


module.exports = {
    build: buildTask
}
