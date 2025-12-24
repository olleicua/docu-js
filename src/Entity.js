import { assign, getDOMNode, flatDOMNodeArray } from './utils';

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

  after(...args) {
    this.$el.after(...flatDOMNodeArray(args));
  }

  remove() {
    this.$el.remove();
  }

  appendChild(child) {
    this.$el.appendChild(getDOMNode(child));
  }
}

export default Entity;
