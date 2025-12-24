import { isString } from 'lodash-es';
import { ensureValidChildObject, getDOMNode } from './utils';

class Fragment {
  constructor(children) {
    this.children = children
  }

  last() {
    return this.children[this.children.length - 1];
  }

  after(...args) {
    this.last().after(...args);
  }

  remove() {
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].remove();
    }
  }

  appendChild(child) {
    const childObject = ensureValidChildObject(child);
    this.last().after(getDOMNode(childObject));
    this.children.push(childObject);
  }
}

export default Fragment
