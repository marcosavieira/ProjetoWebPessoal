
   
const gulp = require('gulp');
const gulpsass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const imagemin = require('gulp-imagemin');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const browsersync = require('browser-sync').create();
const usemin = require('gulp-usemin');
const purgecss = require('gulp-purgecss');
const include = require('gulp-file-include')

function watchFiles(){
    
}

function sass(){
    return gulp.src('./src/scss/**/*.scss')
        .pipe(gulpsass())
        .pipe(gulp.dest('./src/css'))
}

function html(){
    return gulp.src(['./src/**/*.html', '!src/inc/**/*'])
        .pipe(include())
        .pipe(usemin({
            css: [function(){
                return purgecss({
                    content: ['./src/**/*.html'],
                    whitelist: ['js', 'no-js', 'menu-opened']
                })
            }],
            js: [uglify]
        }))
        .pipe(gulp.dest('./dist'))
}

function imagens(){
    return gulp.src('./src/imagens/**/*')
        .pipe(gulp.dest('./dist/imagens'))
}

function server(){
    // browsersync.init({
    //     server: './dist/'
    // })

    browsersync.init({
        server: {
            baseDir: './dist',
            routes: {
                '/node_modules': './node_modules'
            }
        }
    })

    gulp.watch('./src/scss/**/*.scss', sass)
    gulp.watch('./src/**/*.html', html)
    gulp.watch('./src/imagens/**/*', imagens)

    gulp.watch('./dist/**/*').on('change', browsersync.reload)
}

function clean() {
    return del('./dist/')
}
// exports.default = gulp.parallel(sass, html, imagens);
exports.default = gulp.series(clean, gulp.parallel(sass, imagens), html)
exports.server = server;
exports.watch = watchFiles;
