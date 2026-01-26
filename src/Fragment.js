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

  /* Fragment#last()
   *
   * returns the last child.
   */
  last() {
    return this.children[this.children.length - 1];
  }

  /* Fragment#after(...nodes)
   *
   * adds the nodes specified in the arguments to the DOM after the last node in the fragment.
   */
  after(...args) {
    this.last().after(...args);
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
    this.last().after(getDOMNode(childObject));
    this.children.push(childObject);
  }
}

export default Fragment
