import { isString } from 'lodash-es';
import { append, ensureValidChildObject, flatDOMNodeArray } from './utils'

/* class DynamicEntity
 *
 * When a dynamic value is used in a context that should where a DOM should be then a DynamicEntity
 * gets created to keep track of the value so that it can be replaced when the value changes.
 * This can be because of JSX interpolation for example:
 * ```
 *   <div>{dynamicValue(state, (val) => <p>{val}</p>)}</div>
 * ```
 * Or by passing a dynamic entity to append, for example:
 * ```
 *   append(document.body, dynamicValue(state, (val) => <p>{val}</p>));
 * ```
 * Regardless the value can be any of (TODO: list types after addressing FIXME below)
 */
class DynamicEntity {
  constructor(dynamicValue) {
    this.dynamicValue = dynamicValue;
    // FIXME: this currently allows the DynamicValue to have a current value that is
    //        another DynamicValue.. we should prevent that
    this.entity = ensureValidChildObject(dynamicValue.currentValue());
  }

  replaceEntity(newEntity) {
    if (this.entity === newEntity) return;

    const newNodes = flatDOMNodeArray([newEntity]);

    this.entity.after(...newNodes);
    this.entity.remove();
    this.entity = newEntity;
  }

  appendTo($appendable) {
    append($appendable, this.entity);
    this.dynamicValue.onChange((newEntity) => {
      // FIXME: this currently allows the DynamicValue to have a current value that is
      //        another DynamicValue.. we should prevent that
      this.replaceEntity(ensureValidChildObject(newEntity));
    });
  }
}

export default DynamicEntity;
