(() => {
  class StringField extends Fancy.Field {
    value = '';
    type = 'string';
    constructor(config) {
      super(config);

      const me = this;
      Object.assign(me, config);

      me.render();
      me.ons();
    }
  }

  Fancy.StringField = StringField;
})();
