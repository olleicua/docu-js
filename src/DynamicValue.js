import { keys, values, mapValues, every } from 'lodash-es';

import State from './State'
import { normalizePropertyName } from './utils'

function validMultistateObject(object) {
  return every(
    values(object),
    value => value instanceof State
  );
}

class DynamicValue {
  constructor(state, modifierFn) {
    if (state instanceof State) {
      this.mode = 'singleState';
      this.state = state;
    } else {
      if (!validMultistateObject(state)) {
	throw 'the first argument to dynamicValue must be either a State object ' +
	  'or an object whose values are all State objects'
      }

      this.mode = 'multiState';
      this.states = state
    }
    this.modifierFn = modifierFn || ((value) => value);
  }

  bindProperty(object, key) {
    object[normalizePropertyName(key)] = this.currentValue();
    this.onChange((newValue) => {
      object[normalizePropertyName(key)] = newValue;
    });
  }

  currentValue() {
    switch (this.mode) {
    case 'singleState':
      return this.modifierFn(this.state.value);
    case 'multiState':
      return this.modifierFn(mapValues(this.states, 'value'));
    }
  }

  onChange(fn) {
    switch (this.mode) {
    case 'singleState':
      this.singleStateOnChange(fn);
      break;
    case 'multiState':
      this.multiStateOnChange(fn);
      break;
    }
  }

  singleStateOnChange(fn) {
    this.state.listener.listen(() => fn(this.currentValue()));
  }

  multiStateOnChange(fn) {
    const stateKeys = keys(this.states);
    let i, key, state;
    for (i = 0; i < stateKeys.length; i++) {
      key = stateKeys[i];
      state = this.states[key];
      state.listener.listen(() => fn(this.currentValue()));
    }
  }
}

export default DynamicValue;
