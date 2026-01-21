import { isArray, isPlainObject } from 'lodash-es';

import { assignProperties } from './utils';
import Listener from './Listener';

/* class State
 *
 * A State object is simply a value (which can be any JavaScript value) and Listener.
 * Several methods are provided to update the value object, the simplest being State#set.
 * Whenever the value is updated the listener is sent the new value which results in anything
 * that is listening to the listener being updated as well.
 */
class State {
  constructor(initialValue) {
    this.value = initialValue;
    this.listener = new Listener();
  }

  /* State#set(newValue)
   *
   * This is the most basic way to update the value of a state object. The value is replaced
   * with the new value and then the new value is sent to the listener.
   *
   * Returns the new value.
   */
  set(value) {
    this.value = value;
    this.listener.send(value);
    return value;
  }

  /* State#push(value)
   *
   * Throws an exception unless the current value is an Array.
   * Adds the passed in value to the end of the array then sends the array to the listener.
   *
   * Returns the array.
   */
  push(value) {
    if (!isArray(this.value)) {
      throw '`push` can only be called on a State object whose value is an array';
    }

    this.value.push(value);
    this.listener.send(this.value);
    return this.value;
  }

  /* State#pop(value)
   *
   * Throws an exception unless the current value is an Array.
   * Removes the last value from the end of the array then sends the array to the listener.
   *
   * Returns the removed value.
   */
  pop(value) {
    if (!isArray(this.value)) {
      throw '`pop` can only be called on a State object whose value is an array';
    }

    const last = this.value.pop();
    this.listener.send(this.value);
    return last;
  }

  /* State#update(properties)
   *
   * Throws an exception unless the current value is a DOM Node or a plain JavaScript Object.
   * Throws an exception unless the properties object passed in is a plain JavaScript Object.
   * For each key/value pair in the properties object an assignment is made on the current value.
   * If a nested property is an object then assignment is recursive so:
   * ```
   * const entityState = new State(<p style={{ color: 'red', backgroundColor: 'yellow' }}>foo</p>);
   * entityState.update({ backgroundColor: 'blue' });
   * ```
   * won't override the existing properties of the style object and will result in a entity with a
   * style object like: `{ color: 'red', backgroundColor: 'blue' }`.
   *
   * Returns the updated value.
   */
  update(properties) {
    if (isPlainObject(this.value) || this.value instanceof Node) {
      assignProperties(this.value, properties);
      this.listener.send(this.value);
      return this.value;
    }

    throw '`update` can only be called on a State object whose value is ' +
      'a plain obect or a DOM Node'
  }
}

export default State;
