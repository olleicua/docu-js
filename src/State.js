import Listener from './Listener';
import DynamicValue from './DynamicValue';

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

export default State;
