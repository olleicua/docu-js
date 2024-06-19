import { isString, includes } from 'lodash';

import Entity from './Entity';

export function isAppendable(object) {
  return typeof object.appendChild === 'function';
}

const alwaysLowerCasePropertyNames = [
  'onclick',
  'onkeyup',
  'onchange'
];

export function normalizePropertyName(key) {
  if (includes(alwaysLowerCasePropertyNames, key.toLowerCase())) {
    return key.toLowerCase();
  }

  return key;
}

export function append(parent, child) {
  const $parent = (parent instanceof Entity) ? parent.$el : parent;

  if (child instanceof Entity) {
    $parent.appendChild(child.$el);
  } else if (isString(child)) {
    $parent.appendChild(document.createTextNode(child));
  } else {
    $parent.appendChild(child);
  }
}
