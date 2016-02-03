'use strict';

var es = require('event-stream');
var matter = require('gray-matter');

var genError = function (message) {
  return new Error('gulp-gray-matter: ' + message);
};

var extract = function (file, callback) {
  if (file.isBuffer()) {
    if (this.handler || this.name) {
      var data = matter(String(file.contents), this.options);
      if (this.handler) {
        file.contents = new Buffer(this.handler.call(matter, data) || '');
      }
      if (this.name) {
        file[this.name] = data.data;  // may have been modified by handler
      }
    }
    return callback(null, file);
  }
  if (file.isStream()) {
    // TODO?
    return callback(genError('Cannot get the front-matter in a stream. (unsupported)'), file);
  }
  callback(null, file);
};

/**
 * @param {function(this: gray-matter, object): string} handler (optional)
 * @param {object} options options for gray-matter (optional)
 * @param {string} name propery name for adding frontmatter object to file (optional)
 */
module.exports = function (handler, options, name) {
  if (handler !== null && !(handler instanceof Function)) {
    name = options;
    options = handler;
    handler = null;
  }
  if (options !== null && typeof options !== 'object') {
    name = options;
    options = null;
  }
  return es.map(extract.bind({
    name: name,
    options: options,
    handler: handler
  }));
};
