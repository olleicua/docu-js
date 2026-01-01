import { isArray, isPlainObject } from 'lodash-es';

import { assign } from './utils';
import Listener from './Listener';
import Entity from './Entity';

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

  push(value) {
    if (!isArray(this.value)) {
      throw '`push` can only be called on a State object whose value is an array';
    }

    this.value.push(value);
    this.listener.send(this.value);
    return this.value;
  }

  pop(value) {
    if (!isArray(this.value)) {
      throw '`pop` can only be called on a State object whose value is an array';
    }

    const last = this.value.pop();
    this.listener.send(this.value);
    return last;
  }

  update(properties) {
    if (isPlainObject(this.value)) {
      assign(this.value, properties);
      this.listener.send(this.value);
      return this.value;
    }

    if (this.value instanceof Entity) {
      this.value.update(properties);
      this.listener.send(this.value);
      return this.value;
    }

    throw '`update` can only be called on a State object whose value is ' +
      'a plain obect or docu Entity'
  }
}

export default State;
