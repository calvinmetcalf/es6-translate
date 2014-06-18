module.exports = populate;
function populate(Sys) {
  Sys.set('assert', makeMod(require('assert')));
  Sys.set('child_process', makeMod(require('child_process')));
  Sys.set('cluster', makeMod(require('cluster')));
  Sys.set('crypto', makeMod(require('crypto')));
  Sys.set('dns', makeMod(require('dns')));
  Sys.set('domain', makeMod(require('domain')));
  Sys.set('events', makeMod(require('events')));
  Sys.set('fs', makeMod(require('fs')));
  Sys.set('http', makeMod(require('http')));
  Sys.set('https', makeMod(require('https')));
  Sys.set('net', makeMod(require('net')));
  Sys.set('os', makeMod(require('os')));
  Sys.set('path', makeMod(require('path')));
  Sys.set('punycode', makeMod(require('punycode')));
  Sys.set('querystring', makeMod(require('querystring')));
  Sys.set('readline', makeMod(require('readline')));
  Sys.set('repl', makeMod(require('repl')));
  Sys.set('stream', makeMod(require('stream')));
  Sys.set('string_decoder', makeMod(require('string_decoder')));
  Sys.set('tls', makeMod(require('tls')));
  Sys.set('tty', makeMod(require('tty')));
  Sys.set('url', makeMod(require('url')));
  Sys.set('util', makeMod(require('util')));
  Sys.set('dgram', makeMod(require('dgram')));
  Sys.set('vm', makeMod(require('vm')));
  Sys.set('zlib', makeMod(require('zlib')));
}

function makeMod(input) {
  var out = {
    'default': input
  };
  Object.keys(input).forEach(function (key) {
    out[key] = input[key];
  });
  // new Module might not be the final syntax
  return new Module(out);
}