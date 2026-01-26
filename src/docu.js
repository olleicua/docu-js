import { assignProperties, append } from './utils';
import Fragment from './Fragment';
import Listener from './Listener';
import State from './State';
import DynamicValue from './DynamicValue';
import DynamicNode from './DynamicNode';

function jsxEntity(tag, props, ...children) {
  props ||= {};
  props.children = children;

  if (typeof tag === 'function') {
    return tag(props);
  }

  const $element = document.createElement(tag);
  assignProperties($element, props);
  return $element;
}

function DocuFragment({ children }) {
  return new Fragment(children);
}

function dynamicValue(state, modifierFn) {
  return new DynamicValue(state, modifierFn);
}

const docu = { append, Listener, State, dynamicValue, jsxEntity, DocuFragment };

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
  exports.append = append;
  exports.Listener = Listener;
  exports.State = State;
  exports.dynamicValue = dynamicValue;
}

// ES Module export
export { append, Listener, State, dynamicValue, jsxEntity, DocuFragment };
