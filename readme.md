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