'use strict';

var assert = require('assert'),
    path = require('path');

var gulp = require('gulp'),
    streamAssert = require('stream-assert'),
    through = require('through2');

var ggm = require('..');

function fixtures(glob, options) {
  return gulp.src(path.join(__dirname, 'fixtures', glob || '**/*'), options || {});
}

describe('gulp-gray-matter', function() {

  it('should throw an error on a streamed file', function(done) {
    fixtures('foo.md', {buffer: false})
      .pipe(streamAssert.length(1))
      .pipe(ggm())
      .on('error', function(err) {
        assert.equal(err.message, 'Streaming not supported');
        done();
      });
  });

  it('should pass-through null files', function(done) {
    fixtures('foo.md', {read: false})
      .pipe(ggm())
      .pipe(streamAssert.length(1))
      .pipe(streamAssert.end(done));
  });

  it('should read and remove frontmatter', function(done) {
    fixtures('foo.md')
      .pipe(ggm())
      .pipe(streamAssert.first(function(chunk) {
        assert.equal(chunk.data.title, 'foo');
        assert.equal(String(chunk.contents), 'some content');
      }))
      .pipe(streamAssert.end(done));
  });

  it('should allow to disable remove', function(done) {
    fixtures('foo.md')
      .pipe(ggm({
        remove: false
      }))
      .pipe(streamAssert.first(function(chunk) {
        assert.equal(chunk.data.title, 'foo');
        assert.equal(String(chunk.contents), '---\ntitle: foo\n---\n\nsome content\n');
      }))
      .pipe(streamAssert.end(done));
  });

  it('should allow to set a custom data property', function(done) {
    fixtures('foo.md')
      .pipe(ggm({
        property: 'data.matter'
      }))
      .pipe(streamAssert.first(function(chunk) {
        assert.equal(chunk.data.matter.title, 'foo');
      }))
      .pipe(streamAssert.end(done));
  });

  it('should allow to disable trimming contents when removing frontmatter', function(done) {
    fixtures('foo.md')
      .pipe(ggm({
        trim: false
      }))
      .pipe(streamAssert.first(function(chunk) {
        assert.equal(chunk.data.title, 'foo');
        assert.equal((/\n+some content\n+/).test(String(chunk.contents)), true);
      }))
      .pipe(streamAssert.end(done));
  });

  it('should merge with existing file data', function(done) {
    fixtures('foo.md')
      .pipe(through.obj(function(chunk, enc, done) {
        chunk.data = {foo: 'bar'};
        done(null, chunk);
      }))
      .pipe(ggm())
      .pipe(streamAssert.first(function(chunk) {
        assert.deepEqual(chunk.data, {
          foo: 'bar',
          title: 'foo'
        });
      }))
      .pipe(streamAssert.end(done));
  });

  it('should allow to overwrite function for setting data', function(done) {
    fixtures('foo.md')
      .pipe(through.obj(function(chunk, enc, done) {
        chunk.data = {foo: 'bar'};
        done(null, chunk);
      }))
      .pipe(ggm({
        setData: function(oldData, newData) { return newData; }
      }))
      .pipe(streamAssert.first(function(chunk) {
        assert.deepEqual(chunk.data, {title: 'foo'});
      }))
      .pipe(streamAssert.end(done));
  });

  it('should allow custom gray-matter options', function(done) {
    fixtures('bar.md')
      .pipe(ggm({
        delims: '~~~',
        eval: true,
        lang: 'json'
      }))
      .pipe(streamAssert.first(function(chunk) {
        assert.deepEqual(chunk.data, {title: 'bar', foo: 'baz'});
        assert.equal(String(chunk.contents), 'some content');
      }))
      .pipe(streamAssert.end(done));
  });

  it('should catch errors', function(done) {
    fixtures('foo.md')
      .pipe(ggm({
        parser: true
      }))
      .on('error', function(err) {
        assert.equal((/^gray-matter\ cannot\ find\ a\ parser\ for:/).test(err.message), true);
        done();
      });
  });

});
