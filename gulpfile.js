// gulpfile.js
const gulp = require('gulp'),
      htmlmin = require('gulp-htmlmin'),
      cleanCss = require('gulp-clean-css'),
      uglify = require('gulp-uglify'),
      babel = require('gulp-babel'),
      del = require('del'),
      connect = require('gulp-connect'),
      autoprefixer = require('gulp-autoprefixer'),
      sass = require('gulp-sass'),
      { createProxyMiddleware } = require('http-proxy-middleware')


// 集中管理所有路径
const paths = {
  html: {
    src: 'src/**/*.html',
    dest: 'dist'
  },
  css: {
    src: 'src/css/**/*.scss',
    dest: 'dist/css'
  },
  js: {
    src: 'src/js/**',
    dest: 'dist/js'
  },
  img: {
    src: 'src/images/**',
    dest: 'dist/images'
  },
  libs: {
    src: 'src/libs/**',
    dest: 'dist/libs'
  }
}

// 制定一个删除dist目录的任务
const delDist = () => del('dist')

// 指定一个html任务：压缩html代码
const html = () => {
  // 路径写法里 **代表所有目录，*代表所有文件
  return gulp.src(paths.html.src)
    .pipe(htmlmin({
      removeComments: true, // 清除HTML注释
      collapseWhitespace: true, // 压缩HTML
      collapseBooleanAttributes: true, // 省略布尔属性的值 <input checked="true"/> ==> <input checked />
      removeEmptyAttributes: true, // 删除所有空格作属性值 <input id="" /> ==> <input />
      removeScriptTypeAttributes: false, // 删除<script>的type="text/javascript"
      removeStyleLinkTypeAttributes: true, // 删除<style>和<link>的type="text/css"
      minifyJS: true, // 压缩页面JS
      minifyCSS: true // 压缩页面CSS 
    }))
    .pipe(gulp.dest(paths.html.dest))
    .pipe(connect.reload())
}

// 制定css任务：先把sass转成css，再加上兼容性前缀，最后压缩css代码
const css = () => {
  return gulp.src(paths.css.src)
    .pipe(sass())
    .pipe(autoprefixer({
      presets: ['@babel/env']
    }))
    // .pipe(cleanCss())
    .pipe(gulp.dest(paths.css.dest))
    .pipe(connect.reload())
}

// 制定js任务：先使用babelES6转成ES5，再压缩混淆js代码
const js = () => {
  return gulp.src(paths.js.src)
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest(paths.js.dest))
    .pipe(connect.reload())
}

// img任务：把src里的图片全部移动到dist即可
const img = () => gulp.src(paths.img.src).pipe(gulp.dest(paths.img.dest))

// libs任务：把libs里的文件全部移动到dist即可
const libs = () => gulp.src(paths.libs.src).pipe(gulp.dest(paths.libs.dest))

// 制定watch任务：监听代码改变自动重启对应任务
const watch = () => {
  // 监听html文件，当文件改变就自动重启html任务
  gulp.watch(paths.html.src, html)
  gulp.watch(paths.css.src, css)
  gulp.watch(paths.js.src, js)
}

// 制定server任务：开启本地服务器
const server = () => {
  connect.server({
    root: 'dist',
    port: 2005,
    livereload: true,
    middleware () {
      // 代理跨域：把以/api开头的请求代理到拼多多的接口
      return [
        createProxyMiddleware('/api', {
          target: 'https://sqmallservice.u.sdo.com/',
          changeOrigin: true
        }),
        createProxyMiddleware('/api',{
          target: 'https://sqmallservice.u.sdo.com',
          changeOrigin: true
        })
      ]
    }
  })
}

// 在最后把指定的任务导出
// default指默认任务
// sereis 是同步执行代码：要先删除了dist才能启动其他任务
// parallel 是异步执行任务，这些任务可以同时开启
module.exports.default = gulp.series(delDist, gulp.parallel(html, css, js, img, libs, watch, server))
