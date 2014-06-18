var detective = require('detective');
var fs = require('fs');
var rawTemplate = fs.readFileSync('./template.hbs').toString();
var Handlebars = require('handlebars');
var template = Handlebars.compile(rawTemplate);
var path = require('path');
var resolve = require('resolve');
var Promise = require('lie');
exports.translate = function (load) {
  var things = {};
  things.code = load.source;
  things.require = detective(things.code).map(function (item) {
    return {
      path: item,
      name: item.replace(/\W/g, function (a, b) {
        return '$' + a.charCodeAt();
      })
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
  Sys.normalize = exports.normalize;
  Sys.locate = exports.locate;
  return Sys;
};

exports.normalize = function (name, parentName, parentAddress) {
  if (process.browser) {
    return name;
  }
  if (parentAddress) {
    return new Promise(function (fulfill, reject) {
      resolve(name, {
        basedir: path.dirname(parentAddress)
      }, function (err, resp) {
        if (err) {
          reject(err);
        } else {
          fulfill(resp);
        }
      });
    });
  }
  return new Promise(function (fulfill, reject) {
      resolve(name, function (err, resp) {
        if (err) {
          reject(err);
        } else {
          fulfill(resp);
        }
      });
    });
};

exports.locate = function (path) {
  return path.name;
}