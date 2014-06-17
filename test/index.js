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
  t.plan(1);
  System.translate = es6.translate;
  System.import('test/cj1').then(function(m) {
    t.equals(m.default(), 'bat', 'my translations should work');
  }, function (err) {
    t.error(err);
  });
});