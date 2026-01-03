import { isString } from 'lodash-es';
import { append, ensureValidChildObject, flatDOMNodeArray } from './utils'

/* class DynamicEntity
 *
 * When a DynamicValue is used in a context where a DOM node should be then a DynamicEntity
 * gets created to keep track of the value so that it can be replaced when the value changes.
 * This can be because of JSX interpolation for example:
 * ```
 *   <div>{dynamicValue(state, (val) => <p>{val}</p>)}</div>
 * ```
 * Or by passing a dynamic entity to append, for example:
 * ```
 *   append(document.body, dynamicValue(state, (val) => <p>{val}</p>));
 * ```
 *
 * The value of the DynamicValue must be one of the following types:
 * - Entity (aka the return value of a JSX element)
 * - Fragment (aka the return value a JSX fragment)
 * - A plain DOM node
 * - A string (which will be converted to a TextNode)
 * - An array or array like object (which will be converted to a fragment)
 *
 * The type is checked both when DynamicEntity is created and and when the DynamicValue changes.
 */
class DynamicEntity {
  constructor(dynamicValue) {
    this.dynamicValue = dynamicValue;
    this.entity = ensureValidChildObject(dynamicValue.currentValue());
  }

  /* DynamicEntity#appendTo(parent)
   *
   * This method appends the initial value (which should be an Entity, Fragment, or Node)
   * to the parent that was passed in, then it registers a callback with the DynamicValue
   * so that when the value changes the replaceEntity method of this DynamicEntity is automatically
   * called and passed the new value.
   */
  appendTo($appendable) {
    append($appendable, this.entity);
    this.dynamicValue.onChange((newEntity) => {
      this.replaceEntity(ensureValidChildObject(newEntity));
    });
  }

  /* DynamicEntity#replaceEntity(newValue)
   *
   * First we check to make sure the new value is a separate object from the current entity
   * If they do not match we continue and insert the DOM Node(s) for the new value after
   * the current entity, then we remove the current entity from the DOM and finally we set
   * this.entity to the new entity.
   */
  replaceEntity(newEntity) {
    if (this.entity === newEntity) return;

    const newNodes = flatDOMNodeArray([newEntity]);

    this.entity.after(...newNodes);
    this.entity.remove();
    this.entity = newEntity;
  }
}

export default DynamicEntity;
