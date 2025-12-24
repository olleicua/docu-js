import { isString, isArray, includes } from 'lodash-es';

import Fragment from './Fragment';
import DynamicValue from './DynamicValue';
import DynamicEntity from './DynamicEntity';

export function isAppendable(object) {
  return typeof object.appendChild === 'function';
}

export function ensureValidChildObject(object) {
  if (object.isDocuEntity || object.isDocuFragment || object instanceof Node) {
    return object;
  }

  if (isArray(object)) {
    return new Fragment(object.map(ensureValidChildObject));
  }

  if (isString(object)) {
    return document.createTextNode(object);
  }

  throw ('object in a child element context must be set to ' +
	 'a docu Entity, a docu Fragment, a string, a DOM Node, or an Array of such objects');
}

export function getDOMNode(object) {
  if (object.isDocuFragment) {
    throw 'docu Fragment object has no singular DOM node';
  }

  if (isArray(object)) {
    throw 'Array has no singular DOM node';
  }

  if (object.isDocuEntity) {
    return object.$el;
  }

  return ensureValidChildObject(object);
}

export function flatDOMNodeArray(args) {
  return args.map((object) => {
    if (isArray(object)) {
      return flatDOMNodeArray(object);
    }

    if (object.isDocuFragment) {
      return flatDOMNodeArray(object.children);
    }

    return getDOMNode(object)
  }).flat();
}

const alwaysLowerCasePropertyNames = [
  'onclick',
  'onkeyup',
  'onchange'
  // TODO: list all the things
];

export function normalizePropertyName(key) {
  if (includes(alwaysLowerCasePropertyNames, key.toLowerCase())) {
    return key.toLowerCase();
  }

  return key;
}

export function append(parent, child) {
  if (!isAppendable(parent)) {
    throw 'parent object cannot be appended to';
  }

  if (isArray(child)) {
    for (let i = 0; i < child.length; i++) {
      append(parent, child[i]);
    }
  } else if (child.isDocuFragment) {
    for (let i = 0; i < child.children.length; i++) {
      append(parent, child.children[i]);
    }
  } else if (child instanceof DynamicValue) {
    new DynamicEntity(child).appendTo(parent);
  } else {
    parent.appendChild(getDOMNode(child));
  }
}
