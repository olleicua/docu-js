import { isString } from 'lodash-es';
import { append, ensureValidChildObject, flatDOMNodeArray } from './utils'

/* class DynamicNode
 *
 * When a DynamicValue is used in a context where a DOM node should be then a DynamicNode
 * gets created to keep track of the value so that it can be replaced when the value changes.
 * This can be because of JSX interpolation for example:
 * ```
 *   <div>{dynamicValue(state, (val) => <p>{val}</p>)}</div>
 * ```
 * Or by passing a dynamic node to append, for example:
 * ```
 *   append(document.body, dynamicValue(state, (val) => <p>{val}</p>));
 * ```
 *
 * The value of the DynamicValue must be one of the following types:
 * - Fragment (aka the return value a JSX fragment)
 * - A plain DOM node
 * - A string (which will be converted to a TextNode)
 * - An array or array like object (which will be converted to a fragment)
 *
 * The type is checked both when DynamicNode is created and and when the DynamicValue changes.
 */
class DynamicNode {
  constructor(dynamicValue) {
    this.dynamicValue = dynamicValue;
    this.node = ensureValidChildObject(dynamicValue.currentValue());
  }

  /* DynamicNode#appendTo(parent)
   *
   * This method appends the initial value (which should be an Fragment or Node)
   * to the parent that was passed in, then it registers a callback with the DynamicValue
   * so that when the value changes the replaceNode method of this DynamicNode is automatically
   * called and passed the new value.
   */
  appendTo($appendable) {
    append($appendable, this.node);
    this.dynamicValue.onChange((newNode) => {
      this.replaceNode(ensureValidChildObject(newNode));
    });
  }

  /* DynamicNode#replaceNode(newValue)
   *
   * First we check to make sure the new value is a separate object from the current node
   * If they do not match we continue and insert the DOM Node(s) for the new value after
   * the current node, then we remove the current node from the DOM and finally we set
   * this.node to the new node.
   */
  replaceNode(newNode) {
    if (this.node === newNode) return;

    const newNodes = flatDOMNodeArray([newNode]);

    this.node.after(...newNodes);
    this.node.remove();
    this.node = newNode;
  }
}

export default DynamicNode;
