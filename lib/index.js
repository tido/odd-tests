'use strict';

exports.__esModule = true;
exports.run = run;

var _fp = require('lodash/fp');

var _mocha = require('mocha');

var _mocha2 = _interopRequireDefault(_mocha);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function run(options) {
  if (!(0, _fp.isObject)(options)) {
    throw new Error('expected options parameter to be an object');
  }
  if (!(0, _fp.isString)(options.oddPath)) {
    throw new Error('expected oddPath option to be a string');
  }
  if (!(0, _fp.isFunction)(options.wrapFragment)) {
    throw new Error('expected wrapFragment option to be a function');
  }
  if (!(0, _fp.isFunction)(options.validate)) {
    throw new Error('expected validate option to be a function');
  }

  global.oddTestOptions = options;
  var mocha = new _mocha2.default();
  mocha.addFile(_path2.default.join(__dirname, 'spec.js'));
  mocha.run(function (failures) {
    process.on('exit', function () {
      process.exit(failures);
    });
  });
}