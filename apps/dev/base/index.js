var _ = require('lodash');

Object.defineProperty(global, '__stack', {
  get: function(){
    var orig = Error.prepareStackTrace;
    Error.prepareStackTrace = function(_, stack){ return stack; };
    var err = new Error();
    Error.captureStackTrace(err, arguments.callee);
    var stack = err.stack;
    Error.prepareStackTrace = orig;
    return stack;
  }
});

Object.defineProperty(global, '__line', {
  get: function(){
  }
});

log = function(func, args, color) {
  color = color || '[34m';
  var line = __stack[2].getLineNumber();
  args = Array.prototype.slice.call(args, 0);
  args.unshift(__stack[2].getFileName().replace(process.cwd(), '') + '»\033[0m');
  args.unshift('\033' + color + 'Line ' + line + ' of');
  func.apply(null, args);
}

console._log = console.log;
console._error = console.error;

console.log = function() {
  log(console._log, arguments);
};
console.error = function() {
  log(console._error, arguments, '[31m');
};
