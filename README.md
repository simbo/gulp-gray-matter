gulp-gray-matter
================

> A *gulp* plugin for extracting data header from file contents using *gray-matter*.

> *"See the [benchmarks](https://www.npmjs.com/package/gray-matter#benchmarks). gray-matter is 20-30x faster than front-matter."*
> ([@jonschlinkert](https://www.npmjs.com/~jonschlinkert))

[![npm Package Version](https://img.shields.io/npm/v/gulp-gray-matter.svg?style=flat-square)](https://www.npmjs.com/package/gulp-gray-matter)
[![MIT License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://simbo.mit-license.org)
[![Travis Build Status](https://img.shields.io/travis/simbo/gulp-gray-matter/master.svg?style=flat-square)](https://travis-ci.org/simbo/gulp-gray-matter)
[![Codecov Test Coverage](https://img.shields.io/codecov/c/github/simbo/gulp-gray-matter.svg?style=flat-square)](https://codecov.io/github/simbo/gulp-gray-matter)
[![Dependencies Status](https://img.shields.io/david/simbo/gulp-gray-matter.svg?style=flat-square&label=deps)](https://david-dm.org/simbo/gulp-gray-matter)
[![devDependencies Status](https://img.shields.io/david/dev/simbo/gulp-gray-matter.svg?style=flat-square&label=devDeps)](https://david-dm.org/simbo/gulp-gray-matter#info=devDependencies)

---

<!-- MarkdownTOC -->

- [About](#about)
- [Setup and usage](#setup-and-usage)
- [Options](#options)
  - [property](#property)
  - [remove](#remove)
  - [trim](#trim)
  - [setData](#setdata)
- [License](#license)

<!-- /MarkdownTOC -->

---

## About

*gulp-gray-matter* is a plugin for [gulp](http://gulpjs.com/), to extract data 
headers from file contents using [gray-matter](https://www.npmjs.com/package/gray-matter).

The extracted data is set as a property of the file object for further processing.
You can customize the property name and also use nested properties (via
[object-path](https://www.npmjs.com/package/object-path)).

If the file object already has data attached on the defined property, existing
data will be merged recursively with extracted data (using 
[merge](https://www.npmjs.com/package/object-path)). You can define a custom 
function for setting data to change this behavior.

There are further [custom options](#options) and of course you can also use all
[gray-matter options](https://www.npmjs.com/package/gray-matter#options).


## Setup and usage

Install `gulp-gray-matter` using `npm`:

```sh
npm i gulp-gray-matter
```

In your `gulpfile.js`:

```js
var gulp = require('gulp'),
    gulpGrayMatter = require('gulp-gray-matter');

gulp.task('default', function() {
  return gulp.src('./src/**.*')
    .pipe(gulpGrayMatter({ /* options */ }))
    // …
    .pipe(gulp.dest('./dest'));
});
```

A common workflow, after extracting front matter, could be using a template 
rendering plugin like [gulp-jade](https://www.npmjs.com/package/gulp-jade).


## Options

Beside its own options, *gulp-gray-matter* also supports all
[gray-matter options](https://www.npmjs.com/package/gray-matter#options):
`delims`, `eval`, `lang` and `parser`


### property

*String*

Default: `'data'`

The file object property for setting data. can also be a nested property name
like `foo.bar.baz`.


### remove

*Boolean*

Default: `true`

Whether data header should be removed from file contents or not.


### trim

*Boolean*

Default: `true`

Whether file contents should be trimmed after removing file header or not.
(has no effect if `options.remove` is `false`.)


### setData

*Function*

Default: 

```js
function setData(oldData, newData) {
  return require('merge').recursive(oldData, newData);
}
```

If there is already data attached to the file object on the property defined 
with `options.property`, existing data will be recursively merged with extracted
data. Set your own function to change this behavior.


## License

[MIT &copy; 2016 Simon Lepel](http://simbo.mit-license.org/)

Before version 2.2.2, [@jakwings](https://www.npmjs.com/~jakwings) was the 
original author and owner of the npm package *gulp-gray-matter*.
