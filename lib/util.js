'use strict';

exports.__esModule = true;
exports.relativeToFile = exports.getInnerXMLString = exports.parseXML = exports.getAttribute = exports.getElementsByTagName = undefined;

var _fp = require('lodash/fp');

var _xmldom = require('xmldom');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getElementsByTagName = exports.getElementsByTagName = function getElementsByTagName(tagName) {
  return function (domElement) {
    return (0, _fp.toArray)(domElement.getElementsByTagName(tagName));
  };
};

var getAttribute = exports.getAttribute = function getAttribute(attributeName) {
  return function (domElement) {
    return domElement.getAttribute(attributeName);
  };
};

var parseXML = exports.parseXML = function parseXML(str) {
  return new _xmldom.DOMParser().parseFromString(str, 'text/xml');
};

var getInnerXMLString = exports.getInnerXMLString = (0, _fp.flow)((0, _fp.property)('childNodes'), (0, _fp.invokeMap)('toString'), (0, _fp.join)(''));

var relativeToFile = exports.relativeToFile = function relativeToFile(a) {
  return function (b) {
    return _path2.default.resolve(_path2.default.dirname(a), b);
  };
};