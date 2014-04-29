var detective = require('detective');
var template = require('./template.hbs');

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