import { keys, values, mapValues, every } from 'lodash-es';

import State from './State'
import { normalizePropertyName } from './utils'

function validMultistateObject(object) {
  return every(
    values(object),
    value => value instanceof State
  );
}

/* class DynamicValue
 *
 * a DynamicValue represents a value that is a function of one or more states which can be
 * interpolated into JSX.
 * in the simplest case its constructor could take a single state and no function and the value
 * would simply be whatever the state is. This is still useful as DynamicValue contains the logic
 * to bind itself to a DOM property or a DOM Node (via a DynamicNode).
 * for example:
 * ```
 * const className = new State('foo');
 * append(document.body, <p className={new DynamicValue(className)}>lorem</p>);
 * className.set('bar');
 * ```
 * the above will change the paragraph's class from foo to bar.
 *
 * a function can be passed to the constructor as the second argument which in the case of a single
 * state being the first object the function will take the value of that state as and return the
 * value that should be used wherever the DynamicValue is being interpolated.
 * for example:
 * ```
 * const spacing = new State(10);
 * const margin = new DynamicValue(spacing, (sp) => `${sp}px`);
 * append(document.body, <p style={{ margin }}>lorem</p>);
 * spacing.set(20);
 * ```
 * the above example will change the margin of the paragraph from 10px to 20px.
 *
 * it is also possible to make DynamicValue from multiple states by passing an object with
 * states as values for the first argument. in this case the function is required.
 * for example:
 * ```
 * const spacing = new State(10);
 * const unit = new State('px');
 * const margin = new DynamicValue(
 *   { spacing, unit },
 *   ({ spacing, unit }) => `${spacing}${unit}`
 * );
 * append(document.body, <p style={{ margin }}>lorem</p>);
 * spacing.set(1);
 * unit.set('em');
 * ```
 * the above example will change the margin of the paragraph from 10px to 1em.
 */
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

      if (!modifierFn) {
	throw 'multistate dynamic value requires a function';
      }

      this.mode = 'multiState';
      this.states = state
    }
    this.modifierFn = modifierFn || ((value) => value);
  }

  /* DynamicValue#bindProperty(object, key)
   *
   * takes and object and a key
   * sets object[key] to the current value of the object then makes it so that any time any of
   * the state objects changes object[key] will be set to the new value.
   */
  bindProperty(object, key) {
    object[normalizePropertyName(key)] = this.currentValue();
    this.onChange((newValue) => {
      object[normalizePropertyName(key)] = newValue;
    });
  }

  // internal
  currentValue() {
    switch (this.mode) {
    case 'singleState':
      return this.modifierFn(this.state.value);
    case 'multiState':
      return this.modifierFn(mapValues(this.states, 'value'));
    }
  }

  // internal
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

  // internal
  singleStateOnChange(fn) {
    this.state.listener.listen(() => fn(this.currentValue()));
  }

  // internal
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
