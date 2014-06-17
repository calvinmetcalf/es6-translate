var detective = require('detective');
var fs = require('fs');
var rawTemplate = fs.readFileSync('./template.hbs').toString();
var Handlebars = require('handlebars');
var template = Handlebars.compile(rawTemplate);
exports.translate = function (load) {
  var things = {};
  things.code = load.source;
  var keys = {};
  things.require = detective(things.code).filter(function (item) {
    if (keys[item]) {
      return false;
    }
    keys[item] = true;
    return true;
  });
  return template(things);
};