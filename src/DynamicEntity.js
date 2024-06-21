import { append } from './utils'

class DynamicEntity {
  constructor(dynamicValue) {
    this.dynamicValue = dynamicValue;
    this.entity = dynamicValue.currentValue();
  }

  appendTo($appendable) {
    append($appendable, this.entity);
    this.dynamicValue.onChange((newEntity) => {
      this.entity.after(newEntity);
      this.entity.remove();
      this.entity = newEntity;
    });
  }
}

export default DynamicEntity;
