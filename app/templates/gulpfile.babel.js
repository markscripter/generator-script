/*
  Imports
*************************/
import babel from 'gulp-babel';
import browserSync from 'browser-sync';
import combiner from 'stream-combiner2';
import concat from 'gulp-concat';
import cssMinify from 'gulp-minify-css';
import eslint from 'gulp-eslint';
import glob from 'glob';
import gulp from 'gulp';
import jade from 'gulp-jade';
import jsdoc from 'gulp-jsdoc';
import less from 'gulp-less';
import path from 'path';
import prefix from 'gulp-autoprefixer';
import R from 'ramda';
import rename from 'gulp-rename';
import sourcemaps from 'gulp-sourcemaps';
import svgstore from 'gulp-svgstore';
import svgmin from 'gulp-svgmin';
import uglify from 'gulp-uglify';
import vash  from './helpers/gulp-vash';
import webpack from 'webpack';
import wrapper from 'gulp-wrapper';

/*
  Import our config object
  so we can use our paths.
*************************/
const PATHS = require('./config.json').paths;

function pageData(root, comps) {
  const data = require(root);
  const compData = glob.sync(comps, {});
  const tempData = {};

  compData.forEach(function cb(page) {
    R.merge(tempData, require(page));
  });

  // since require will cache the origin items returned from the require(root) call,
  // we need to delete the cache so it fetches any updated data from the json file
  delete require.cache[require.resolve(root)];

  return R.merge(tempData, data);
}

/*
  Build commands
*************************/

// build task
gulp.task('build', ['styles', 'styleguide', 'javascript', 'assets', 'fonts', 'svg', 'templates']);

<% if (useVash) { %>
gulp.task('templates', ['vash']);
<% } if (useJade) { %>
gulp.task('templates', ['jade']);
<% } %>

// serve task
gulp.task('serve', ['build', 'watch', 'server']);

// javascript task
gulp.task('javascript', ['js-global', 'js-libraries', 'js-maps']);

// jade task to build out jade template to static HTML files.
gulp.task('jade', () => {
  // get glob of pages
  glob(path.join(__dirname, PATHS.pages), {}, (err, pages) => {
    if (err) {
      return;
    }
    // for each page
    pages.forEach((page) => {
      const data = pageData(path.join(__dirname, PATHS.data), path.join(__dirname, PATHS.compData));
      gulp.src(page)
        .pipe(jade({
          locals: data,
          pretty: true,
        }))
        .pipe(gulp.dest(path.join(__dirname, PATHS.public)));
    });
  });

  return;
});

// vash task to build out jade template to static HTML files.
gulp.task('vash', () => {
  // get glob of pages
  glob(path.join(__dirname, PATHS.pages), {}, (err, pages) => {
    if (err) {
      return;
    }
    // for each page
    pages.forEach((page) => {
      const data = require(path.join(__dirname, PATHS.data));
      gulp.src(page, {cwd: path.join(__dirname, 'source/pages')})
        .pipe(vash({
          locals: data
        }))
        .pipe(gulp.dest(path.join(__dirname, PATHS.public)));
    });
  });

  return;
});

// styles task to build out our LESS files into a stylesheet.
gulp.task('styles', () => {
  const globalCSS = PATHS.cssLibraries.map((filePath) => {
    return path.join(__dirname, filePath);
  });

  const cssArray = [
    ...globalCSS,
    path.join(__dirname, PATHS.components, '**/less/*.less'),
    path.join(__dirname, PATHS.styles, 'main.less'),
  ];
  return gulp.src(cssArray)
    .pipe(concat('stylesheet.less'))
    .pipe(less({
      paths: [path.join(__dirname, PATHS.styles)],
    }))
    .pipe(concat('stylesheet.css'))
    .pipe(prefix({
      browsers: ['last 4 versions'],
      cascade: 'false',
    }))
    .pipe(gulp.dest(path.join(__dirname, PATHS.public, 'css/')))
    .pipe(cssMinify())
    .pipe(rename('stylesheet.min.css'))
    .pipe(gulp.dest(path.join(__dirname, PATHS.public, 'css/')));
});

// styleguide builds out the items for the styleguide.
gulp.task('styleguide', () => {
  // build pages
  gulp.src(path.join(__dirname, PATHS.styleguide.pages))
    <% if (useJade) {%>
    .pipe(jade({
      pretty: true,
    }))
    <% } %>
    <% if (useVash) {%>
    .pipe(vash({
      locals : {}
    }))
    <% } %>
    .pipe(gulp.dest(path.join(__dirname, PATHS.public)));

  // build styles
  return gulp.src(path.join(__dirname, PATHS.styleguide.styles))
    .pipe(sourcemaps.init())
    .pipe(less())
    .pipe(sourcemaps.write())
    .pipe(rename('styleguide.css'))
    .pipe(gulp.dest(path.join(__dirname, PATHS.public, 'css')));
});

