var gulp          	= require('gulp');
var notify        	= require('gulp-notify');
var livereload    	= require('gulp-livereload');
var source        	= require('vinyl-source-stream');
var browserify    	= require('browserify');
var babelify      	= require('babelify');
var ngAnnotate    	= require('browserify-ngannotate');
var browserSync   	= require('browser-sync').create();
var rename        	= require('gulp-rename');
var templateCache 	= require('gulp-angular-templatecache');
var uglify        	= require('gulp-uglify');
var concat        	= require('gulp-concat');
var cleanCSS      	= require('gulp-clean-css');
var merge         	= require('merge-stream');
var htmlmin         = require('gulp-htmlmin');
var nodemon         = require('gulp-nodemon');
var run             = require('gulp-run');

// Where our files are located
var jsFiles   			= "src/client/js/**/*.js";
var cssFiles   			= "src/client/css/**/*.css";
var viewFiles 			= "src/client/js/**/*.html";
var vendor          = ["src/client/vendor/js/jquery.min.js", "src/client/vendor/js/bootstrap.min.js", "src/client/vendor/js/bootstrap-wysihtml5.js"];

var interceptErrors = function(error) {
  var args = Array.prototype.slice.call(arguments);

  // Send error to notification center with gulp-notify
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);

  // Keep gulp from hanging on this task
  this.emit('end');
};

gulp.task('vendor', function(){
  var jq = gulp.src(vendor, {base: 'src/client/vendor/js/'})
      .pipe(concat('vendor.js'))
      .pipe(rename('vendor.min.js'))
      .pipe(uglify('vendor.min.js'))
      .pipe(gulp.dest('./build'));
  var map = gulp.src('./src/client/vendor/js/jquery/dist/jquery.min.map')
      .pipe(gulp.dest('./build'));

  return merge(jq, map);
});

gulp.task('html', function() {
  return gulp.src("src/client/index.html")
    .on('error', interceptErrors)
    .pipe(gulp.dest('./build/'));
});

gulp.task('minify-css',['img'], function() {
  return gulp.src(cssFiles)
    .pipe(cleanCSS({compatibility: 'ie8', processImport:false}))
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest('./build/'));
});

gulp.task('img', function(){
  return gulp.src('src/client/img/**/*')
    .pipe(gulp.dest('./build/img'));
});

gulp.task('views', function() {
  return gulp.src(viewFiles)
    .pipe(templateCache({
      standalone: true
    }))
    .on('error', interceptErrors)
    .pipe(rename("app.templates.js"))
    .pipe(gulp.dest('./src/client/js/config/'));
});

gulp.task('browserify', ['views'], function() {
  return browserify('./src/client/js/app.js')
    .transform(babelify, {presets: ["es2015"]})
    .transform(ngAnnotate)
    .bundle()
    .on('error', interceptErrors)
    //Pass desired output filename to vinyl-source-stream
    .pipe(source('main.js'))
    // Start piping stream to tasks!
    .pipe(gulp.dest('./build/'));
});

gulp.task('start', ['build'] , function () {
  nodemon({
    script: 'server.js',
    ignore: ['node_modules/', 'build/', 'dist/'],
    task: ['build'],
    ext: 'js html', 
    env: { 'NODE_ENV': 'development' }
  });
});

// This task is used for building production ready
// minified JS/CSS files into the dist/ folder
gulp.task('build', ['html', 'browserify', 'minify-css', 'vendor'], function() {
  var html = gulp.src("build/index.html")
                 .pipe(htmlmin({collapseWhitespace: true}))
                 .pipe(gulp.dest('./dist/'));

  var js = gulp.src(["build/vendor.min.js","build/main.js"], {base: 'build'})
               .pipe(concat('main.js'))
               .pipe(uglify())
               .pipe(gulp.dest('./dist/'));

  var css = gulp.src("build/vendor.min.css")
                .pipe(gulp.dest('./dist'));
  var img = gulp.src('build/img/**/*')
		              .pipe(gulp.dest('./dist/img'));

  return merge(html,js, css, img);
});

gulp.task('default', ['html', 'browserify', 'minify-css'], function() {

  browserSync.init(['./build/**/**.**'], {
    server: "./build",
    port: 9000,
    notify: false,
    ui: {
      port: 9001
    }
  });

  gulp.watch("src/index.html", ['html']);
  gulp.watch(viewFiles, ['views']);
  gulp.watch(jsFiles, ['browserify']);
  gulp.watch(cssFiles, ['minify-css']);
});