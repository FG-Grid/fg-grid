(() => {
  class NumberField extends Fancy.Field {
    value = '';
    type = 'number';
    constructor(config) {
      super(config);

      const me = this;
      Object.assign(me, config);

      me.render();
      me.ons();
    }
  }

  Fancy.NumberField = NumberField;
})();
