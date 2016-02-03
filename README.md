gulp-gray-matter
================

> A simple gulp plugin for [gray-matter](https://github.com/assemble/gray-matter).

[![Build Status](https://travis-ci.org/jakwings/gulp-gray-matter.svg)](https://travis-ci.org/jakwings/gulp-gray-matter)
[![NPM version](https://badge.fury.io/js/gulp-gray-matter.svg)](http://badge.fury.io/js/gulp-gray-matter)

**Unmaintained. Use it at your own risk.**

Usage
=====

``` javascript
/**
 * @param {function(this: gray-matter, object): string} handler (optional)
 * @param {object} options options for gray-matter (optional)
 * @param {string} name propery name for adding frontmatter object to file (optional)
 */
var matter = require('gulp-gray-matter');

var noop = function (data) {
    return data.orig;  // Since gray-matter v0.5.0, "original" property is renamed "orig"
};

/**
 * @param this gray-matter
 * @param {object} data object return from `gray-matter(content)`
 * @return {string}
 */
var handler = function (data) {
    var matter = this;  // not gulp plugin
    return data.content;
};

...
    gulp.src('*.md')
        .pipe(matter(handler, {delims: ['@@@', '@@@']}))
        .pipe(gulp.dest('build'));
...

...
    gulp.src('*.md')
        .pipe(matter(handler, null, 'context'))
        .pipe(custom())  // file.contents = Handlerbars.compile(file.contents)(file.context)
        .pipe(gulp.dest('build'));
...
```

License
=======

Copyright &copy; 2014 Jak Wings. Released under the MIT license
