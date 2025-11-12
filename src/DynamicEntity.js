import { isString } from 'lodash';
import { append } from './utils'

function ensureEntity(value) {
  if (isString(value)) {
    return document.createTextNode(value);
  }

  if (value.isDocuEntity || obj instanceof Node) {
    return value;
  }

  throw ('Dynamic value in child element context must be set to ' +
	 'a docu Entity, a string, or a DOM Node');
}

class DynamicEntity {
  constructor(dynamicValue) {
    this.dynamicValue = dynamicValue;
    this.entity = ensureEntity(dynamicValue.currentValue());
  }

  appendTo($appendable) {
    append($appendable, this.entity);
    this.dynamicValue.onChange((newEntity) => {
      const confirmedNewEntity = ensureEntity(newEntity);
      this.entity.after(confirmedNewEntity);
      this.entity.remove();
      this.entity = confirmedNewEntity;
    });
  }
}

export default DynamicEntity;
