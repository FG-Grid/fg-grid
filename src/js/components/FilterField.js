(() => {
  const {
    FILTER_FIELD,
    FILTER_FIELD_INPUT,
    FILTER_FIELD_SIGN,
    FILTER_FIELD_LIST_ITEM,
    FILTER_FIELD_LIST_ITEM_TEXT,
    FILTER_FIELD_LIST,
    FILTER_FIELD_TEXT
  } = Fancy.cls;

  const FancyIconSignPaths = {
    'Clear': 'M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z',
    'Contains': 'M19,10H5V8H19V10M19,16H5V14H19V16Z',
    'Not Contains': 'M21,10H9V8H21V10M21,16H9V14H21V16M4,5H6V16H4V5M6,18V20H4V18H6Z',
    'Equals': 'M 10.56 10 L 1.508 10 L 1.508 8 L 10.56 8 L 10.56 10 M 10.56 16 L 1.508 16 L 1.508 14 L 10.56 14 L 10.56 16 Z M 22.009 10.01 L 12.984 10.01 L 12.984 8.01 L 22.009 8.01 L 22.009 10.01 M 22.009 16.01 L 12.984 16.01 L 12.984 14.01 L 22.009 14.01 L 22.009 16.01 Z',
    'Not Equals': 'M 12.368 10 L 5.449 10 L 5.449 8 L 12.368 8 L 12.368 10 M 12.368 16 L 5.449 16 L 5.449 14 L 12.368 14 L 12.368 16 Z M 23.009 10.01 L 15.05 10.01 L 15.05 8.01 L 23.009 8.01 L 23.009 10.01 M 23.009 16.01 L 15.05 16.01 L 15.05 14.01 L 23.009 14.01 L 23.009 16.01 Z M 2.585 4.076 L 2.575 13.265 L 0.54 13.277 L 0.55 4.087 L 2.585 4.076 M 6.653 13.252 L 6.621 13.255 L 6.649 13.243 L 6.616 13.239 L 6.653 13.252 Z M 2.569 15.074 L 2.559 17.22 L 0.524 17.223 L 0.534 15.077 L 2.569 15.074 M 6.637 17.217 L 6.605 17.218 L 6.633 17.215 L 6.6 17.214 L 6.637 17.217 Z',
    'Empty': 'M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z',
    'Not Empty': 'M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z',
    'Starts with': 'M11.14 4L6.43 16H8.36L9.32 13.43H14.67L15.64 16H17.57L12.86 4M12 6.29L14.03 11.71H9.96M4 18V15H2V20H22V18Z',
    'Ends with': 'M11.14 4L6.43 16H8.36L9.32 13.43H14.67L15.64 16H17.57L12.86 4M12 6.29L14.03 11.71H9.96M20 14V18H2V20H22V14Z',
    'Regex': 'M16,16.92C15.67,16.97 15.34,17 15,17C14.66,17 14.33,16.97 14,16.92V13.41L11.5,15.89C11,15.5 10.5,15 10.11,14.5L12.59,12H9.08C9.03,11.67 9,11.34 9,11C9,10.66 9.03,10.33 9.08,10H12.59L10.11,7.5C10.3,7.25 10.5,7 10.76,6.76V6.76C11,6.5 11.25,6.3 11.5,6.11L14,8.59V5.08C14.33,5.03 14.66,5 15,5C15.34,5 15.67,5.03 16,5.08V8.59L18.5,6.11C19,6.5 19.5,7 19.89,7.5L17.41,10H20.92C20.97,10.33 21,10.66 21,11C21,11.34 20.97,11.67 20.92,12H17.41L19.89,14.5C19.7,14.75 19.5,15 19.24,15.24V15.24C19,15.5 18.75,15.7 18.5,15.89L16,13.41V16.92H16V16.92M5,19A2,2 0 0,1 7,17A2,2 0 0,1 9,19A2,2 0 0,1 7,21A2,2 0 0,1 5,19H5Z',
    'Greater Than': 'M5.5,4.14L4.5,5.86L15,12L4.5,18.14L5.5,19.86L19,12L5.5,4.14Z',
    'Less Than': 'M18.5,4.14L19.5,5.86L8.97,12L19.5,18.14L18.5,19.86L5,12L18.5,4.14Z'
  };

  const FancyTextSign = {
    'Clear': '=',
    'Contains': '=',
    'Not Contains': '!=',
    'Equals': '==',
    'Not Equals': '!==',
    'Empty': 'empty',
    'Not Empty': '!empty',
    'Starts with': 'a_',
    'Ends with': '_a',
    'Regex': 'regex',
    'Greater Than': '>',
    'Less Than': '<',
    'Positive': '+',
    'Negative': '-'
  };

  const FancySignText = {
    '=': 'Clear',
    '=': 'Contains',
    '!=': 'Not Contains',
    '==': 'Equals',
    '!==': 'Not Equals',
    'empty': 'Empty',
    '!empty': 'Not Empty',
    'a_': 'Starts with',
    '_a': 'Ends with',
    'regex': 'Regex',
    '>': 'Greater Than',
    '<': 'Less Than',
    '+': 'Positive',
    '-': 'Negative'
  };

  const {
    div,
    input
  } = Fancy;

  class FilterField {
    sign = '=';
    defaultSign = '=';
    value = '';
    constructor(config) {
      Object.assign(this, config);

      this.render();
      this.ons();
    }
    render() {
      const me = this;
      const el = div(FILTER_FIELD);

      me.container = me.renderTo;

      const elSign = div(FILTER_FIELD_SIGN);
      elSign.innerHTML = [
        '<svg width="17" height="17" viewBox="0 0 24 24" style="vertical-align: middle; fill: currentcolor;">',
        '<path d=""></path>',
        '</svg>'
      ].join('');
      me.elSign = elSign;

      const elInput = input(FILTER_FIELD_INPUT);
      elInput.value = me.value;
      me.input = elInput;

      const elText = div(FILTER_FIELD_TEXT);
      me.elText = elText;

      me.updateUI(FancySignText[me.sign || me.defaultSign]);

      el.append(elSign, elInput, elText);
      me.el = el;

      me.container.appendChild(el);
    }
    ons() {
      const me = this;

      me.debouceInputFn = Fancy.debounce(me.onInput.bind(this), 300);
      me.input.addEventListener('input', me.debouceInputFn);
      me.input.addEventListener('focus', me.#onFocus.bind(this));
      me.elSign.addEventListener('click', me.signClick.bind(this));
    }
    uns(){
      const me = this;

      me.input.removeEventListener('input', me.debouceInputFn);
      me.input.removeEventListener('focus', me.#onFocus.bind(this));
      me.elSign.removeEventListener('click', me.signClick.bind(this));
    }
    destroy() {
      const me = this;

      me.uns();
      me.destroyComboList();
      me.el.remove();
    }
    signClick() {
      const me = this;

      if(!me.column.type){
        console.warn('FG-Grid: To use column header filter, column type should be set');
        return;
      }

      if (!me.elComboList) {
        requestAnimationFrame(() => {
          me.hideAllOpenedComboList();
          me.showComboList();
        });
      } else {
        me.destroyComboList();
      }
    }
    #onFocus(event){
      const me = this;

      me.onFocus?.();
    }
    onInput(event) {
      const me = this;
      const sign = me.sign || me.defaultSign;
      const value = event.target.value;

      !me.preventFire && me.onChange?.(value, sign, me.column, me.signWasChanged);
      delete me.signWasChanged;
    }
    hideAllOpenedComboList(){
      document.body.querySelectorAll(`.${FILTER_FIELD_LIST}`).forEach(el => {
        el.remove();
      });
    }
    destroyComboList() {
      this.elComboList?.remove();
      delete this.elComboList;
    }
    showComboList() {
      const me = this;
      const elSignRect = me.elSign.getBoundingClientRect();
      const top = elSignRect.top - 1 + elSignRect.height;
      const left = elSignRect.left;
      const el = div([FILTER_FIELD_LIST, 'fg-theme-' + me.theme], {
        top: `${top}px`,
        left: `${left}px`
      });

      let signs = [];

      switch(me.column.type){
        case 'string':
          signs = ['Clear', 'Contains', 'Not Contains', 'Equals', 'Not Equals', 'Empty', 'Not Empty', 'Starts with', 'Ends with', 'Regex'];
          break;
        case 'number':
          signs = ['Clear', 'Contains', 'Not Contains', 'Equals', 'Not Equals', 'Empty', 'Not Empty', 'Greater Than', 'Less Than', 'Positive', 'Negative'];
          break;
      }

      el.innerHTML = signs.map(sign => {
        let innerHTML = [`<div sign="${sign}" class="${FILTER_FIELD_LIST_ITEM}">`];

        innerHTML.push('<svg width="17" height="17" viewBox="0 0 24 24" style="vertical-align: middle; fill: currentcolor;">');

        switch (sign) {
          case 'Clear':
          case 'Contains':
          case 'Not Contains':
          case 'Equals':
          case 'Not Equals':
          case 'Empty':
          case 'Not Empty':
          case 'Starts with':
          case 'Ends with':
          case 'Regex':
          case 'Greater Than':
          case 'Less Than':
            innerHTML.push(`<path d="${FancyIconSignPaths[sign]}"></path>`);
            innerHTML.push('</svg>');
            break;
          case 'Positive':
            innerHTML.pop();
            innerHTML.push('&gt;0');
            break;
          case 'Negative':
            innerHTML.pop();
            innerHTML.push('&lt;0');
            break;
        }

        const signText = me.lang.sign[Fancy.toCamelCase(sign.toLowerCase())];

        innerHTML.push(`<div class="${FILTER_FIELD_LIST_ITEM_TEXT}">${signText}</div>`);
        innerHTML.push('</div>');

        return innerHTML.join('');
      }).join('');

      el.addEventListener('click', me.onListClick.bind(this));
      document.body.appendChild(el);
      me.elComboList = el;
      me.onDocMouseDownFn = me.onDocMouseDown.bind(this);

      document.addEventListener('mousedown', me.onDocMouseDownFn);
    }
    onDocMouseDown(e) {
      const me = this;

      if (!e.target.closest(`.${FILTER_FIELD_LIST}`) && !e.target.closest(`.${FILTER_FIELD_SIGN}`)) {
        document.removeEventListener('mousedown', me.onDocMouseDownFn);
        me.destroyComboList();
      }
    }
    onListClick(e) {
      const me = this;
      const itemEl = e.target.closest(`.${FILTER_FIELD_LIST_ITEM}`);
      const sign = itemEl.getAttribute('sign');

      me.destroyComboList();
      me.setSign(sign);
      me.setValue('');
    }
    setValue(value, fire = true) {
      const me = this;
      const sign = me.sign || me.defaultSign;

      switch (sign) {
        case 'empty':
        case '!empty':
        case '+':
        case '-':
          value = sign;
          break;
        default:
          me.input.value = value;
      }

      fire && me.onChange?.(value, sign, me.column, me.signWasChanged);
      delete me.signWasChanged;
    }
    clearValue(preventFire = false) {
      const me = this;

      if(preventFire) (me.preventFire = true);
      me.input.value = '';
      me.setSign('Clear');
      delete me.preventFire;
    }
    setSign(sign) {
      const me = this;
      const prevSign = me.sign;

      if(FancySignText[sign]){
        sign = FancySignText[sign];
      }

      me.sign = FancyTextSign[sign] || sign;
      if(prevSign !== me.sign){
        me.signWasChanged = true;
      }
      me.updateUI(sign);
    }
    updateUI(sign) {
      const me = this;

      switch (sign) {
        case 'Clear':
        case 'Contains':
        case 'Not Contains':
        case 'Equals':
        case 'Not Equals':
        case 'Empty':
        case 'Not Empty':
        case 'Starts with':
        case 'Ends with':
        case 'Regex':
        case 'Greater Than':
        case 'Less Than':
          const svgPathEl = me.elSign.querySelector('svg d');
          const path = sign === 'Clear' ? FancyIconSignPaths['Contains'] : FancyIconSignPaths[sign];

          if (svgPathEl) {
            svgPathEl.setAttribute('d', path);
          } else {
            me.elSign.innerHTML = [
              '<svg width="17" height="17" viewBox="0 0 24 24" style="vertical-align: middle; fill: currentcolor;">',
              `<path d="${path}"></path>`,
              '</svg>'
            ].join('');
          }
          break;
        case 'Positive':
          me.elSign.innerHTML = '&gt;0';
          break;
        case 'Negative':
          me.elSign.innerHTML = '&lt;0';
          break;
      }

      switch (sign) {
        case 'Empty':
        case 'Not Empty':
        case 'Positive':
        case 'Negative':
          me.input.style.display = 'none';
          me.elText.innerHTML = sign;
          me.elText.style.display = 'block';
          break;
        default:
          me.input.style.display = '';
          me.elText.style.display = 'none';
      }
    }
  }

  Fancy.FilterField = FilterField;
})();
