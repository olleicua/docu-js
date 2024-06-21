import { append } from './utils'

class DynamicEntity {
  constructor(dynamicValue) {
    this.dynamicValue = dynamicValue;
    this.entity = dynamicValue.currentValue();
  }

  appendTo($appendable) {
    append($appendable, this.entity);
    // FIXME: define a method on DynamicValue that can be used here to make this
    //        work with multistate values
    this.dynamicValue.state.listener.listen((newValue) => {
      const newEntity = this.dynamicValue.currentValue();
      this.entity.after(newEntity);
      this.entity.remove();
      this.entity = newEntity;
    });
  }
}

export default DynamicEntity;
