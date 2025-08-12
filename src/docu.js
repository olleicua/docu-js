import { append } from './utils'
import Entity from './Entity';
import Listener from './Listener';
import State from './State';
import DynamicValue from './DynamicValue';

function jsxEntity(tag, props, ...children) {
  props ||= {};
  props.children = children;
  return new Entity(tag, props);
}

function dynamicValue(state, modifierFn) {
  return new DynamicValue(state, modifierFn);
}

window.docu = { Entity, append, Listener, State, dynamicValue, jsxEntity };
