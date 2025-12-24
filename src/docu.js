import { append, registerClasses } from './utils';
import Entity from './Entity';
import Fragment from './Fragment';
import Listener from './Listener';
import State from './State';
import DynamicValue from './DynamicValue';
import DynamicEntity from './DynamicEntity';

// avoid circular dependencies using lazy binding
registerClasses({ Entity, Fragment, DynamicValue, DynamicEntity });

function jsxEntity(tag, props, ...children) {
  props ||= {};
  props.children = children;

  if (typeof tag === 'function') {
    return tag(props);
  }

  return new Entity(tag, props);
}

function DocuFragment({ children }) {
  return new Fragment(children);
}

function dynamicValue(state, modifierFn) {
  return new DynamicValue(state, modifierFn);
}

const docu = { Entity, append, Listener, State, dynamicValue, jsxEntity, DocuFragment };

// Browser global
if (typeof window !== 'undefined') {
  window.docu = docu;
}

// Node.js/ES Module export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = docu;
} else if (typeof exports !== 'undefined') {
  exports.jsxEntity = jsxEntity;
  exports.DocuFragment = DocuFragment;
  exports.Entity = Entity;
  exports.append = append;
  exports.Listener = Listener;
  exports.State = State;
  exports.dynamicValue = dynamicValue;
}

// ES Module export
export { Entity, append, Listener, State, dynamicValue, jsxEntity, DocuFragment };
