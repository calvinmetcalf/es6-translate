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
  var Sys = es6.patch(System, Loader);
  t.plan(1);
  Sys.import('./cj1').then(function(m) {
    t.equals(m(), 'bat', 'my translations should work');
  }).catch(function (err) {
    t.error(err);
  });
});
test('circular', function (t) {
  var Sys = es6.patch(System, Loader);
  t.plan(1);
  Sys.import('./a').then(function(m) {
    t.equals(m.obj.val, 'asdf', 'it works');
  }).catch(function (err) {
    t.error(err);
  });
});
test('works with null', function (t) {
  var Sys = es6.patch(System, Loader);
  t.plan(1);
  Sys.import('./null1').then(function(m) {
    t.equals(m.nullThing, null, 'null default exports should work');
  }, function (err) {
    t.error(err);
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
  Sys.import('./cj1').then(function(m) {
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

test('json patch', function (t) {
  t.plan(1);
  var Sys = es6.patch(System, Loader);
  Sys.import('./json').then(function(m) {
    t.equals(m, 'isJSON', 'get json from es6 modules');
  }, function (err) {
    t.error(err);
  });
});
test('built ins should work in es6', function (t) {
  t.plan(1);
  var Sys = es6.patch(System, Loader);
  Sys.import('./bi-6').then(function(m) {
    t.equals(m.foo, 'module.exports = null;', 'es6 modules still work');
  }).catch(function (err) {
    t.error(err);
  });
});


test('built ins should work', function (t) {
  t.plan(1);
  var Sys = es6.patch(System, Loader);
  Sys.import('./bi').then(function(m) {
    t.equals(m.foo, 'module.exports = null;', 'built ins work');
  }).catch(function (err) {
    t.error(err);
  });
});
test('buffer', function (t) {
  t.plan(1);
  System.import('test/buffer').then(function (buff) {
    t.ok(Buffer.isBuffer(buff.default()), 'should be a buffer');
  }).catch(function (err) {
    t.error(err);
  });
});
test('mix', function (t) {
  t.plan(1);
  var Sys = es6.patch(System, Loader);
  Sys.import('./mix1').then(function (mix) {
    t.equals(mix.foo(), 9, 'mixing cjs and es6 should work');
  }).catch(function (err) {
    t.error(err);
  });
});
test('monkey patch', function (t) {
  t.plan(1);
  var Sys = es6.patch(System);
  Sys.import('./cj1').then(function(m) {
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