var gulp = require("gulp");
var sass = require("gulp-sass");
var sourcemaps = require("gulp-sourcemaps");
var autoprefixer = require("gulp-autoprefixer");
var browser = require("browser-sync");
var plumber = require("gulp-plumber");
var del = require("del");
var ejs = require("gulp-ejs");
var rename = require("gulp-rename");
var minifyejs = require('gulp-minify-ejs');

var path = {
  src: "./src/",
  dist: "./src/"
};

gulp.task("dist", ["clean:all"], function() {
  return gulp
    .src(
      [
        "./src/assets/css/**",
        "./src/assets/js/**",
        "!./src/assets/css/*.map",
        "./src/assets/images/**",
        "./src/assets/fonts/**",
        "./src/*.html",
        "./src/*/*.html",
        "./src/*/*/*.html",
        "./src/.htaccess",
        "!./src/assets/sass/**"
      ],
      { base: "./src/" }
    )
    .pipe(gulp.dest("./dist/"));
});

// EJS
var ejs_src = [
  path.src + "ejs/*.ejs",
  path.src + "ejs/**/*.ejs",
  "!" + path.src + "ejs/**/_*.ejs"
];
var ejs_src_watch = [path.src + "ejs/*.ejs", path.src + "ejs/**/*.ejs"];
var ejs_dist = path.dist + "";
gulp.task("ejs", function() {
  gulp
    .src(ejs_src)
    .pipe(plumber())
    .pipe(ejs())
    .pipe(rename({extname: '.html'}))
    .pipe(minifyejs())
    .pipe(gulp.dest(ejs_dist))
    .pipe(browser.reload({ stream: true }));
});

gulp.task("clean:all", () => {
  return del.sync(["./dist"]);
});

gulp.task("server", function() {
  browser({
    server: {
      baseDir: "./src/"
    }
  });
});

gulp.task("sass", function() {
  gulp
    .src("./src/assets/sass/*.scss")
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "compressed" }))
    .pipe(
      autoprefixer({
        browsers: ["last 3 versions"],
        cascade: false
      })
    )
    .pipe(sourcemaps.write("./"))
    .pipe(gulp.dest("./src/assets/css/"))
    .pipe(browser.reload({ stream: true }));
});

gulp.task("bs-reload", function() {
  browser.reload();
});

gulp.task("default", ["server"], function() {
  gulp.watch(
    ["./src/assets/sass/*.scss", "./src/assets/sass/**/*.scss"],
    ["sass"]
  );
  gulp.watch(
    ["./src/assets/js/*.js", "!./src/assets/js/min/**/*.js"],
    ["bs-reload"]
  );
  gulp.watch([path.src + "ejs/*.ejs", path.src + "ejs/**/*.ejs"], ["ejs"]);
  gulp.watch(["./src/*.html", "./src/*/*.html"], ["bs-reload"]);
});
