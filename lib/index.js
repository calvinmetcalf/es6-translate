var detective = require('detective');
var path = require('path');
var Promise = require('lie');
var _resolve = require('resolve');
var isModule = require('ismodule');
var sidetable = require('./sidetable');
var evaluate = require('./evaluate');
function resolve(path, opts) {
  opts = opts || {};
  return new Promise(function (fulfill, reject) {
    _resolve(path, opts, function (err, resp) {
      if (err) {
        reject(err);
      } else {
        fulfill(resp);
      }
    });
  });
}
exports.instantiate = function (load) {
  var loader = this;
  if (path.extname(load.name) === '.json') {
    return {
      deps: [],
      execute: function () {
        return loader.newModule(JSON.parse(load.source));
      }
    }
  }
  if (isModule(load.source)) {
    return;
  }
    // statically extract the dependencies
  var deps = detective(load.source);
    // normalize the dependencies
  return Promise.all(deps.map(function(dep) {
    return loader.normalize(dep, load.name, load.address);
  })).then(function(normalized) {
    // create the normalization map
    var depMap = {};
    normalized.forEach(function(normalized, index) {
      depMap[deps[index]] = normalized;
    });
    
    // add this module to the side table
    // exports starts as an empty object
    var record = {
      evaluated: false,
      exports: {},
      source: load.source,
      depMap: depMap,
      address: load.address,
      dirname: path.dirname(load.address)
    };
    sidetable.set(load.name, record);
 
    // instantiate return
    return {
      deps: normalized,
      execute: function() {
        // evaluate the module if not already
        if (!record.evaluated) {
          evaluate(load.name, loader);
        }
 
        // clear from the side table to save memory
        sidetable.delete(load.name);
        if (record.defaultUsed) {
          return loader.newModule({ default: record.exports });
        } else {
          record.exports.default = record.exports;
          return loader.newModule(record.exports);
        }
      }
    };
  });
};

exports.patch = function (System, Loader) {
  var Sys = System;
  if (Loader) {
    Sys = new Loader(System);
    Sys.baseURL = System.baseURL;
    Sys.paths = System.paths;
  }
  var _import = Sys.import;
  Sys.import = function () {
    return _import.apply(this, arguments).then(function (m) {
      if ('default' in m) {
        return m.default;
      } else {
        return m;
      }
    });
  };
  Sys.instantiate = exports.instantiate;
  if (!process.browser) {
    Sys.normalize = exports.normalize;
    Sys.locate = exports.locate;
  }
  return Sys;
};

exports.normalize = function (name, parentName, parentAddress) {
  if (process.browser) {
    return name;
  }
  if (_resolve.isCore(name)) {
    this.set(name, makeMod(this, require(name)));
    return name;
  }
  if (parentAddress) {
    return resolve(name, {
        basedir: path.dirname(parentAddress)
      });
  }
  if (module.parent && module.parent.filename) {
    return resolve(name, {
        basedir: path.dirname(module.parent.filename)
      });
  }
  return resolve(name, {
    basedir: process.cwd()
  });
};

exports.locate = function (path, metadata) {
  return path.name;
};
function makeMod(loader, input) {
  var out = {
    'default': input
  };
  Object.keys(input).forEach(function (key) {
    out[key] = input[key];
  });
  // new Module might not be the final syntax
  return loader.newModule(out);
}