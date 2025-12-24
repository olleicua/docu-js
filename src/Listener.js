class Listener {
  constructor() {
    this.listeners = [];
  }

  // TODO: add the support for introspecting and removing listeners via uniq ids
  //       (which are automatically generated in the simplest case
  //       or specified with this.listen({ id: 'ID_123', fn: (v) => { ... }})
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
