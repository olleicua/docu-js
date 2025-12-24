import { keys, isObject, isPlainObject, isArrayLike } from 'lodash-es';

import { isAppendable, normalizePropertyName, append, getDOMNode, flatDOMNodeArray } from './utils';
import DynamicValue from './DynamicValue';
import DynamicEntity from './DynamicEntity';

function addChildrenToElement($appendable, children) {
  if (!isArrayLike(children)) {
    throw 'children property is not an array';
  }

  let i, child;
  for (i = 0; i < children.length; i++) {
    child = children[i];
    if (child instanceof DynamicValue) {
      new DynamicEntity(child).appendTo($appendable);
    } else {
      append($appendable, child);
    }
  }
}

function assign(object, nestedProperties) {
  if (!isPlainObject(nestedProperties)) {
    throw 'Entity can only be assigned using a plain object';
  }

  const propertyKeys = keys(nestedProperties);
  let i, key, value;
  for (i = 0; i < propertyKeys.length; i++) {
    key = propertyKeys[i];
    value = nestedProperties[key];
    if (key === 'children' && isAppendable(object)) {
      addChildrenToElement(object, value);
    } else if (isPlainObject(value)) {
      assign(object[normalizePropertyName(key)], value);
    } else if (value instanceof DynamicValue) {
      value.bindProperty(object, key);
    } else {
      object[normalizePropertyName(key)] = value;
    }
  }
}

class Entity {
  constructor(first, second) {
    const tagName = (typeof first === 'string') ? first : 'div';
    const properties = (typeof first === 'string') ? second : first;

    this.isDocuEntity = true;

    this.$el = document.createElement(tagName);
    assign(this.$el, properties);
  }

  update(properties) {
    assign(this.$el, properties);
  }

  after(...args) {
    this.$el.after(...flatDOMNodeArray(args));
  }

  remove() {
    this.$el.remove();
  }

  appendChild(child) {
    this.$el.appendChild(getDOMNode(child));
  }
}

export default Entity;
