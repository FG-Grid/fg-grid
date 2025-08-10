(() => {
  const {
    HIDDEN,
    FIELD,
    FIELD_COMBO,
    FIELD_COMBO_BUTTON,
    FIELD_DISABLED,
    FIELD_INPUT,
    FIELD_COMBO_LIST,
    FIELD_COMBO_LIST_ITEM,
    FIELD_COMBO_LIST_ITEM_ACTIVE,
    FIELD_COMBO_LIST_ITEM_SELECTED,
    FIELD_COMBO_LIST_ITEM_TEXT
  } = Fancy.cls;
  const { ENTER, ESC, UP, DOWN } = Fancy.key;
  const { div, input } = Fancy;

  const FancyIconPaths = {
    chevron: 'M11.293 6.293a1 1 0 0 1 1.414 1.414l-4 4a1 1 0 0 1-1.414 0l-4-4a1 1 0 0 1 1.414-1.414L8 9.586l3.293-3.293z'
  };

  class Combo extends Fancy.Field {
    value = '';
    theme = 'default';
    disabled = false;
    typing = true;
    filtering = true;
    filterType = 'matchAny'; // 'match' || 'matchAny'
    caseSensitive = false;
    minListWidth = 120;
    constructor(config) {
      super(config);
      Object.assign(this, config);

      this.render();
      this.ons();
    }
    render() {
      const me = this;
      const cls = [FIELD, FIELD_COMBO, 'fg-theme-' + me.theme];

      (me.disabled || me.typing === false ) && cls.push(FIELD_DISABLED);

      const el = div(cls, me.style);
      delete me.style;

      if(typeof me.renderTo === 'string'){
        me.renderTo = document.getElementById(me.renderTo);
      }

      me.container = me.renderTo;

      const elButton = div(FIELD_COMBO_BUTTON);
      elButton.innerHTML = [
        '<svg width="16px" height="16px" viewBox="0 0 16 16" style="vertical-align: middle; fill: currentcolor;">',
        `<path d="${FancyIconPaths.chevron}"></path>`,
        '</svg>'
      ].join('');
      me.elButton = elButton;

      const elInput = input(FIELD_INPUT);
      elInput.value = me.value;
      me.input = elInput;

      if(me.disabled || me.typing === false){
        me.input.disabled = true;
      }

      el.append(elInput, elButton);
      me.el = el;

      me.container.appendChild(el);
      me.showComboList();
    }
    ons() {
      const me = this;

      me.abortController = new AbortController();
      const { signal } = me.abortController;

      const debounceInputFn = Fancy.debounce(me.onInput.bind(this), 300);
      me.input.addEventListener('input', debounceInputFn, { signal });
      me.input.addEventListener('focus', me.#onFocus.bind(this), { signal });
      me.elButton.addEventListener('click', me.buttonClick.bind(this), { signal });
      me.input.addEventListener('keydown', me.onKeyDown.bind(me), { signal });
    }
    uns(){
      this.abortController.abort();
    }
    destroy() {
      const me = this;

      me.uns();
      me.destroyComboList();
      me.el.remove();
    }
    buttonClick() {
      const me = this;

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
      const value = event.target.value;

      me.onChange?.(value, true);
      if(me.filtering){
        if(!me.elComboList){
          me.showComboList(true);
        } else {
          me.filterItems();
        }
        me.setActiveItem();
      }
    }
    onKeyDown(event){
      switch (event.keyCode) {
        case ENTER:
          let value = event.target.value;

          const activeItem = this.elComboList?.querySelector(`.${FIELD_COMBO_LIST_ITEM_ACTIVE}`);
          const itemTextEl = activeItem?.querySelector(`.${FIELD_COMBO_LIST_ITEM_TEXT}`);
          if(itemTextEl){
            value = itemTextEl?.innerHTML;
            if(value === '&nbsp;'){
              value = '';
            }
          }

          this.onEnter?.(value);
          break;
        case ESC:
          this.onESC?.();
          break;
        case UP:
          this.onUP(event);
          break;
        case DOWN:
          this.onDOWN(event);
          break;
      }
    }
    hideAllOpenedComboList(){
      document.body.querySelectorAll(`.${FIELD_COMBO_LIST}`).forEach(el => {
        el.remove();
      });
    }
    hide(){
      super.hide();
      this.destroyComboList();
    }
    show(style){
      super.show(style);
      this.showComboList();
    }
    destroyComboList() {
      this.elComboList?.remove();
      delete this.elComboList;
    }
    showComboList(filtering = false) {
      const me = this;
      const elRect = me.el.getBoundingClientRect();
      let top = elRect.top + window.scrollY - 1 + elRect.height;
      let left = elRect.left + window.scrollX;
      let width = elRect.width;

      if(width < me.minListWidth){
        width = me.minListWidth;
      }

      const el = div([FIELD_COMBO_LIST, 'fg-theme-' + me.theme], {
        top: `${top}px`,
        left: `${left}px`,
        width: `${width}px`
      });

      if(me.items === undefined){
        me.generateItems();
      }

      el.innerHTML = me.items.map(item => {
        let hidden = false;
        if(me.filtering && filtering){
          hidden = !me.filterItem(item);
        }

        const selected = me.value === item.text;
        const innerHTML = [
          `<div value="${item.value}" class="${FIELD_COMBO_LIST_ITEM} ${hidden ? HIDDEN : ''} ${selected ? FIELD_COMBO_LIST_ITEM_SELECTED : ''}">`
        ];

        if(me.leftListRender){
          innerHTML.push(
            me.leftListRender({
              item
            })
          );
        }

        innerHTML.push(`<div class="${FIELD_COMBO_LIST_ITEM_TEXT}">${item.text || '&nbsp;'}</div>`);
        innerHTML.push('</div>');

        return innerHTML.join('');
      }).join('');

      el.addEventListener('click', me.onListClick.bind(this));
      document.body.appendChild(el);
      me.elComboList = el;
      me.onDocMouseDownFn = me.onDocMouseDown.bind(this);

      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - elRect.bottom;
      const spaceAbove = elRect.top;
      const listHeight = el.getBoundingClientRect().height;

      if (spaceBelow < listHeight && spaceAbove > spaceBelow) { // Render up
        top = elRect.top + window.scrollY - listHeight;
        el.style.top = top + 'px';
      }

      document.addEventListener('mousedown', me.onDocMouseDownFn);

      me.scrollToSelected();
      me.input.focus();
    }
    onDocMouseDown(e) {
      const me = this;
      const target = e.target;

      if (!target.closest(`.${FIELD_COMBO_LIST}`)
        && !target.closest(`.${FIELD_COMBO_BUTTON}`)
        && !target.closest(`.${FIELD_COMBO}`)
      ) {
        document.removeEventListener('mousedown', me.onDocMouseDownFn);
        me.destroyComboList();
      }
    }
    onListClick(e) {
      const me = this;
      const itemEl = e.target.closest(`.${FIELD_COMBO_LIST_ITEM}`);
      const value = itemEl.getAttribute('value');
      const itemTextEl = itemEl.querySelector(`.${FIELD_COMBO_LIST_ITEM_TEXT}`);
      let text = itemTextEl.innerHTML;

      if(text === '&nbsp;'){
        text = '';
      }

      me.destroyComboList();
      me.setValue(text);
      me.focus();
    }
    setValue(value) {
      this.value = value;
      this.input.value = value;
      this.onChange?.(value, true);
    }
    filterItems(){
      const me = this;
      const itemEls = me.elComboList.querySelectorAll(`.${FIELD_COMBO_LIST_ITEM}`);

      me.items.forEach((item, index) => {
        const hidden = !me.filterItem(item);
        const itemEl = itemEls[index];

        itemEl.classList[hidden?'add':'remove'](HIDDEN);
      });
    }
    filterItem(item){
      const me = this;
      let value = me.input.value;
      let text = item.text;

      if(!me.caseSensitive){
        value = value.toLocaleLowerCase();
        text = text.toLocaleLowerCase();
      }

      switch(this.filterType){
        case 'match':
          return text?.startsWith(value);
        case 'matchAny':
          return text?.includes(value);
      }
    }
    onUP(event){
      event.preventDefault();

      const me = this;
      let list = me.elComboList;
      let openedList = false;
      if(!list){
        me.showComboList();
        list = me.elComboList;
        openedList = true;
      }

      const ACTIVE = FIELD_COMBO_LIST_ITEM_ACTIVE;
      const oldActiveItem = list.querySelector(`.${ACTIVE}`);
      let prevNotHiddenItem;

      let prevItem = oldActiveItem?.previousElementSibling;
      while(prevItem){
        if (!prevItem.classList.contains(HIDDEN)) {
          prevNotHiddenItem = prevItem;
          break;
        }
        prevItem = prevItem.previousElementSibling;
      }

      if(prevNotHiddenItem){
        oldActiveItem.classList.remove(ACTIVE);
        prevNotHiddenItem.classList.add(ACTIVE);
        prevNotHiddenItem.scrollIntoView({
          block: 'nearest'
        });
      }

      openedList && me.setActiveItem();
    }
    scrollToSelected(){
      const me = this;
      const selectedItem = me.elComboList.querySelector(`.${FIELD_COMBO_LIST_ITEM_SELECTED}`);

      if(selectedItem){
        selectedItem.scrollIntoView();
        me.setActiveItem(selectedItem);
      }
    }
    onDOWN(event){
      event.preventDefault();

      const me = this;
      let list = me.elComboList;
      let openedList = false;
      if(!list){
        me.showComboList();
        list = me.elComboList;
        openedList = true;
      }

      const ACTIVE = FIELD_COMBO_LIST_ITEM_ACTIVE;
      const oldActiveItem = list.querySelector(`.${ACTIVE}`);
      const nextNotHiddenItem = list.querySelector(`.${ACTIVE} ~ :not(.${HIDDEN})`);

      if(nextNotHiddenItem){
        oldActiveItem.classList.remove(ACTIVE);
        nextNotHiddenItem.classList.add(ACTIVE);
        nextNotHiddenItem.scrollIntoView({
          block: 'nearest'
        });
      }

      openedList && me.setActiveItem();
    }
    setActiveItem(item){
      const me = this;
      const ACTIVE = FIELD_COMBO_LIST_ITEM_ACTIVE;
      const list = me.elComboList;

      const oldActiveItem = list.querySelector(`.${ACTIVE}`);
      oldActiveItem?.classList.remove(ACTIVE);

      item = item || me.elComboList.querySelector(`.${FIELD_COMBO_LIST_ITEM}:not(.${HIDDEN})`);
      item?.classList.add(ACTIVE);
    }
    generateItems(){
      const me = this;
      const data = me.grid.getUniqueColumnData(me.column).map(value => {
        return {
          value,
          text: value
        };
      });

      me.items = data;
    }
  }

  Fancy.ComboField = Combo;
})();
