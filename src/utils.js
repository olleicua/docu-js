import { isString, isArray, includes } from 'lodash-es';

export function isAppendable(object) {
  return typeof object.appendChild === 'function';
}

export function ensureValidChildObject(object) {
  if (object.isDocuEntity || object.isDocuFragment || object instanceof Node) {
    return object;
  }

  if (isString(object)) {
    return document.createTextNode(object);
  }

  throw ('object in a child element context must be set to ' +
	 'a docu Entity, a docu Fragment, a string, or a DOM Node');
}

export function getDOMNode(object) {
  if (object.isDocuFragment) {
    throw 'docu Fragment object has no singular DOM node';
  }

  if (object.isDocuEntity) {
    return object.$el;
  }

  return ensureValidChildObject(object);
}

export function flatDOMNodeArray(args) {
  return args.map((object) => {
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
  } else {
    parent.appendChild(getDOMNode(child));
  }
}
