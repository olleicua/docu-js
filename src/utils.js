import { isString, isArray, includes } from 'lodash-es';

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
  const $parent = parent.isDocuEntity ? parent.$el : parent;

  if (isArray(child)) {
    for (let i = 0; i < child.length; i++) {
      append(parent, child[i]);
    }
  } else if (child.isDocuEntity) {
    $parent.appendChild(child.$el);
  } else if (isString(child)) {
    $parent.appendChild(document.createTextNode(child));
  } else {
    $parent.appendChild(child);
  }
}
