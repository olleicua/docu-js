import {
  keys,
  isObject,
  isPlainObject,
  isString,
  isArrayLike,
  isArray,
  toArray,
  includes
} from 'lodash-es';

import Fragment from './Fragment';
import DynamicValue from './DynamicValue';
import DynamicNode from './DynamicNode';
import State from './State';

export function assignProperties(object, nestedProperties) {
  if (!isPlainObject(nestedProperties)) {
    throw 'the second argument to assignProperties can only be assigned using a plain object';
  }

  const propertyKeys = keys(nestedProperties);
  let i, key, normalKey, value;
  for (i = 0; i < propertyKeys.length; i++) {
    key = propertyKeys[i];
    normalKey = normalizePropertyName(key);
    value = nestedProperties[key];
    if (key === 'children' && isAppendable(object)) {
      append(object, value);
    } else if (isPlainObject(value) && isObject(object[normalKey])) {
      assignProperties(object[normalKey], value);
    } else if (value instanceof DynamicValue) {
      value.bindProperty(object, normalKey);
    } else if (value instanceof State) {
      new DynamicValue(value).bindProperty(object, normalKey);
    } else {
      object[normalKey] = value;
    }
  }
}

export function isAppendable(object) {
  return typeof object.appendChild === 'function';
}

export function ensureValidChildObject(object) {
  if (object instanceof Fragment ||
      object instanceof Node) {
    return object;
  }

  if (isString(object)) {
    return document.createTextNode(object);
  }

  if (isArrayLike(object)) {
    return new Fragment(toArray(object).map(ensureValidChildObject));
  }

  throw ('object in a child element context must be a docu Fragment, ' +
	 'a string, a DOM Node, or an Array of such objects');
}

export function getDOMNode(object) {
  if (object instanceof Fragment) {
    throw 'docu Fragment object has no singular DOM node';
  }

  if (isArray(object)) {
    throw 'Array has no singular DOM node';
  }

  return ensureValidChildObject(object);
}

export function flatDOMNodeArray(args) {
  return args.map((object) => {
    const validObject = ensureValidChildObject(object);

    if (validObject instanceof Fragment) {
      return flatDOMNodeArray(validObject.children);
    }

    return getDOMNode(validObject)
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

export function isChildArray(object) {
  if (object instanceof Node || isString(object)) {
    return false;
  }

  return isArrayLike(object);
}

function debug(x) {
  console.log([x, JSON.stringify(x), x && x.constructor.name, isChildArray(x), x instanceof Node])
}

export function append(parent, child) {
  if (!isAppendable(parent)) {
    throw 'parent object cannot be appended to';
  }

  if (isChildArray(child)) {
    const childArray = toArray(child);
    for (let i = 0; i < childArray.length; i++) {
      append(parent, childArray[i]);
    }
    return;
  }

  if (child instanceof DynamicValue) {
    new DynamicNode(child).appendTo(parent);
    return;
  }

  if (child instanceof State) {
    new DynamicNode(
      new DynamicValue(child)
    ).appendTo(parent);
    return;
  }

  const childObject = ensureValidChildObject(child);

  if (childObject instanceof Fragment) {
    for (let i = 0; i < childObject.children.length; i++) {
      append(parent, childObject.children[i]);
    }
    return;
  }

  parent.appendChild(getDOMNode(childObject));
}
