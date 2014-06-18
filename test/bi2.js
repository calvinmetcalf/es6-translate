var fs = require('fs');

module.exports = function () {
  return fs.readFileSync(__dirname + '/null.js', {encoding: 'utf8'});
};