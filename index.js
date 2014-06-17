var detective = require('detective');
var fs = require('fs');
var rawTemplate = fs.readFileSync('./template.hbs').toString();
var Handlebars = require('handlebars');
var template = Handlebars.compile(rawTemplate);
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

exports.patch = function (System) {
  var _import = System.import;
  System.import = function () {
    return _import.apply(this, arguments).then(function (m) {
      if ('default' in m) {
        return m.default;
      } else {
        return m;
      }
    });
  };
  System.translate = exports.translate;
};