// js-global task to combine our JS files
gulp.task('js-global', () => {
  const combined = combiner.obj([
    gulp.src([
      path.join(__dirname, PATHS.javascript, '*.js'),
      path.join(__dirname, PATHS.components, '**/javascript/*.js'),
    ]),
    eslint(),
    babel(),
    wrapper({
      header: '\n/* \n ${filename} \n */ \n',
      footer: '\n/* \n END ${filename} \n */ \n',
    }),
    sourcemaps.init(),
    concat('main.js'),
    gulp.dest(path.join(__dirname, PATHS.public, 'js/')),
    uglify({
      mangle: false,
      compress: true,
    }),
    rename('main.min.js'),
    gulp.dest(path.join(__dirname, PATHS.public, 'js/')),
  ]);

  return combined;
});

// js-libraires task to combine our JS libs
gulp.task('js-libraries', () => {
  const libs = PATHS.jsLibraries.map((filePath) => {
    return path.join(__dirname, filePath);
  });

  const combined = combiner.obj([
    gulp.src(libs),
    eslint(),
    wrapper({
      header: '\n/* \n ${filename} \n */ \n',
      footer: '\n/* \n END ${filename} \n */ \n',
    }),
    sourcemaps.init(),
    concat('libs.min.js'),
    gulp.dest(path.join(__dirname, PATHS.public, 'js/')),
  ]);

  return combined;
});

// js-jsdoc task
gulp.task('js-jsdoc', () => {
  return gulp.src(path.join(__dirname, PATHS.components, '**/javascript/*.js'))
    .pipe(jsdoc(path.join(__dirname, PATHS.public, 'jsdocs/')));
});

// js-maps task
gulp.task('js-maps', () => {
  const maps = PATHS.jsMaps.map((filePath) => {
    return path.join(__dirname, filePath);
  });

  return gulp.src(maps)
    .pipe(gulp.dest(path.join(__dirname, PATHS.public, 'js')));
});

// server task
gulp.task('server', () => {
  browserSync({
    server: {
      baseDir: 'public',
    },
  });
});

// svg task
gulp.task('svg', () => {
  return gulp.src(path.join(__dirname, PATHS.svg, '**.svg'))
    .pipe(svgmin())
    .pipe(svgstore())
    .pipe(gulp.dest(path.join(__dirname, PATHS.public, 'svg/')))
    .pipe(rename('svg.min.jade'))
    .pipe(gulp.dest(path.join(__dirname, PATHS.svg)));
});

// assets task
gulp.task('assets', () => {
  return gulp.src(path.join(__dirname, PATHS.assets))
    .pipe(gulp.dest(path.join(__dirname, PATHS.public, 'assets')));
});

// font task
gulp.task('fonts', () => {
  const combined = combiner.obj([
    gulp.src([
      path.join(__dirname, PATHS.fonts),
      path.join(__dirname, PATHS.fontAwesome, 'fonts/*.*'),
    ]),
    gulp.dest(path.join(__dirname, PATHS.public, 'css/fonts/')),
  ]);

  return combined;
});

// watch
gulp.task('watch', () => {
  gulp.watch([
    path.join(__dirname, PATHS.assets),
  ], ['assets']).on('change', browserSync.reload);
  gulp.watch([
    path.join(__dirname, PATHS.styles, '**.less'),
    path.join(__dirname, PATHS.styles, '**/**.less'),
    path.join(__dirname, PATHS.components, '**/less/**.less'),
  ], ['styles', 'styleguide']).on('change', browserSync.reload);
  gulp.watch([
    path.join(__dirname, PATHS.pages),
    path.join(__dirname, '/pages/**/*.jade'),
    path.join(__dirname, PATHS.components, '/**/markup/**.jade'),
    path.join(__dirname, PATHS.partials),
    path.join(__dirname, PATHS.compData),
    path.join(__dirname, PATHS.data),
  ], ['jade']).on('change', browserSync.reload);
  gulp.watch([
    path.join(__dirname, PATHS.styleguide.styles),
    path.join(__dirname, PATHS.styleguide.pages),
  ], ['styleguide']).on('change', browserSync.reload);
  gulp.watch([
    path.join(__dirname, PATHS.javascript, '*.js'),
    path.join(__dirname, PATHS.components, '**/javascript/*.js'),
  ], ['javascript']).on('change', browserSync.reload);
  gulp.watch([
    path.join(__dirname, PATHS.svg, '*.svg'),
  ], ['svg', 'jade']).on('change', browserSync.reload);
});
