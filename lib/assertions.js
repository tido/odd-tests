'use strict';

exports.__esModule = true;
var assertTemplatePath = exports.assertTemplatePath = function assertTemplatePath(templatePath, rendition) {
  if (!templatePath) {
    throw new Error('could not find template for rendition "#' + rendition + '"');
  }
};

var assertValid = exports.assertValid = function assertValid(report) {
  var errors = report.getErrors();

  if (errors.length) {
    var messages = errors.map(function (error) {
      return error.toString();
    }).join('\n');
    throw new Error('expected XML to be valid\n' + messages);
  }
};

var assertInvalid = exports.assertInvalid = function assertInvalid(report) {
  if (report.isValid) {
    throw new Error('expected XML to be invalid');
  }
};