(() => {
  const { FIELD, FIELD_INPUT } = Fancy.cls;
  const { ENTER, ESC } = Fancy.key;
  const { div, input } = Fancy;

  class Field {
    render() {
      const me = this;
      const el = div(FIELD, me.style);

      delete me.style;

      if(typeof me.renderTo === 'string'){
        me.renderTo = document.getElementById(me.renderTo);
      }

      me.container = me.renderTo;

      const elInput = input(FIELD_INPUT);
      if(me.type === 'date') (elInput.type = 'date');
      elInput.value = me.value;
      me.input = elInput;

      el.appendChild(elInput);
      me.el = el;

      me.container.appendChild(el);
    }
    ons() {
      const me = this;

      // me.debounceInputFn = Fancy.debounce(me.onInput.bind(this), 300);
      // me.input.addEventListener('input', me.debounceInputFn);
      me.input.addEventListener('input', me.onInput.bind(me));
      me.input.addEventListener('keydown', me.onKeyDown.bind(me));
    }
    onInput(event) {
      const value = event.target.value;

      this.onChange?.(value, true);
    }
    onKeyDown(event){
      switch (event.keyCode) {
        case ENTER:
          const value = event.target.value;
          this.onEnter?.(value);
          break;
        case ESC:
          this.onESC?.();
          break;
      }
    }
    setValue(value) {
      this.input.value = value;
      this.onChange?.(value, false);
    }
    focus(){
      this.input.focus();
    }
    hide(){
      this.el.style.display = 'none';
    }
    show(style){
      this.el.style.display = '';

      for(let p in style){
        this.el.style[p] = style[p];
      }
    }
  }

  Fancy.Field = Field;
})();
