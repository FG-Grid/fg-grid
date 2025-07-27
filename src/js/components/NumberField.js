(() => {
  class NumberField extends Fancy.Field {
    value = '';
    type = 'number';
    constructor(config) {
      super(config);

      Object.assign(this, config);

      this.render();
      this.ons();
    }
  }

  Fancy.NumberField = NumberField;
})();
