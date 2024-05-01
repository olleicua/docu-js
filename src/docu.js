import { keys, isObject, isPlainObject, isArrayLike, isString, includes } from 'lodash';

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

function isAppendable(object) {
  return typeof object.appendChild === 'function';
}

const alwaysLowerCasePropertyNames = [
  'onclick',
  'onkeyup',
  'onchange'
];
function normalizePropertyName(key) {
  if (includes(alwaysLowerCasePropertyNames, key.toLowerCase())) {
    return key.toLowerCase();
  }

  return key;
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
      object[normalizePropertyName(key)] = value.modifierFn(value.state.value);
      value.bindProperty(object, key);
    } else {
      object[normalizePropertyName(key)] = value;
    }
  }
}

function append(parent, child) {
  const $parent = (parent instanceof Entity) ? parent.$el : parent;

  if (child instanceof Entity) {
    $parent.appendChild(child.$el);
  } else if (isString(child)) {
    $parent.appendChild(document.createTextNode(child));
  } else {
    $parent.appendChild(child);
  }
}

class Entity {
  constructor(first, second) {
    const tagName = (typeof first === 'string') ? first : 'div';
    const properties = (typeof first === 'string') ? second : first;

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

class Listener {
  constructor() {
    this.listeners = [];
  }

  listen(fn) {
    this.listeners.push(fn);
  }

  send(event) {
    let i;
    for (i = 0; i < this.listeners.length; i++) {
      this.listeners[i](event);
    }
  }
}

class State {
  constructor(initialValue) {
    this.value = initialValue;
    this.listener = new Listener();
  }

  set(value) {
    this.value = value;
    this.listener.send(value);
    return value;
  }

  dynamicValue(modifierFn) {
    return new DynamicValue(this, modifierFn);
  }
}

class DynamicEntity {
  constructor(dynamicValue) {
    this.dynamicValue = dynamicValue;
    this.entity = dynamicValue.modifierFn(dynamicValue.state.value);
  }

  appendTo($appendable) {
    append($appendable, this.entity);
    this.dynamicValue.state.listener.listen((newValue) => {
      const newEntity = this.dynamicValue.modifierFn(newValue);
      this.entity.after(newEntity);
      this.entity.remove();
      this.entity = newEntity;
    });
  }
}

class DynamicValue {
  constructor(state, modifierFn) {
    this.state = state;
    this.modifierFn = modifierFn || ((value) => value);
  }

  bindProperty(object, key) {
    this.onChange((newValue) => {
      object[normalizePropertyName(key)] = newValue;
    });
  }

  onChange(fn) {
    this.state.listener.listen((newValue) => {
      fn(this.modifierFn(newValue));
    });
  }
}

window.docu = { Entity, append, Listener, State };
