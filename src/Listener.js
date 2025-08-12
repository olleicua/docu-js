class Listener {
  constructor() {
    this.listeners = [];
  }

  // TODO: add the ability to introspect and remove listeners
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

export default Listener;
