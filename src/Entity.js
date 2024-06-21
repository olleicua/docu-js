import { keys, isObject, isPlainObject, isArrayLike } from 'lodash';

import { isAppendable, normalizePropertyName, append } from './utils'
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
      new DynamicEntity(child).appendTo($appendable)
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
    } else if (isObject(object[key])) {
      assign(object[key], value);
    } else if (value instanceof DynamicValue) {
      object[normalizePropertyName(key)] = value.currentValue();
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
    this.$el.after(...args.map((arg) => {
      return (arg instanceof Entity) ? arg.$el : arg;
    }));
  }

  remove() {
    this.$el.remove();
  }
}

export default Entity;
