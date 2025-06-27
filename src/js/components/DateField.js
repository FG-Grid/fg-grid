(() => {
  class DateField extends Fancy.Field {
    value = '';
    type = 'date';

    constructor(config) {
      super(config);

      const me = this;
      Object.assign(me, config);

      me.render();
      me.ons();
    }
  }

  Fancy.DateField = DateField;

})();
