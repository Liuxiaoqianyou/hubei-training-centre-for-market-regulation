const gulp = require('gulp');
const clean = require('gulp-clean');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const minifycss = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const connect = require('gulp-connect');
const open = require('open');
const config = require('./config');

//清理目标目录
gulp.task('clean', function() {
    return gulp.src(config.path.dist)
      .pipe(clean({ force: true }))
      .pipe(connect.reload())
  })

//拷贝字体
gulp.task('fonts:copy', function() {
    return gulp.src([
        config.path.src + '/fonts/**/*',
        config.path.node_modules + '/bootstrap/fonts/**/*'
      ])
      .pipe(gulp.dest(config.path.dist + '/fonts'))
      .pipe(connect.reload())
  });
// 拷贝图片
// gulp.task('img:copy', function(cb){
//     return gulp.src(config.path.src + '/img/**/*')
//     .pipe(gulp.dest(config.path.dist + '/img'))
// });


//压缩和拷贝图片
gulp.task('img:minify', function(cb) {
    return gulp.src(config.path.src + '/img/**/*')
      .pipe(imagemin({
        progressive: true,                        //无损压缩jpj图片
        svgoPlugins: [{ removeViewBox: false }],  //不要移除svg的viewbox属性
        use: [pngquant()],
        // use:[require('imagemin-pngquant')()]                         //使用pngquant深度压缩png图片的imagemin插件
      }))
      .pipe(gulp.dest(config.path.dist +'/img'))
      .pipe(connect.reload())
  });


  // 合并压缩css文件
// gulp.task('css:minify', function(){
//     // 源文件
//     return gulp.src('src/css/*.css')
//     // 合并css
//     .pipe(concat('build.css'))
//     // 重命名
//     .pipe(rename({suffix:'.min'}))
//     // 压缩css
//     .pipe(minifycss({compatibility:'ie8'}))
//     // 输出
//     .pipe(gulp.dest('dist/css/'))
//     .pipe(connect.reload())
// });
  
//   合并css
  gulp.task('css:concat', function() {
    //let timestamp = +new Date();
    return gulp.src([
        config.path.node_modules + '/bootstrap/dist/css/bootstrap.css',
        config.path.src + '/css/*.css',
      ])
      .pipe(concat('build.css'))
      .pipe(gulp.dest(config.path.dist + '/css'))
      .pipe(connect.reload())
  });

//   压缩css
  gulp.task('css:minify', ['css:concat'], function() {
    return gulp.src(config.path.dist + '/css/**/*.css')
      .pipe(postcss([
        // 生成css前缀
        autoprefixer({
          // 兼容主流浏览器的最新两个版本 
          overrideBrowserslist: ['> 1%', 'last 2 versions'],
          // 是否美化属性值
          cascade: true
        })
      ]))
      .pipe(minifycss({
        // 保留所有特殊前缀
        keepSpecialComments: '*',
        // 兼容
        compatibility: 'ie8',
        // 移除注释
        removeComment: true
      }))
      .pipe(gulp.dest(config.path.dist + '/css'))
      .pipe(connect.reload())
  });



// 合并压缩js文件
gulp.task('js:minify', function(){
    // 目标源文件
    return gulp.src('src/js/*.js') 
    // 合并文件
    .pipe(concat('build.js'))
    // 临时输出到本地
    .pipe(gulp.dest('dist/js/'))
    // 压缩文件
    .pipe(uglify())
    // 重命名
    .pipe(rename({suffix:'.min'}))
    // 输出
    .pipe(gulp.dest(config.path.dist + '/js'))
    .pipe(connect.reload())
});

// 压缩html
gulp.task('html:minify',function(){
    return gulp.src('src/*.html')
    .pipe(htmlmin({collapseWhitespace:true}))
    .pipe(gulp.dest(config.path.dist +  '/'))
    .pipe(connect.reload())
})

// 监听任务
gulp.task('watch', function() {
    gulp.watch(config.path.src + '/fonts/**/*', ['fonts:copy']);
    gulp.watch(config.path.src + '/img/**/*', ['img:minify']);
    gulp.watch(config.path.src + '/css/**/*', ['css:minify']);
    gulp.watch(config.path.src + '/*.html', ['html:minify']);
    gulp.watch(config.path.src + '/js/**/*', ['js:minify']);
  });

gulp.task('server',function(){
    connect.server({
        root:'dist/',
        livereload:true,
        port:5000
    })

    open('http://localhost:5000/');

    gulp.start(['fonts:copy', 'css:minify', 'js:minify','html:minify','img:minify' ,'watch']);
});


// 注册默认任务
// gulp.task('default',['js','css']);
// gulp.task('default',['js','css']);

// 'img:minify', 
gulp.task('build', ['clean'], function() {
    gulp.start(['fonts:copy', 'css:minify', 'js:minify','html:minify','img:minify' ,'watch','server' ]);
  });