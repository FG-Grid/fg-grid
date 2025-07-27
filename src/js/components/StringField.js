(() => {
  class StringField extends Fancy.Field {
    value = '';
    type = 'string';
    constructor(config) {
      super(config);

      Object.assign(this, config);

      this.render();
      this.ons();
    }
  }

  Fancy.StringField = StringField;
})();
