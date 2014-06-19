es6-translate [![Build Status](https://travis-ci.org/calvinmetcalf/es6-translate.svg)](https://travis-ci.org/calvinmetcalf/es6-translate)
===

Load commonjs modules in an es6 enviroment, it **always** returns a default export.

## Overly convoluted example

lib1.js

```js
'use strict';
var foo = require('./lib2');

module.exports = function () {
  return foo.bar;
};
```

lib2.js

```js
exports.bar = 'baz';
```

index.js

```js
var es6Translate = require('es6-translate');
var System = require('es6-module-loader').System;
System.translate = es6Translate.translate;
System.import('lib1').then(function(m) {
  console.log(m.default());
});
```
from the console

```bash
node index.js # prints baz
```

there is also a patch method that also updates System.import to always return the default value (because that's all that's ever exported).

```js
var es6Translate = require('es6-translate');
var System = require('es6-module-loader').System;
es6Translate.patch(System);
System.import('lib1').then(function(m) {
  console.log(m());
});
```

or if you don't want to mess with global System object pass in Loader too

```js
var es6Translate = require('es6-translate');
var es6ModuleLoader = require('es6-module-loader');
var Sys = es6Translate.patch(es6ModuleLoader.System, es6ModuleLoader.Loader);
Sys.import('lib1').then(function(m) {
  console.log(m());
});
```

To populate a loader with all of the node.js built in modules use

```js
var es6Translate = require('es6-translate');
var es6ModuleLoader = require('es6-module-loader');
es6Translate.populate(es6ModuleLoader.System);
```