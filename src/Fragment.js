import { isString } from 'lodash-es';
import { ensureValidChildObject, getDOMNode } from './utils';

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
    this.children = children
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

    if (this.previousNode) {
      this.previousNode.after(...args);
      return;
    }

    if (this.parent) {
      this.parent.append(...args);
      return;
    }

    throw (
      'Failed to insert dom node(s) after a fragment due to insufficient context:\n' +
      `  dom nodes: ${args}.`
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

  /* Fragment#appendChild(childNode)
   *
   * adds the specified node to the fragment at the end.
   */
  appendChild(child) {
    const childObject = ensureValidChildObject(child);
    this.after(getDOMNode(childObject));
    this.children.push(childObject);
  }
}

export default Fragment
