import { isString } from 'lodash-es';
import { append } from './utils'

function ensureEntity(value) {
  if (value.isDocuEntity || value instanceof Node) {
    return value;
  }

  if (isString(value)) {
    return document.createTextNode(value);
  }

  throw ('Dynamic value in child element context must be set to ' +
	 'a docu Entity, a string, or a DOM Node');
}

class DynamicEntity {
  constructor(dynamicValue) {
    this.dynamicValue = dynamicValue;
    this.entity = ensureEntity(dynamicValue.currentValue());
  }

  replaceEntity(newEntity) {
    const newNode = newEntity.isDocuEntity ? newEntity.$el : newEntity;
    
    this.entity.after(newNode);
    this.entity.remove();
    this.entity = newEntity
  }

  appendTo($appendable) {
    append($appendable, this.entity);
    this.dynamicValue.onChange((newEntity) => {
      this.replaceEntity(ensureEntity(newEntity));
    });
  }
}

export default DynamicEntity;
