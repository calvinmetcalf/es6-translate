var timer;
var promise = new Promise(function (resolve, reject) {
  global.foo = resolve;
  timer = setTimeout(reject, 2000);
});
promise.then(function () {
  clearTimeout(timer);
});
//require('./trace');
function foo () {
  require('./effects');
}

module.exports =  function () {
  return promise;
};