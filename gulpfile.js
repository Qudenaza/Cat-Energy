"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync").create();
var svgstore = require("gulp-svgstore");
var rename = require("gulp-rename");
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var webp = require("gulp-webp");
var imagemin = require("gulp-imagemin");
var posthtml = require("gulp-posthtml");
var uglify = require("gulp-uglify");
var include = require("posthtml-include");
var run = require("run-sequence");
var del = require("del");
var htmlmin = require("gulp-htmlmin");
var prettyHtml = require("gulp-pretty-html");


gulp.task("htmlpretty", function () {
    return gulp.src("src/*.html")
        .pipe(prettyHtml())
        .pipe(gulp.dest("build/prettyhtmlboy"));
});

gulp.task("style", function () {
  gulp.src("src/sass/style.scss")
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("src/css"))
    .pipe(minify({
        }))
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("src/css"))
    .pipe(server.stream());
});

gulp.task("sprite", function () {
  return gulp.src("src/img/*.svg")
    .pipe(svgstore({
      inlineSvg: false
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/img"));
});

gulp.task("webp", function () {
  return gulp.src("src/img/**/*.{png,jpg}")
  .pipe(webp({quality: 70}))
  .pipe(gulp.dest("src/img"));
});

gulp.task("images", function () {
  return gulp.src("src/img/**/*.{png,jpg,svg}")
  .pipe(imagemin([
    imagemin.optipng({optimizationLevel: 3}),
    imagemin.jpegtran({progressive: true}),
    imagemin.svgo()
  ]))
  .pipe(gulp.dest("src/img"));
});

gulp.task("html", function () {
  return gulp.src("src/*.html")
  .pipe(posthtml([
    include()
  ]))
  .pipe(htmlmin({collapseWhitespace: true}))
  .pipe(gulp.dest("build"));
});

gulp.task("compress", function () {
    return gulp.src("src/js/*.js")
    .pipe(uglify())
    .pipe(gulp.dest("build/js"));
});

gulp.task("clean", function () {
  return del("build");
});

gulp.task("copy", function () {
  return gulp.src([
    "src/fonts/**/*.{woff,woff2}",
    "src/img/**",
    "src/js/**"
  ], {
    base: "src"
  })
  .pipe(gulp.dest("build"));
});

gulp.task("build", function (done) {
  run(
    "clean",
    // "images",
    // "webp",
    "copy",
    "style",
    "sprite",
    "html",
    "compress",
    done
  );
});

gulp.task("serve", ["style"], function() {
  server.init({
    server: "src/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("src/sass/**/*.{scss,sass}", ["style"]);
  gulp.watch("src/*.html").on("change", server.reload);
});
