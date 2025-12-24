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
}

export default State;
