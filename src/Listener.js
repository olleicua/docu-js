/* class Listener
 *
 * a listener object keeps track of a collection of callback functions.
 * when the #send method is called, all of the callback functions get called with whatever
 * arguments were passed to #send.
 */
class Listener {
  constructor() {
    this.listeners = [];
  }

  // TODO: add the support for introspecting and removing listeners via uniq ids
  //       (which are automatically generated in the simplest case
  //       or specified with this.listen({ id: 'ID_123', fn: (v) => { ... }})

  /* Listener#listen(callbackFunction)
   *
   * adds the specified callback function to the collection
   */
  listen(fn) {
    this.listeners.push(fn);
  }

  /* Listener#send(...arguments)
   *
   * calls each callback function in the order they were added and pass each one the arguments that
   * were passed in to send.
   */
  send(...args) {
    let i;
    for (i = 0; i < this.listeners.length; i++) {
      this.listeners[i](...args);
    }
  }
}

export default Listener;
