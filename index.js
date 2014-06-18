var detective = require('detective');
var fs = require('fs');
var rawTemplate = fs.readFileSync('./template.hbs').toString();
var Handlebars = require('handlebars');
var template = Handlebars.compile(rawTemplate);
var path = require('path');
var resolve = require('resolve');
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
  Sys.locate = exports.locate;
  Sys.normalize = function normalize(name, parentName, parentAddress) {
    this.lastPath = path.dirname(parentAddress);
    return name;
  };
  return Sys;
};

exports.locate = function (path) {
  if (process.browser) {
    return this.baseURL + '/' + path.name + '.js';
  }
  return resolve.sync(path.name, {
    basedir: this.lastPath
  });
};