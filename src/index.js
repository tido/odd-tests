
import { isObject, isFunction, isString } from 'lodash/fp';
import Mocha from 'mocha';
import path from 'path';

export function run(options) {
  if (!isObject(options)) {
    throw new Error('expected options parameter to be an object');
  }
  if (!isString(options.oddPath)) {
    throw new Error('expected oddPath option to be a string');
  }
  if (!isFunction(options.wrapFragment)) {
    throw new Error('expected wrapFragment option to be a function');
  }
  if (!isFunction(options.validate)) {
    throw new Error('expected validate option to be a function');
  }

  global.oddTestOptions = options;

  const mocha = new Mocha();
  mocha.addFile(path.join(__dirname, 'spec.js'));
  mocha.run(failures => {
    process.on('exit', () => {
      process.exit(failures);
    });
  });
}
