import { isString } from 'lodash-es';
import DynamicValue from './DynamicValue';
import DynamicNode from './DynamicNode';
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
    this.children = children.map((child) => {
      // TODO: the DynamicNode needs to register that it is used in a Fragment so that the Fragment can be updated
      if (child instanceof DynamicValue) {
	// TODO: we may want DynamicValue to have exactly one DynamicNode to prevent excess object proliferation and reign in memory usage
        return new DynamicNode(child).node;
      }

      return ensureValidChildObject(child);
    });
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
