var es6 = require('../');
var test = require('tape');
var es6ModuleLoader = require('es6-module-loader');
var System = es6ModuleLoader.System;
var Loader = es6ModuleLoader.Loader;
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
test('human patch', function (t) {
  t.plan(1);
  var Sys = es6.patch(System, Loader);
  Sys.import('test/cj1').then(function(m) {
    t.equals(m(), 'bat', 'es6 modules still work');
  }, function (err) {
    t.error(err);
  });
});
test('control should still work', function (t) {
  t.plan(1);
  System.import('test/mod1').then(function(m) {
    t.equals(m.default(), 'bar', 'es6 modules still work');
  }).catch(function (err) {
    t.error(err);
  });
});
test('monkey patch', function (t) {
  t.plan(1);
  var Sys = es6.patch(System);
  Sys.import('test/cj1').then(function(m) {
    t.equals(m(), 'bat', 'es6 modules still work');
  }, function (err) {
    t.error(err);
  });
});
test('control should fail', function (t) {
  t.plan(1);
  System.import('test/mod1').then(function(m) {
    t.equals(m.default(), 'bar', 'es6 modules still work');
  }).catch(function (err) {
    t.ok(true, 'error is thrown');
  });
});