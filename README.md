
# ODD Tests

Creates and runs a Mocha ODD test suite by extracting `<egXML>` elements from an ODD,
transforming their contents into full XML documents (based on templates) and
validating these documents (usually against the schemata generated from the ODD).

## Requirements

node, npm

## Installation

```
npm i odd-tests
```

## ODD

Only `<egXML>` elements with a `@valid` attribute value of 'true' or 'false' get
included in the tests. Each of the respective `<egXML>` elements needs to have
a `@rendition` attribute pointing to a `<rendition>` element in the ODD header.
Each `<rendition>` element needs to contain a descendant `<ptr>` element providing
the path to the template file associated with the rendition in the `@target` attribute.

This is an excerpt of a TEI header providing the path to a single JSX template:

```
<encodingDesc>
  <tagsDecl>
    <rendition xml:id="afterStaff" scheme="free">
      <ptr target="../test/jsx/templates/AfterStaff.jsx"/>
    </rendition>
  </tagsDecl>
</encodingDesc>
```

An example of an `<egXML>` element referring to that `<rendition>`:

```
<egXML xmlns="http://www.tei-c.org/ns/Examples" valid="true" rendition="#afterStaff">
  <slur xml:id="d020" startid="#n01" endid="#n02"/>
</egXML>
```

A full example of an ODD which can get processed by the ODD Tests package can be found at https://github.com/tido/mei-customization/blob/master/src/tido.xml. See http://www.tei-c.org/release/doc/tei-p5-doc/en/html/ref-egXML.html for general
information about the `<egXML>` element.

## Running the tests

The ODD Tests package exposes a single function, `run`, which triggers the tests.
It takes an options object with three mandatory properties:

* *oddPath: string* - the path to the ODD file on which the tests are based
* *wrapFragment(templatePath: string, fragment: string): string* - a function wrapping the provided fragment using the template at templatePath
* *validate(xmlString: string, schemaSpecName: string): ValidationReport* - a function validating the given XML string against
the schemata associated with the given `<schemaSpec>` (schemaSpecName is the value of the `@ident` attribute of the `<schemaSpec>` in concern). The returned ValidationReport must be an object with a boolean `isValid` property and a `getErrors()` method returning an array of validation errors. The returned validation errors are required to have a `toString()` method returning the error message to get displayed.

See https://github.com/tido/mei-customization/blob/master/test/run.js for a sample implementation
using Jade as a template engine and the `tido-mei-validation` package for validation.
