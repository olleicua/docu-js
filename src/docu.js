import { append } from './utils';
import Entity from './Entity';
import Listener from './Listener';
import State from './State';
import DynamicValue from './DynamicValue';

function jsxEntity(tag, props, ...children) {
  props ||= {};
  props.children = children;

  if (typeof tag === 'function') {
    return tag(props);
  }

  return new Entity(tag, props);
}

function dynamicValue(state, modifierFn) {
  return new DynamicValue(state, modifierFn);
}

const docu = { Entity, append, Listener, State, dynamicValue, jsxEntity };

// Browser global
if (typeof window !== 'undefined') {
  window.docu = docu;
}

// Node.js/ES Module export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = docu;
} else if (typeof exports !== 'undefined') {
  exports.jsxEntity = jsxEntity;
  exports.Entity = Entity;
  exports.append = append;
  exports.Listener = Listener;
  exports.State = State;
  exports.dynamicValue = dynamicValue;
}

// ES Module export
export { Entity, append, Listener, State, dynamicValue, jsxEntity };

