var sidetable = require('./sidetable');

module.exports = evaluate;
function evaluate(name, loader) {
  var record = sidetable.get(name);
  
  if (record.evaluated)
    return;
 
  // mark as evaluated
  record.evaluated = true;
 
  
  function localRequire(name, fullModule) {
    return ourRequire(record.depMap[name], loader, fullModule);
  } 
  var localModule = {
    get exports() {
      return record.exports;
    },
    set exports(val) {
      record.defaultUsed = true;
      record.exports = val;
    }
  };
  var scopedEval = new Function('global', 'require', 'module', 'exports', '__filename', '__dirname', record.source);
  // this can also be done with VM or something cleaner
  scopedEval.call(global, global, localRequire, localModule, record.exports, record.address, record.dirname);
}

function ourRequire(name, loader, fullModule) {
  // if in the side table
  if (sidetable.has(name)) {
    var record = sidetable.get(name);
    evaluate(name, loader);
    return record.exports;
  }
 
  if (loader.has(name)) {
    var mod = loader.get(name);
    if ('default' in mod && !fullModule) {
      return mod.default;
    } else {
      return mod;
    }
  }
}