import { isString } from 'lodash-es';
import { append, ensureValidChildObject, flatDOMNodeArray } from './utils'

class DynamicEntity {
  constructor(dynamicValue) {
    this.dynamicValue = dynamicValue;
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
      this.replaceEntity(ensureValidChildObject(newEntity));
    });
  }
}

export default DynamicEntity;
