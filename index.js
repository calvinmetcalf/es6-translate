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