import { isString } from 'lodash-es';
import State from './State';
import DynamicValue from './DynamicValue';
import DynamicNode from './DynamicNode';
import { ensureValidChildObject, getDOMNode, flatDOMNodeArray } from './utils';

/* class Fragment
 *
 * used handle an array of sibling DOM Nodes without the need for an unneccessary parent node.
 * called by the JSX compiler when empty angle brackets are used, for example:
 * ```
 * const foo = <><span>abc</span><span>def</span></>;
 * ```
 * will create a new Fragment with two children.
 */
class Fragment {
  constructor(children) {
    this.children = [];

    children.forEach(child => this.appendChild(child));
  }

  /* Fragment#prepareNode(object)
   *
   * if the object is a State or DynamicValue then create a DynamicNode tied to this fragment
   * and return its node
   * otherwise return ensureValidChildObject(object)
   */
  prepareNode(object) {
    if (object instanceof State || object instanceof DynamicValue) {
      const dynamicNode = new DynamicNode(
        (object instanceof DynamicValue) ? object : new DynamicValue(object)
      );

      dynamicNode.fragmentParent = this;
      return dynamicNode.node;
    }

    return ensureValidChildObject(object);
  }

  /* Fragment#appendChild(child)
   *
   * adds the child to the end of the fragment if it is a node
   * creates a dynamic node tied to this fragment if the child is a State or DynamicValue
   * inserts the child into an a DOM tree iff the fragment has a parentNode
   */
  appendChild(child) {
    const childNode = this.prepareNode(child);

    if (this.parentNode) {
      this.after(...flatDOMNodeArray([childNode]));
    }

    this.children.push(childNode);
  }

  /* Fragment#isEmpty()
   *
   * returns true if there are zero children
   */
  isEmpty() {
    return this.children.length === 0;
  }

  /* Fragment#last()
   *
   * returns the last child.
   */
  last() {
    if (this.isEmpty()) {
      return null;
    }

    return this.children[this.children.length - 1];
  }

  /* Fragment#after(...nodes)
   *
   * adds the nodes specified in the arguments to the DOM after the last node in the fragment.
   */
  after(...args) {
    if (!this.isEmpty()) {
      this.last().after(...args);
      return;
    }

    if (this.previousSibling) {
      this.previousSibling.after(...args);
      return;
    }

    if (this.nextSibling) {
      this.nextSibling.before(...args);
      return;
    }

    if (this.parentNode) {
      this.parentNode.append(...args);
      return;
    }

    throw (
      'Failed to insert dom node(s) after a fragment due to insufficient context:\n' +
      `  dom node(s): ${args}.`
    );
  }

  /* Fragment#remove()
   *
   * removes all of the nodes in the fragment from the DOM
   */
  remove() {
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].remove();
    }
  }
}

export default Fragment
