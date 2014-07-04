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
System.instantiate = es6Translate.instantiate;
System.import('lib1').then(function(m) {
  console.log(m.default());
});
```
from the console

```bash
node index.js # prints baz
```

there is also a patch method that also updates System.import to always return the default value (because that's all that's ever exported) and in node fixes the path resolution.

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

## Usage

Common JS modules may be loaded from ES6 ones and vice versa, all CommonJS modules export a default export so 

```js
import name from '/path/to/common.js'
```

will always work, if the commonjs one does not redefine module exports then named exports will be available as well.

```js
//common.js
export.foo = 'bar';

//es6.js
import {foo} from './common';
//foo === 'bar';
```

Inside CommonJS modules, if there is a key named `default` in a module it is assumed to be the default export and just that is imported, to avoid this behavior think of default exports as single exports and yell at anyone that violates that or pass a truthy second argument to require, ex

```js
//export.js
var val;
exports.default = 9;
exports.get = function () {
	if (typeof val !== 'undefined') {
		return val;
	}
	return this.default;
}
exports.set = function (nval) {
	val = nval;
}

//import.js
var mod = require('./export');
// mod === 9;
var mod = require('./export', true);
// does what you want it to do.
```