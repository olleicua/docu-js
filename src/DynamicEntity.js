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

  appendTo($appendable) {
    append($appendable, this.entity);
    console.log({ entity: this.entity });
    this.dynamicValue.onChange((newEntity) => {
      console.log(document.body.innerHTML);
      console.log({ newEntity });
      const confirmedNewEntity = ensureEntity(newEntity);
      console.log({ confirmedNewEntity });
      this.entity.after(confirmedNewEntity);
      this.entity.remove();
      this.entity = confirmedNewEntity;
      console.log(document.body.innerHTML);
    });
  }
}

export default DynamicEntity;
