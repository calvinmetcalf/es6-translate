var es6 = require('../');
var test = require('tape');
var System = require('es6-module-loader').System;

test('control', function (t) {
  t.plan(1);
  System.import('test/mod1').then(function(m) {
    t.equals(m.default(), 'bar', 'es6 modules should work');
  }, function (err) {
    t.error(err);
  });
});
test('actual translation', function (t) {
  var _translate = System.translate;
  t.test('test', function (t) {
    t.plan(1);
    System.translate = es6.translate;
    System.import('test/cj1').then(function(m) {
      t.equals(m.default(), 'bat', 'my translations should work');
    }, function (err) {
      t.error(err);
    });
  });
  t.test('cleanup', function (t) {
    System.translate = _translate;
    t.end();
  });
});

test('works with null', function (t) {
  var _translate = System.translate;
  t.test('test', function (t) {
    t.plan(1);
    System.translate = es6.translate;
    System.import('test/null1').then(function(m) {
      t.equals(m.default.nullThing, null, 'null default exports should work');
    }, function (err) {
      t.error(err);
    });
  });
  t.test('cleanup', function (t) {
    System.translate = _translate;
    t.end();
  });
});
test('control should still work', function (t) {
  t.plan(1);
  System.import('test/mod1').then(function(m) {
    t.equals(m.default(), 'bar', 'es6 modules still work');
  }, function (err) {
    t.error(err);
  });
});