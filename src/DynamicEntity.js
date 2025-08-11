import { isString } from 'lodash';
import { append } from './utils'

// TODO: consider more robust validation and/or rename this function
function ensureEntity(value) {
  if (isString(value)) {
    return document.createTextNode(value);
  }

  return value;
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
