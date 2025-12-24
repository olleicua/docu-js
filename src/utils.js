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

let _EntityClass = null;
let _FragmentClass = null;
let _DynamicValueClass = null;
let _DynamicEntityClass = null;

export function registerClasses({ Entity, Fragment, DynamicValue, DynamicEntity }) {
  _EntityClass = Entity;
  _FragmentClass = Fragment;
  _DynamicValueClass = DynamicValue;
  _DynamicEntityClass = DynamicEntity;
}

export function assign(object, nestedProperties) {
  if (!isPlainObject(nestedProperties)) {
    throw 'Entity can only be assigned using a plain object';
  }

  const propertyKeys = keys(nestedProperties);
  let i, key, value;
  for (i = 0; i < propertyKeys.length; i++) {
    key = propertyKeys[i];
    value = nestedProperties[key];
    if (key === 'children' && isAppendable(object)) {
      append(object, value);
    } else if (isPlainObject(value)) {
      assign(object[normalizePropertyName(key)], value);
    } else if (value instanceof _DynamicValueClass) {
      value.bindProperty(object, key);
    } else {
      object[normalizePropertyName(key)] = value;
    }
  }
}

export function isAppendable(object) {
  return typeof object.appendChild === 'function';
}

export function ensureValidChildObject(object) {
  if (object instanceof _EntityClass ||
      object instanceof _FragmentClass ||
      object instanceof _DynamicValueClass ||
      object instanceof Node) {
    return object;
  }

  if (isString(object)) {
    return document.createTextNode(object);
  }

  if (isArrayLike(object)) {
    return new _FragmentClass(toArray(object).map(ensureValidChildObject));
  }

  throw ('object in a child element context must be a docu Entity, a docu Fragment, ' +
	 'a string, a DOM Node, or an Array of such objects');
}

export function getDOMNode(object) {
  if (object instanceof _FragmentClass) {
    throw 'docu Fragment object has no singular DOM node';
  }

  if (isArray(object)) {
    throw 'Array has no singular DOM node';
  }

  if (object instanceof _EntityClass) {
    return object.$el;
  }

  return ensureValidChildObject(object);
}

export function flatDOMNodeArray(args) {
  return args.map((object) => {
    const validObject = ensureValidChildObject(object);

    if (validObject instanceof _FragmentClass) {
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

export function append(parent, child) {
  if (!isAppendable(parent)) {
    throw 'parent object cannot be appended to';
  }

  const childObject = ensureValidChildObject(child);

  if (childObject instanceof _FragmentClass) {
    for (let i = 0; i < childObject.children.length; i++) {
      append(parent, childObject.children[i]);
    }
  } else if (childObject instanceof _DynamicValueClass) {
    new _DynamicEntityClass(childObject).appendTo(parent);
  } else {
    parent.appendChild(getDOMNode(childObject));
  }
}
