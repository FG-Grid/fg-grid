(() => {
  const {
    FIELD,
    FIELD_INPUT
  } = Fancy.cls;

  const {
    ENTER,
    ESC
  } = Fancy.key;

  class DateField {
    value = '';

    constructor(config) {
      const me = this;

      Object.assign(me, config);

      me.render();
      me.ons();
    }

    render() {
      const me = this;
      const el = document.createElement('div');

      if(typeof me.renderTo === 'string'){
        me.renderTo = document.getElementById(me.renderTo);
      }

      if(me.style){
        for(let p in me.style){
          el.style[p] = me.style[p];
        }

        delete me.style;
      }

      me.container = me.renderTo;

      el.classList.add(FIELD);

      const elInput = document.createElement('input');
      elInput.type = 'date';
      elInput.classList.add(FIELD_INPUT);
      elInput.value = me.value;
      me.input = elInput;

      el.appendChild(elInput);
      me.el = el;

      me.container.appendChild(el);
    }

    ons() {
      const me = this;

      me.input.addEventListener('input', me.onInput.bind(me));
      me.input.addEventListener('keydown', me.onKeyDown.bind(me));
    }

    onInput(event) {
      const me = this;
      const value = event.target.value;

      me.onChange?.(value, true);
    }

    onKeyDown(event){
      const me = this;

      switch (event.keyCode) {
        case ENTER:
          const value = event.target.value;
          me.onEnter?.(value);
          break;
        case ESC:
          me.onESC?.();
          break;
      }
    }

    setValue(value) {
      const me = this;

      me.input.value = value;

      me.onChange?.(value, false);
    }

    show(style){
      const me = this;

      me.el.style.display = '';

      for(let p in style){
        me.el.style[p] = style[p];
      }
    }

    focus(){
      const me = this;

      me.input.focus();
    }

    hide(){
      const me = this;

      me.el.style.display = 'none';
    }
  }

  Fancy.DateField = DateField;

})();
