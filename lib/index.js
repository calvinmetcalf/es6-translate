var detective = require('detective');
var fs = require('fs');
var rawTemplate = fs.readFileSync('./template.hbs').toString();
var Handlebars = require('handlebars');
var template = Handlebars.compile(rawTemplate);
var path = require('path');
var Promise = require('lie');
var _resolve = require('resolve');
global._require = require;
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
exports.translate = function (load) {
  var things = {};
  things.__filename = load.address;
  things.__dirname = path.dirname(load.address);
  things.code = load.source;
  var requires = detective(things.code);
  things.require = requires.filter(function (item) {
    return !_resolve.isCore(item);
  }).map(function (item) {
    return {
      path: item,
      name: item.replace(/\W/g, function (a, b) {
        return '$' + a.charCodeAt();
      })
    };
  });
  things.core = requires.filter(function (item) {
    return _resolve.isCore(item);
  }).map(function (item) {
    return {
      name: item
    };
  });
  return template(things);
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
  Sys.translate = exports.translate;
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

exports.locate = function (path) {
  return path.name;
};