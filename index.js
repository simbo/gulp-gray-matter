'use strict';

var grayMatter = require('gray-matter'),
    gUtil = require('gulp-util'),
    merge = require('merge'),
    objectPath = require('object-path'),
    through = require('through2');

module.exports = gulpGrayMatter;

/**
 * gray-matter gulp plugin
 * @param  {object} options custom options
 * @return {object}         gulp stream handler
 */
function gulpGrayMatter(options) {

  options = setOptions(options);

  return through.obj(transformChunk);

  /**
   * transform a file
   * @param  {object}    chunk file object
   * @param  {string}    enc   file encoding
   * @param  {Function}  done  callback
   * @return {undefined}
   */
  function transformChunk(chunk, enc, done) {
    if (chunk.isNull()) return done(null, chunk);
    if (chunk.isStream()) return this.emit('error', new gUtil.PluginError('gulp-gray-matter', 'Streaming not supported'));
    try {
      extractMatter(chunk);
    } catch (err) {
      return this.emit('error', err);
    }
    done(null, chunk);
  }

  /**
   * extract matter data from file and optionally remove matter header
   * @param  {object} chunk file object
   * @return {undefined}
   */
  function extractMatter(chunk) {
    var matter = grayMatter(String(chunk.contents), options.grayMatter),
        data = objectPath.get(chunk, options.property);
    data = options.setData(typeof data === 'object' ? data : {}, matter.data);
    objectPath.set(chunk, options.property, data);
    if (options.remove) {
      chunk.contents = new Buffer(
        options.trim ? String(matter.content).trim() : matter.content
      );
    }
  }

  /**
   * sets new data values
   * @param  {object}    oldData old data
   * @param  {object}    newData new data
   * @return {undefined}
   */
  function setData(oldData, newData) {
    return merge.recursive(oldData, newData);
  }

  /**
   * validate/set custom options
   * @param  {object} opts    custom options
   * @return {object} options object
   */
  function setOptions(opts) {
    opts = typeof opts === 'object' ? opts : {};
    return {
      property: typeof opts.property === 'string' ? opts.property : 'data',
      remove: typeof opts.remove === 'boolean' ? opts.remove : true,
      trim: typeof opts.trim === 'boolean' ? opts.trim : true,
      setData: typeof opts.setData === 'function' ? opts.setData : setData,
      grayMatter: {
        delims: opts.delims || '---',
        eval: typeof opts.eval === 'boolean' ? opts.eval : true,
        lang: opts.lang || 'yaml',
        parser: opts.parser || undefined
      }
    };
  }

}
