
import fs from 'fs';
import {
  flow, forEach, find, map, flatten, keyBy, mapValues,
} from 'lodash/fp';

import {
  getElementsByTagName, getAttribute, parseXML, getInnerXMLString, relativeToFile,
} from './util';
import {
  assertTemplatePath, assertValid, assertInvalid,
} from './assertions';

const renditionAttributeName = 'rendition';
const oddTestOptions = global.oddTestOptions;
const relativeToODD = relativeToFile(oddTestOptions.oddPath);

describe(`validation results of the egXML element contents in "${oddTestOptions.oddPath}"`, () => {
  it('should match the values of the respective @valid attributes', (done) => {
    Promise.resolve(fs.readFileSync(oddTestOptions.oddPath, 'utf-8'))
      .then(parseXML)
      .then(oddDocument => {
        const renditionToTemplatePath = flow(
          getElementsByTagName('rendition'),
          keyBy(element => element.getAttribute('xml:id')),
          mapValues(element =>
            getElementsByTagName('ptr')(element)[0].getAttribute('target')
          )
        )(oddDocument);

        const schemaSpecNames = flow(
          getElementsByTagName('schemaSpec'),
          map(getAttribute('ident'))
        )(oddDocument);
        forEach(
          schemaSpecName =>
            flow(
              getTestElements(schemaSpecName),
              forEach(validateElement(renditionToTemplatePath, schemaSpecName))
            )(oddDocument),
          schemaSpecNames
        );
      })
      .then(() => done())
      .catch(done);
  });
});

const getTestElements = (schemaSpecName) => (xml) => {
  const schemaSpecs = getElementsByTagName('schemaSpec')(xml);
  const specGrps = getElementsByTagName('specGrp')(xml);
  const body = getElementsByTagName('body')(xml)[0];

  const schemaSpec = find(
    (element) => getAttribute('ident')(element) === schemaSpecName,
    schemaSpecs
  );

  const relevantSpecGrps = flow(
    getElementsByTagName('specGrpRef'),
    map(
      flow(
        getAttribute('target'),
        ref => ref.substr(1),
        id => find(specGrp => getAttribute('xml:id')(specGrp) === id, specGrps)
      )
    )
  )(schemaSpec);

  const testElements = flow(
    map(getElementsByTagName('egXML')),
    flatten,
  )([body, schemaSpec, ...relevantSpecGrps]);

  return testElements;
};

const validateElement = (renditionToTemplatePath, schemaSpecName) => (element) => {
  const fragment = getInnerXMLString(element);
  const validAttribute = getAttribute('valid')(element);
  const rendition = getAttribute(renditionAttributeName)(element).substr(1);
  const templatePath = renditionToTemplatePath[rendition];

  describe(fragment, () => {
    switch (validAttribute) {
      case 'true':
        it(`should be valid against schema spec "${schemaSpecName}"`, () => {
          assertTemplatePath(templatePath, rendition);
          const xmlString = oddTestOptions.wrapFragment(relativeToODD(templatePath), fragment);
          const report = oddTestOptions.validate(xmlString, schemaSpecName);
          assertValid(report);
        });
        break;
      case 'false':
        it(`should be invalid against schema spec "${schemaSpecName}"`, () => {
          assertTemplatePath(templatePath, rendition);
          const xmlString = oddTestOptions.wrapFragment(relativeToODD(templatePath), fragment);
          const report = oddTestOptions.validate(xmlString, schemaSpecName);
          assertInvalid(report);
        });
        break;
      default:
    }
  });
};
