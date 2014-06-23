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