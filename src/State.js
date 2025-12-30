import { isArray } from 'lodash-es';

import Listener from './Listener';

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
}

export default State;
