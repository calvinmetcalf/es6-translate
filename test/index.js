var es6 = require('../');
var test = require('tape');
var example = [
  'var foo = require(\'./bar/baz\');',
  'exports.lala = foo.baz'
].join('\n');

test('should work', function (t) {
  var out = es6.translate({source: example});
  t.ok(true, out);
  t.end();
});