import { keys, isObject, isPlainObject, isArrayLike, isString, includes } from 'lodash';

function addChildrenToElement($appendable, children) {
	if (!isArrayLike(children)) {
		throw 'children property is not an array';
	}

	let i, child;
	for (i = 0; i < children.length; i++) {
		child = children[i];
		append($appendable, child);
	}
}

function isAppendable(object) {
	return typeof object.appendChild === 'function';
}

const alwaysLowerCasePropertyNames = [
	'onclick',
	'onkeyup'
];
function normalizePropertyName(key) {
	if (includes(alwaysLowerCasePropertyNames, key.toLowerCase())) {
		return key.toLowerCase();
	}

	return key;
}

function assign(object, nestedProperties) {
	if (!isPlainObject(nestedProperties)) {
		throw 'Entity can only be assigned using a plain object';
	}

	const propertyKeys = keys(nestedProperties);
  let i, key, value;
  for (i = 0; i < propertyKeys.length; i++) {
    key = propertyKeys[i];
		value = nestedProperties[key];
		if (key === 'children' && isAppendable(object)) {
			addChildrenToElement(object, value);
		} else if (isObject(object[key])) {
      assign(object[key], value);
    } else if (value instanceof Dynamicvalue) {
      object[normalizePropertyName(key)] = value.state.value;
			value.onChange((newValue) => {
				object[normalizePropertyName(key)] = newValue;
			});
		} else {
      object[normalizePropertyName(key)] = value;
    }
  }
}

function append(parent, child) {
	const $parent = (parent instanceof Entity) ? parent.$el : parent;

	if (child instanceof Entity) {
		$parent.appendChild(child.$el);
	} else if (isString(child)) {
		$parent.appendChild(document.createTextNode(child));
	} else {
		$parent.appendChild(child);
	}
}

class Entity {
  constructor(first, second) {
		const tagName = (typeof first === 'string') ? first : 'div';
		const properties = (typeof first === 'string') ? second : first;

		this.$el = document.createElement(tagName);
    assign(this.$el, properties);
  }
  
  update(properties) {
    assign(this.$el, properties);
  }
}

class Listener {
	constructor() {
		this.listeners = [];
	}

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

	dynamicValue(modifierFn) {
		return new DynamicValue(this, modifierFn);
	}
}

class DynamicValue {
	constructor(state, modifierFn) {
		this.state = state;
		this.modifierFn = modifierFn || ((value) => value);
	}

	onChange(fn) {
		this.state.listener.listen((newValue) => {
			fn(modifierFn(newValue));
		});
	}
}

window.docu = { Entity, append, Listener, State };
