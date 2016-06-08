
import { flow, property, invokeMap, join, toArray } from 'lodash/fp';
import { DOMParser } from 'xmldom';
import path from 'path';

export const getElementsByTagName = (tagName) =>
  (domElement) => toArray(domElement.getElementsByTagName(tagName));

export const getAttribute = (attributeName) =>
  (domElement) => domElement.getAttribute(attributeName);

export const parseXML = (str) => new DOMParser().parseFromString(str, 'text/xml');

export const getInnerXMLString = flow(
  property('childNodes'),
  invokeMap('toString'),
  join('')
);

export const relativeToFile = (a) => (b) => path.resolve(path.dirname(a), b);
