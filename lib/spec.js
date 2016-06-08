'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _fp = require('lodash/fp');

var _util = require('./util');

var _assertions = require('./assertions');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var renditionAttributeName = 'rendition';
var oddTestOptions = global.oddTestOptions;
var relativeToODD = (0, _util.relativeToFile)(oddTestOptions.oddPath);

describe('validation results of the egXML element contents in "' + oddTestOptions.oddPath + '"', function () {
  it('should match the values of the respective @valid attributes', function (done) {
    Promise.resolve(_fs2.default.readFileSync(oddTestOptions.oddPath, 'utf-8')).then(_util.parseXML).then(function (oddDocument) {
      var renditionToTemplatePath = (0, _fp.flow)((0, _util.getElementsByTagName)('rendition'), (0, _fp.keyBy)(function (element) {
        return element.getAttribute('xml:id');
      }), (0, _fp.mapValues)(function (element) {
        return (0, _util.getElementsByTagName)('ptr')(element)[0].getAttribute('target');
      }))(oddDocument);

      var schemaSpecNames = (0, _fp.flow)((0, _util.getElementsByTagName)('schemaSpec'), (0, _fp.map)((0, _util.getAttribute)('ident')))(oddDocument);
      (0, _fp.forEach)(function (schemaSpecName) {
        return (0, _fp.flow)(getTestElements(schemaSpecName), (0, _fp.forEach)(validateElement(renditionToTemplatePath, schemaSpecName)))(oddDocument);
      }, schemaSpecNames);
    }).then(function () {
      return done();
    }).catch(done);
  });
});

var getTestElements = function getTestElements(schemaSpecName) {
  return function (xml) {
    var schemaSpecs = (0, _util.getElementsByTagName)('schemaSpec')(xml);
    var specGrps = (0, _util.getElementsByTagName)('specGrp')(xml);
    var body = (0, _util.getElementsByTagName)('body')(xml)[0];

    var schemaSpec = (0, _fp.find)(function (element) {
      return (0, _util.getAttribute)('ident')(element) === schemaSpecName;
    }, schemaSpecs);

    var relevantSpecGrps = (0, _fp.flow)((0, _util.getElementsByTagName)('specGrpRef'), (0, _fp.map)((0, _fp.flow)((0, _util.getAttribute)('target'), function (ref) {
      return ref.substr(1);
    }, function (id) {
      return (0, _fp.find)(function (specGrp) {
        return (0, _util.getAttribute)('xml:id')(specGrp) === id;
      }, specGrps);
    })))(schemaSpec);

    var testElements = (0, _fp.flow)((0, _fp.map)((0, _util.getElementsByTagName)('egXML')), _fp.flatten)([body, schemaSpec].concat(relevantSpecGrps));

    return testElements;
  };
};

var validateElement = function validateElement(renditionToTemplatePath, schemaSpecName) {
  return function (element) {
    var fragment = (0, _util.getInnerXMLString)(element);
    var validAttribute = (0, _util.getAttribute)('valid')(element);
    var rendition = (0, _util.getAttribute)(renditionAttributeName)(element).substr(1);
    var templatePath = renditionToTemplatePath[rendition];

    describe(fragment, function () {
      switch (validAttribute) {
        case 'true':
          it('should be valid against schema spec "' + schemaSpecName + '"', function () {
            (0, _assertions.assertTemplatePath)(templatePath, rendition);
            var xmlString = oddTestOptions.wrapFragment(relativeToODD(templatePath), fragment);
            var report = oddTestOptions.validate(xmlString, schemaSpecName);
            (0, _assertions.assertValid)(report);
          });
          break;
        case 'false':
          it('should be invalid against schema spec "' + schemaSpecName + '"', function () {
            (0, _assertions.assertTemplatePath)(templatePath, rendition);
            var xmlString = oddTestOptions.wrapFragment(relativeToODD(templatePath), fragment);
            var report = oddTestOptions.validate(xmlString, schemaSpecName);
            (0, _assertions.assertInvalid)(report);
          });
          break;
        default:
      }
    });
  };
};