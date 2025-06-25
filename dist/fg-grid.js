(function (root, factory) {
  if (typeof exports === 'object' && typeof module === 'object') {
    // CommonJS
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    // AMD
    define([], factory);
  } else if (typeof exports === 'object') {
    // CommonJS-like environments
    exports["Fancy"] = factory();
  } else {
    // Browser globals (root is window)
    root["Fancy"] = factory();
  }
})(typeof self !== 'undefined' ? self : this, function () {

const Fancy$1 = {
  version: '0.7.13',
  isTouchDevice: 'ontouchstart' in window,
  gridIdSeed: 0,
  gridsMap: new Map(),
  get(id){
    return this.gridsMap.get(id);
  },
  capitalizeFirstLetter(str){
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
  deepClone(obj){
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => Fancy$1.deepClone(item));
    }

    const clonedObj = {};
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = Fancy$1.deepClone(obj[key]);
      }
    }

    return clonedObj;
  },
  getTranslateY(element) {
    const style = window.getComputedStyle(element);
    const matrix = style.transform;

    if (!matrix || matrix === 'none') {
      return 0;
    }

    const values = matrix.match(/matrix.*\((.+)\)/);
    if (!values) {
      return 0;
    }

    const parts = values[1].split(', ').map(parseFloat);
    return parts.length === 6 ? parts[5] : 0;
  },
  typeOf(value) {
    if (value === null) {
      return 'null';
    }

    const type = typeof value;
    if(type === 'undefined' || type === 'string' || type === 'number' || type === 'boolean'){
      return type;
    }

    const toString = Object.prototype.toString,
      typeToString = toString.call(value);

    if (value.length !== undefined && typeof value !== 'function') {
      return 'array';
    }

    switch(typeToString){
      case '[object Array]':
        return 'array';
      case '[object Date]':
        return 'date';
      case '[object Boolean]':
        return 'boolean';
      case '[object Number]':
        return 'number';
      case '[object RegExp]':
        return 'regexp';
    }

    if(type === 'function'){
      return 'function';
    }

    if(type === 'object'){
      return 'object';
    }
  }
};

window.Fancy = window.Fancy || Fancy$1;

Fancy.debounce = (func, delay) => {
  let timeoutId;

  return function(...args) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

Fancy.svg = {
  chevronRight: [
    '<svg viewBox="0 0 16 16" style="shape-rendering: geometricprecision;">',
    '<path fill-rule="evenodd" fill="currentColor" d="M5.054 4.524a1.04 1.04 0 0 1 1.47-1.47l4.211 4.211a1.04 1.04 0 0 1 0 1.47l-4.21 4.21a1.04 1.04 0 0 1-1.47-1.47L8.53 8 5.054 4.524z"></path>',
    '</svg>'
  ].join(''),
  group: [
    '<svg viewBox="0 0 16 16" style="shape-rendering: geometricprecision;">',
    '<path fill-rule="evenodd" fill="currentColor" d="M1 3.006C1 1.898 1.897 1 3.006 1h9.988C14.102 1 15 1.897 15 3.006v9.988A2.005 2.005 0 0 1 12.994 15H3.006A2.005 2.005 0 0 1 1 12.994V3.006zm2 .99v8.009c0 .54.446.995.995.995h8.01c.54 0 .995-.446.995-.995v-8.01c0-.54-.446-.995-.995-.995h-8.01C3.455 3 3 3.446 3 3.995zM7 6c0-.552.444-1 1-1h3c.552 0 1 .444 1 1 0 .552-.444 1-1 1H8c-.552 0-1-.444-1-1zm0 4c0-.552.444-1 1-1h3c.552 0 1 .444 1 1 0 .552-.444 1-1 1H8c-.552 0-1-.444-1-1zM4 6c0-.552.444-1 1-1 .552 0 1 .444 1 1 0 .552-.444 1-1 1-.552 0-1-.444-1-1zm0 4c0-.552.444-1 1-1 .552 0 1 .444 1 1 0 .552-.444 1-1 1-.552 0-1-.444-1-1z"></path>',
    '</svg>'
  ].join(''),
  groupCellDrag: [
    '<svg viewBox="0 0 16 16" style="shape-rendering: geometricprecision;">',
      '<path fill-rule="evenodd" fill="currentColor" d="M5 3.505C5 3.226 5.214 3 5.505 3h.99c.279 0 .505.214.505.505v.99A.497.497 0 0 1 6.495 5h-.99A.497.497 0 0 1 5 4.495v-.99zm4 0C9 3.226 9.214 3 9.505 3h.99c.279 0 .505.214.505.505v.99a.497.497 0 0 1-.505.505h-.99A.497.497 0 0 1 9 4.495v-.99zm-4 4C5 7.226 5.214 7 5.505 7h.99c.279 0 .505.214.505.505v.99A.497.497 0 0 1 6.495 9h-.99A.497.497 0 0 1 5 8.495v-.99zm4 0C9 7.226 9.214 7 9.505 7h.99c.279 0 .505.214.505.505v.99a.497.497 0 0 1-.505.505h-.99A.497.497 0 0 1 9 8.495v-.99zm-4 4c0-.279.214-.505.505-.505h.99c.279 0 .505.214.505.505v.99a.497.497 0 0 1-.505.505h-.99A.497.497 0 0 1 5 12.495v-.99zm4 0c0-.279.214-.505.505-.505h.99c.279 0 .505.214.505.505v.99a.497.497 0 0 1-.505.505h-.99A.497.497 0 0 1 9 12.495v-.99z"></path>',
    '</svg>'
  ].join(''),
  remove: [
    '<svg viewBox="0 0 16 16" style="shape-rendering: geometricprecision;">',
      '<path fill-rule="evenodd" fill="currentColor" d="M3.71428571,7 C3.32,7 3,7.224 3,7.5 L3,8.5 C3,8.776 3.32,9 3.71428571,9 L12.2857143,9 C12.68,9 13,8.776 13,8.5 L13,7.5 C13,7.224 12.68,7 12.2857143,7 L3.71428571,7 Z"></path>',
    '</svg>'
  ].join(''),
  block: [
    '<svg viewBox="0 0 16 16" style="shape-rendering: geometricprecision;">',
      '<path fill-rule="evenodd" fill="currentColor" d="M3.617 4.677A5.48 5.48 0 0 0 2.5 8 5.5 5.5 0 0 0 8 13.5a5.48 5.48 0 0 0 3.323-1.117zm1.06-1.06 7.706 7.706A5.48 5.48 0 0 0 13.5 8 5.5 5.5 0 0 0 8 2.5a5.48 5.48 0 0 0-3.323 1.117M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8 Z"></path>"',
    '</svg>'
  ].join(''),
  menu: [
    '<svg viewBox="0 0 28 28">',
    '<path d="M5.5 8a1 1 0 1 1 0-2h17a1 1 0 0 1 0 2h-17Zm0 7a1 1 0 0 1 0-2h17a1 1 0 0 1 0 2h-17Zm0 7a1 1 0 0 1 0-2h17a1 1 0 0 1 0 2h-17Z"></path>',
    '</svg>'
  ].join(''),
  sortAsc: [
    '<svg viewBox="0 0 16 16">',
    '<path d="M12.78 6.47a.75.75 0 0 1-1.06 1.06L8.75 4.56v8.69a.75.75 0 0 1-1.5 0V4.56L4.28 7.53a.75.75 0 1 1-1.06-1.06l4.25-4.25a.75.75 0 0 1 1.06 0l4.25 4.25Z"></path>',
    '</svg>'
  ].join(''),
  sortDesc: [
    '<svg viewBox="0 0 16 16">',
    '<path d="M3.22 9.53a.75.75 0 0 1 1.06-1.06l2.97 2.97V2.75a.75.75 0 0 1 1.5 0v8.69l2.97-2.97a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L3.22 9.53Z"></path>',
    '</svg>'
  ].join(''),
  filter: [
    '<svg viewBox="0 0 20 20">',
    '<path d="M7.5 7.75a1 1 0 1 1 0-2 1 1 0 0 1 0 2zM5.11 6A2.5 2.5 0 0 1 9.9 6h6.36a.75.75 0 0 1 0 1.5H9.89a2.5 2.5 0 0 1-4.78 0H3.75a.75.75 0 0 1 0-1.5zm7.39 8.25a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm2.39-1.75a2.5 2.5 0 0 0-4.78 0H3.75a.75.75 0 0 0 0 1.5h6.36a2.5 2.5 0 0 0 4.78 0h1.36a.75.75 0 0 0 0-1.5z"></path>',
    '</svg>'
  ].join('')
};

Fancy.cls = {
  HIDDEN: 'fg-hidden',
  GRID: 'fg-grid',
  TOUCH: 'fg-touch',
  EDITING: 'fg-editing',

  // Header
  HEADER: 'fg-header',
  HEADER_INNER: 'fg-header-inner',
  HEADER_INNER_CONTAINER: 'fg-header-inner-container',
  HEADER_CELL: 'fg-header-cell',
  HEADER_CELL_SORTABLE: 'fg-header-cell-sortable',
  HEADER_CELL_NOT_RESIZABLE: 'fg-header-cell-not-resizable',
  HEADER_CELL_LABEL: 'fg-header-cell-label',
  HEADER_CELL_TEXT: 'fg-header-cell-text',
  HEADER_FILTER_EL: 'fg-header-filter-el',
  HEADER_CELL_RESIZE: 'fg-header-cell-resize',
  HEADER_CELL_MENU: 'fg-header-cell-menu',
  HEADER_CELL_SELECTION: 'fg-header-cell-selection',

  // Body
  BODY: 'fg-body',
  BODY_INNER: 'fg-body-inner',
  BODY_INNER_CONTAINER: 'fg-body-inner-container',
  EDITORS_CONTAINER: 'fg-editors-container',

  // Column
  COLUMN_RESIZING: 'fg-column-resizing',
  COLUMN_DRAGGING: 'fg-column-dragging',
  FAKE_COLUMN_CELL_DRAGGING: 'fg-fake-column-cell-dragging',
  FAKE_COLUMN_CELL_DRAGGING_ALLOW: 'fg-fake-column-cell-dragging-allow',
  FAKE_COLUMN_CELL_DRAGGING_DENY: 'fg-fake-column-cell-dragging-deny',
  COLUMNS_MENU: 'fg-columns-menu',
  COLUMNS_MENU_ITEM: 'fg-columns-menu-item',
  COLUMNS_MENU_ITEM_TEXT: 'fg-columns-menu-item-text',

  // Cell
  CELL: 'fg-cell',
  ANIMATE_CELLS_POSITION: 'fg-animate-cells-position',
  GRID_CELLS_RIGHT_BORDER: 'fg-enabled-cell-right-border',
  CELL_BOOLEAN: 'fg-cell-boolean',
  CELL_ORDER: 'fg-cell-order',
  CELL_WRAPPER: 'fg-cell-wrapper',
  CELL_SELECTION: 'fg-cell-selection',
  CELL_SELECTED: 'fg-cell-selected',
  ACTIVE_CELL: 'fg-cell-active',
  ACTIVE_CELL_ROW: 'fg-cell-active-row',

  // Row Group
  ROW: 'fg-row',
  ROW_ODD: 'fg-row-odd',
  ROW_EVEN: 'fg-row-even',
  ROW_GROUP: 'fg-row-group',
  ROW_SELECTED: 'fg-row-selected',
  ROW_GROUP_VALUE_CELL: 'fg-row-group-value-cell',
  ROW_GROUP_CELL: 'fg-row-group-cell',
  ROW_GROUP_CELL_SELECTION: 'fg-row-group-cell-selection',
  ROW_GROUP_CELL_VALUE: 'fg-row-group-cell-value',
  ROW_GROUP_CELL_AMOUNT: 'fg-row-group-cell-amount',
  ROW_GROUP_CELL_EXPANDER: 'fg-row-group-cell-expander',
  ROW_GROUP_EXPANDED_CELL: 'fg-row-group-cell-expanded',
  ROW_ANIMATION: 'fg-row-animation',
  ROW_HOVER: 'fg-row-hover',
  ROW_GROUP_BAR: 'fg-row-group-bar',
  ROW_GROUP_BAR_EMPTY_TEXT: 'fg-row-group-bar-empty-text',
  ROW_GROUP_BAR_ITEM_CONTAINER: 'fg-row-group-bar-item-container',
  ROW_GROUP_BAR_ITEM: 'fg-row-group-bar-item',
  ROW_GROUP_BAR_ITEM_TEXT: 'fg-row-group-bar-item-text',
  ROW_GROUP_BAR_ITEM_ACTIVE: 'fg-row-group-bar-item-active',

  // Filter
  FILTER_BAR: 'fg-filter-bar',
  FILTER_BAR_CELL: 'fg-filter-bar-cell',
  FILTER_BAR_INNER: 'fg-filter-bar-inner',
  FILTER_BAR_INNER_CONTAINER: 'fg-filter-bar-inner-container',
  FILTER_INDICATOR_CONTAINER: 'fg-filter-indicator-container',
  FILTER_FIELD: 'fg-filter-field',
  FILTER_FIELD_INPUT: 'fg-filter-field-input',
  FILTER_FIELD_TEXT: 'fg-filter-field-text',
  FILTER_FIELD_SIGN: 'fg-filter-field-sign',
  FILTER_FIELD_LIST: 'fg-filter-field-list',
  FILTER_FIELD_LIST_ITEM: 'fg-filter-field-list-item',
  FILTER_FIELD_LIST_ITEM_TEXT: 'fg-filter-field-list-item-text',

  // Sort
  SORT_ORDER: 'fg-sort-order',
  SORT_ASC: 'fg-sort-asc',
  SORT_DESC: 'fg-sort-desc',
  SORT_INDICATOR_CONTAINER: 'fg-sort-indicator-container',

  // Scroll
  BODY_VERTICAL_SCROLL: 'fg-body-vertical-scroll',
  BODY_VERTICAL_SCROLL_CONTAINER: 'fg-body-vertical-scroll-container',
  BODY_VERTICAL_SCROLL_SIZE: 'fg-body-vertical-scroll-size',
  BODY_HORIZONTAL_SCROLL: 'fg-body-horizontal-scroll',
  BODY_HORIZONTAL_SCROLL_CONTAINER: 'fg-body-horizontal-scroll-container',
  BODY_HORIZONTAL_SCROLL_SIZE: 'fg-body-horizontal-scroll-size',
  SCROLLBAR_INVISIBLE: 'fg-scrollbar-invisible',

  //Checkbox
  INPUT_CHECKBOX: 'fg-input-checkbox',

  // Field
  FIELD: 'fg-field',
  FIELD_INPUT: 'fg-field-input',

  // String Field
  STRING_FIELD: 'fg-string-field',
  STRING_FIELD_INPUT: 'fg-string-field-input',

  // Number Field
  NUMBER_FIELD: 'fg-number-field',
  NUMBER_FIELD_INPUT: 'fg-number-field-input',

  // SVG
  SVG_ITEM: 'fg-svg-item',
  SVG_CHEVRON_RIGHT: 'fg-svg-chevron-right',
  SVG_GROUP: 'fg-svg-group',
  SVG_DRAG: 'fg-svg-drag',
  SVG_REMOVE: 'fg-svg-remove',
  SVG_BLOCK: 'fg-svg-block'
};

Fancy.key = {
  BACKSPACE: 8,
  TAB: 9,
  ENTER: 13,
  RETURN: 13,
  SHIFT: 16,
  CTRL: 17,
  ALT: 18,
  PAUSE: 19,
  CAPS_LOCK: 20,
  ESC: 27,
  SPACE: 32,
  PAGE_UP: 33,
  PAGE_DOWN: 34,
  END: 35,
  HOME: 36,
  LEFT: 37,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  PRINT_SCREEN: 44,
  INSERT: 45,
  DELETE: 46,
  ZERO: 48,
  ONE: 49,
  TWO: 50,
  THREE: 51,
  FOUR: 52,
  FIVE: 53,
  SIX: 54,
  SEVEN: 55,
  EIGHT: 56,
  NINE: 57,
  A: 65,
  B: 66,
  C: 67,
  D: 68,
  E: 69,
  F: 70,
  G: 71,
  H: 72,
  I: 73,
  J: 74,
  K: 75,
  L: 76,
  M: 77,
  N: 78,
  O: 79,
  P: 80,
  Q: 81,
  R: 82,
  S: 83,
  T: 84,
  U: 85,
  V: 86,
  W: 87,
  X: 88,
  Y: 89,
  Z: 90,
  META: 91,
  CONTEXT_MENU: 93,
  NUM_ZERO: 96,
  NUM_ONE: 97,
  NUM_TWO: 98,
  NUM_THREE: 99,
  NUM_FOUR: 100,
  NUM_FIVE: 101,
  NUM_SIX: 102,
  NUM_SEVEN: 103,
  NUM_EIGHT: 104,
  NUM_NINE: 105,
  NUM_MULTIPLY: 106,
  NUM_PLUS: 107,
  NUM_MINUS: 109,
  NUM_DOT: 110,
  NUM_DIVISION: 111,
  F1: 112,
  F2: 113,
  F3: 114,
  F4: 115,
  F5: 116,
  F6: 117,
  F7: 118,
  F8: 119,
  F9: 120,
  F10: 121,
  F11: 122,
  F12: 123,
  WHEEL_SCALE: 120,
  DOT: 190
};

Fancy.Key = {
  isNum(c){
    const key = Fancy.key;

    switch(c){
      case key.ZERO:
      case key.ONE:
      case key.TWO:
      case key.THREE:
      case key.FOUR:
      case key.FIVE:
      case key.SIX:
      case key.SEVEN:
      case key.EIGHT:
      case key.NINE:
      case key.NUM_ZERO:
      case key.NUM_ONE:
      case key.NUM_TWO:
      case key.NUM_THREE:
      case key.NUM_FOUR:
      case key.NUM_FIVE:
      case key.NUM_SIX:
      case key.NUM_SEVEN:
      case key.NUM_EIGHT:
      case key.NUM_NINE:
        return true;
      default:
        return false;
    }
  },
  isNumControl(c, e){
    const key = Fancy.key;

    if( Fancy.Key.isNum(c) ){
      return true;
    }

    if( e.shiftKey && c === 187){
      return true;
    }

    switch(c){
      case key.NUM_PLUS:
      case 189:
      case key.NUM_MINUS:
      case key.NUM_DOT:
      case key.BACKSPACE:
      case key.DELETE:
      case key.TAB:
      case key.ENTER:
      case key.RETURN:
      case key.SHIFT:
      case key.CTRL:
      case key.ALT:
      case key.ESC:
      case key.END:
      case key.HOME:
      case key.LEFT:
      case key.UP:
      case key.RIGHT:
      case key.DOWN:
      case key.INSERT:
      case key.DOT:
        return true;
      default:
        return false;
    }
  }
};

Fancy.render = {
  boolean(params){
    const {
      column,
      value,
      cell
    } = params;

    if(value === ''){
      return;
    }

    const inputEl = document.createElement('input');
    inputEl.setAttribute('type', 'checkbox');
    inputEl.checked = value;

    inputEl.addEventListener('click', (e) => {
      if(!column.editable){
        e.preventDefault();
      }
    });

    inputEl.addEventListener('change', (e)=>{
      column.onCheckBoxChange?.(e, inputEl.checked);
    });

    cell.classList.add(Fancy.cls.CELL_BOOLEAN);

    cell.appendChild(inputEl);
  },
  order(params){
    const {
      cell,
      rowIndex
    } = params;

    // For copy CTRL + C
    if(!cell){
      return Number(rowIndex) + 1;
    }

    cell.classList.add(Fancy.cls.CELL_ORDER);

    cell.innerHTML = rowIndex + 1;
  }
};

Fancy.format = {
  CURRENCY_REGIONS: {
    USD: 'en-US',
    EUR: 'de',
    GBP: 'en-gb',
    JPY: 'jp',
    CNY: 'zh-cn'
  },
  currency(params) {
    const value = params.value;
    const minDecimal = params.minDecimal || 0;
    const maxDecimal = params.maxDecimal || minDecimal || 0;
    const currency = params.currency || 'USD';
    let region = 'en-US';

    if (isNaN(value) || value === '' || value === null) {
      return '';
    }

    if (params.region) {
      region = params.region;
    } else if (Fancy.format.CURRENCY_REGIONS[params.currency]) {
      region = Fancy.format.CURRENCY_REGIONS[params.currency];
    }

    return new Intl.NumberFormat(region, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: minDecimal,
      maximumFractionDigits: maxDecimal
    }).format(value);
  }
};

Fancy.copyText = (text) => {
  if(navigator.clipboard){
    navigator.clipboard.writeText(text)
      .catch(err => console.error('Error copying: ', err));
  }
  else {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
};

(()=> {

  /**
   * @mixes StoreMixinEdit
   * @mixes StoreMixinFilter
   * @mixes StoreMixinRowGroup
   * @mixes StoreMixinSelection
   * @mixes StoreMixinSort
   */

  class Store {
    data = [];
    sortedData = undefined;
    filteredData = undefined;
    sorters = [];
    filters = [];
    rowGroups = [];
    rowGroupExpanded = [];
    aggregations = [];
    idRowIndexesMap = null;
    idItemMap = null;
    selectedItemsMap = null;
    selectedRowGroupsChildren = null;

    idSeed = 0;

    prevAction = '';

    constructor({data, rowGroups, rowGroupExpanded, aggregations, defaultRowGroupSort}) {
      const me = this;

      me.prevAction = '';

      me.data = data || [];
      me.rowGroups = rowGroups || [];
      me.rowGroupExpanded = rowGroupExpanded || [];
      me.aggregations = aggregations || [];
      me.defaultRowGroupSort = defaultRowGroupSort || [];
      me.selectedItemsMap = new Map();
      me.selectedRowGroupsChildren = {};
      me.groupDetails = {};

      if (me.data.length && me.rowGroups.length) {
        me.lightSetIds();
        me.rowGroupData();
        me.setIndexAndItemsMaps();
      } else {
        me.setIds();
      }
    }

    setData(data){
      const me = this;

      me.sortedData = undefined;
      me.filteredData = undefined;
      me.data = data;
      me.selectedItemsMap = new Map();
      me.selectedRowGroupsChildren = {};

      if (me.data.length && me.rowGroups.length) {
        me.lightSetIds();

        // Potential problem
        if(me.filters.length){
          //me.reFilter(false);
          me.reFilter();
        }

        me.rowGroupData();
        me.setIndexAndItemsMaps();
      } else {
        me.setIds();

        if(me.filters.length){
          me.reFilter(false);
        }

        if(me.sorters.length){
          me.reSort();
        }
      }
    }

    lightSetIds() {
      const me = this;

      me.idSeed = 0;

      me.data.forEach(item => {
        if (!item.id) {
          item.id = me.generateId();
        }
        else if(typeof item.id === 'number'){
          item.id = String(item.id);
        }
      });
    }

    // For row groups only
    setIndexAndItemsMaps() {
      const me = this;

      if (!me.idItemMap) {
        me.idItemMap = new Map();
      }
      me.updateIndexes();
    }

    // TODO: something wrong
    // Serious bug
    updateIndexes() {
      const me = this;
      const data = me.displayedData || me.data;
      //const data = me.displayedData || me.filteredData || me.data;

      if(!me.$isOriginalDataIndexesSet){
        me.data.forEach((item, index) => {
          item.originalDataRowIndex = index;
        });
      }

      me.idRowIndexesMap = new Map();

      data.forEach((item, index) => {
        me.idRowIndexesMap.set(item.id, index);
        me.idItemMap.set(item.id, item);

        item.rowIndex = index;
        item.originalRowIndex = index;
      });

      /*
      me.data.forEach((item, index) => {
        me.idRowIndexesMap.set(item.id, index);
        me.idItemMap.set(item.id, item);

        item.originalRowIndex = index;
        if(me.displayedData === undefined){
          item.rowIndex = index;
        }
      });

      me.displayedData?.forEach((item, index) => {
        me.idRowIndexesMap.set(item.id, index);
        me.idItemMap.set(item.id, item);

        item.rowIndex = index;
      });
       */
    }

    setIds() {
      const me = this;

      me.idRowIndexesMap = new Map();
      me.idItemMap = new Map();

      me.idSeed = 0;

      me.data.forEach((item, index) => {
        if (!item.id) {
          item.id = me.generateId();
          item.originalRowIndex = index;
        }

        me.idRowIndexesMap.set(item.id, index);
        me.idItemMap.set(item.id, item);
      });
    }

    generateId() {
      return 'id-' + this.idSeed++;
    }

    getDataTotal() {
      return this.data.length;
    }

    getDisplayedDataTotal() {
      const me = this;
      const {
        sorters,
        filters,
        rowGroups
      } = me;

      if (sorters.length || filters.length || rowGroups.length) {
        return this.displayedData?.length || 0;
      }

      return me.getDataTotal();
    }

    getItemByRowIndex(rowIndex) {
      const me = this;
      const {
        sorters,
        filters,
        rowGroups
      } = me;
      let item;

      if (sorters.length || filters.length || rowGroups.length) {
        //item = me.sortedData[rowIndex];
        item = me.displayedData[rowIndex];
      } else {
        item = me.data[rowIndex];
      }

      return item;
    }

    memorizePrevRowIndexesMap() {
      const me = this;

      me.prevIdRowIndexesMap = me.idRowIndexesMap;
    }

    getPrevVisibleRowIndex(rowIndex){
      const me = this;
      const data = me.displayedData || me.data;

      for(let i = rowIndex - 1;i>-1;i--){
        const row = data[i];
        if(row.$isGroupRow !== true){
          return i;
        }
      }
    }

    getNextVisibleRowIndex(rowIndex){
      const me = this;
      const totalDisplayed = me.getDisplayedDataTotal();
      const data = me.displayedData || me.data;

      for(let i = rowIndex + 1;i<totalDisplayed;i++){
        const row = data[i];
        if(row.$isGroupRow !== true){
          return i;
        }
      }
    }
  }

  Fancy.Store = Store;

})();

(()=> {

  /**
   * @mixin StoreMixinSort
   */

  const StoreMixinSort = {
    reSort() {
      const me = this;
      let data;

      if (me.filteredData) {
        data = me.filteredData.slice();
      } else {
        data = me.data.slice();
      }

      me.sorters.forEach(sorter => {
        data = me.sortData(data, sorter.column, sorter.dir);
      });

      me.sortedData = data;

      me.idRowIndexesMap = new Map();

      me.sortedData.forEach((item, index) => {
        me.idRowIndexesMap.set(item.id, index);
        item.rowIndex = index;
      });

      me.displayedData = me.sortedData;
    },

    sort(column, dir = 'ASC', multi) {
      const me = this;
      let data;

      if (me.prevAction === 'sort' && me.sortedData) {
        data = me.sortedData.slice();
      } else if (me.filteredData) {
        data = me.filteredData.slice();
      } else {
        data = me.data.slice();
      }

      if (!me.prevIdRowIndexesMap) {
        me.prevIdRowIndexesMap = me.idRowIndexesMap;
      }

      if (!multi) {
        me.sorters = [];
      } else {
        me.sorters = me.sorters.filter(sorter => sorter.column.id !== column.id);
      }

      me.sorters.push({
        column,
        dir
      });

      switch (dir) {
        case 'ASC':
        case 'DESC':
          if (me.rowGroups.length) {
            me.sortedData = me.filters.length ? me.sortGroupDataForFiltering(column, dir) : me.sortGroupData(column, dir);
          } else {
            me.sortedData = me.sortData(data, column, dir);
          }
          break;
      }

      me.idRowIndexesMap = new Map();

      me.sortedData.forEach((item, index) => {
        me.idRowIndexesMap.set(item.id, index);
        item.rowIndex = index;
      });

      me.displayedData = me.sortedData;
      me.prevAction = 'sort';
    },

    sortGroupData(column, dir) {
      const me = this;
      const sortedData = me.displayedData.slice();

      for (const group in me.expandedGroupsWithDataChildren) {
        if (me.isParentCollapsed(group)) {
          continue;
        }

        const groupData = me.groupsChildren[group].slice();
        const groupDetails = me.groupDetails[group];
        const rowIndex = me.idRowIndexesMap.get(groupDetails.id);
        let sortedGroupData = groupData;

        if (me.sorters.length) {
          me.sorters.forEach(sorter => {
            sortedGroupData = me.sortData(sortedGroupData, sorter.column, sorter.dir);
          });
        } else {
          sortedGroupData = me.sortData(groupData, column, dir);
        }

        sortedData.splice(rowIndex + 1, sortedGroupData.length, ...sortedGroupData);
      }

      return sortedData;
    },

    sortGroupDataForFiltering(column, dir) {
      const me = this;
      const sortedData = me.displayedData.slice();

      for (const group in me.expandedGroupsWithDataChildrenForFiltering) {
        if (me.isParentCollapsed(group)) {
          continue;
        }

        const groupData = me.groupsChildrenForFiltering[group].slice();
        const groupDetails = me.groupDetailsForFiltering[group];
        const rowIndex = me.idRowIndexesMap.get(groupDetails.id);
        let sortedGroupData = groupData;

        if (me.sorters.length) {
          me.sorters.forEach(sorter => {
            sortedGroupData = me.sortData(sortedGroupData, sorter.column, sorter.dir);
          });
        } else {
          sortedGroupData = me.sortData(groupData, column, dir);
        }

        sortedData.splice(rowIndex + 1, sortedGroupData.length, ...sortedGroupData);
      }

      return sortedData;
    },

    sortPieceOfData(data) {
      const me = this;

      me.sorters.forEach(sorter => {
        data = me.sortData(data, sorter.column, sorter.dir);
      });

      return data;
    },

    sortData(data, column, dir) {
      let sortedData = [];

      switch (dir) {
        case 'ASC':
          switch (column.type) {
            case 'number':
              sortedData = data.sort((a, b) => {
                if(column.getter){
                  a = column.getter({
                    item: a
                  });

                  b = column.getter({
                    item: b
                  });
                }
                else {
                  a = a[column.index];
                  b = b[column.index];
                }

                if (a === null) {
                  a = Number.MIN_SAFE_INTEGER;
                }

                if (b === null) {
                  b = Number.MIN_SAFE_INTEGER;
                }

                return a - b;
              });
              break;
            case 'string':
              sortedData = data.sort((a, b) => {
                if(column.getter){
                  a = column.getter({
                    item: a
                  }) || '';

                  b = column.getter({
                    item: b
                  }) || '';
                }
                else {
                  a = a[column.index] || '';
                  b = b[column.index] || '';
                }

                if (!a.localeCompare) {
                  console.error(`${a} is not a string`);
                }

                return a.localeCompare(b);
              });
              break;
            case 'boolean':
              sortedData = data.sort((a, b) => {
                if(column.getter){
                  a = column.getter({
                    item: a
                  }) || false;
                  b = column.getter({
                    item: b
                  }) || false;
                }
                else {
                  a = a[column.index] || false;
                  b = b[column.index] || false;
                }

                return (a === b) ? 0 : a ? 1 : -1;
              });
              break;
          }
          break;
        case 'DESC':
          switch (column.type) {
            case 'number':
              sortedData = data.sort((a, b) => {
                if(column.getter){
                  a = column.getter({
                    item: a
                  });

                  b = column.getter({
                    item: b
                  });
                }
                else {
                  a = a[column.index];
                  b = b[column.index];
                }

                if (a === null) {
                  a = Number.MIN_SAFE_INTEGER;
                }

                if (b === null) {
                  b = Number.MIN_SAFE_INTEGER;
                }

                return b - a;
              });
              break;
            case 'string':
              sortedData = data.sort((a, b) => {
                if(column.getter){
                  a = column.getter({
                    item: a
                  }) || '';

                  b = column.getter({
                    item: b
                  }) || '';
                }
                else {
                  a = a[column.index] || '';
                  b = b[column.index] || '';
                }

                return b.localeCompare(a);
              });
              break;
            case 'boolean':
              sortedData = data.sort((a, b) => {
                if(column.getter){
                  a = column.getter({
                    item: a
                  }) || false;
                  b = column.getter({
                    item: b
                  }) || false;
                }
                else {
                  a = a[column.index] || false;
                  b = b[column.index] || false;
                }

                return (a === b) ? 0 : a ? -1 : 1;
              });
              break;
          }
          break;
      }

      return sortedData;
    },

    clearSort(column, multi) {
      const me = this;

      me.sortedData = [];

      if (column && multi) {
        me.sorters = me.sorters.filter(sorter => sorter.column.id !== column.id);
      } else {
        me.sorters = [];
      }

      if (!me.rowGroups.length) {
        me.idRowIndexesMap = new Map();
      }

      if (me.sorters.length) {
        if (me.rowGroups.length) {
          me.sortedData = me.filters.length ? me.sortGroupDataForFiltering() : me.sortGroupData();

          me.idRowIndexesMap = new Map();

          me.sortedData.forEach((item, index) => {
            me.idRowIndexesMap.set(item.id, index);
            item.rowIndex = index;
          });

          me.displayedData = me.sortedData;
          me.prevAction = 'sort';
        } else {
          me.reSort();
        }
      } else if (me.filters.length) {
        if (me.rowGroups.length) {
          me.rowGroupDataForFiltering();
          me.sortGroupsForFiltering();
          // Problem
          // It requires some other reading sorted groups
          // Looks at how sorting goes
          me.generateDisplayedGroupedDataForFiltering(true);
          me.updateIndexes();

          me.prevAction = 'filter';
        } else {
          if(!me.filteredData){
            me.reFilter(false);
          }

          me.filteredData.forEach((item, index) => {
            me.idRowIndexesMap.set(item.id, index);
            item.rowIndex = index;
          });

          me.displayedData = me.filteredData;
        }
      } else {
        if (me.rowGroups.length) {
          for (const group in me.expandedGroupsWithDataChildren) {
            const groupData = me.groupsChildren[group];

            groupData.forEach(item => {
              me.idRowIndexesMap.set(item.id, item.originalRowIndex);
              item.rowIndex = item.originalRowIndex;
            });
          }

          me.sortGroups();
          me.simpleReGenerateDisplayedGroupedData();
        } else {
          me.data.forEach((item, index) => {
            me.idRowIndexesMap.set(item.id, index);
            item.rowIndex = index;
          });
        }
      }

      if (me.sorters.length === 0) {
        delete me.sortedData;
      }
    },

    isParentCollapsed(group) {
      const me = this;
      const splitted = group.split('/');
      let iL = splitted.length - 1;

      for (let i = 0; i < iL; i++) {
        splitted.pop();
        if (!me.expandedGroups[splitted.join('/')]) {
          return true;
        }
      }

      return false;
    }
  };

  Object.assign(Fancy.Store.prototype, StoreMixinSort);

})();

(()=> {

  /**
   * @mixin StoreMixinFilter
   */

  const StoreMixinFilter = {
    clearFilter(column, sign) {
      const me = this;

      me.filters = me.filters.filter(filter => filter.column.id!== column.id);
      delete me.prevFilterColumn;

      me.reFilter(false);
      me.reSort();
    },

    clearFilterForGrouping(column, sign) {
      const me = this;
      const data = me.data.slice();

      me.filters = me.filters.filter(filter => filter.column.id !== column.id);
      delete me.prevFilterColumn;

      me.filteredData = me.filters.reduce((filteredData, filter) => {
        return me.filterData(filteredData, filter.column, filter.value, filter.sign);
      }, data);

      me.rowGroupDataForFiltering();
      me.sortGroupsForFiltering();
      me.generateDisplayedGroupedDataForFiltering();
      me.updateIndexes();

      if (me.filters.length === 0) {
        delete me.filteredData;
      }

      me.prevAction = 'filter';
    },

    reFilter(useSortedDataIfPossible = true) {
      const me = this;
      let data;

      if (useSortedDataIfPossible && me.prevAction === 'sort' && me.sortedData) {
        data = me.sortedData.slice();
      } else {
        data = me.data.slice();
      }

      me.filteredData = me.filters.reduce((filteredData, filter) => {
        return me.filterData(filteredData, filter.column, filter.value, filter.sign);
      }, data);
      me.displayedData = me.filteredData;

      me.updateIndexMapAfterFilter();

      if (me.filters.length === 0) {
        delete me.filteredData;
      }

      me.prevAction = 'filter';
    },

    filter(column, value, sign = '=') {
      const me = this;
      let data;
      let totalReFilterRequired = false;

      if (me.prevAction === 'sort' && me.sortedData) {
        data = me.sortedData.slice();
      } else if (me.prevAction === 'filter' && me.prevFilterColumn?.id !== column.id && me.filteredData) {
        data = me.filteredData.slice();
      } else if (me.prevAction === 'filter' && me.prevFilterColumn?.id === column.id) {
        totalReFilterRequired = true;
      } else {
        data = me.data.slice();
      }

      me.filters = me.filters.filter(filter => filter.column.id !== column.id);

      if (value !== null) {
        me.filters.push({
          column,
          value,
          sign
        });
      }

      if (totalReFilterRequired) {
        me.reFilter();
        me.reSort();
        return;
      }

      me.filteredData = me.filterData(data, column, value, sign);
      me.displayedData = me.filteredData;

      me.updateIndexMapAfterFilter();

      me.prevAction = 'filter';
      me.prevFilterColumn = column;
    },

    filterForRowGrouping(column, value, sign = '=') {
      const me = this;
      const data = me.data.slice();

      me.filters = me.filters.filter(filter => filter.column.id !== column.id);

      if (value !== null) {
        me.filters.push({
          column,
          value,
          sign
        });
      }

      me.filteredData = me.filters.reduce((filteredData, filter) => {
        return me.filterData(filteredData, filter.column, filter.value, filter.sign);
      }, data);

      me.rowGroupDataForFiltering();
      me.sortGroupsForFiltering();
      me.generateDisplayedGroupedDataForFiltering();
      me.updateIndexes();

      me.prevAction = 'filter';
      me.prevFilterColumn = column;
    },

    updateIndexMapAfterFilter() {
      const me = this;

      me.memorizePrevRowIndexesMap();
      me.idRowIndexesMap = new Map();

      me.filteredData.forEach((item, index) => {
        me.idRowIndexesMap.set(item.id, index);
        item.rowIndex = index;
      });
    },

    filterData(data, column, value, sign) {
      let filteredData = [];

      value = String(value).toLocaleLowerCase();

      const getItemValue = (item) => {
        let itemValue;
        if(column.getter){
          itemValue = column.getter({
            item,
            column
          });
        }
        else {
          itemValue = item[column.index];
        }

        return itemValue;
      };

      switch (sign) {
        // Contains
        case '=':
          filteredData = data.filter(item => {
            const itemValue = String(getItemValue(item)).toLocaleLowerCase();

            return itemValue.includes(value);
          });
          break;
        // Not Contains
        case '!=':
          filteredData = data.filter(item => {
            const itemValue = String(getItemValue(item)).toLocaleLowerCase();

            return !itemValue.includes(value);
          });
          break;
        // Equals
        case '==':
          filteredData = data.filter(item => {
            const itemValue = String(getItemValue(item)).toLocaleLowerCase();

            return itemValue === value;
          });
          break;
        // Not Equals
        case '!==':
          filteredData = data.filter(item => {
            const itemValue = String(getItemValue(item)).toLocaleLowerCase();

            return itemValue !== value;
          });
          break;
        // Greater Than
        case '>':
          filteredData = data.filter(item => {
            const itemValue = getItemValue(item);

            return itemValue > value;
          });
          break;
        // Less Than
        case '<':
          filteredData = data.filter(item => {
            const itemValue = getItemValue(item);

            return itemValue < value;
          });
          break;
        // Starts with
        case '_a':
          filteredData = data.filter(item => {
            const itemValue = String(getItemValue(item)).toLocaleLowerCase();

            return itemValue.startsWith(value);
          });
          break;
        // Ends with
        case 'a_':
          filteredData = data.filter(item => {
            const itemValue = String(getItemValue(item)).toLocaleLowerCase();

            return itemValue.endsWith(value);
          });
          break;
        // Regex
        case 'regex':
          filteredData = data.filter(item => {
            const itemValue = String(getItemValue(item)).toLocaleLowerCase();

            return new RegExp(value).test(itemValue);
          });
          break;
        // Empty
        case 'empty':
          filteredData = data.filter(item => {
            const itemValue = getItemValue(item);

            switch (itemValue) {
              case undefined:
              case null:
              case '':
                return true;
            }

            return false;
          });
          break;
        // Not Empty
        case '!empty':
          filteredData = data.filter(item => {
            const itemValue = getItemValue(item);

            switch (itemValue) {
              case undefined:
              case null:
              case '':
                return false;
            }

            return true;
          });
          break;
        // Positive
        case '+':
          filteredData = data.filter(item => {
            const itemValue = getItemValue(item);

            return itemValue >= 0;
          });
          break;
        // Negative
        case '-':
          filteredData = data.filter(item => {
            const itemValue = getItemValue(item);

            return itemValue < 0;
          });
          break;
      }

      return filteredData;
    }
  };

  Object.assign(Fancy.Store.prototype, StoreMixinFilter);

})();

/*
  levelsWithGroups sample structure
  [
    [{
      'root': ['Germany', 'UK', 'Japan', 'USA']
    }],
    [{
      'Germany': ['Germany/BMW', 'Germany/Audi', 'Germany/VW'],
      'UK': ['UK/Land Rover', 'UK/Jaguar'],
      'Japan': ['Japan/Toyota', 'Japan/Mazda', 'Japan/Lexus'],
      'USA': ['USA/Ford']
    }],
    [{
      'Germany/BMW': ['Germany/BMW/X1', 'Germany/BMW/X2', 'Germany/BMW/X7'],
      'Germany/Audi': ['Germany/Audi/A3', 'Germany/Audi/A4', 'Germany/Audi/Q5', 'Germany/Audi/Q7'],
      'Germany/VW': ['Germany/VW/Teramont', 'Germany/VW/Tiguan', 'Germany/VW/Polo', 'Germany/VW/Tuareg'],
      'UK/Land Rover': ['UK/Land Rover/Land Rover Sport'],
      'UK/Jaguar': ['UK/Jaguar/F-Pace', 'UK/Jaguar/E-Pace', 'UK/Jaguar/E-Type'],
      'Japan/Toyota': ['Japan/Toyota/Camry', 'Japan/Toyota/Land Cruiser', 'Japan/Toyota/Prado', 'Japan/Toyota/HighLander'],
      'Japan/Mazda': ['Japan/Mazda/CX-5', 'Japan/Mazda/CX-9', 'Japan/Mazda/6'],
      'Japan/Lexus': ['Japan/Lexus/RX 350', 'Japan/Lexus/NX', 'Japan/Lexus/NX 300', 'Japan/Lexus/RX'],
      'USA/Ford': ['USA/Ford/F-150', 'USA/Ford/Explorer']
    }]
  ]
*/

(()=> {

  /**
   * @mixin StoreMixinRowGroup
   */

  const StoreMixinRowGroup = {
    rowGroupData() {
      const me = this;

      me.set$rowGroupValue();
      me.setExpandedGroups();
      me.generateGroupsInfo();
      me.sortGroups();
      me.generateDisplayedGroupedData();
    },

    rowGroupDataForFiltering() {
      const me = this;

      me.generateGroupsInfoForFiltering();
    },

    generateDisplayedGroupedData() {
      const me = this;
      const displayedGroupsSorted = me.getSortedDisplayedGroups();
      let groupedData = [];

      displayedGroupsSorted.forEach(group => {
        const groupChildren = me.groupsChildren[group];
        const groupDetails = me.groupDetails[group];
        const expanded = me.expandedGroups[group] || false;

        groupedData.push(groupDetails);

        // Group that does not have groups
        // This group has children that are real data
        if (!groupDetails.$hasChildrenGroups && expanded) {
          groupedData = groupedData.concat(groupChildren);
        }
      });

      me.displayedData = groupedData;
    },

    // Regenerate display group data
    // It is only for case when there are no sorters
    simpleReGenerateDisplayedGroupedData() {
      const me = this;
      const groupedData = me.displayedData.slice();

      for (const group in me.expandedGroupsWithDataChildren) {
        if (me.isParentCollapsed(group)) {
          continue;
        }

        const groupData = me.groupsChildren[group].slice();
        const groupDetails = me.groupDetails[group];
        const rowIndex = me.idRowIndexesMap.get(groupDetails.id);

        groupedData.splice(rowIndex + 1, groupData.length, ...groupData);
      }

      me.displayedData = groupedData;
    },

    generateDisplayedGroupedDataForFiltering(doNotSort = false) {
      const me = this;
      let displayedGroupsSorted = [];
      let groupedData = [];

      if (!doNotSort) {
        displayedGroupsSorted = me.getSortedDisplayedGroupsForFiltering();

        displayedGroupsSorted.forEach(group => {
          const groupChildren = me.groupsChildrenForFiltering[group];
          const groupDetails = me.groupDetailsForFiltering[group];
          const expanded = me.expandedGroups[group] || false;

          groupedData.push(groupDetails);

          // Group that does not have groups
          // This group has children that are real data
          if (!groupDetails.$hasChildrenGroups && expanded) {
            groupedData = groupedData.concat(groupChildren);
          }
        });
      } else {
        groupedData = me.getGroupDataForFiltering();
      }

      me.displayedData = groupedData;
    },

    /*
     Generates groupsChildren, groupDetails, levelsWithGroups
     */
    generateGroupsInfo(groupNames, groupLevel) {
      const me = this;
      const parentGroups = {};
      let hasChildrenGroups = true;

      if (groupNames === undefined) {
        me.groupsChildren = me.groupsChildren || Object.groupBy(me.data, row => row.$rowGroupValue);
        groupNames = Object.keys(me.groupsChildren);
        groupLevel = me.rowGroups.length - 1;
        hasChildrenGroups = false;
        me.groupDetails = {};
        me.levelsWithGroups = [
          [{
            root: []
          }]
        ];
        me.expandedGroupsWithDataChildren = {};
      }

      groupNames.forEach(groupName => {
        const splitted = groupName.split('/');
        const rowDisplayGroupValue = splitted.pop();
        let parentGroupName = 'root';

        if (groupLevel !== 0) {
          parentGroupName = splitted.join('/');
          parentGroups[parentGroupName] = true;
        }

        const parentGroup = splitted.join('/');
        const expanded = me.expandedGroups[groupName] || false;

        me.groupsChildren[parentGroup] = me.groupsChildren[parentGroup] || [];
        me.levelsWithGroups[groupLevel] = me.levelsWithGroups[groupLevel] || [{}];
        me.levelsWithGroups[groupLevel][0][parentGroupName] = me.levelsWithGroups[groupLevel][0][parentGroupName] || [];
        me.levelsWithGroups[groupLevel][0][parentGroupName].push(groupName);

        const groupInfo = {
          $rowGroupValue: groupName,
          $rowDisplayGroupValue: rowDisplayGroupValue,
          $groupLevel: groupLevel,
          $isGroupRow: true,
          $hasChildrenGroups: hasChildrenGroups,
          id: me.generateId(),
          childrenAmount: me.groupsChildren[groupName].length,
          expanded,
          $agValues: {}
        };

        if (!hasChildrenGroups) {
          me.aggregations.forEach(aggregation => {
            const values = me.groupsChildren[groupName].map(rowData => rowData[aggregation.index]);
            groupInfo.$agValues[aggregation.index] = me.getAggregationResult(aggregation, values);
          });

          groupInfo.amount = groupInfo.childrenAmount;

          if (groupInfo.expanded) {
            me.expandedGroupsWithDataChildren[groupName] = true;
          }
        } else {
          me.aggregations.forEach(aggregation => {
            const values = me.groupsChildren[groupName].map(groupData => groupData.$agValues[aggregation.index]);
            groupInfo.$agValues[aggregation.index] = me.getAggregationResult(aggregation, values);
          });

          groupInfo.amount = me.groupsChildren[groupName].reduce((sum, child) => sum + child.amount, 0);
        }

        me.groupDetails[groupName] = groupInfo;
        if (groupLevel !== 0) {
          me.groupsChildren[parentGroup].push(groupInfo);
        }
      });

      if (groupLevel !== 0) {
        const parentGroupNames = Object.keys(parentGroups);
        me.generateGroupsInfo(parentGroupNames, groupLevel - 1);
      }
    },

    generateGroupsInfoForFiltering(groupNames, groupLevel) {
      const me = this;
      const parentGroups = {};
      let hasChildrenGroups = true;

      if (groupNames === undefined) {
        me.groupsChildrenForFiltering = Object.groupBy(me.filteredData, row => row.$rowGroupValue);
        groupNames = Object.keys(me.groupsChildrenForFiltering);
        groupLevel = me.rowGroups.length - 1;
        hasChildrenGroups = false;
        me.groupDetailsForFiltering = {};
        me.levelsWithGroupsForFiltering = [];
        me.expandedGroupsWithDataChildrenForFiltering = {};
      }

      groupNames.forEach(groupName => {
        const groupInfo = me.groupDetails[groupName];
        const splitted = groupName.split('/');
        const rowDisplayGroupValue = splitted.pop();
        let parentGroupName = 'root';

        if (groupLevel !== 0) {
          parentGroupName = splitted.join('/');
          parentGroups[parentGroupName] = true;
        }

        const parentGroup = splitted.join('/');
        const expanded = me.expandedGroups[groupName] || false;

        me.groupsChildrenForFiltering[parentGroup] = me.groupsChildrenForFiltering[parentGroup] || [];
        me.levelsWithGroupsForFiltering[groupLevel] = me.levelsWithGroupsForFiltering[groupLevel] || [{}];
        me.levelsWithGroupsForFiltering[groupLevel][0][parentGroupName] = me.levelsWithGroupsForFiltering[groupLevel][0][parentGroupName] || [];
        me.levelsWithGroupsForFiltering[groupLevel][0][parentGroupName].push(groupName);

        if(!groupInfo){
          console.error(`groupDetails does not contain ${groupName}`);
        }

        const groupInfoForFiltering = {
          $rowGroupValue: groupName,
          $rowDisplayGroupValue: rowDisplayGroupValue,
          $groupLevel: groupLevel,
          $isGroupRow: true,
          $hasChildrenGroups: hasChildrenGroups,
          id: groupInfo.id,
          childrenAmount: me.groupsChildrenForFiltering[groupName].length,
          expanded,
          $agValues: {}
        };

        if (!hasChildrenGroups) {
          me.aggregations.forEach(aggregation => {
            const values = me.groupsChildrenForFiltering[groupName].map(rowData => rowData[aggregation.index]);
            groupInfoForFiltering.$agValues[aggregation.index] = me.getAggregationResult(aggregation, values);
          });

          groupInfoForFiltering.amount = groupInfoForFiltering.childrenAmount;

          if (groupInfoForFiltering.expanded) {
            me.expandedGroupsWithDataChildrenForFiltering[groupName] = true;
          }
        } else {
          me.aggregations.forEach(aggregation => {
            const values = me.groupsChildrenForFiltering[groupName].map(groupData => groupData.$agValues[aggregation.index]);
            groupInfoForFiltering.$agValues[aggregation.index] = me.getAggregationResult(aggregation, values);
          });

          groupInfoForFiltering.amount = me.groupsChildrenForFiltering[groupName].reduce((sum, child) => sum + child.amount, 0);
        }

        me.groupDetailsForFiltering[groupName] = groupInfoForFiltering;
        if (groupLevel !== 0) {
          me.groupsChildrenForFiltering[parentGroup].push(groupInfoForFiltering);
        }
      });

      if (groupLevel === 0) {
        me.generateDisplayedGroupsForFiltering(groupNames);
      } else {
        const parentGroupNames = Object.keys(parentGroups);
        me.generateGroupsInfoForFiltering(parentGroupNames, groupLevel - 1);
      }
    },

    clearGroups() {
      const me = this;

      delete me.groupsChildren;
      delete me.levelsWithGroups;
      delete me.expandedGroupsWithDataChildren;

      me.data.forEach(rowData => {
        delete rowData.$rowGroupValue;
      });
    },

    set$rowGroupValue(data) {
      if(data === undefined){
        data = this.data;
      }

      data.forEach(rowData => {
        let $rowGroupValues = [];

        this.rowGroups.forEach(group => {
          $rowGroupValues.push(rowData[group]);
        });

        rowData.$rowGroupValue = $rowGroupValues.join('/');
      });

      return data;
    },

    setExpandedGroups() {
      const me = this;

      me.expandedGroups = {};

      if (typeof me.rowGroupExpanded === 'function') {
        const groupNames = Object.keys(Object.groupBy(me.data, row => row.$rowGroupValue));
        const parentGroups = {};
        groupNames.forEach(group => {
          const splitted = group.split('/');
          const iL = splitted.length;

          for (let i = 0; i < iL; i++) {
            splitted.pop();
            parentGroups[splitted.join('/')] = true;
          }
        });

        const parentGroupNames = Object.keys(parentGroups);

        const rowGroupExpanded = [].concat(groupNames).concat(parentGroupNames).sort();

        rowGroupExpanded.forEach(group => {
          const expanded = me.rowGroupExpanded(group);

          me.expandedGroups[group] = expanded;

          if (expanded) {
            rowGroupExpanded.push(group);
          }
        });

        me.rowGroupExpanded = rowGroupExpanded;
      } else {
        me.rowGroupExpanded.forEach(group => {
          me.expandedGroups[group] = true;
        });
      }
    },

    generateDisplayedGroupsForFiltering(zeroLevelGroups) {
      const me = this;

      me.displayedGroupsForFiltering = {};

      zeroLevelGroups.forEach(group => {
        me.displayedGroupsForFiltering[group] = true;
      });

      me.rowGroupExpanded.forEach(group => {
        const subGroups = me.groupsChildrenForFiltering[group];

        subGroups?.forEach(({$rowGroupValue}) => {
          if ($rowGroupValue) {
            me.displayedGroupsForFiltering[$rowGroupValue] = true;
          }
        });
      });
    },

    sortGroups() {
      const me = this;

      me.levelsWithGroups.forEach(({0: groupsContainer}) => {
        for (const group in groupsContainer) {
          const subGroups = groupsContainer[group];
          const newSubGroupsOrder = subGroups.toSorted((a, b) => {
            const groupA = me.groupDetails[a];
            const groupB = me.groupDetails[b];

            switch (me.defaultRowGroupSort) {
              case 'asc-amount':
                return groupA.amount - groupB.amount;
              case 'desc-amount':
                return groupB.amount - groupA.amount;
            }
          });

          groupsContainer[group] = newSubGroupsOrder;
        }
      });
    },

    sortGroupsForFiltering() {
      const me = this;
      const levelsWithGroupsForFiltering = [];

      me.levelsWithGroups.forEach(({0: groupsContainer}, level) => {
        const filteredGroupsContainer = {};

        for (const group in groupsContainer) {
          const subGroups = groupsContainer[group].filter(value => me.displayedGroupsForFiltering[value]);

          if (me.displayedGroupsForFiltering[group] || level === 0) {
            filteredGroupsContainer[group] = subGroups;
          }
        }

        levelsWithGroupsForFiltering[level] = [filteredGroupsContainer];
      });

      me.levelsWithGroupsForFiltering = levelsWithGroupsForFiltering;
    },

    getSortedDisplayedGroups() {
      const me = this;
      let displayedGroupsSorted = [];

      const recursiveDataExtraction = (levelGroups, level = 0) => {
        levelGroups.forEach((group) => {
          displayedGroupsSorted.push(group);

          if (me.expandedGroups[group] && level !== me.levelsWithGroups.length - 1) {
            const nextLevel = level + 1;
            const levelGroups = me.levelsWithGroups[nextLevel][0][group];

            recursiveDataExtraction(levelGroups, nextLevel);
          }
        });
      };


      switch (me.defaultRowGroupSort) {
        case 'desc-string':
          displayedGroupsSorted = Array.from(Object.keys(me.displayedGroups)).sort();
          break;
        case 'desc-amount':
          const zeroLevelGroups = me.levelsWithGroups[0][0].root;
          recursiveDataExtraction(zeroLevelGroups);
          break;
        default:
          console.error(`Not supported defaultRowGroupSort value ${me.defaultRowGroupSort}`);
      }

      return displayedGroupsSorted;
    },

    getSortedDisplayedGroupsForFiltering() {
      const me = this;
      let displayedGroupsSorted = [];

      const recursiveDataExtraction = (levelGroups, level = 0) => {
        levelGroups.forEach((group) => {
          displayedGroupsSorted.push(group);

          if (me.expandedGroups[group] && level !== me.levelsWithGroupsForFiltering.length - 1) {
            const nextLevel = level + 1;
            const levelGroups = me.levelsWithGroupsForFiltering[nextLevel][0][group];

            recursiveDataExtraction(levelGroups, nextLevel);
          }
        });
      };

      switch (me.defaultRowGroupSort) {
        case 'desc-string':
          displayedGroupsSorted = Array.from(Object.keys(me.displayedGroupsForFiltering)).sort();
          break;
        case 'desc-amount':
          const zeroLevelGroups = me.levelsWithGroupsForFiltering[0][0].root;
          recursiveDataExtraction(zeroLevelGroups);
          break;
        default:
          console.error(`Not supported defaultRowGroupSort value ${me.defaultRowGroupSort}`);
      }

      return displayedGroupsSorted;
    },

    getAggregationResult(aggregation, values) {
      let result = '';

      if (typeof aggregation.fn === 'function') {
        result = aggregation.fn(values);
      } else {
        switch (aggregation.fn) {
          case 'sum':
            result = values.reduce((sum, value) => sum + value, 0);
            break;
          case 'avg':
            const sum = values.reduce((sum, value) => sum + value, 0);
            const avg = parseFloat((sum / values.length).toFixed(2));

            result = avg;
            break;
          case 'min':
            result = values.sort()[0];
            break;
          case 'max':
            result = values.sort()[values.length - 1];
            break;
        }
      }

      return result;
    },

    expand(group) {
      const me = this;
      const groupDetails = me.groupDetails[group];
      const rowIndex = me.idRowIndexesMap.get(groupDetails.id);

      groupDetails.expanded = true;
      me.expandedGroups[group] = true;
      if (!groupDetails.$hasChildrenGroups) {
        me.expandedGroupsWithDataChildren[group] = true;
      }

      const groupData = me.getGroupExpandedChildren(group);

      me.displayedData.splice(rowIndex + 1, 0, ...groupData);
      me.rowGroupExpanded.push(group);

      me.updateIndexes();
    },

    expandForFiltering(group) {
      const me = this;
      const groupDetails = me.groupDetailsForFiltering[group];
      const rowIndex = me.idRowIndexesMap.get(groupDetails.id);

      groupDetails.expanded = true;
      me.expandedGroups[group] = true;
      if (!groupDetails.$hasChildrenGroups) {
        me.expandedGroupsWithDataChildren[group] = true;
        me.expandedGroupsWithDataChildrenForFiltering[group] = true;
      }

      const groupData = me.getGroupExpandedChildrenForFiltering(group);

      me.displayedData.splice(rowIndex + 1, 0, ...groupData);
      me.rowGroupExpanded.push(group);
      me.updateIndexes();
    },

    expandAll() {
      const me = this;

      me.prevAction = '';

      me.rowGroupExpanded = () => {
        return true;
      };

      me.rowGroupExpanded = [];

      for (const group in me.groupDetails) {
        const groupDetails = me.groupDetails[group];

        me.expandedGroups[group] = true;
        me.rowGroupExpanded.push(group);
        groupDetails.expanded = true;

        if (!groupDetails.$hasChildrenGroups) {
          me.expandedGroupsWithDataChildren[group] = true;
        }
      }

      me.generateDisplayedGroupedData();
      me.setIndexAndItemsMaps();
    },

    toggleExpand(group) {
      const me = this;
      const groupDetails = me.groupDetails[group];

      if (groupDetails.expanded) {
        me.collapse(group);
      } else {
        me.expand(group);
      }
    },

    collapse(group) {
      const me = this;
      const groupData = me.getGroupExpandedChildren(group);
      const groupDetails = me.groupDetails[group];
      const rowIndex = me.idRowIndexesMap.get(groupDetails.id);

      groupDetails.expanded = false;
      delete me.expandedGroups[group];
      if (!groupDetails.$hasChildrenGroups) {
        delete me.expandedGroupsWithDataChildren[group];
      }

      me.displayedData.splice(rowIndex + 1, groupData.length);
      me.rowGroupExpanded = me.rowGroupExpanded.filter(value => value !== group);

      me.updateIndexes();
    },

    collapseForFiltering(group) {
      const me = this;
      const groupDetails = me.groupDetailsForFiltering[group];
      const groupData = me.getGroupExpandedChildrenForFiltering(group);
      const rowIndex = me.idRowIndexesMap.get(groupDetails.id);

      groupDetails.expanded = false;
      delete me.expandedGroups[group];
      if (!groupDetails.$hasChildrenGroups) {
        delete me.expandedGroupsWithDataChildren[group];
        delete me.expandedGroupsWithDataChildrenForFiltering[group];
      }

      me.displayedData.splice(rowIndex + 1, groupData.length);
      me.rowGroupExpanded = me.rowGroupExpanded.filter(value => value !== group);

      me.updateIndexes();
    },

    collapseAll() {
      const me = this;

      me.prevAction = '';

      me.rowGroupExpanded = () => {
        return false;
      };

      me.rowGroupExpanded = [];

      for (const group in me.groupDetails) {
        me.expandedGroups[group] = false;
        me.groupDetails[group].expanded = false;
      }

      me.generateDisplayedGroupedData();
      me.setIndexAndItemsMaps();
    },

    getGroupExpandedChildren(group, groupData = []) {
      const me = this;
      const groupDetails = me.groupDetails[group];
      let groupChildren = me.groupsChildren[group].slice();

      if (!groupDetails.$hasChildrenGroups && me.sorters.length) {
        groupChildren = me.sortPieceOfData(groupChildren);
      } else {
        // TODO:Requires to take data from levelsWithGroups
        groupChildren.sort((groupA, groupB) => {
          switch (me.defaultRowGroupSort) {
            case 'asc-amount':
              return groupA.amount - groupB.amount;
            case 'desc-amount':
              return groupB.amount - groupA.amount;
          }
        });
      }

      groupChildren.forEach(item => {
        groupData.push(item);
        if (item.$isGroupRow && item.expanded) {
          const itemGroup = item.$rowGroupValue;

          me.getGroupExpandedChildren(itemGroup, groupData);
        }
      });

      return groupData;
    },

    getGroupExpandedChildrenForFiltering(group, groupData = []) {
      const me = this;
      const groupDetails = me.groupDetailsForFiltering[group];
      let groupChildren = me.groupsChildrenForFiltering[group].slice();

      if (!groupDetails.$hasChildrenGroups && me.sorters.length) {
        groupChildren = me.sortPieceOfData(groupChildren);
      }

      groupChildren.forEach(item => {
        groupData.push(item);
        if (item.$isGroupRow && item.expanded) {
          const itemGroup = item.$rowGroupValue;

          me.getGroupExpandedChildrenForFiltering(itemGroup, groupData);
        }
      });

      return groupData;
    },

    reConfigRowGroups(rowGroups) {
      const me = this;
      const {
        sorters,
        filters
      } = me;

      me.setRowGroups(rowGroups);

      me.prevAction = '';

      if(!me.$dontDropExpandedGroups){
        me.rowGroupExpanded = [];
        me.expandedGroups = {};
      }

      delete me.groupsChildren;
      if (rowGroups.length === 0) {
        me.clearGroups();
        if (!(sorters.length || filters.length)) {
          delete me.displayedData;
        } else {
          // Requires resort and re-filter because sorted and filtered data will be different for grouping.
          if (filters.length) {
            me.reFilter(false);
          }

          if (sorters.length) {
            me.reSort();
          }
        }
      } else {
        if (filters.length) {
          me.set$rowGroupValue();
          me.generateGroupsInfo();
          me.sortGroups();

          me.rowGroupDataForFiltering();
          me.sortGroupsForFiltering();
          me.generateDisplayedGroupedDataForFiltering();
          me.updateIndexes();
        } else {
          me.set$rowGroupValue();
          me.generateGroupsInfo();
          me.sortGroups();
          me.generateDisplayedGroupedData();
        }
      }

      //??? Maybe a bug, maybe it requires testing sorters.length
      if (!filters.length || !rowGroups.length) {
        me.setIndexAndItemsMaps();
      }
    },

    setRowGroups(rowGroups) {
      this.rowGroups = rowGroups;
    },

    getGroupDataForFiltering() {
      const me = this;
      const sortedData = me.displayedData.slice();

      for (const group in me.expandedGroupsWithDataChildrenForFiltering) {
        if (me.isParentCollapsed(group)) {
          continue;
        }

        const groupData = me.groupsChildrenForFiltering[group].slice();
        const groupDetails = me.groupDetailsForFiltering[group];
        const rowIndex = me.idRowIndexesMap.get(groupDetails.id);

        sortedData.splice(rowIndex + 1, groupData.length, ...groupData);
      }

      return sortedData;
    },

    addGroup(group){
      const me = this;
      const splitted = group.split('/');

      me.levelsWithGroups = me.levelsWithGroups || [
        [{
          root: []
        }]
      ];
      me.groupsChildren = me.groupsChildren || {};
      me.expandedGroupsWithDataChildren = me.expandedGroupsWithDataChildren || {};
      me.expandedGroups = me.expandedGroups || {};
      if(typeof me.rowGroupExpanded === 'function'){
        me.rowGroupExpanded = [];
      }

      me.expandedGroupsWithDataChildren[group] = true;

      const addToGroupsChildren = [];

      for(let i = 0;i<splitted.length;i++){
        const name = splitted.slice(0, splitted.length - i).join('/');
        const groupLevel = name.split('/').length - 1;

        if(me.groupDetails[name]) {
          break;
        }

        const parentGroup = splitted.slice(0, splitted.length - i - 1).join('/');

        if(groupLevel === 0){
          if(!me.levelsWithGroups[0][0].root.includes(name)){
            me.levelsWithGroups[0][0].root.push(name);
          }
        }
        else {
          if(me.levelsWithGroups === undefined){
            me.levelsWithGroups = [
              [{
                root: []
              }]
            ];
          }

          if(me.levelsWithGroups[groupLevel] === undefined){
            me.levelsWithGroups[groupLevel] = [{}];
          }

          if(!me.levelsWithGroups[groupLevel][0][parentGroup]){
            me.levelsWithGroups[groupLevel][0][parentGroup] = [];
          }

          me.levelsWithGroups[groupLevel][0][parentGroup].push(name);
        }

        if(!me.expandedGroups[name]){
          me.rowGroupExpanded.push(name);
        }

        me.expandedGroups[name] = true;
        me.groupsChildren[name] = [];

        me.groupDetails[name] = {
          $rowGroupValue: name,
          $rowDisplayGroupValue: splitted[splitted.length - i - 1],
          $groupLevel: groupLevel,
          $isGroupRow: true,
          $hasChildrenGroups: group !== name,
          id: me.generateId(),
          childrenAmount: 0,
          amount: 0,
          expanded: true,
          $agValues: {}
        };

        addToGroupsChildren.push(name);
      }

      addToGroupsChildren.forEach(group => {
        const splitted = group.split('/');
        const parentGroup = splitted.slice(0, splitted.length - 1).join('/');

        me.groupsChildren[parentGroup] = me.groupsChildren[parentGroup] || [];

        me.groupsChildren[parentGroup].push(me.groupDetails[group]);
        if(me.groupDetails[parentGroup].$hasChildrenGroups){
          me.groupsChildren[parentGroup].sort((groupA, groupB) => {
            switch (me.defaultRowGroupSort) {
              case 'asc-amount':
                return groupA.amount - groupB.amount;
              case 'desc-amount':
                return groupB.amount - groupA.amount;
            }
          });
        }
      });
    }
  };

  Object.assign(Fancy.Store.prototype, StoreMixinRowGroup);

})();

(()=> {

  /**
   * @mixin StoreMixinSelection
   */

  const StoreMixinSelection = {
    selectRowItem(item, value = true) {
      const me = this;
      const group = item.$rowGroupValue;

      item.$selected = value;
      me.updateSelectedItemsMap(value, item);

      if (group) {
        me.updateSelectedRowGroupsChildren(group, value, item);
        me.updateSelectedStatus(group);

        const splitted = group.split('/');
        const iL = splitted.length;

        for (let i = 0; i < iL - 1; i++) {
          const _group = splitted.join('/');
          const groupDetail = me.groupDetails[_group];
          const groupItem = me.idItemMap.get(groupDetail.id);
          splitted.pop();
          const parentGroup = splitted.join('/');

          if(value || !groupItem.selectedStatus){
            me.updateSelectedRowGroupsChildren(parentGroup, value, groupItem);
          }
          me.updateSelectedStatus(parentGroup);
        }
      }
    },

    updateGroupsChildrenSelection(group, value) {
      const me = this;

      me.groupsChildren[group].forEach(childItem => {
        childItem.$selected = value;

        if (!childItem.$isGroupRow) {
          me.updateSelectedItemsMap(value, childItem);
        }
        me.updateSelectedRowGroupsChildren(group, value, childItem);

        const childGroup = childItem.$rowGroupValue;

        if (childItem.$isGroupRow) {
          if (value) {
            childItem.selectedStatus = 'full';
          } else {
            childItem.selectedStatus = false;
          }
          me.updateGroupsChildrenSelection(childGroup, value);
        }
      });
    },

    selectGroupRowItems(item, value = true) {
      const me = this;
      const group = item.$rowGroupValue;

      item.$selected = value;
      if (value) {
        item.selectedStatus = 'full';
      } else {
        item.selectedStatus = false;
      }

      if (!item.$isGroupRow) {
        me.updateSelectedItemsMap(value, item);
      }
      me.updateGroupsChildrenSelection(group, value);
      me.updateSelectedStatus(group);

      const splitted = group.split('/');
      const iL = splitted.length;

      for (let i = 0; i < iL - 1; i++) {
        const _group = splitted.join('/');
        const groupDetail = me.groupDetails[_group];
        const groupItem = me.idItemMap.get(groupDetail.id);
        splitted.pop();
        const parentGroup = splitted.join('/');

        me.updateSelectedRowGroupsChildren(parentGroup, value, groupItem);
        me.updateSelectedStatus(parentGroup);
      }
    },

    updateSelectedItemsMap(value, item) {
      const me = this;

      if (item.$isGroupRow) {
        console.warn('It is wrong to use selectedItemsMap for group row. Only for items that do not have children.');
      }

      if (value) {
        me.selectedItemsMap.set(item.id, item);
      } else {
        me.selectedItemsMap.delete(item.id);
      }
    },

    updateSelectedRowGroupsChildren(group, value, item) {
      const me = this;
      const selectedRowGroupsChildren = me.selectedRowGroupsChildren;

      if (value) {
        if (selectedRowGroupsChildren[group] === undefined) {
          selectedRowGroupsChildren[group] = new Set();
        }
        selectedRowGroupsChildren[group].add(item.id);
      } else if (selectedRowGroupsChildren[group]) {
        selectedRowGroupsChildren[group].delete(item.id);
        if (selectedRowGroupsChildren[group].size === 0) {
          delete selectedRowGroupsChildren[group];
        }
      }
    },

    updateSelectedStatus(group) {
      const me = this;
      const groupDetail = me.groupDetails[group];
      const groupItem = me.idItemMap.get(groupDetail.id);

      let groupSelectedStatus;

      if (!me.selectedRowGroupsChildren[group]) {
        groupSelectedStatus = false;
        groupItem.$selected = false;
        me.selectedItemsMap.delete(groupDetail.id);
      } else if (me.groupsChildren[group].length === me.selectedRowGroupsChildren[group].size) {
        let childIsPartlySelected = false;
        if(groupItem.$hasChildrenGroups){
          const groupChildren = me.groupsChildren[group];
          for(let i = 0;i<groupChildren.length;i++){
            const subGroupItem = groupChildren[i];
            if(subGroupItem.selectedStatus === 'partly'){
              childIsPartlySelected = true;
              break;
            }
          }
        }

        if(childIsPartlySelected){
          groupSelectedStatus = 'partly';
          delete groupItem.$selected;
        }
        else {
          groupSelectedStatus = 'full';
          groupItem.$selected = true;
        }
        //me.updateSelectedRowGroupsChildren()
      } else {
        groupSelectedStatus = 'partly';
        delete groupItem.$selected;
      }

      me.groupDetails[group].selectedStatus = groupSelectedStatus;
    },

    selectAll(value = true) {
      const me = this;

      if (value) {
        for (const group in me.groupsChildren) {
          const children = me.groupsChildren[group];
          const groupDetail = me.groupDetails[group];

          if (!groupDetail) {
            // TODO: fix case with '' group
            // Maybe it is root group
            continue;
          }

          groupDetail.selectedStatus = 'full';
          groupDetail.$selected = true;

          children.forEach(item => {
            me.updateSelectedRowGroupsChildren(group, true, item);
          });
        }

        me.data.forEach(item => {
          item.$selected = true;
          me.selectedItemsMap.set(item.id, item);
        });
      } else {
        for (const group in me.groupsChildren) {
          const children = me.groupsChildren[group];
          const groupDetail = me.groupDetails[group];

          if (!groupDetail) {
            // TODO: fix case with '' group
            // Maybe it is root group
            continue;
          }

          groupDetail.selectedStatus = false;
          delete groupDetail.$selected;

          children.forEach(item => {
            me.updateSelectedRowGroupsChildren(group, false, item);
          });
        }

        me.data.forEach(item => {
          delete item.$selected;
          me.selectedItemsMap.delete(item.id);
        });
      }
    }
  };

  Object.assign(Fancy.Store.prototype, StoreMixinSelection);
})();

(()=> {
  const typeOf = Fancy.typeOf;

  /**
   * @mixin StoreMixinEdit
   */

  const StoreMixinEdit = {
    setById(id, key, value){
      const me = this;
      const item = me.idItemMap.get(id);

      if(!item){
        return false;
      }

      if(typeOf(key) === 'object'){
        for(let p in key){
          item[p] = key[p];
        }
      }
      else {
        item[key] = value;
      }

      return item;
    },
    removeItemById(id){
      const me = this;
      const item = me.idItemMap.get(id);
      //const rowIndex = item.originalRowIndex;
      const rowIndex = item.originalDataRowIndex;

      me.idItemMap.delete(id);
      me.idRowIndexesMap.delete(id);
      me.selectedItemsMap.delete(id);

      me.data[rowIndex] = undefined;

      return item;
    },
    add(items, position){
      const me = this;

      if(typeOf(items) === 'object'){
        items = [items];
      }

      items.forEach(item => {
        if (!item.id) {
          item.id = me.generateId();
        }
      });

      if(me.rowGroups.length) {
        items = me.set$rowGroupValue(items);
        items.forEach(item => {
          const group = item.$rowGroupValue;
          let groupDetail = me.groupDetails[group];

          if (!groupDetail) {
            me.addGroup(group);
          }

          me.groupsChildren[group].push(item);

          const splitted = group.split('/');

          for(let i = 0;i<splitted.length;i++) {
            const name = splitted.slice(0, splitted.length - i).join('/');
            const groupDetails = me.groupDetails[name];

            groupDetails.amount++;
            groupDetails.childrenAmount++;
          }

          me.data.push(item);
        });

        me.rowGroupExpanded.sort();

        me.generateDisplayedGroupedData();
        me.setIndexAndItemsMaps();

        return;
      }

      if(position === undefined){
        me.data.push(...items);

        if(me.displayedData){
          me.displayedData.push(...items);
        }
      }
      else if(position === 0){
        me.data.unshift(...items);
        if(me.displayedData){
          me.displayedData.unshift(...items);
        }
      }
      else if(typeOf(position) === 'number'){
        me.data.splice(position, 0, ...items);
        if(me.displayedData){
          me.displayedData.splice(position, 0, ...items);
        }
      }
      else if(typeOf(position) === 'object'){
        me.data.splice(position.originalRowIndex, 0, ...items);
        if(me.displayedData){
          me.displayedData.splice(position.rowIndex, 0, ...items);
        }
      }

      me.updateIndexes();
    }
  };

  Object.assign(Fancy.Store.prototype, StoreMixinEdit);

})();

(() => {
  const {
    BODY_VERTICAL_SCROLL,
    BODY_VERTICAL_SCROLL_CONTAINER,
    BODY_VERTICAL_SCROLL_SIZE,
    BODY_HORIZONTAL_SCROLL,
    BODY_HORIZONTAL_SCROLL_CONTAINER,
    BODY_HORIZONTAL_SCROLL_SIZE,
    SCROLLBAR_INVISIBLE
  } = Fancy.cls;

  class Scroller {
    startRow = 0;
    endRow = 0;

    scrollTop = 0;
    scrollLeft = 0;
    maxScrollTop = 0;

    topBufferRows = 10;
    bufferRows = 30;
    extraBufferRows = 20;

    columnViewStart = 0;
    columnViewEnd = 0;
    columnsViewRange = [];

    scrollBarWidth = 17;

    isDomInvisibleScrollbar = false;

    constructor(config) {
      const me = this;

      me.grid = config.grid;

      me.calcScrollBarWidth();
      me.calcViewRange();

      me.initResizeObserver();
    }

    deltaChange(delta) {
      const me = this;

      if(!me.isVerticalVisible()){
        me.scrollTop = 0;
        me.verticalScrollContainerEl.scrollTop = 0;
        return false;
      }

      let changed = false;
      let scrollTop = me.scrollTop - delta;

      if (scrollTop < 0) {
        scrollTop = 0;
      }

      if(scrollTop > me.maxScrollTop){
        scrollTop = me.maxScrollTop;
      }

      if(me.scrollTop !== scrollTop){
        changed = true;
      }

      me.scrollTop = scrollTop;
      me.verticalScrollContainerEl.scrollTop = scrollTop;

      return changed;
    }

    horizontalDeltaChange(delta){
      const me = this;

      if(!me.isHorizontalVisible()){
        me.scrollLeft = 0;
        me.horizontalScrollContainerEl.scrollLeft = 0;
        return false;
      }

      let changed = false;
      let scrollLeft = me.scrollLeft - delta;

      if (scrollLeft < 0) {
        scrollLeft = 0;
      }

      if(me.horizontalScrollContainerEl.scrollLeft !== scrollLeft){
        changed = true;
      }

      me.horizontalScrollContainerEl.scrollLeft = scrollLeft;
      me.scrollLeft = me.horizontalScrollContainerEl.scrollLeft;

      return changed;
    }

    calcVisibleRows() {
      const me = this;
      let requiresRenderMoreRows = false;
      const newBufferRows = Math.ceil(me.grid.height / me.grid.rowHeight) + me.extraBufferRows;

      if(me.bufferRows < newBufferRows){
        requiresRenderMoreRows = true;
      }

      me.bufferRows = newBufferRows;

      return requiresRenderMoreRows;
    }

    calcMaxScrollTop() {
      const me = this;

      me.maxScrollTop = me.grid.store.getDisplayedDataTotal() * me.grid.rowHeight - me.grid.bodyEl.getBoundingClientRect().height;

      if(me.maxScrollTop < 0){
        me.maxScrollTop = 0;
      }
    }

    updateScrollTop() {
      const me = this;

      if(me.scrollTop > me.maxScrollTop){
        me.scrollTop = me.maxScrollTop;
        me.verticalScrollContainerEl.scrollTop = me.maxScrollTop;
      }
    }

    getStartRow() {
      const me = this;

      me.calcStartRow();

      return me.startRow;
    }

    calcStartRow() {
      const me = this;
      let startRow = Math.round(me.scrollTop / me.grid.rowHeight) - me.topBufferRows;
      const endRow = me.getEndRow();
      const deltaRows = endRow - startRow;

      if (deltaRows < me.bufferRows) {
        startRow = endRow - me.bufferRows;
      }

      if (startRow < 0) {
        startRow = 0;
      }

      me.startRow = startRow;
    }

    getEndRow() {
      const me = this;
      const store = me.grid.store;
      const {
        rowGroups
      } = store;

      const displayedDataTotal = store.getDisplayedDataTotal();

      let startRow = Math.round(me.scrollTop / me.grid.rowHeight) - me.topBufferRows;
      let endRow = startRow + me.bufferRows;

      if (!rowGroups.length && endRow > me.grid.store.getDataTotal()) {
        endRow = me.grid.store.getDataTotal();
      }

      if (endRow > displayedDataTotal) {
        endRow = displayedDataTotal;
      }

      me.endRow = endRow;

      return endRow;
    }

    render() {
      const me = this;

      me.renderVerticalScroll();
      me.renderHorizontalScroll();

      me.ons();
    }

    renderVerticalScroll() {
      const me = this;

      const verticalScrollEl = document.createElement('div');
      verticalScrollEl.classList.add(BODY_VERTICAL_SCROLL);

      if (me.isDomInvisibleScrollbar) {
        verticalScrollEl.classList.add(SCROLLBAR_INVISIBLE);
      }

      const verticalScrollContainerEl = document.createElement('div');
      verticalScrollContainerEl.classList.add(BODY_VERTICAL_SCROLL_CONTAINER);
      verticalScrollContainerEl.style.width = me.scrollBarWidth + 'px';

      const verticalScrollSizeEl = document.createElement('div');
      verticalScrollSizeEl.classList.add(BODY_VERTICAL_SCROLL_SIZE);
      verticalScrollSizeEl.style.width = me.scrollBarWidth + 'px';

      verticalScrollContainerEl.appendChild(verticalScrollSizeEl);
      verticalScrollEl.appendChild(verticalScrollContainerEl);
      me.grid.bodyEl.appendChild(verticalScrollEl);

      me.verticalScrollEl = verticalScrollEl;
      me.verticalScrollContainerEl = verticalScrollContainerEl;
      me.verticalScrollSizeEl = verticalScrollSizeEl;

      me.setVerticalSize();
    }

    renderHorizontalScroll() {
      const me = this;

      const horizontalScrollEl = document.createElement('div');
      horizontalScrollEl.classList.add(BODY_HORIZONTAL_SCROLL);

      if (me.isDomInvisibleScrollbar) {
        horizontalScrollEl.classList.add(SCROLLBAR_INVISIBLE);
      }

      horizontalScrollEl.style.height = me.scrollBarWidth + 'px';
      horizontalScrollEl.style.minHeight = me.scrollBarWidth + 'px';
      horizontalScrollEl.style.maxHeight = me.scrollBarWidth + 'px';

      if (me.isDomInvisibleScrollbar || !me.isVerticalVisible()) {
        horizontalScrollEl.style.width = `100%`;
      } else {
        horizontalScrollEl.style.width = `calc(100% - ${me.scrollBarWidth}px)`;
      }

      const horizontalScrollContainerEl = document.createElement('div');
      horizontalScrollContainerEl.classList.add(BODY_HORIZONTAL_SCROLL_CONTAINER);
      horizontalScrollContainerEl.style.height = me.scrollBarWidth + 'px';
      horizontalScrollContainerEl.style.minHeight = me.scrollBarWidth + 'px';
      horizontalScrollContainerEl.style.maxHeight = me.scrollBarWidth + 'px';

      const horizontalScrollSizeEl = document.createElement('div');
      horizontalScrollSizeEl.classList.add(BODY_HORIZONTAL_SCROLL_SIZE);
      horizontalScrollSizeEl.style.height = me.scrollBarWidth + 'px';
      horizontalScrollSizeEl.style.minHeight = me.scrollBarWidth + 'px';
      horizontalScrollSizeEl.style.maxHeight = me.scrollBarWidth + 'px';

      horizontalScrollContainerEl.appendChild(horizontalScrollSizeEl);
      horizontalScrollEl.appendChild(horizontalScrollContainerEl);
      me.grid.gridEl.appendChild(horizontalScrollEl);

      me.horizontalScrollEl = horizontalScrollEl;
      me.horizontalScrollContainerEl = horizontalScrollContainerEl;
      me.horizontalScrollSizeEl = horizontalScrollSizeEl;

      me.setHorizontalSize();
    }

    updateHorizontalScrollSize() {
      const me = this,
        horizontalScrollEl = me.horizontalScrollEl;

      if (me.isDomInvisibleScrollbar) {
        horizontalScrollEl.style.width = `100%`;
      } else {
        if (me.isVerticalVisible()) {
          horizontalScrollEl.style.width = `calc(100% - ${me.scrollBarWidth}px)`;
        } else {
          horizontalScrollEl.style.width = `100%`;
        }
      }
    }

    ons() {
      const me = this;

      me.verticalScrollContainerEl.addEventListener('scroll', me.onVerticalScroll);
      me.horizontalScrollContainerEl.addEventListener('scroll', me.onHorizontalScroll);
    }

    onVerticalScroll = () => {
      const me = this;

      if(!me.grid.wheelScrolling){
        me.scrollTop = me.verticalScrollContainerEl.scrollTop;
        me.grid.bodyInnerEl.scrollTop = me.scrollTop;

        cancelAnimationFrame(me.grid.animationRenderId);

        me.grid.animationRenderId = requestAnimationFrame(() => {
          me.grid.renderVisibleRows();
        });

        cancelAnimationFrame(me.grid.animationRemoveId);

        me.grid.animationRemoveId = requestAnimationFrame(() => {
          me.grid.removeNotNeededRows();
        });
      }
    }

    onHorizontalScroll = () => {
      const me = this;

      me.scrollLeft = me.horizontalScrollContainerEl.scrollLeft;
      me.grid.headerEl.scrollLeft = me.scrollLeft;
      me.grid.bodyInnerEl.scrollLeft = me.scrollLeft;

      if (me.grid.filterBar) {
        me.grid.filterBarEl.scrollLeft = me.scrollLeft;
      }

      cancelAnimationFrame(me.grid.horizontalScrollId);

      me.grid.horizontalScrollId = requestAnimationFrame(() => {
        me.generateNewRange();
      });
    }

    generateNewRange(doRender = true) {
      const me = this;
      const {
        columnStart: newColumnStart,
        columnEnd: newColumnEnd,
        range: newRange
      } = me.getColumnsViewRange();

      const newRangeSet = new Set(newRange);
      const rangeSet = new Set(me.columnsViewRange);

      const columnsToAdd = [];
      const columnsToRemove = [];

      if(doRender){
        newRange.forEach(newColumnIndex => {
          const column = me.grid.columns[newColumnIndex];

          if (!column.hidden && !rangeSet.has(newColumnIndex)) {
            columnsToAdd.push(newColumnIndex);
          }
        });

        rangeSet.forEach(columnIndex => {
          if (!newRangeSet.has(columnIndex)) {
            columnsToRemove.push(columnIndex);
          }
        });
      }

      me.columnsViewRange = newRange;
      me.columnViewStart = newColumnStart;
      me.columnViewEnd = newColumnEnd;

      me.grid.addColumnCells(columnsToAdd);
      me.grid.removeColumnCells(columnsToRemove);

      return {
        columnsViewRange: me.columnsViewRange,
        columnViewStart: me.columnViewStart,
        columnViewEnd: me.columnViewEnd,
        columnsToAdd,
        columnsToRemove
      }
    }

    setVerticalSize() {
      const me = this;
      const grid = me.grid;
      const store = grid.store;
      const {
        filters,
        rowGroups
      } = store;

      let height;

      if (filters.length || rowGroups.length) {
        height = store.getDisplayedDataTotal() * grid.rowHeight;
      } else {
        height = store.getDataTotal() * grid.rowHeight;
      }

      me.verticalScrollSizeEl.style.height = height + 'px';

      if (me.isVerticalVisible()) {
        me.verticalScrollEl.style.display = '';
      } else {
        me.verticalScrollEl.style.display = 'none';
      }
    }

    isHorizontalVisible() {
      const me = this;
      const bodyWidth = me.grid.bodyEl.getBoundingClientRect().width;
      const visibleColumnsWidth = me.grid.columns.reduce((sum, column) => {
        if (column.hidden) {
          return sum;
        }

        return sum + column.width;
      }, 0);

      return visibleColumnsWidth > bodyWidth;
    }

    isVerticalVisible() {
      const me = this;
      const grid = me.grid;
      const store = grid.store;
      const {
        filters,
        rowGroups
      } = store;
      const bodyHeight = grid.bodyEl.getBoundingClientRect().height;
      const rowHeight = grid.rowHeight;

      let visibleRowsHeight;

      if (filters.length || rowGroups.length) {
        visibleRowsHeight = store.getDisplayedDataTotal() * rowHeight;
      } else {
        visibleRowsHeight = store.getDataTotal() * rowHeight;
      }

      return bodyHeight < visibleRowsHeight;
    }

    setHorizontalSize() {
      const me = this;
      const columnsWidth = me.grid.getTotalColumnsWidth();

      me.horizontalScrollSizeEl.style.width = `${columnsWidth}px`;

      if (!me.isHorizontalVisible()) {
        me.horizontalScrollEl.style.display = 'none';
      } else {
        me.horizontalScrollEl.style.display = '';
      }
    }

    calcViewRange() {
      const me = this;
      const {
        columnStart,
        columnEnd,
        range
      } = me.getColumnsViewRange();

      me.columnViewStart = columnStart;
      me.columnViewEnd = columnEnd;
      me.columnsViewRange = range;
    }

    getColumnsViewRange() {
      const me = this;
      const gridWidth = me.grid.width;

      let columnStart;
      let columnEnd;
      let range = [];

      let columnPastWidth = 0;

      for (let i = 0; i < me.grid.columns.length; i++) {
        const column = me.grid.columns[i];

        if (column.hidden) {
          continue
        }

        if (columnStart === undefined && columnPastWidth <= me.scrollLeft && (columnPastWidth + column.width) > me.scrollLeft) {
          columnStart = i;
        }

        if (columnStart !== undefined) {
          range.push(i);
        }

        if (columnEnd === undefined && columnPastWidth <= me.scrollLeft + gridWidth && columnPastWidth + column.width >= me.scrollLeft + gridWidth) {
          const nextColumn = me.grid.columns[i + 1];
          if (nextColumn) {
            columnEnd = i + 1;
            range.push(i + 1);
          } else {
            columnEnd = i;
          }

          break;
        }

        columnPastWidth += column.width;
      }

      if (columnEnd === undefined) {
        columnEnd = me.grid.columns.length - 1;
      }

      return {
        columnStart,
        columnEnd,
        range
      }
    }

    calcScrollBarWidth() {
      const me = this;

      me.scrollBarWidth = me.getScrollbarWidth();
    }

    getScrollbarWidth() {
      const body = document.body;
      const div = document.createElement('div');
      div.style.width = div.style.height = '100px';
      div.style.opacity = '0';
      div.style.overflow = 'scroll';
      div.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps
      div.style.position = 'absolute';
      body.appendChild(div);

      let width = div.offsetWidth - div.clientWidth;
      // if width is 0 and client width is 0, means the DOM isn't ready
      /*
      if (width === 0 && div.clientWidth === 0) {
        width = null;
      }
       */

      if (div.parentNode) {
        div.parentNode.removeChild(div);
      }

      if (width === 0) {
        this.isDomInvisibleScrollbar = width === 0;
        width = 16;
      }

      return width;
    }

    initResizeObserver(){
      const me = this;
      const grid = me.grid;

      me.resizeObserver = new ResizeObserver((entries) => {
        if (!Array.isArray(entries) || !entries.length) {
          return;
        }

        if(me.grid.checkSize()) {
          const changedBufferedRows = me.calcVisibleRows();
          me.generateNewRange();
          grid.reCalcColumnsPositions();
          grid.updateWidth();
          grid.updateCellPositions();

          if(changedBufferedRows){
            grid.renderVisibleRows();
          }
        }
      });

      me.resizeObserver.observe(me.grid.containerEl);
    }

    isColumnVisible(checkColumn){
      const me = this;

      if(!checkColumn){
        return false;
      }

      for(let i = 0, iL = me.columnsViewRange.length;i<iL;i++){
        const columnIndex = me.columnsViewRange[i];
        const column = me.grid.columns[columnIndex];

        if(column.id === checkColumn.id){
          return true;
        }
      }

      return false;
    }
  }

  Fancy.Scroller = Scroller;

})();

(()=>{

  class TouchScroller {
    constructor(element, config) {
      const me = this;

      Object.assign(me, config);

      me.element = element;
      me.startY = 0;
      me.startX = 0;

      me.velocityX = 0;
      me.velocityY = 0;
      me.lastMoveTime = 0;

      me.touchStartHandler = me.touchStart.bind(me);
      me.touchMoveHandler = me.touchMove.bind(me);
      me.touchEndHandler = me.touchEnd.bind(me);

      me.init();
    }

    init() {
      const me = this;

      me.element.addEventListener('touchstart', me.touchStartHandler);
      me.element.addEventListener('touchmove', me.touchMoveHandler);
      me.element.addEventListener('touchend', me.touchEndHandler);
    }

    touchStart(e) {
      const me = this;

      delete me.direction;

      me.startY = e.touches[0].pageY;
      me.startX = e.touches[0].pageX;

      me.velocityX = 0;
      me.velocityY = 0;
      me.lastMoveTime = Date.now();

      if (me.intervalId) {
        clearInterval(me.intervalId);
        delete me.intervalId;
      }
    }

    touchMove(e) {
      const me = this;
      const currentY = e.touches[0].pageY;
      const currentX = e.touches[0].pageX;
      const now = Date.now();

      const deltaY = currentY - me.startY;
      const deltaX = currentX - me.startX;
      const timeDelta = now - me.lastMoveTime;

      // Calculating the velocity
      me.velocityX = deltaX / timeDelta;
      me.velocityY = deltaY / timeDelta;

      // Updating coordinates for the next event
      me.startY = currentY;
      me.startX = currentX;
      me.lastMoveTime = now;

      if(!me.direction){
        if(Math.abs(deltaY) > Math.abs(deltaX)){
          me.direction = 'vertical';
        }
        else {
          me.direction = 'horizontal';
        }
      }

      if(me.direction === 'vertical'){
        Object.assign(e, {
          deltaX: 0,
          deltaY
        });
      }
      else {
        Object.assign(e, {
          deltaX,
          deltaY: 0
        });
      }

      me.onTouchScroll(e);
    }

    smoothScroll() {
      const me = this;
      //let deceleration = 0.95; // Deceleration factor
      //let threshold = 0.5;     // Minimum speed to stop

      let deceleration = 0.98; // Deceleration factor
      //let threshold = 0.01;     // Minimum speed to stop
      let threshold = 0.2;     // Minimum speed to stop

      //let intervalDuration = 16;

      //me.intervalId = setInterval(() => {
      const step = () => {
        me.velocityX *= deceleration;
        me.velocityY *= deceleration;

        if (me.direction === 'vertical') {
          me.onTouchScroll({
            deltaX: 0,
            deltaY: me.velocityY * 10
          });
        } else {
          me.onTouchScroll({
            deltaX: me.velocityX * 10,
            deltaY: 0
          });
        }

        // Continue scrolling until the speed exceeds the threshold
        if(Math.abs(me.velocityX) <= threshold && Math.abs(me.velocityY) <= threshold);
        else {
          requestAnimationFrame(()=> {
            requestAnimationFrame(step);
          });
        }
        //}, intervalDuration);
      };

      requestAnimationFrame(step);
    }

    touchEnd() {
      const me = this;

      // Smooth continuation of the scroll
      me.smoothScroll();
    }

    destroy() {
      const me = this;

      me.element.removeEventListener('touchstart', me.touchStartHandler);
      me.element.removeEventListener('touchmove', me.touchMoveHandler);
      me.element.removeEventListener('touchend', me.touchEndHandler);

      if (me.intervalId) {
        clearInterval(me.intervalId);
      }
    }
  }

  Fancy.TouchScroller = TouchScroller;

})();

(()=> {
  const {
    GRID,
    GRID_CELLS_RIGHT_BORDER,
    ROW_ANIMATION,
    HEADER,
    HEADER_INNER,
    HEADER_INNER_CONTAINER,
    BODY,
    BODY_INNER,
    BODY_INNER_CONTAINER,
    EDITORS_CONTAINER,
    TOUCH
  } = Fancy.cls;

  /**
   * @mixes GridMixinBody
   * @mixes GridMixinColumn
   * @mixes GridMixinColumnDrag
   * @mixes GridMixinEdit
   * @mixes GridMixinFilter
   * @mixes GridMixinHeader
   * @mixes GridMixinKeyNavigation
   * @mixes GridMixinRowGroup
   * @mixes GridMixinRowGroupBar
   * @mixes GridMixinScroll
   * @mixes GridMixinSelection
   * @mixes GridMixinSort
   */

  class Grid {
    theme = 'default';
    defaultColumnWidth = 120;

    headerRowHeight = 32;
    rowHeight = 28;
    rowAnimation = true;

    minColumnWidth = 35;

    rowGroupType = 'row';
    // asc-string desc-string asc-amount desc-amount
    defaultRowGroupSort = 'desc-amount';

    rowGroupBarSeparator = false;

    actualRowsIdSet;
    renderedRowsIdMap;

    activeCell = true;
    selectingCells = true;

    editorEnterAction = 'stay'; // 'stay' | 'down' | 'right'

    startEditByTyping = true;
    flashChanges = true;
    flashChangesColors = ['#e0e5e9','beige'];

    filterBar = false;
    cellsRightBorder = false;
    columnLines = false;
    rowGroupBar = false;

    $defaultRowGroupColumn = {
      title: 'Group',
      width: 120,
      sortable: false,
      type: 'string',
      rowGroupIndent: true,
      editable: false,
      render(params){
        const {
          value
        } = params;

        return value || '';
      }
    };

    constructor(config, extraConfig) {
      const me = this;

      if(extraConfig){
        extraConfig.renderTo = config;
        config = extraConfig;
      }

      me.initContainer(config.renderTo);
      me.initId(config.id);

      me.actualRowsIdSet = new Set();
      me.renderedRowsIdMap = new Map();

      config = me.prepareConfig(config);

      Object.assign(me, config);

      me.checkSize();
      me.initScroller();
      me.render();
      const scroller = me.scroller;
      scroller.calcMaxScrollTop();
      scroller.calcVisibleRows();
      me.renderVisibleRows();
      me.renderVisibleHeaderCells();
      if(me.filterBar){
        me.renderVisibleFilterBarCells();
      }

      if(me.activeCell){
        me.initKeyNavigation();
      }

      me.ons();
    }

    initContainer(renderTo){
      const me = this;

      if(renderTo.tagName){
        me.containerEl = renderTo;
      }
      else if(typeof renderTo === 'string'){
        me.containerEl = document.getElementById(renderTo);

        if(!me.containerEl){
          me.containerEl = document.querySelector(renderTo);
        }
      }

      if(!me.containerEl){
        console.error(`Could not find renderTo element`);
      }
    }

    initId(id){
      const me = this;

      if(id){
        me.id = id;
      }

      if(!me.id){
        me.id = `fg-grid-${Fancy.gridIdSeed}`;
        Fancy.gridIdSeed++;
      }

      Fancy.gridsMap.set(me.id, me);
    }

    render() {
      const me = this;
      const gridEl = document.createElement('div');

      gridEl.setAttribute('id', me.id);
      gridEl.classList.add(GRID);
      if(me.rowAnimation){
        gridEl.classList.add(ROW_ANIMATION);
      }

      if(me.cellsRightBorder || me.columnLines){
        gridEl.classList.add(GRID_CELLS_RIGHT_BORDER);
      }

      if(Fancy.isTouchDevice){
        gridEl.classList.add(TOUCH);
      }

      gridEl.classList.add('fg-theme-' + me.theme);

      me.containerEl.appendChild(gridEl);
      me.gridEl = gridEl;

      if(me.rowGroupBar){
        me.renderRowGroupBar();
      }

      me.renderHeader();

      if(me.filterBar){
        me.renderFilterBar();
      }

      me.renderBody();

      me.scroller.render();
    }

    updateWidth(){
      const me = this;
      const width = me.getTotalColumnsWidth();
      const headerWidth = width + me.scroller.scrollBarWidth;
      const bodyWidth = width;

      me.headerInnerEl.style.width = headerWidth + 'px';
      me.headerInnerContainerEl.style.width = width + 'px';
      me.bodyInnerContainerEl.style.width = bodyWidth + 'px';

      if(me.filterBar){
        me.filterBarInnerEl.style.width = headerWidth + 'px';
        me.filterBarInnerContainerEl.style.width = width + 'px';
      }

      me.scroller.setHorizontalSize();
    }

    renderHeader() {
      const me = this;

      const headerEl = document.createElement('div');
      headerEl.classList.add(HEADER);
      headerEl.style.height = (this.headerRowHeight + 1) + 'px';

      const headerInnerEl = document.createElement('div');
      headerInnerEl.classList.add(HEADER_INNER);
      headerInnerEl.style.width = (me.getTotalColumnsWidth() + me.scroller.scrollBarWidth) + 'px';

      const headerInnerContainerEl = document.createElement('div');
      headerInnerContainerEl.classList.add(HEADER_INNER_CONTAINER);
      headerInnerContainerEl.style.height = me.headerRowHeight + 'px';
      headerInnerContainerEl.style.width = me.getTotalColumnsWidth() + 'px';

      headerInnerEl.appendChild(headerInnerContainerEl);
      headerEl.appendChild(headerInnerEl);
      me.gridEl.appendChild(headerEl);

      me.headerInnerContainerEl = headerInnerContainerEl;
      me.headerInnerEl = headerInnerEl;
      me.headerEl = headerEl;
    }

    renderBody() {
      const me = this;

      const bodyEl = document.createElement('div');

      bodyEl.classList.add(BODY);

      const bodyInnerEl = document.createElement('div');
      bodyInnerEl.classList.add(BODY_INNER);

      const bodyInnerContainerEl = document.createElement('div');

      bodyInnerContainerEl.classList.add(BODY_INNER_CONTAINER);
      if(me.store.rowGroups.length){
        bodyInnerContainerEl.style.height = (me.store.getDisplayedDataTotal() * me.rowHeight) + 'px';
      }
      else {
        bodyInnerContainerEl.style.height = (me.store.getDataTotal() * me.rowHeight) + 'px';
      }
      bodyInnerContainerEl.style.width = me.getTotalColumnsWidth() + 'px';

      const editorsContainerEl = document.createElement('div');

      editorsContainerEl.classList.add(EDITORS_CONTAINER);

      bodyInnerContainerEl.appendChild(editorsContainerEl);
      bodyInnerEl.appendChild(bodyInnerContainerEl);
      bodyEl.appendChild(bodyInnerEl);
      me.gridEl.appendChild(bodyEl);

      me.editorsContainerEl = editorsContainerEl;
      me.bodyInnerContainerEl = bodyInnerContainerEl;
      me.bodyInnerEl = bodyInnerEl;
      me.bodyEl = bodyEl;
    }

    updateVisibleHeight(){
      const me = this;
      const store = me.store;
      const {
        filters,
        rowGroups
      } = store;

      if(filters.length || rowGroups.length){
        me.bodyInnerContainerEl.style.height = (store.getDisplayedDataTotal() * me.rowHeight) + 'px';
      }
      else {
        me.bodyInnerContainerEl.style.height = (store.getDataTotal() * me.rowHeight) + 'px';
      }
    }

    animatedRemoveDomRowById(id){
      const me = this;
      const rowEl = me.renderedRowsIdMap.get(id);

      if(rowEl){
        rowEl.style.opacity = 0;
        setTimeout(()=>{
          rowEl.remove();
        }, 200);
      }
      else {
        console.warn(`Row El with id = ${id} was not found`);
      }

      me.actualRowsIdSet.delete(id);
      me.renderedRowsIdMap.delete(id);
    }

    removeDomRowById(id){
      const me = this;
      const rowEl = me.renderedRowsIdMap.get(id);

      if(rowEl){
        rowEl.remove();
      }
      else {
        console.warn(`Row El with id = ${id} was not found`);
      }

      me.actualRowsIdSet.delete(id);
      me.renderedRowsIdMap.delete(id);
    }

    prepareConfig(config) {
      const me = this;
      let rowGroups = [];
      let aggregations = [];

      if(config.columns){
        config.columns = Fancy.deepClone(config.columns);

        let left = 0;
        let newRowGroupsOrder = false;

        me.generateColumnIds(config.columns);

        if(config.rowGroupType === 'column') {
          config.rowGroupColumn = config.rowGroupColumn || {};
        }

        config.columns.forEach(column => {
          if(column.rowGroup){
            column.hidden = true;
            rowGroups.push(column.index);

            if(column.rowGroupOrder !== undefined){
              newRowGroupsOrder = newRowGroupsOrder || [];
              newRowGroupsOrder[column.rowGroupOrder] = column.index;
            }
          }
        });

        if(newRowGroupsOrder){
          const groupsToMerge = structuredClone(rowGroups).filter(group => !newRowGroupsOrder.includes(group));

          rowGroups.forEach((group, index) => {
            if(newRowGroupsOrder[index] === undefined){
              group = groupsToMerge.shift();
              newRowGroupsOrder[index] = group;
            }
          });

          newRowGroupsOrder = newRowGroupsOrder.concat(groupsToMerge);
          rowGroups = newRowGroupsOrder;
        }

        if(config.rowGroupColumn){
          let rowGroupColumn = Object.assign({
            $isRowGroupColumn: true
          }, me.$defaultRowGroupColumn);

          rowGroupColumn.id = rowGroupColumn.id || me.getAutoColumnIdSeed();

          Object.assign(rowGroupColumn, config.rowGroupColumn);
          me.$rowGroupColumn = rowGroupColumn;
          if(rowGroups.length && me.$rowGroupColumn){
            if(config.columns[0].type === 'order'){
              config.columns.splice(1, 0, rowGroupColumn);
            }
            else {
              config.columns.unshift(rowGroupColumn);
            }
          }
        }

        config.columns.forEach(column => {
          switch(column.type){
            case 'order':
              if((rowGroups.length || config.rowGroupBar) && config.rowGroupType !== 'column'){
                console.error('Order column is not supported for row grouping with rowGroupType equals to "row"');
                console.error('For order column use rowGroupType equals to "column"');
              }
              break;
          }

          me.prepareColumn(column, config.defaults);

          if(column.checkboxSelection){
            config.checkboxSelection = true;
          }

          if(column.agFn){
            aggregations.push({
              index: column.index,
              fn: column.agFn
            });
          }

          column.left = left;
          if(!column.hidden){
            left += column.width;
          }
        });
      }

      const storeConfig = {
        data: structuredClone(config.data),
        defaultRowGroupSort: config.defaultRowGroupSort || me.defaultRowGroupSort
      };

      if(rowGroups.length){
        storeConfig.rowGroups = rowGroups;
        storeConfig.aggregations = aggregations;

        storeConfig.rowGroupExpanded = config.rowGroupExpanded || [];
      }

      me.initStore(storeConfig);

      delete config.data;

      return config;
    }

    initStore(config) {
      const me = this;

      me.store = new Fancy.Store(config);
    }

    ons() {
      const me = this;

      me.debouceClearWheelScrollingFn = Fancy.debounce(me.clearWheelScrolling, 50);
      me.bodyEl.addEventListener('wheel', me.onMouseWheel.bind(this));
      me.touchScroller = new Fancy.TouchScroller(me.bodyEl, {
        onTouchScroll: me.onTouchScroll.bind(this)
      });

      me.headerInnerContainerEl.addEventListener('click', me.onHeaderCellClick.bind(this));
      me.headerInnerContainerEl.addEventListener('mousedown', me.onHeaderMouseDown.bind(this));
    }

    getTotalColumnsWidth() {
      return this.columns.reduce((sum, column)=>{
        return sum + (column.hidden? 0: column.width)
      }, 0);
    }

    reCalcColumnsPositions(){
      const me = this;

      me.columns.reduce((left, column) => {
        column.left = left;

        return left + (column.hidden? 0: column.width);
      }, 0);
    }

    checkSize(){
      const me = this;
      let changed = false;

      if(me.width && me.height);

      const rect = me.containerEl.getBoundingClientRect();

      if(me.width !== rect.width){
        changed = true;
      }

      if(me.height !== rect.height){
        changed = true;
      }

      me.width = rect.width;
      me.height = rect.height;

      return changed;
    }

    setData(data){
      const me = this;

      me.store.$dontDropExpandedGroups = true;

      me.store.setData(structuredClone(data));
      me.reRender();
      delete me.store.$dontDropExpandedGroups;
    }

    reRender(){
      const me = this;
      const store = me.store;
      const scroller = me.scroller;

      if(me.store.rowGroups.length){
        me.reConfigRowGroups();
      }
      else {
        me.terminateVisibleRows();
        scroller.calcMaxScrollTop();
        scroller.updateScrollTop();
        scroller.calcViewRange();
        scroller.setVerticalSize();
        scroller.updateHorizontalScrollSize();
        me.updateVisibleHeight();

        scroller.calcVisibleRows();

        me.renderVisibleRows();
        store.memorizePrevRowIndexesMap();
      }
    }

    destroy(){
      const me = this;

      me.touchScroller.destroy();

      me.gridEl.remove();
    }

    onBodyCellClick(){
      const me = this;

      me.hideActiveEditor();
    }

    remove(rows){
      const me = this;
      const store = me.store;

      switch (Fancy.typeOf(rows)){
        case 'string':
          rows = [{
            id: rows
          }];
          break;
        case 'object':
          rows = [rows];
          break;
        case 'array':
          rows = rows.map((value)=>{
            if(typeof value === 'string'){
              return {
                id: value
              }
            }

            return value;
          });
          break;
      }

      if(rows.length === 0){
        return;
      }

      let itemsToRemove = [];
      let dataItemsToRemove = [];
      let rowGroups = new Map();

      for(let i = 0;i<rows.length;i++){
        const row = rows[i];

        me.animatedRemoveDomRowById(row.id);

        let item = me.store.removeItemById(row.id);
        itemsToRemove.push(item);
        if(item.$rowGroupValue){
          let values = rowGroups.get(item.$rowGroupValue) || [];
          values.push(item.id);
          rowGroups.set(item.$rowGroupValue, values);

          store.selectRowItem(item, false);
        }

        if (item.$isGroupRow !== true) {
          dataItemsToRemove.push(item);
        }
      }

      rowGroups.forEach((items, groupValue) => {
        const splitted = groupValue.split('/');

        for(let i = 0;i<splitted.length;i++){
          const name = splitted.slice(0, splitted.length - i).join('/');
          const groupDetails = store.groupDetails[name];

          groupDetails.amount -= items.length;
          if(groupDetails.amount === 0){
            groupDetails.childrenAmount = 0;
            me.animatedRemoveDomRowById(groupDetails.id);
            delete me.store.groupDetails[name];
            delete me.store.expandedGroupsWithDataChildren[name];
            delete me.store.groupsChildren[name];

            let item = me.store.removeItemById(groupDetails.id);
            itemsToRemove.push(item);

            const parentGroup = splitted.slice(0, splitted.length - i - 1).join('/');
            store.groupsChildren[parentGroup] = store.groupsChildren[parentGroup].filter(item => {
              return item.id !== groupDetails.id;
            });
          }
          else {
            store.groupsChildren[name] = store.groupsChildren[name].filter(item => {
                return items.includes(item.id) === false;
            });
          }

          if(store.groupDetailsForFiltering){
            const groupDetailsForFiltering = store.groupDetailsForFiltering[name];

            groupDetailsForFiltering.amount -= items.length;
            if(groupDetailsForFiltering.amount <= 0){
              groupDetailsForFiltering.childrenAmount = 0;
              delete me.store.groupDetailsForFiltering[name];
              delete me.store.expandedGroupsWithDataChildrenForFiltering[name];
              delete me.store.groupsChildrenForFiltering[name];

              const parentGroup = splitted.slice(0, splitted.length - i - 1).join('/');
              store.groupsChildrenForFiltering[parentGroup] = store.groupsChildrenForFiltering[parentGroup].filter(item => {
                return item.id !== groupDetails.id;
              });
            }
            else {
              store.groupsChildrenForFiltering[name] = store.groupsChildrenForFiltering[name].filter(item => {
                return items.includes(item.id) === false;
              });
            }
          }
        }
      });

      /*
      if(!me.$isOriginalDataIndexesSet){
        me.data.forEach((item, index) => {
          item.originalDataRowIndex = index;
        });
      }
       */

      const rowIndexes = dataItemsToRemove.sort((a, b) => a.originalDataRowIndex - b.originalDataRowIndex);
      rowIndexes.forEach((item, index) => {
        me.store.data.splice(item.originalDataRowIndex - index, 1);
      });
      delete me.store.$isOriginalDataIndexesSet;

      /*
      const rowIndexes = dataItemsToRemove.sort((a,b) => a.originalRowIndex - b.originalRowIndex);
      rowIndexes.forEach((item,index) => {
        me.store.data.splice(item.originalRowIndex - index, 1)
      });
      */

      if(me.store.displayedData?.length){
        const rowIndexes = itemsToRemove.sort((a, b) => a.rowIndex - b.rowIndex);

        rowIndexes.forEach((item, index) => {
          me.store.displayedData.splice(item.rowIndex - index, 1);
        });
      }

      if(rowGroups.size){
        me.updateRowGroupAmount();
        me.updateRowGroupRowsAndCheckBoxes();
      }

      store.updateIndexes();

      me.scroller.calcVisibleRows();
      me.renderVisibleRows();
      me.updateAfterAddRemove();

      me.updateHeaderCheckboxesSelection();

      me.updateOrderColumn();
    }

    add(items, position){
      const me = this;
      const store = me.store;

      store.add(items, position);

      if(store.rowGroups.length){
        me.updateRowGroupAmount();
        me.updateRowGroupRowsAndCheckBoxes();
      }

      me.scroller.calcVisibleRows();
      me.renderVisibleRows();
      me.updateAfterAddRemove();

      me.updateHeaderCheckboxesSelection();

      me.updateOrderColumn();
    }

    setById(id, index, value){
      const me = this;
      const store = me.store;
      const row = me.renderedRowsIdMap.get(id);
      const flashChangesColors = me.flashChangesColors;
      const rowIndex = row?.getAttribute('row-index');

      const rerenderCell = (cell) => {
        if(!cell){
          return;
        }

        const columnIndex = Number(cell.getAttribute('col-index'));

        const newCell = me.createCell(rowIndex, columnIndex);

        if(cell.innerHTML === newCell.innerHTML){
          return;
        }

        cell.remove();
        cell = newCell;
        const cellStyle = cell.style;
        if(me.flashChanges && !cell.style.backgroundColor){
          cellStyle.transition = 'background-color 2000ms';
          cellStyle.backgroundColor = flashChangesColors[store.selectedItemsMap.has(id)?1:0];

          setTimeout(()=>{
            cellStyle.backgroundColor = '';
          });

          setTimeout(()=>{
            cellStyle.transition = '';
            cellStyle.backgroundColor = '';
          }, 2000);
        }
        row.appendChild(cell);
      };

      if(typeof index === 'object'){
        for(let p in index){
          store.setById(id, p, index[p]);

          let cell = row?.querySelector(`div[col-id="${p}"]`);
          rerenderCell(cell);
        }
      }
      else {
        store.setById(id, index, value);

        let cell = row?.querySelector(`div[col-id="${index}"]`);
        rerenderCell(cell);
      }

      row && me.rowCellsUpdateWithColumnRender(row, me.flashChanges);
    }

    getItemById(id) {
      return this.store.idItemMap.get(id);
    }
  }

  window.Grid = Grid;
  Fancy.Grid = Grid;

})();

(()=>{

  const  {
    ANIMATE_CELLS_POSITION,
    CELL,
    HEADER_CELL,
    FILTER_BAR_CELL,
    ROW
  } = Fancy.cls;

  /**
   * @mixin GridMixinColumn
   */

  const GridMixinColumn = {
    showColumn(column, animate){
      const me = this;

      if(animate){
        me.animatingColumnsPosition = true;
        me.gridEl.classList.add(ANIMATE_CELLS_POSITION);
      }

      delete column.hidden;

      me.scroller.generateNewRange();
      me.reCalcColumnsPositions();
      me.updateWidth();
      me.updateCellPositions();

      if(animate){
        setTimeout(() => {
          me.gridEl.classList.remove(ANIMATE_CELLS_POSITION);
          delete me.animatingColumnsPosition;
        }, 300);
      }
    },

    hideColumn(column, animate){
      const me = this;

      if(!me.isPossibleToHideColumn()){
        console.warn('Hiding column was prevented because it requires at least 1 visible column');
        return false;
      }

      if(animate && !me.animatingColumnsPosition){
        me.animatingColumnsPosition = true;
        me.gridEl.classList.add(ANIMATE_CELLS_POSITION);
      }

      column.hidden = true;

      const {
        columnsToRemove
      } = me.scroller.generateNewRange();
      me.reCalcColumnsPositions();
      me.updateWidth();
      me.updateCellPositions();

      if(animate && me.animatingColumnsPosition){
        setTimeout(() => {
          me.gridEl.classList.remove(ANIMATE_CELLS_POSITION);
          delete me.animatingColumnsPosition;
        }, 300);
      }

      if(me.activeCell){
        me.clearActiveCell();
      }

      return {
        columnIndex: columnsToRemove[0]
      };
    },

    isPossibleToHideColumn(){
      const me = this;
      const numOfHiddenColumns = me.columns.reduce((sum, column) => sum + (column.hidden? 1: 0), 0);

      return me.columns.length - numOfHiddenColumns !== 1;
    },

    removeColumn(column){
      const me = this;

      const {
        columnIndex: hiddenColumnIndex
      } = me.hideColumn(column, false);

      me.columns.splice(hiddenColumnIndex, 1);
      me.clearColumFromLinks(column);

      delete me.$rowGroupColumn.elSortOrder;
      delete me.$rowGroupColumn.filterCellEl;
      delete me.$rowGroupColumn.headerCellEl;
      delete me.$rowGroupColumn.left;

      me.scroller.generateNewRange(false);
      me.reSetVisibleHeaderColumnsIndex();
      me.reSetVisibleBodyColumnsIndex();
      me.reCalcColumnsPositions();
    },

    clearColumFromLinks(column){
      delete column.elFilter;
      delete column.elMenu;
      delete column.elSortAsc;
      delete column.elSortDesc;
      delete column.elSortOrder;
      delete column.filterCellEl;
      delete column.filterField;
      delete column.headerCellEl;
    },

    getColumn(index){
      const me = this;

      return me.columns.find(column => column.index === index);
    },

    getNextVisibleColumnIndex(index){
      const me = this;

      for(let i = index + 1;i<me.columns.length;i++){
        const column = me.columns[i];
        if(column.hidden !== true){
          return i;
        }
      }
    },

    getPrevVisibleColumnIndex(index){
      const me = this;

      for(let i = index - 1;i>-1;i--){
        const column = me.columns[i];
        if(column.hidden !== true){
          return i;
        }
      }
    },

    getAutoColumnIdSeed(){
      const me = this;

      if(me.columnIdSeed === undefined){
        me.columnIdSeed = 0;
      }
      else {
        me.columnIdSeed++;
      }

      return me.columnIdSeed;
    },

    generateColumnIds(columns, updateMaps = true){
      const me = this;

      const columnIdsMap = new Map();
      const columnIdsSeedMap = new Map();

      columns.forEach(column => {
        const index = (column.index || column.title || '').toLocaleLowerCase();
        if(!column.id){
          let seed = columnIdsSeedMap.get(index);

          if(seed === undefined){
            column.id = index || me.getAutoColumnIdSeed();
            seed = 0;
          }
          else {
            column.id = `${index}-${seed}`;
          }

          seed++;
          columnIdsSeedMap.set(index, seed);
        }
        else {
          let seed = columnIdsSeedMap.get(index);

          if(seed === undefined){
            seed = 0;
          }

          seed++;
          columnIdsSeedMap.set(index, seed);
        }

        columnIdsMap.set(column.id, column);
      });

      if(updateMaps){
        me.columnIdsMap = columnIdsMap;
        me.columnIdsSeedMap = columnIdsSeedMap;
      }

      return {
        columnIdsMap,
        columnIdsSeedMap
      }
    },

    setColumns(columns){
      const me = this;

      columns = Fancy.deepClone(columns);

      me.animatingColumnsPosition = true;
      me.gridEl.classList.add(ANIMATE_CELLS_POSITION);

      me.$setColumns(columns);

      me.scroller.generateNewRange(false);
      me.reCalcColumnsPositions();
      me.updateWidth();

      me.terminateNotExistedCells();
      me.reSetVisibleHeaderColumnsIndex();
      me.reSetVisibleBodyColumnsIndex();

      me.renderMissedCells();
      me.updateCellPositions();

      setTimeout(() => {
        me.gridEl.classList.remove(ANIMATE_CELLS_POSITION);
        delete me.animatingColumnsPosition;
      }, 300);
    },

    renderMissedCells(){
      const me = this;
      let columnStart = me.scroller.columnViewStart;
      let columnEnd = me.scroller.columnViewEnd;

      const columnIndexes = [];

      for(let i = columnStart; i <= columnEnd; i++){
        const column = me.columns[i];

        if(column.hidden){
          continue
        }

        if(!column.headerCellEl){
          columnIndexes.push(i);
        }
      }

      me.addColumnCells(columnIndexes);
    },

    terminateNotExistedCells(){
      const me = this;
      const cells = me.headerEl.querySelectorAll(`.${HEADER_CELL}`);

      cells.forEach(cell => {
        const columnId = cell.getAttribute('col-id');
        const column = me.columnIdsMap.get(columnId);
        const isColumnVisible = me.scroller.isColumnVisible(column);

        if(!column || !isColumnVisible){
          cell.remove();
          if(column && column.filterCellEl){
            column.filterCellEl.remove();
          }

          const filterCellEl = me.filterBarEl?.querySelector?.(`.${FILTER_BAR_CELL}[col-id="${columnId}"]`);
          filterCellEl?.remove();

          const bodyCells = me.bodyEl.querySelectorAll(`.${CELL}[col-id="${columnId}"]`);
          bodyCells.forEach(bodyCell => {
            bodyCell.remove();
          });
        }

        if(column && !isColumnVisible){
          me.clearColumFromLinks(column);
        }
      });
    },

    $setColumns(newColumns){
      const me = this;
      const columnsToAdd = new Map();
      const columnsToRemoveIds = new Set();

      const {
        columnIdsMap: newColumnsIdMap,
        columnIdsSeedMap: newColumnsIdsSeedMap
      } = me.generateColumnIds(newColumns, false);

      me.columns.forEach(column => {
        if(newColumnsIdMap.has(column.id)){
          const newColumn = newColumnsIdMap.get(column.id);

          if(typeof newColumn.width === 'number' && newColumn.width !== column.width){
            column.width = newColumn.width;
          }
        }
        else {
          columnsToRemoveIds.add(column.id);
        }
      });

      const newColumnsOrderMap = new Map();
      newColumns.forEach((newColumn, index)=>{
        if(!me.columnIdsMap.has(newColumn.id)){
          me.prepareColumn(newColumn, me.defaults);

          columnsToAdd.set(newColumn.id, newColumn);
        }

        newColumnsOrderMap.set(index, newColumn.id);
      });

      columnsToRemoveIds.forEach(id => {
        const column = me.columnIdsMap.get(id);
        const index = (column.index || column.title || '').toLocaleLowerCase();
        me.columnIdsMap.delete(id);
        let seed = me.columnIdsSeedMap.get(index);

        if(typeof seed === 'number'){
          seed--;
          if(seed === 0){
            me.columnIdsSeedMap.delete(index);
          }
          else {
            me.columnIdsSeedMap.set(index, seed);
          }
        }
      });

      columnsToAdd.forEach((column, key) => {
        me.columnIdsMap.set(key, column);
        me.columnIdsSeedMap.set(key, newColumnsIdsSeedMap.get(key));
      });

      const orderedColumns = [];
      newColumnsOrderMap.forEach((columnId, index) => {
        const column = me.columnIdsMap.get(columnId);

        orderedColumns[index] = column;
      });

      me.columns = orderedColumns;
    },

    prepareColumn(column, defaults = {}){
      const me = this;
      const store = me.store;

      switch (column.type){
        case 'boolean':
          column.render = Fancy.render.boolean;
          column.onCheckBoxChange = (event, value) => {
            const inputEl= event.target;
            const cell = inputEl.closest(`.${CELL}`);
            const row = cell.closest(`.${ROW}`);
            const itemId = row.getAttribute('row-id');

            me.store.setById(itemId, column.index, value);
          };
          break;
        case 'currency':
          column.format = Fancy.format.currency;
          column.type = 'number';
          column.$type = 'currency';
          break;
        case 'order':
          column.sortable = false;
          column.render = Fancy.render.order;
          column.width = column.width || 45;
          column.resizable = false;
          column.menu = false;
          column.draggable = false;
          me.columnOrder = column;

          if(store?.rowGroups.length || me?.rowGroupBar){
            console.error('Order column is not supported for row grouping');
          }
          break;
      }

      if(column.width === undefined){
        column.width = me.defaultColumnWidth;
      }

      if(column.minWidth && column.width < column.minWidth){
        column.width = column.minWidth;
      }

      if(!column.title){
        column.title = Fancy.capitalizeFirstLetter(column.index || '');
      }

      Object.keys(defaults).forEach(key => {
        if(column[key] === undefined){
          column[key] = defaults[key];
        }
      });
    }
  };

  Object.assign(Grid.prototype, GridMixinColumn);

})();

(()=> {
  const {
    ANIMATE_CELLS_POSITION,
    HIDDEN,
    HEADER_CELL,
    HEADER_CELL_LABEL,
    HEADER_CELL_MENU,
    HEADER_CELL_SELECTION,
    HEADER_CELL_SORTABLE,
    HEADER_CELL_NOT_RESIZABLE,
    HEADER_CELL_TEXT,
    HEADER_FILTER_EL,
    HEADER_CELL_RESIZE,
    BODY,
    COLUMN_RESIZING,
    COLUMN_DRAGGING,
    COLUMNS_MENU,
    COLUMNS_MENU_ITEM,
    COLUMNS_MENU_ITEM_TEXT,
    FILTER_INDICATOR_CONTAINER,
    SORT_ASC,
    SORT_DESC,
    SORT_ORDER,
    SORT_INDICATOR_CONTAINER,
    INPUT_CHECKBOX,
    ROW_GROUP_BAR_ITEM_ACTIVE
  } = Fancy.cls;

  /**
   * @mixin GridMixinHeader
   */

  const GridMixinHeader = {
    deltaStartColumnDrag: 10,
    onHeaderMouseDown(event) {
      event.preventDefault();
    },

    onHeaderCellClick(event) {
      const me = this;
      const cellLabel = event.target.closest(`.${HEADER_CELL_LABEL}`);
      const cellMenu = event.target.closest(`.${HEADER_CELL_MENU}`);
      const multi = event.shiftKey;

      if(me.columnDragging){
        return;
      }

      if(cellLabel){
        const cell = cellLabel.closest(`.${HEADER_CELL}`);
        const columnIndex = cell.getAttribute('col-index');
        const column = me.columns[columnIndex];

        if (!column.sortable || !column.type) {
          return;
        }

        switch (column.sort) {
          case 'ASC':
            if (multi) {
              me.multiSort(column, 'DESC');
            } else {
              me.sort(column, 'DESC');
            }
            break;
          case 'DESC':
            me.clearSort(column, multi);
            break;
          case undefined:
            if (multi) {
              me.multiSort(column, 'ASC');
            } else {
              me.sort(column, 'ASC');
            }
            break;
        }
      }

      if (cellMenu) {
        const cell = cellMenu.closest(`.${HEADER_CELL}`);
        const columnIndex = cell.getAttribute('col-index');
        const column = me.columns[columnIndex];

        if (!column.elMenuList) {
          me.destroyHeaderCellMenuList();
          requestAnimationFrame(() => {
            me.showHeaderCellMenuList(event, column, columnIndex);
          });
        } else {
          me.destroyHeaderCellMenuList(column);
        }
      }
    },

    renderVisibleHeaderCells() {
      const me = this;

      let columnStart = me.scroller.columnViewStart,
        columnEnd = me.scroller.columnViewEnd;

      for (let i = columnStart; i <= columnEnd; i++) {
        const column = me.columns[i];

        if (column.hidden) {
          continue;
        }

        const cell = me.createHeaderCell(i);

        me.headerInnerContainerEl.appendChild(cell);
      }
    },

    appendHeaderCell(columnIndex) {
      const me = this;
      const rowEl = me.headerInnerContainerEl;
      const cell = me.createHeaderCell(columnIndex);

      rowEl.appendChild(cell);
    },

    createHeaderCell(columnIndex) {
      const me = this;
      const cell = document.createElement('div');
      const column = me.columns[columnIndex];
      const value = column.title;

      cell.classList.add(HEADER_CELL);

      if(column.sortable && column.type){
        cell.classList.add(HEADER_CELL_SORTABLE);
      }

      if(column.resizable === false){
        cell.classList.add(HEADER_CELL_NOT_RESIZABLE);
      }

      cell.setAttribute('col-index', columnIndex);
      cell.setAttribute('col-id', column.id);
      cell.style.width = column.width + 'px';
      cell.style.left = column.left + 'px';

      const label = document.createElement('div');
      label.classList.add(HEADER_CELL_LABEL);

      const cellText = document.createElement('div');
      cellText.classList.add(HEADER_CELL_TEXT);
      cellText.innerHTML = value;

      const filterContainer = document.createElement('span');
      filterContainer.classList.add(FILTER_INDICATOR_CONTAINER);

      const elFilter = document.createElement('span');
      elFilter.classList.add(HEADER_FILTER_EL);
      if(!Object.entries(column.filters || {}).length){
        elFilter.classList.add(HIDDEN);
      }
      elFilter.innerHTML = Fancy.svg.filter;
      filterContainer.appendChild(elFilter);
      column.elFilter = elFilter;

      const sortContainer = document.createElement('span');
      sortContainer.classList.add(SORT_INDICATOR_CONTAINER);

      const elSortOrder = document.createElement('span');
      elSortOrder.classList.add(SORT_ORDER);
      if(!column.sortOrder){
        elSortOrder.classList.add(HIDDEN);
      }
      else {
        elSortOrder.innerHTML = column.sortOrder;
      }
      sortContainer.appendChild(elSortOrder);
      column.elSortOrder = elSortOrder;

      const elSortAsc = document.createElement('span');
      elSortAsc.classList.add(SORT_ASC);
      if(column.sort !== 'ASC'){
        elSortAsc.classList.add(HIDDEN);
      }
      elSortAsc.innerHTML = Fancy.svg.sortAsc;
      sortContainer.appendChild(elSortAsc);
      column.elSortAsc = elSortAsc;

      const elSortDesc = document.createElement('span');
      elSortDesc.classList.add(SORT_DESC);
      if(column.sort !== 'DESC'){
        elSortDesc.classList.add(HIDDEN);
      }
      elSortDesc.innerHTML = Fancy.svg.sortDesc;
      sortContainer.appendChild(elSortDesc);
      column.elSortDesc = elSortDesc;

      const cellResize = document.createElement('div');
      cellResize.classList.add(HEADER_CELL_RESIZE);
      cellResize.addEventListener('mousedown', me.onResizeMouseDown.bind(this));

      label.appendChild(cellText);
      label.appendChild(filterContainer);
      label.appendChild(sortContainer);

      const elMenu = document.createElement('div');
      elMenu.classList.add(HEADER_CELL_MENU);
      elMenu.innerHTML = Fancy.svg.menu;

      column.elMenu = elMenu;

      if(column.headerCheckboxSelection && column.checkboxSelection){
        const elSelection = document.createElement('div');
        elSelection.classList.add(HEADER_CELL_SELECTION);

        const checkboxEl = document.createElement('input');
        checkboxEl.classList.add(INPUT_CHECKBOX);
        checkboxEl.setAttribute('type', 'checkbox');
        checkboxEl.addEventListener('click', me.onHeaderCheckboxSelectionClick.bind(this));

        elSelection.appendChild(checkboxEl);

        column.headerCheckboxSelectionEl = checkboxEl;

        cell.appendChild(elSelection);

        me.updateHeaderCheckboxSelection(column);
      }

      cell.appendChild(label);

      if(column.menu !== false){
        cell.appendChild(elMenu);
      }

      if(column.resizable !== false){
        cell.appendChild(cellResize);
      }

      cell.addEventListener('mousedown', me.onCellMouseDown.bind(this));

      column.headerCellEl = cell;

      return cell;
    },

    onCellMouseDown(event){
      const me = this;
      const isTargetHeaderCellMenu = event.target.closest(`.${HEADER_CELL_MENU}`);

      if(isTargetHeaderCellMenu){
        return;
      }

      const cell = event.target.classList.contains(HEADER_CELL)? event.target : event.target.closest(`.${HEADER_CELL}`);
      const columnIndex = Number(cell.getAttribute('col-index'));
      const column = me.columns[columnIndex];

      if(column.draggable === false){
        return;
      }

      me.columnDragDownX = event.pageX;
      me.columnDragDownY = event.pageY;
      me.columnDragMouseDownColumn = column;
      me.columnDragMouseDownColumnIndex = columnIndex;

      me.onColumnDragMouseMoveFn = me.onColumnDragMouseMove.bind(this);
      document.addEventListener('mousemove', me.onColumnDragMouseMoveFn);

      document.addEventListener('mouseup', () => {
        delete me.columnDragDownX;
        delete me.columnDragDownY;
        delete me.columnDragMouseDownColumn;
        delete me.debouceColumnDraggingFn;

        setTimeout(()=>{
          if(me.activeRowGroupBarItemEl){
            me.activeRowGroupBarItemEl.classList.remove(ROW_GROUP_BAR_ITEM_ACTIVE);
          }

          me.gridEl.classList.remove(COLUMN_DRAGGING);
          me.columnDragging?.dragColumnCellEl.remove();
          delete me.columnDragging;

          if(me.$requiresReSetGroupColumn && me.rowGroupType === 'column'){
            delete me.$requiresReSetGroupColumn;
            if(me.rowGroupBarItemColumns.length === 1){
              setTimeout(()=>{
                let indexToAddColumn = 0;
                me.$rowGroupColumn.hidden = true;
                if(me.columns[0].type === 'order'){
                  me.columns.splice(1, 0, me.$rowGroupColumn);
                  indexToAddColumn = 1;
                }
                else {
                  me.columns.unshift(me.$rowGroupColumn);
                }

                me.scroller.generateNewRange(false);
                me.reSetVisibleHeaderColumnsIndex();

                //me.scroller.generateNewRange();
                //me.reCalcColumnsPositions();
                //me.updateWidth();
                //me.updateCellPositions();
                me.showColumn(me.columns[indexToAddColumn]);
              },1);
            }
          }

          if(me.rowGroupBarItemColumns && me.rowGroupBarItemColumns.length !== me.store.rowGroups.length){
            me.reConfigRowGroups();
          }
        }, 1);

        document.removeEventListener('mousemove', me.onColumnDragMouseMoveFn);
      }, {
        once: true
      });
    },

    onResizeMouseDown(event) {
      const me = this;
      const cell = event.target.closest(`.${HEADER_CELL}`);
      const columnIndex = Number(cell.getAttribute('col-index'));
      const column = me.columns[columnIndex];

      event.preventDefault();
      event.stopPropagation();

      if(column.resizable === false){
        return;
      }

      me.columnResizing = true;

      me.resizeDownX = event.pageX;
      me.resizeDownColumnWidth = column.width;
      me.resizeDownColumnIndex = columnIndex;

      me.onResizeMouseMoveFn = me.onResizeMouseMove.bind(this);

      document.addEventListener('mouseup', me.onResizeMouseUp.bind(this), {
        once: true
      });
      document.body.addEventListener('mousemove', me.onResizeMouseMoveFn);

      me.gridEl.classList.add(COLUMN_RESIZING);
      me.gridEl.style.cursor = 'ew-resize';
      me.gridEl.style.userSelect = 'none';
      me.gridEl.querySelectorAll(`.${HEADER_CELL}`).forEach(cell => {
        cell.style.cursor = 'ew-resize';
      });
      me.gridEl.querySelectorAll(`.${BODY}`).forEach(bodyEl => {
        bodyEl.style.cursor = 'ew-resize';
      });
    },

    onResizeMouseUp() {
      const me = this;

      me.columnResizing = false;

      me.gridEl.classList.remove(COLUMN_RESIZING);
      me.gridEl.style.cursor = '';
      me.gridEl.style.userSelect = '';
      document.body.querySelectorAll(`.${HEADER_CELL}`).forEach(cell => {
        cell.style.cursor = '';
      });
      me.gridEl.querySelectorAll(`.${BODY}`).forEach(bodyEl => {
        bodyEl.style.cursor = '';
      });
      document.body.removeEventListener('mousemove', me.onResizeMouseMoveFn);
    },

    onResizeMouseMove(event) {
      const me = this;
      const deltaX = event.pageX - me.resizeDownX;
      const column = me.columns[me.resizeDownColumnIndex];
      const minColumnWidth = column.minWidth || me.minColumnWidth;

      let newWidth = me.resizeDownColumnWidth + deltaX;

      if (newWidth < minColumnWidth) {
        newWidth = minColumnWidth;
      }

      column.width = newWidth;

      requestAnimationFrame(() => {
        me.reCalcColumnsPositions();
        me.updateCellPositions(me.resizeDownColumnIndex);
        me.updateWidth();
      });
    },

    updateHeaderCells() {
      const me = this;

      let columnStart = me.scroller.columnViewStart,
        columnEnd = me.scroller.columnViewEnd;

      for (let i = columnStart; i <= columnEnd; i++) {
        const column = me.columns[i];

        if(column.hidden){
          continue;
        }

        if (Object.entries(column.filters || {}).length) {
          column.elFilter.classList.remove(HIDDEN);
        } else {
          column.elFilter.classList.add(HIDDEN);
        }

        if (column.sortOrder) {
          column.elSortOrder.innerHTML = column.sortOrder;
          column.elSortOrder.classList.remove(HIDDEN);
        } else if (!column.elSortOrder.classList.contains(HIDDEN)) {
          column.elSortOrder.classList.add(HIDDEN);
        }

        if (column.sort === 'ASC') {
          column.elSortAsc.classList.remove(HIDDEN);
        } else if (!column.elSortAsc.classList.contains(HIDDEN)) {
          column.elSortAsc.classList.add(HIDDEN);
        }

        if (column.sort === 'DESC') {
          column.elSortDesc.classList.remove(HIDDEN);
        } else if (!column.elSortDesc.classList.contains(HIDDEN)) {
          column.elSortDesc.classList.add(HIDDEN);
        }
      }
    },

    showHeaderCellMenuList(event, column) {
      const me = this;
      const el = document.createElement('div');
      const elMenuRect = column.elMenu.getBoundingClientRect();
      const top = elMenuRect.top - 1 + elMenuRect.height;
      const left = elMenuRect.left;

      el.classList.add(COLUMNS_MENU);
      el.classList.add('fg-theme-' + me.theme);
      el.style.top = `${top}px`;
      el.style.left = `${left}px`;

      el.innerHTML = me.columns.map((column, index) => {
        if(column.$isRowGroupColumn){
          return '';
        }

        return [
          `<div col-index="${index}" class="${COLUMNS_MENU_ITEM}">`,
          `<input type="checkbox" ${column.hidden ? '' : 'checked'}>`,
          `<div class="${COLUMNS_MENU_ITEM_TEXT}">${column.title}</div>`,
          '</div>'
        ].join('');
      }).join('');

      column.elMenuList = el;
      document.body.appendChild(el);
      setTimeout(()=>{
        el.style.opacity = `1`;
        me.activeElMenuList = el;
      }, 0);

      el.addEventListener('click', me.onClickHeaderMenuItem.bind(this));

      me.onDocClickForHeaderCellMenuFn = me.onDocClickForHeaderCellMenu.bind(this, column);
      document.addEventListener('mousedown', me.onDocClickForHeaderCellMenuFn);
    },

    onClickHeaderMenuItem(e) {
      const me = this;
      const menuItem = e.target.closest(`.${COLUMNS_MENU_ITEM}`);

      if (menuItem && !me.animatingColumnsPosition) {
        const inputCheckBox = menuItem.querySelector('input');
        const columnIndex = Number(menuItem.getAttribute('col-index'));
        const column = me.columns[columnIndex];
        const isInputTarget = e.target.tagName.toLowerCase() === 'input';

        if (!me.isPossibleToHideColumn() &&
          ((!isInputTarget && inputCheckBox.checked) || (isInputTarget && !inputCheckBox.checked))
        ) {
          if (isInputTarget) {
            e.preventDefault();
          }

          console.warn('Hiding column was prevented because it requires at least 1 visible column');

          return;
        }

        me.animatingColumnsPosition = true;
        me.gridEl.classList.add(ANIMATE_CELLS_POSITION);

        if (!isInputTarget) {
          inputCheckBox.checked = !inputCheckBox.checked;
        }

        if (inputCheckBox.checked) {
          me.showColumn(column);
        } else {
          me.hideColumn(column);
        }

        setTimeout(() => {
          me.gridEl.classList.remove(ANIMATE_CELLS_POSITION);
          delete me.animatingColumnsPosition;
        }, 300);
      }
    },

    onDocClickForHeaderCellMenu(column, e) {
      const me = this;

      if (!e.target.closest(`.${COLUMNS_MENU}`) && !e.target.closest(`.${HEADER_CELL_MENU}`)) {
        me.destroyHeaderCellMenuList(column);
      }
    },

    destroyHeaderCellMenuList(column) {
      const me = this;

      document.removeEventListener('mousedown', me.onDocClickForHeaderCellMenuFn);

      if(column) {
        column.elMenuList?.remove();
        delete column.elMenuList;
      }
      else if(me.activeElMenuList){
        me.scroller.columnsViewRange.forEach(columnIndex => {
          const column = me.columns[columnIndex];
          if(column.elMenuList){
            column.elMenuList.remove();
            delete column.elMenuList;
          }
        });
      }
      delete me.activeElMenuList;
    },

    reSetVisibleHeaderColumnsIndex(){
      const me = this;
      const columnsViewRange = me.scroller.columnsViewRange;

      for(let i = 0, iL = columnsViewRange.length;i<iL;i++){
        const columnIndex = columnsViewRange[i];
        //const columnIndex = i;
        const column = me.columns[columnIndex];
        const headerCellEl = column.headerCellEl;
        const filterCellEl = column.filterCellEl;

        if(column.hidden){
          continue;
        }

        if(headerCellEl){
          if(Number(headerCellEl.getAttribute('col-index')) !== columnIndex){
            headerCellEl.setAttribute('col-index', columnIndex);
          }
        }

        if(filterCellEl){
          if(Number(filterCellEl.getAttribute('col-index')) !== columnIndex){
            filterCellEl.setAttribute('col-index', columnIndex);
          }
        }
      }
    }
  };

  Object.assign(Grid.prototype, GridMixinHeader);

})();

(()=>{
  const {
    CELL,
    CELL_ORDER,
    CELL_WRAPPER,
    CELL_SELECTION,
    CELL_SELECTED,
    ACTIVE_CELL,
    ACTIVE_CELL_ROW,
    ROW,
    ROW_ODD,
    ROW_EVEN,
    ROW_SELECTED,
    ROW_GROUP,
    ROW_GROUP_VALUE_CELL,
    ROW_GROUP_CELL,
    ROW_GROUP_CELL_SELECTION,
    ROW_GROUP_CELL_VALUE,
    ROW_GROUP_CELL_AMOUNT,
    ROW_GROUP_CELL_EXPANDER,
    ROW_GROUP_EXPANDED_CELL,
    ROW_HOVER,
    INPUT_CHECKBOX,
    SVG_ITEM,
    SVG_CHEVRON_RIGHT
  } = Fancy.cls;

  /**
   * @mixin GridMixinBody
   */

  const GridMixinBody = {
    addColumnCells(columnIndexes = []) {
      const me = this;
      const startRow = me.scroller.getStartRow();
      const endRow = me.scroller.getEndRow();

      columnIndexes.forEach(columnIndex => {
        let i = startRow;

        me.appendHeaderCell(columnIndex);

        if (me.filterBar) {
          me.appendFilterBarCell(columnIndex);
        }

        for (; i < endRow; i++) {
          me.appendCell(i, columnIndex);
        }
      });
    },

    appendCell(rowIndex, columnIndex) {
      const me = this;
      const item = me.store.getItemByRowIndex(rowIndex);
      const rowEl = me.renderedRowsIdMap.get(item.id);

      if(rowEl.classList.contains(ROW_GROUP)){
        const column = me.columns[columnIndex];
        if(me.rowGroupType === 'column' && column.$isRowGroupColumn){
          const cell = me.createCellGroupTypeColumn(rowIndex, item, columnIndex);
          rowEl.appendChild(cell);
        }
        return;
      }

      const cell = me.createCell(rowIndex, columnIndex);

      rowEl.appendChild(cell);
    },

    createCell(rowIndex, columnIndex) {
        const me = this;
        const store = me.store;
        const item = store.getItemByRowIndex(rowIndex);
        const column = me.columns[columnIndex];
        let value = item[column.index];
        let cellInner;
        const cell = document.createElement('div');
        const params = {
          item,
          column,
          rowIndex,
          columnIndex,
          value,
          cell
        };

        if(column.$type === 'currency'){
          column.currency && (params.currency = column.currency);
          column.minDecimal !== undefined && (params.minDecimal = column.minDecimal);
          column.maxDecimal !== undefined && (params.maxDecimal = column.maxDecimal);
        }

        cell.setAttribute('col-index', columnIndex);
        cell.setAttribute('col-id', column.id);
        cell.classList.add(CELL);
        cell.style.width = column.width + 'px';
        cell.style.left = column.left + 'px';

        if(me.activeCell && me.$preventActiveCellRender !== true && item.id === me.activeCellRowId && columnIndex === me.activeCellColumnIndex){
          cell.classList.add(ACTIVE_CELL);
          me.activeCellEl = cell;
        }

        if(column.cellStyle) {
          let cellExtraStyles;
          switch(typeof column.cellStyle){
            case 'function':
              cellExtraStyles = column.cellStyle(params) || {};
              break;
            case 'object':
              cellExtraStyles = column.cellStyle;
              break;
          }

          for (const p in cellExtraStyles) {
            cell.style[p] = cellExtraStyles[p];
          }
        }

        if(column.cellCls){
          if(typeof column.cellCls === 'string'){
            cell.classList.add(column.cellCls);
          }
          else if(Array.isArray(column.cellCls)){
            cell.classList.add(...column.cellCls);
          }
          else if(typeof column.cellCls === 'function'){
            let cls = column.cellCls(params);
            if(typeof cls === 'string'){
              cls = [cls];
            }

            if(cls){
              cell.classList.add(...cls);
            }
          }
        }

        if(column.cellClsRules){
          for(const cls in column.cellClsRules){
            const fn = column.cellClsRules[cls];

            fn(params) && cell.classList.add(cls);
          }
        }

        if(column.format){
          value = column.format(params);
        }

        if(column.render){
          cellInner = column.render(params);
        }
        else {
          cellInner = value;
        }

        if(column.$isRowGroupColumn || column.rowGroupIndent){
          cell.classList.add(ROW_GROUP_VALUE_CELL);
        }

        if(column.checkboxSelection){
          const wrapperEl = document.createElement('div');
          wrapperEl.classList.add(CELL_WRAPPER);

          if(column.rowGroupIndent){
            wrapperEl.style.setProperty('--grid-group-level', `${store.rowGroups.length + 1}`);
          }

          const checkBoxEl = me.generateRowGroupCheckBoxEl(item);
          checkBoxEl.addEventListener('click', this.onRowCellSelectionClick.bind(this));
          wrapperEl.appendChild(checkBoxEl);

          const valueEl = me.generateSimpleValueEl(cellInner);
          wrapperEl.appendChild(valueEl);

          cell.appendChild(wrapperEl);
          cell.classList.add(CELL_SELECTION);
        }
        else if(column.$isRowGroupColumn){
          const wrapperEl = document.createElement('div');
          wrapperEl.classList.add(CELL_WRAPPER);

          if(column.rowGroupIndent){
            wrapperEl.style.setProperty('--grid-group-level', `${store.rowGroups.length}`);
          }

          const valueEl = document.createElement('span');
          valueEl.classList.add('fg-cell-value');

          if(cellInner === ''){
            cellInner = '&nbsp;';
          }
          valueEl.innerHTML = cellInner ?? '&nbsp;';

          wrapperEl.appendChild(valueEl);

          cell.appendChild(wrapperEl);
        }
        else if (cellInner !== undefined) {
          if(cellInner === ''){
            cellInner = '&nbsp;';
          }

          cell.innerHTML = cellInner ?? '&nbsp;';
        }

        if(me.activeCell){
          cell.addEventListener('mousedown', me.onBodyCellMouseDown.bind(this));
          if(me.selectingCells){
            cell.addEventListener('mouseenter', me.onBodyCellMouseEnter.bind(this));

            if(me.selectionCellsRange && cell){
              requestAnimationFrame(()=> {
                if (me.isCellInSelectedRange(cell)) {
                  cell.classList.add(CELL_SELECTED);
                }
              });
            }
          }
        }

        if(column.editable){
          cell.addEventListener('dblclick', me.onBodyCellDBLClick.bind(this));
        }

        cell.addEventListener('click', me.onBodyCellClick.bind(this));
        //cell.addEventListener('mousedown', me.onBodyCellMouseDown.bind(this));

        return cell;
    },

    createCellGroupTypeColumn(rowIndex, item, columnIndex) {
      const me = this;
      const column = me.columns[columnIndex];

      if(column.$isRowGroupColumn){
        const cell = me.generateGroupCell(rowIndex, item, column);

        cell.setAttribute('col-index', columnIndex);
        cell.setAttribute('col-id', column.id);
        cell.style.left = column.left + 'px';
        cell.style.width = column.width + 'px';

        return cell;
      } else {
        const column = me.columns[columnIndex];
        let value = item.$agValues[column.index] || '';
        const cell = document.createElement('div');
        let cellInner;

        if(column.format){
          value = column.format({
            item,
            column,
            rowIndex: rowIndex,
            columnIndex: columnIndex,
            value,
            cell
          });
        }

        if(column.render){
          cellInner = column.render({
            item,
            column,
            rowIndex: rowIndex,
            columnIndex: columnIndex,
            value,
            cell
          });
        }
        else {
          cellInner = value;
        }

        cell.setAttribute('col-index', columnIndex);
        cell.setAttribute('col-id', column.id);
        cell.classList.add(CELL);
        cell.style.width = column.width + 'px';
        cell.style.left = column.left + 'px';

        if(cellInner !== undefined){
          cell.innerHTML = cellInner;
        }

        return cell;
      }
    },

    createCellGroupTypeRow(rowIndex, item) {
      const cell = this.generateGroupCell(rowIndex, item);

      cell.style.left = '0px';

      return cell;
    },

    generateSimpleValueEl(cellInner){
      const valueEl = document.createElement('span');
      valueEl.classList.add('fg-cell-value');

      if(cellInner === ''){
        cellInner = '&nbsp;';
      }
      valueEl.innerHTML = cellInner ?? '&nbsp;';

      return valueEl;
    },

    generateGroupCell(rowIndex, item, column = {}){
      const me = this;
      const cell = document.createElement('div');
      cell.classList.add(ROW_GROUP_CELL);

      if(item.expanded){
        cell.classList.add(ROW_GROUP_EXPANDED_CELL);
      }

      const expanderEl = me.generateRowGroupExpanderEl(item);
      cell.appendChild(expanderEl);

      if(me.checkboxSelection || column.checkboxSelection){
        const selectionEl = me.generateRowGroupSelectionEl(item);
        cell.appendChild(selectionEl);
        cell.classList.add(CELL_SELECTION);
      }

      const valueEl = me.generateValueEl(item, rowIndex);
      cell.appendChild(valueEl);

      const amountEl = me.generateAmountEl(item);
      cell.appendChild(amountEl);

      return cell;
    },

    generateAmountEl(item){
      const amountEl = document.createElement('span');
      amountEl.classList.add(ROW_GROUP_CELL_AMOUNT);
      amountEl.innerHTML = ` (${item.amount})`;

      return amountEl;
    },

    generateValueEl(item, rowIndex){
      const displayGroupValue = item.$rowDisplayGroupValue;
      const valueEl = document.createElement('span');
      valueEl.classList.add(ROW_GROUP_CELL_VALUE);

      if(this.groupValueRender){
        const displayValue = this.groupValueRender({
          el: valueEl,
          value: displayGroupValue,
          item,
          rowIndex
        });

        if(displayValue){
          valueEl.innerHTML = displayValue;
        }
      }
      else {
        valueEl.innerHTML = displayGroupValue;
      }

      return valueEl;
    },

    generateRowGroupExpanderEl(item){
      const svgChevronRight = Fancy.svg.chevronRight;
      const expanderEl = document.createElement('span');

      expanderEl.classList.add(ROW_GROUP_CELL_EXPANDER, SVG_ITEM, SVG_CHEVRON_RIGHT);
      expanderEl.style.setProperty('--grid-group-level', item.$groupLevel);
      expanderEl.innerHTML = svgChevronRight;
      expanderEl.addEventListener('click', this.onRowGroupExpanderClick.bind(this));

      return expanderEl;
    },

    generateRowGroupCheckBoxEl(item){
      const selected = item.$selected || false;
      const checkboxEl = document.createElement('input');
      checkboxEl.classList.add(INPUT_CHECKBOX);
      checkboxEl.setAttribute('type', 'checkbox');
      checkboxEl.checked = selected;

      if(item.selectedStatus === 'partly'){
        checkboxEl.indeterminate = true;
      }

      return checkboxEl;
    },

    generateRowGroupSelectionEl(item){
      const selectionEl = document.createElement('span');
      const checkBoxEl = this.generateRowGroupCheckBoxEl(item);
      checkBoxEl.addEventListener('click', this.onRowGroupCellSelectionClick.bind(this));

      selectionEl.classList.add(ROW_GROUP_CELL_SELECTION);
      selectionEl.appendChild(checkBoxEl);

      return selectionEl;
    },

    removeColumnCells(columnIndexes = []) {
      const me = this;

      columnIndexes.forEach((columnIndex) => {
        const headerCell = me.headerEl.querySelector(`[col-index="${columnIndex}"]`);

        if(!headerCell){
          return;
        }

        headerCell.remove?.();

        if (me.filterBar) {
          const filterCell = me.filterBarEl.querySelector(`[col-index="${columnIndex}"]`);

          filterCell.remove?.();
        }

        me.renderedRowsIdMap.forEach(rowEl => {
          if (rowEl.classList.contains(ROW_GROUP)) {
            return
          }

          const cell = rowEl.querySelector(`[col-index="${columnIndex}"]`);

          cell?.remove();
        });
      });
    },

    renderRow(index, item, style = {}) {
      const me = this;
      const rowEl = document.createElement('div');

      if (!item) {
        console.warn(`row ${index} does not exist`);
        return;
      }

      const params = {
        rowIndex: index,
        item
      };

      rowEl.classList.add(ROW, index % 2 === 1 ? ROW_ODD : ROW_EVEN);

      if(me.activeCell && me.$preventActiveCellRender !== true && item.id === me.activeCellRowId){
        rowEl.classList.add(ACTIVE_CELL_ROW);
        me.activeCellRowEl = rowEl;
      }

      me.applyExtraRowStyles(rowEl, params);

      if(item.$selected){
        rowEl.classList.add(ROW_SELECTED);
      }

      rowEl.style.transform = `translateY(${index * me.rowHeight}px)`;
      for(const p in style){
        rowEl.style[p] = style[p];
      }
      rowEl.setAttribute('row-id', item.id);
      rowEl.setAttribute('row-index', index);

      rowEl.addEventListener('mouseenter', this.onRowMouseEnter.bind(this));

      let columnStart = me.scroller.columnViewStart,
        columnEnd = me.scroller.columnViewEnd;

      for (let i = columnStart; i <= columnEnd; i++) {
        const cell = me.createCell(index, i);
        const column = me.columns[i];

        if (!column.hidden) {
          rowEl.appendChild(cell);
        }
      }

      me.bodyInnerContainerEl.appendChild(rowEl);
      me.renderedRowsIdMap.set(item.id, rowEl);

      return rowEl;
    },

    applyExtraRowStyles(rowEl, params){
      const me = this;

      if(me.rowStyle){
        if(typeof me.rowStyle === 'function'){
          const rowStyles = me.rowStyle(params) || {};

          for(const p in rowStyles){
            rowEl.style[p] = rowStyles[p];
          }
        }
      }

      if(me.rowCls){
        if(typeof me.rowCls === 'function'){
          let cls = me.rowCls(params) || [];

          if(typeof cls === 'string'){
            cls = [cls];
          }

          rowEl.classList.add(...cls);
        }
      }

      if(me.rowClsRules){
        if(typeof me.rowClsRules === 'object'){
          for(const cls in me.rowClsRules){
            const fn = me.rowClsRules[cls];

            if(fn(params)){
              rowEl.classList.add(cls);
            }
          }
        }
      }
    },

    renderRowGroup(index, item, style = {}) {
      const me = this;
      const rowEl = document.createElement('div');
      const rowGroupType = me.rowGroupType;

      if (!item) {
        console.warn(`row ${index} does not exist`);
        return;
      }

      rowEl.classList.add(ROW_GROUP, index % 2 === 1 ? ROW_ODD : ROW_EVEN);

      if(item.$selected){
        rowEl.classList.add(ROW_SELECTED);
      }

      rowEl.style.transform = `translateY(${index * me.rowHeight}px)`;
      for(const p in style){
        rowEl.style[p] = style[p];
      }
      rowEl.setAttribute('row-id', item.id);
      rowEl.setAttribute('row-index', index);
      rowEl.setAttribute('row-group', item.$rowGroupValue.replaceAll('-', '$').split('/').join('-'));

      rowEl.addEventListener('mouseenter', this.onRowMouseEnter.bind(this));

      if (rowGroupType === 'column') {
        let columnStart = me.scroller.columnViewStart,
          columnEnd = me.scroller.columnViewEnd;

        for (let i = columnStart; i <= columnEnd; i++) {
          const column = me.columns[i];

          if (!column.hidden) {
            const cell = me.createCellGroupTypeColumn(index, item, i);
            rowEl.appendChild(cell);
          }
        }
      } else if (rowGroupType === 'row') {
        const cell = me.createCellGroupTypeRow(index, item);
        rowEl.appendChild(cell);
      }

      me.bodyInnerContainerEl.appendChild(rowEl);
      me.renderedRowsIdMap.set(item.id, rowEl);

      return rowEl;
    },

    renderRowOnPrevPosition(item, smoothPositionAnimate) {
      const me = this;
      const rowEl = document.createElement('div');
      const prevIndex = me.store.prevIdRowIndexesMap.get(item.id);
      const index = item.rowIndex;

      if (!item) {
        console.warn(`row ${item.index} does not exist`);
        return;
      }

      let positionY;

      if (smoothPositionAnimate) {
        positionY = me.getSmoothPositionY(item, true);
      } else {
        positionY = prevIndex * me.rowHeight;
      }

      if(item.$selected){
        rowEl.classList.add(ROW_SELECTED);
      }

      const params = {
        rowIndex: index,
        item
      };

      rowEl.classList.add(ROW, index % 2 === 1 ? ROW_ODD : ROW_EVEN);
      me.applyExtraRowStyles(rowEl, params);

      rowEl.style.transform = `translateY(${positionY}px)`;
      rowEl.setAttribute('row-id', item.id);
      rowEl.setAttribute('row-index', index);
      rowEl.addEventListener('mouseenter', this.onRowMouseEnter.bind(this));

      let columnStart = me.scroller.columnViewStart,
        columnEnd = me.scroller.columnViewEnd;

      for (let i = columnStart; i <= columnEnd; i++) {
        const column = me.columns[i];

        if (column.hidden) {
          continue
        }

        const cell = me.createCell(index, i);

        rowEl.appendChild(cell);
      }

      me.bodyInnerContainerEl.appendChild(rowEl);
      me.renderedRowsIdMap.set(item.id, rowEl);
    },

    updateCellPositions(columnIndex) {
      const me = this;

      let columnStart = me.scroller.columnViewStart,
        columnEnd = me.scroller.columnViewEnd;

      if (columnIndex !== undefined && columnStart < columnIndex) {
        columnStart = columnIndex;
      }

      // Update Header Cells
      for (let i = columnStart; i <= columnEnd; i++) {
        const column = me.columns[i];

        if (column.hidden) {
          continue
        }

        if(!column.headerCellEl){
          me.appendHeaderCell(i);
        }

        column.headerCellEl.style.left = column.left + 'px';
        column.headerCellEl.style.width = column.width + 'px';

        if (column.filterCellEl) {
          column.filterCellEl.style.left = column.left + 'px';
          column.filterCellEl.style.width = column.width + 'px';
        }
      }

      // Update Body Cells
      me.renderedRowsIdMap.forEach((rowEl, id) => {
        const cells = rowEl.querySelectorAll(`.${CELL}`);
        cells.forEach(cell => {

          const columnIndex = cell.getAttribute('col-index');
          const column = me.columns[columnIndex];
          cell.style.left = column.left + 'px';

          cell.style.width = column.width + 'px';
        });

        if(me.rowGroupType === 'column'){
          const groupCells = rowEl.querySelectorAll(`.${ROW_GROUP_CELL}`);

          groupCells.forEach(cell => {
            const columnIndex = cell.getAttribute('col-index');
            const column = me.columns[columnIndex];

            cell.style.left = column.left + 'px';
            cell.style.width = column.width + 'px';
          });
        }
      });
    },

    renderVisibleRows() {
      const me = this;
      const startRow = me.scroller.getStartRow();
      const endRow = me.scroller.getEndRow();

      me.actualRowsIdSet = new Set();

      let i = startRow;

      for (; i < endRow; i++) {
        const item = me.store.getItemByRowIndex(i);

        if (!item) {
          console.warn(`Item with index equals to ${i} does not exist`);
          continue;
        }

        if (!me.renderedRowsIdMap.has(item.id)) {
          if (item.$isGroupRow) {
            me.renderRowGroup(i, item);
          } else {
            me.renderRow(i, item);
          }
        }

        me.actualRowsIdSet.add(item.id);
      }
    },

    terminateVisibleRows(){
      const me = this;

      me.renderedRowsIdMap.forEach((row, key) => {
        me.removeDomRowById(key);
      });
    },

    // For smooth filtering
    fakeHideRow(item) {
      const me = this;
      const rowEl = me.renderedRowsIdMap.get(item.id);

      if (!rowEl) {
        console.warn(`Row el for row index ${item.rowIndex} does not exist`);
        return;
      }

      rowEl.style.opacity = '0';
    },

    // For smooth animating
    fakeRowPosition(item) {
      const me = this;
      const rowEl = me.renderedRowsIdMap.get(item.id);

      if (!rowEl) {
        console.warn(`Row el for row index ${item.rowIndex} does not exist`);
        return;
      }

      const positionY = me.getSmoothPositionY(item);

      rowEl.style.transform = `translateY(${positionY}px)`;
      rowEl.setAttribute('row-index', item.rowIndex);

      if(me.columnOrder){
        const orderCell = rowEl.querySelector(`.${CELL_ORDER}`);

        if(orderCell){
          orderCell.innerHTML = item.rowIndex + 1;
        }
      }
    },

    getSmoothPositionY(item, prevPosition) {
      const me = this;
      const bufferPosition = me.rowHeight * me.scroller.bufferRows;

      let rowIndex = item.rowIndex;

      if (prevPosition) {
        rowIndex = me.store.prevIdRowIndexesMap.get(item.id);
      }

      let positionY = rowIndex * me.rowHeight;

      if (positionY < me.scroller.scrollTop - bufferPosition) {
        positionY = me.scroller.scrollTop - bufferPosition;
      } else if (positionY > me.scroller.scrollTop + me.height + bufferPosition) {
        positionY = me.scroller.scrollTop + me.height + bufferPosition;
      }

      return positionY;
    },

    updateRowPosition(item) {
      const me = this;
      const rowEl = me.renderedRowsIdMap.get(item.id);

      if (!rowEl) {
        console.warn(`Row el for row index ${item.rowIndex} does not exist`);
        return;
      }

      rowEl.style.transform = `translateY(${item.rowIndex * me.rowHeight}px)`;
      rowEl.setAttribute('row-index', item.rowIndex);
    },

    removeNotNeededRows() {
      const me = this;

      me.renderedRowsIdMap.forEach((rowEl, id) => {
        if (!me.actualRowsIdSet.has(id)) {
          me.removeDomRowById(id);
        }
      });
    },

    onRowMouseEnter(event) {
      const me = this;

      if (me.columnResizing) {
        return;
      }

      event.target.classList.add(ROW_HOVER);

      event.target.addEventListener('mouseleave', me.onRowMouseLeave.bind(this), {
        once: true
      });
    },

    onRowMouseLeave(event) {
      event.target.classList.remove(ROW_HOVER);
    },

    onRowGroupExpanderClick(event) {
      const me = this;

      if(me.grouping){
        return;
      }

      const cell = event.target.closest(`.${ROW_GROUP_CELL}`);
      const row = cell.closest(`.${ROW_GROUP}`);
      const $rowGroupValue = row.getAttribute('row-group').replaceAll('-', '/').replaceAll('$', '-');

      if (cell.classList.contains(ROW_GROUP_EXPANDED_CELL)) {
        me.collapse($rowGroupValue);
      } else {
        me.expand($rowGroupValue);
      }
    },

    updateRowGroupCellExpandedCls(group){
      const me = this;
      const cell = me.bodyEl.querySelector(`div[row-group="${group.replaceAll('-', '$').replaceAll('/', '-')}"] .${ROW_GROUP_CELL}`);

      if (cell.classList.contains(ROW_GROUP_EXPANDED_CELL)) {
        cell.classList.remove(ROW_GROUP_EXPANDED_CELL);
      } else {
        cell.classList.add(ROW_GROUP_EXPANDED_CELL);
      }
    },

    updateAllRowGroupCellsExtendedCls(){
      const me = this;
      const rows = me.bodyEl.querySelectorAll(`.${ROW_GROUP}`);

      rows.forEach(row => {
        const $rowGroupValue = row.getAttribute('row-group').replaceAll('-', '/').replaceAll('$', '-');
        const cell = row.querySelector(`.${ROW_GROUP_CELL}`);
        const expanded = me.store.expandedGroups[$rowGroupValue];
        const hasExpandedCls = cell.classList.contains(ROW_GROUP_EXPANDED_CELL);

        if(expanded && !hasExpandedCls){
          cell.classList.add(ROW_GROUP_EXPANDED_CELL);
        }
        else if(!expanded && hasExpandedCls){
          cell.classList.remove(ROW_GROUP_EXPANDED_CELL);
        }
      });
    },

    reSetVisibleBodyColumnsIndex(from, to, oldOrders){
      const me = this;
      const cellsMap = {};
      const cellsGroupMap = {};

      if(from === undefined){
        const columnsViewRange = me.scroller.columnsViewRange;

        for(let i = 0, iL = columnsViewRange.length;i<iL;i++) {
          const columnIndex = columnsViewRange[i];
          const column = me.columns[columnIndex];

          const cells = me.bodyEl.querySelectorAll(`.${CELL}[col-id="${column.id}"]`);
          cells.forEach(cell => {
            if(Number(cell.getAttribute('col-index')) !== columnIndex){
              cell.setAttribute('col-index', columnIndex);
            }
          });

          if(me.rowGroupType === 'column'){
            const cells = me.bodyEl.querySelectorAll(`.${ROW_GROUP_CELL}[col-index="${i}"]`);

            cells.forEach(cell => {
              if(Number(cell.getAttribute('col-index')) !== columnIndex){
                cell.setAttribute('col-index', columnIndex);
              }
            });
          }
        }

        return;
      }

      for(let i = from;i <= to;i++){
          const cells = me.bodyEl.querySelectorAll(`.${CELL}[col-index="${i}"]`);
          cellsMap[i] = cells;

          if(me.rowGroupType === 'column'){
            const cells = me.bodyEl.querySelectorAll(`.${ROW_GROUP_CELL}[col-index="${i}"]`);

            if(cells.length){
              cellsGroupMap[i] = cells;
            }
          }
      }

      for(let i = from, j = 0;i <= to;i++, j++){
        const oldIndex = oldOrders[j];
        const newIndex = from + j;

        cellsMap[oldIndex].forEach(cell => {
          cell.setAttribute('col-index', newIndex);
        });

        cellsGroupMap[oldIndex]?.forEach(cell => {
          cell.setAttribute('col-index', newIndex);
        });
      }
    },

    getCell(rowIndex, columnIndex){
      const me = this;
      const cell = me.bodyEl.querySelector(`div.${ROW}[row-index="${rowIndex}"] div.${CELL}[col-index="${columnIndex}"]`);

      return cell;
    },

    updateOrderColumn(){
      const me = this;

      if(me.columnOrder){
        const cells = me.bodyEl.querySelectorAll(`div.${CELL_ORDER}`);

        cells.forEach(cell => {
          const row = cell.closest(`.${ROW}`);
          if(!row){
            return;
          }
          const itemId = row.getAttribute('row-id');
          const item = me.store.idItemMap.get(itemId);

          if(!item){
            return;
          }

          cell.innerHTML = item.rowIndex + 1;
        });
      }
    }
  };

  Object.assign(Grid.prototype, GridMixinBody);

})();

(()=> {

  /**
   * @mixin GridMixinScroll
   */

  const GridMixinScroll = {
    initScroller() {
      const me = this;

      me.scroller = new Fancy.Scroller({
        grid: me
      });
    },

    onMouseWheel(event) {
      const me = this;
      const delta = 'wheelDelta' in event ? event.wheelDelta : event.deltaY;
      let changed = false;

      me.wheelScrolling = true;

      if(Math.abs(event.deltaY) > Math.abs(event.deltaX)){
        // Vertical scroll
        changed = me.scroller.deltaChange(delta);
        me.bodyInnerEl.scrollTop = me.scroller.scrollTop;
      }
      else {
        // Horizontal scroll
        changed = me.scroller.horizontalDeltaChange(delta);
        me.bodyInnerEl.scrollLeft = me.scroller.scrollLeft;
      }

      if(changed){
        event.preventDefault();
      }

      cancelAnimationFrame(me.animationRenderId);

      me.animationRenderId = requestAnimationFrame(() => {
        me.renderVisibleRows();
      });

      cancelAnimationFrame(me.animationRemoveId);

      me.animationRemoveId = requestAnimationFrame(() => {
        me.removeNotNeededRows();
      });

      me.debouceClearWheelScrollingFn();
    },

    onTouchScroll(event){
      const me = this;
      let changed = false;

      me.wheelScrolling = true;

      if(Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
        // Vertical scroll
        changed = me.scroller.deltaChange(event.deltaY);
        me.bodyInnerEl.scrollTop = me.scroller.scrollTop;
      }
      else if(event.deltaX){
        // Horizontal scroll
        changed = me.scroller.horizontalDeltaChange(event.deltaX);
        me.bodyInnerEl.scrollLeft = me.scroller.scrollLeft;
      }

      if(changed){
        event.preventDefault?.();
      }

      cancelAnimationFrame(me.animationRenderId);

      me.animationRenderId = requestAnimationFrame(() => {
        me.renderVisibleRows();
      });

      cancelAnimationFrame(me.animationRemoveId);

      me.animationRemoveId = requestAnimationFrame(() => {
        me.removeNotNeededRows();
      });

      me.debouceClearWheelScrollingFn();
    },

    clearWheelScrolling() {
      delete this.wheelScrolling;
    }
  };

  Object.assign(Grid.prototype, GridMixinScroll);

})();

(()=> {

  /**
   * @mixin GridMixinSort
   */

  const GridMixinSort = {
    sort(sortingColumn, dir = 'ASC', multi) {
      const me = this;

      if (me.sorting) {
        return;
      }

      if(me.isEditing){
        me.hideActiveEditor();
      }

      me.sorting = true;

      let sorterOrdersMap = {};

      me.store.sort(sortingColumn, dir, multi);

      if (multi) {
        me.store.sorters.forEach((sorter, index) => {
          sorterOrdersMap[sorter.column.id] = index + 1;
        });
      }

      me.columns.forEach(column => {
        if (column.id === sortingColumn.id){
          column.sort = dir;

          if (multi && me.store.sorters.length !== 1) {
            column.sortOrder = sorterOrdersMap[column.id];
          } else {
            delete column.sortOrder;
          }
        } else {
          if (!multi) {
            delete column.sort;
          }

          if (sorterOrdersMap[column.id]) {
            column.sortOrder = sorterOrdersMap[column.id];
          } else {
            delete column.sortOrder;
          }
        }
      });

      me.renderVisibleRowsAfterSort();
      me.store.memorizePrevRowIndexesMap();
      me.updateHeaderCells();

      if(me.activeCell){
        me.clearActiveCell();
      }
    },

    multiSort(column, dir) {
      const me = this;

      me.sort(column, dir, true);
    },

    clearSort($column, multi) {
      const me = this;

      let i = 0;

      for (; i < me.columns.length; i++) {
        const column = me.columns[i];

        if (!$column || !multi) {
          delete column.sort;
          delete column.sortOrder;
        } else if (column.id === $column.id) {
          delete column.sort;
          delete column.sortOrder;
        }
      }

      me.store.clearSort($column, multi);

      me.renderVisibleRowsAfterSort();
      me.store.memorizePrevRowIndexesMap();
      me.updateHeaderCells();

      if(me.activeCell){
        me.clearActiveCell();
      }
    },

    renderVisibleRowsAfterSort() {
      const me = this;
      const startRow = me.scroller.getStartRow();
      const endRow = me.scroller.getEndRow();

      me.actualRowsIdSet = new Set();

      let i = startRow;

      for (; i < endRow; i++) {
        const item = me.store.getItemByRowIndex(i);

        if (!item) {
          console.warn(`Item with index equals to ${i} does not exist`);
        } else {
          if (!me.renderedRowsIdMap.has(item.id)) {
            me.renderRowOnPrevPosition(item, true);
          }

          me.actualRowsIdSet.add(item.id);
        }
      }

      const itemsToRemove = [];

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          me.renderedRowsIdMap.forEach((rowEl, id) => {
            const item = me.store.idItemMap.get(id);

            if (!me.actualRowsIdSet.has(item.id)) {
              itemsToRemove.push(item);
            }

            // me.updateRowPosition(item);
            me.fakeRowPosition(item);
          });

          clearTimeout(me.timeOutRemoveRows);

          me.timeOutRemoveRows = setTimeout(() => {
            itemsToRemove.forEach(item => {
              me.removeDomRowById(item.id);
            });

            me.sorting = false;
          }, 500);
        });
      });
    }
  };

  Object.assign(Grid.prototype, GridMixinSort);

})();

(()=> {
  const {
    FILTER_BAR,
    FILTER_BAR_CELL,
    FILTER_BAR_INNER,
    FILTER_BAR_INNER_CONTAINER
  } = Fancy.cls;

  /**
   * @mixin GridMixinFilter
   */

  const GridMixinFilter = {
    renderVisibleFilterBarCells() {
      const me = this;

      let columnStart = me.scroller.columnViewStart,
        columnEnd = me.scroller.columnViewEnd;

      for (let i = columnStart; i <= columnEnd; i++) {
        const column = me.columns[i];

        if(column.hidden){
          continue;
        }

        const cell = me.createFilterBarCell(i);

        me.filterBarInnerContainerEl.appendChild(cell);
      }
    },

    renderFilterBar() {
      const me = this;

      const filterBarEl = document.createElement('div');
      filterBarEl.classList.add(FILTER_BAR);
      filterBarEl.style.height = (this.headerRowHeight + 1) + 'px';

      const filterBarInnerEl = document.createElement('div');
      filterBarInnerEl.classList.add(FILTER_BAR_INNER);
      filterBarInnerEl.style.width = (me.getTotalColumnsWidth() + me.scroller.scrollBarWidth) + 'px';

      const filterBarInnerContainerEl = document.createElement('div');
      filterBarInnerContainerEl.classList.add(FILTER_BAR_INNER_CONTAINER);
      filterBarInnerContainerEl.style.height = me.headerRowHeight + 'px';
      filterBarInnerContainerEl.style.width = me.getTotalColumnsWidth() + 'px';

      filterBarInnerEl.appendChild(filterBarInnerContainerEl);
      filterBarEl.appendChild(filterBarInnerEl);
      me.gridEl.appendChild(filterBarEl);

      me.filterBarInnerContainerEl = filterBarInnerContainerEl;
      me.filterBarInnerEl = filterBarInnerEl;
      me.filterBarEl = filterBarEl;
    },

    createFilterBarCell(columnIndex) {
      const me = this;
      const cell = document.createElement('div');
      const column = me.columns[columnIndex];

      cell.classList.add(FILTER_BAR_CELL);
      cell.setAttribute('col-index', columnIndex);
      cell.setAttribute('col-id', column.id);
      cell.style.width = column.width + 'px';
      cell.style.left = column.left + 'px';

      if (column.filter) {
        const filters = Object.entries(column.filters || {});
        let sign = '',
          value = '';

        if (filters.length) {
          sign = filters[0][0];
          value = filters[0][1].value;
        }

        const field = new Fancy.FilterField({
          renderTo: cell,
          onChange: me.onFilterFieldChange.bind(this),
          column,
          sign: sign,
          value: value
        });

        column.filterField = field;
      }

      column.filterCellEl = cell;

      return cell;
    },

    onFilterFieldChange(value, sign, column) {
      const me = this;

      column.filters = {};

      if (value === '') {
        me.clearFilter(column, sign);
      } else {
        me.filter(column, value, sign);
      }
    },

    appendFilterBarCell(columnIndex) {
      const me = this;
      const rowEl = me.filterBarInnerContainerEl;
      const cell = me.createFilterBarCell(columnIndex);

      rowEl.appendChild(cell);
    },

    clearFilter(index, sign) {
      const me = this;
      const store = me.store;

      if(store.rowGroups.length){
        store.clearFilterForGrouping(index, sign);
        me.updateAfterGrouping();
        me.updateRowGroupAmount();
        me.updateHeaderCells();
        return;
      }

      store.clearFilter(index, sign);

      me.columns.forEach(column => {
        if (column.index === index) {
          if (sign && column.filters) {
            delete column.filters[sign];
          } else {
            delete column.filters;
          }
        }
      });

      me.updateAfterFilter();
    },

    filter(column, value, sign = '=') {
      const me = this;
      const store = me.store;

      if(store.rowGroups.length){
        me.filterForRowGrouping(column, value, sign);
        me.updateAfterGrouping();
        me.updateRowGroupAmount();
        me.updateHeaderCells();
        return;
      }

      store.filter(column, value, sign);
      me.updateFiltersInColumns(column, value, sign);
      me.updateAfterFilter();
    },

    filterForRowGrouping(column, value, sign = '='){
      const me = this;

      me.store.filterForRowGrouping(column, value, sign);
      me.updateFiltersInColumns(column, value, sign);
    },

    updateFiltersInColumns(index, value, sign){
      this.columns.forEach(column => {
        if (column.index === index) {
          column.filters = column.filters || {};
          column.filters[sign] = column.filters[sign] || {};
          column.filters[sign].value = value;
        }
      });
    },

    updateAfterFilter() {
      const me = this;

      me.scroller.calcMaxScrollTop();
      me.scroller.updateScrollTop();
      me.scroller.calcViewRange();
      me.scroller.setVerticalSize();
      me.scroller.updateHorizontalScrollSize();
      me.updateVisibleHeight();

      me.renderVisibleRowsAfterFilter();
      me.store.memorizePrevRowIndexesMap();
      me.updateHeaderCells();
    },

    renderVisibleRowsAfterFilter() {
      const me = this;
      const startRow = me.scroller.getStartRow();
      const endRow = me.scroller.getEndRow();

      me.actualRowsIdSet = new Set();

      let i = startRow;

      for (; i < endRow; i++) {
        const item = me.store.getItemByRowIndex(i);

        if (!item) {
          console.warn(`Item with index equals to ${i} does not exist`);
        } else {
          if (!me.renderedRowsIdMap.has(item.id)) {
            me.renderRowOnPrevPosition(item, true);
          }

          me.actualRowsIdSet.add(item.id);
        }
      }

      const itemsToRemove = [];

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          me.renderedRowsIdMap.forEach((rowEl, id) => {
            const item = me.store.idItemMap.get(id);

            if (!me.actualRowsIdSet.has(item.id)) {
              itemsToRemove.push(item);
              me.fakeHideRow(item);
            } else {
              me.fakeRowPosition(item);
            }
          });

          clearTimeout(me.timeOutRemoveRows);

          me.timeOutRemoveRows = setTimeout(() => {
            itemsToRemove.forEach(item => {
              me.removeDomRowById(item.id);
            });

            me.filtering = false;
          }, 500);
        });
      });
    }
  };

  Object.assign(Grid.prototype, GridMixinFilter);

})();

(()=> {
  const {
    ROW_GROUP,
    ROW_GROUP_CELL_AMOUNT
  } = Fancy.cls;

  /**
   * @mixin GridMixinRowGroup
   */

  const GridMixinRowGroup = {
    toggleExpand(group) {
      const me = this;

      if (me.grouping) {
        return;
      }

      me.store.toggleExpand(group);

      me.updateAfterGrouping();

      if(me.activeCell){
        me.clearActiveCell();
      }
    },

    expand(group) {
      const me = this;

      if (me.grouping) {
        return;
      }

      me.grouping = true;

      if(me.store.filters.length){
        me.store.expandForFiltering(group);
      }
      else {
        me.store.expand(group);
      }

      me.updateRowGroupCellExpandedCls(group);
      me.updateAfterGrouping();

      if(me.activeCell){
        me.clearActiveCell();
      }
    },

    expandAll() {
      const me = this;

      if (me.grouping) {
        return;
      }

      me.grouping = true;

      me.store.expandAll();

      me.updateAllRowGroupCellsExtendedCls();
      me.updateAfterGrouping();

      if(me.activeCell){
        me.clearActiveCell();
      }
    },

    collapse(group) {
      const me = this;

      if (me.grouping) {
        return;
      }

      me.grouping = true;

      if(me.store.filters.length){
        me.store.collapseForFiltering(group);
      }
      else {
        me.store.collapse(group);
      }

      me.updateRowGroupCellExpandedCls(group);
      me.updateAfterGrouping();

      if(me.activeCell){
        me.clearActiveCell();
      }
    },

    collapseAll() {
      const me = this;

      if (me.grouping) {
        return;
      }

      me.grouping = true;

      me.store.collapseAll();

      me.updateAllRowGroupCellsExtendedCls();
      me.updateAfterGrouping();

      if(me.activeCell){
        me.clearActiveCell();
      }
    },

    updateAfterGrouping() {
      const me = this;

      me.scroller.calcMaxScrollTop();
      me.scroller.updateScrollTop();
      me.scroller.calcViewRange();
      me.scroller.setVerticalSize();
      me.scroller.updateHorizontalScrollSize();
      me.updateVisibleHeight();

      me.renderVisibleRowsAfterGrouping();
      me.store.memorizePrevRowIndexesMap();
    },

    renderVisibleRowsAfterGrouping() {
      const me = this;
      const startRow = me.scroller.getStartRow();
      const endRow = me.scroller.getEndRow();
      const newExpendedRowEls = [];

      me.actualRowsIdSet = new Set();

      let i = startRow;

      for (; i < endRow; i++) {
        const item = me.store.getItemByRowIndex(i);

        if (!item) {
          console.warn(`Item with index equals to ${i} does not exist`);
        } else {
          if (!me.renderedRowsIdMap.has(item.id)) {
            //me.renderRowOnPrevPosition(item, true);
            //me.renderRowOnPrevPosition(item);
            if (item.$isGroupRow) {
              newExpendedRowEls.push(me.renderRowGroup(i, item, {
                'z-index': 0,
                opacity: 0
              }));
            } else {
              newExpendedRowEls.push(me.renderRow(i, item, {
                'z-index': 0,
                opacity: 0
              }));
            }
          }

          me.actualRowsIdSet.add(item.id);
        }
      }

      const itemsToRemove = [];

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          me.renderedRowsIdMap.forEach((rowEl, id) => {
            const item = me.store.idItemMap.get(id);

            if (!me.actualRowsIdSet.has(item.id)) {
              itemsToRemove.push(item);
            }

            me.updateRowPosition(item);
            me.fakeRowPosition(item);
          });

          itemsToRemove.forEach(item => {
            const rowEl = me.renderedRowsIdMap.get(item.id);
            rowEl.style.zIndex = '0';
            rowEl.style.opacity = '0';
          });

          clearTimeout(me.timeOutRemoveRows);

          newExpendedRowEls.forEach(rowEl => {
            rowEl.style.opacity = 1;
          });

          me.timeOutRemoveRows = setTimeout(() => {
            itemsToRemove.forEach(item => {
              me.removeDomRowById(item.id);
            });

            newExpendedRowEls.forEach(rowEl => {
              rowEl.style['z-index'] = '';
              rowEl.style.opacity = '';
            });

            me.grouping = false;
          }, 500);
        });
      });
    },

    updateRowGroupAmount() {
      const me = this;
      const store = me.store;
      const filters = store.filters;
      const rowAmounts = me.bodyEl.querySelectorAll(`.${ROW_GROUP_CELL_AMOUNT}`);

      rowAmounts.forEach(amountEl => {
        const row = amountEl.closest(`.${ROW_GROUP}`);
        const $rowGroupValue = row.getAttribute('row-group').replaceAll('-', '/').replaceAll('$', '-');
        const groupDetail = filters.length? store.groupDetailsForFiltering[$rowGroupValue]:store.groupDetails[$rowGroupValue];

        //if(filters.length || !groupDetail){
        if(!groupDetail){
          return;
        }

        let amount = ` (${groupDetail.amount})`;
        const domAmount = Number(amountEl.innerHTML);

        if(domAmount !== groupDetail.amount){
          amountEl.innerHTML = amount;
        }
      });
    },

    reConfigRowGroups(){
      const me = this;
      const store = me.store;
      let rowGroups = [];

      me.grouping = true;

      me.terminateVisibleRows();

      if(me.rowGroupBarItemColumns?.length !== undefined){
        me.rowGroupBarItemColumns.forEach(column => {
          rowGroups.push(column.index);
        });
      }
      else {
        rowGroups = store.rowGroups;
      }

      store.reConfigRowGroups(rowGroups);

      me.scroller.calcMaxScrollTop();
      me.scroller.updateScrollTop();
      me.scroller.calcViewRange();
      me.scroller.setVerticalSize();
      me.scroller.updateHorizontalScrollSize();
      me.updateVisibleHeight();

      me.scroller.calcVisibleRows();

      me.renderVisibleRows();
      me.store.memorizePrevRowIndexesMap();

      me.grouping = false;
    }
  };

  Object.assign(Grid.prototype, GridMixinRowGroup);

})();

(()=> {
  const {
    COLUMN_DRAGGING,
    ROW_GROUP_BAR,
    ROW_GROUP_BAR_EMPTY_TEXT,
    ROW_GROUP_BAR_ITEM_CONTAINER,
    ROW_GROUP_BAR_ITEM,
    ROW_GROUP_BAR_ITEM_TEXT,
    ROW_GROUP_BAR_ITEM_ACTIVE,
    SVG_ITEM,
    SVG_GROUP,
    SVG_DRAG,
    SVG_CHEVRON_RIGHT,
    SVG_REMOVE
  } = Fancy.cls;

  /**
   * @mixin GridMixinRowGroupBar
   */

  const GridMixinRowGroupBar = {
    renderRowGroupBar() {
      const me = this;

      const rowGroupBarEl = document.createElement('div');
      rowGroupBarEl.classList.add(ROW_GROUP_BAR);
      rowGroupBarEl.style.height = (this.headerRowHeight + 1) + 'px';

      const svgGroup = Fancy.svg.group;
      const groupLogoEl = document.createElement('span');
      groupLogoEl.classList.add(SVG_ITEM, SVG_GROUP);
      groupLogoEl.innerHTML = svgGroup;

      rowGroupBarEl.appendChild(groupLogoEl);

      const emptyTextEl = document.createElement('span');
      emptyTextEl.classList.add(ROW_GROUP_BAR_EMPTY_TEXT);
      emptyTextEl.innerHTML = 'Drag columns here to generate row groups';

      rowGroupBarEl.appendChild(emptyTextEl);

      me.gridEl.appendChild(rowGroupBarEl);

      me.rowGroupBarEmptyTextEl = emptyTextEl;
      me.rowGroupBarEl = rowGroupBarEl;

      me.renderRowGroupBarItems();
    },

    renderRowGroupBarItems(){
      const me = this;

      me.store.rowGroups.forEach(group => {
        const column =  me.getColumn(group);

        me.addGroupInBar(column, false);
      });
      delete me.activeRowGroupBarItemEl;
    },

    // Syntactic mouseenter because cursor is over dragging cell
    onRowGroupBarMouseEnter(){
      const me = this;

      me.addGroupInBar(me.columnDragging.column);
    },

    addGroupInBar(column, isItemActive = true){
      const me = this;
      const rowGroupBarItemEl = me.generateRowGroupBarItemEl(column);
      if(isItemActive){
        rowGroupBarItemEl.classList.add(ROW_GROUP_BAR_ITEM_ACTIVE);
      }

      me.activeRowGroupBarItemEl = rowGroupBarItemEl;
      me.rowGroupBarItems = me.rowGroupBarItems || [];
      me.rowGroupBarItemColumns = me.rowGroupBarItemColumns || [];

      me.rowGroupBarEl.appendChild(rowGroupBarItemEl);
      me.rowGroupBarItems.push(rowGroupBarItemEl);
      me.rowGroupBarItemColumns.push(column);

      if(me.columnDragging && me.rowGroupType === 'column'){
        if(me.rowGroupBarItemColumns.length <= 1){
          me.$requiresReSetGroupColumn = true;
        }
      }

      me.rowGroupBarEmptyTextEl.style.setProperty('display', 'none');
    },

    generateRowGroupBarItemEl(column){
      const me = this;

      const containerEl = document.createElement('div');
      containerEl.classList.add(ROW_GROUP_BAR_ITEM_CONTAINER);
      containerEl.setAttribute('row-group-order-index', String(me.rowGroupBarItems?.length || 0));

      const groupItemEl = document.createElement('span');
      groupItemEl.classList.add(ROW_GROUP_BAR_ITEM);

      const dragSvgEl = document.createElement('span');
      dragSvgEl.classList.add(SVG_ITEM, SVG_DRAG);
      dragSvgEl.innerHTML = Fancy.svg.groupCellDrag;
      groupItemEl.appendChild(dragSvgEl);

      dragSvgEl.addEventListener('mousedown', me.onRowGroupBarItemDragElMouseDown.bind(me));

      const groupItemText = document.createElement('span');
      groupItemText.classList.add(ROW_GROUP_BAR_ITEM_TEXT);
      groupItemText.innerHTML = column.title;
      groupItemEl.appendChild(groupItemText);

      const removeSvgEl = document.createElement('span');
      removeSvgEl.classList.add(SVG_ITEM, SVG_REMOVE);
      removeSvgEl.innerHTML = Fancy.svg.remove;
      removeSvgEl.addEventListener('click', me.onRowGroupBarItemRemoveClick.bind(me));
      groupItemEl.appendChild(removeSvgEl);

      if(me.rowGroupBarItems?.length){
        const svgChevronRight = Fancy.svg.chevronRight;
        const chevronEl = document.createElement('span');

        chevronEl.classList.add(SVG_ITEM, SVG_CHEVRON_RIGHT);
        chevronEl.innerHTML = svgChevronRight;

        if(me.rowGroupBarSeparator){
          containerEl.appendChild(chevronEl);
        }
      }

      containerEl.appendChild(groupItemEl);

      return containerEl;
    },

    onRowGroupBarItemDragElMouseDown(event){
      const me = this;
      const groupItemEl = event.target.closest(`.${ROW_GROUP_BAR_ITEM_CONTAINER}`);
      const rowGroupOrderIndex = Number(groupItemEl.getAttribute('row-group-order-index'));
      const column = me.rowGroupBarItemColumns[rowGroupOrderIndex];

      groupItemEl.classList.add(ROW_GROUP_BAR_ITEM_ACTIVE);
      me.activeRowGroupBarItemEl = groupItemEl;

      if(me.isEditing){
        me.hideActiveEditor();
      }

      me.columnDragging = {
        column,
        inBar: true,
        dragColumnCellEl: me.createDragColumnCellEl(column),
        rowGroupBarElRect: me.getRowGroupBarElRect(),
        dragItemFromRowGroupBar: true,
        rowGroupBarItemsRect: me.getRowGroupBarItemsRect(),
        originalRowGroupItemOrderIndex: rowGroupOrderIndex
      };

      me.gridEl.classList.add(COLUMN_DRAGGING);

      me.onColumnDragMouseMoveFn = me.onColumnDragMouseMove.bind(this);
      document.body.addEventListener('mousemove', me.onColumnDragMouseMoveFn);
      document.addEventListener('mouseup', () => {
        const columnDragging = me.columnDragging;
        const {
          dragItemFromRowGroupBar,
          changedRowGroupItemOrderIndex,
          originalRowGroupItemOrderIndex,
          inBar
        } = me.columnDragging;

        if(dragItemFromRowGroupBar && !inBar){
          me.showColumn(columnDragging.column, true);
          //me.onRowGroupBarMouseLeave(event);
          me.removeGroupInBar(columnDragging.column);
          setTimeout(()=>{
            me.reConfigRowGroups();

            if(me.store.rowGroups.length === 0 && me.$rowGroupColumn){
              me.removeColumn(me.$rowGroupColumn);
            }
          }, 1);
        }
        else {
          me.activeRowGroupBarItemEl.classList.remove(ROW_GROUP_BAR_ITEM_ACTIVE);

          if(changedRowGroupItemOrderIndex !== undefined && changedRowGroupItemOrderIndex !== originalRowGroupItemOrderIndex){
            setTimeout(()=>{
              me.reConfigRowGroups();
            }, 1);
          }
        }

        me.gridEl.classList.remove(COLUMN_DRAGGING);
        columnDragging?.dragColumnCellEl.remove();
        delete me.columnDragMouseDownColumn;
        delete me.columnDragging;
        delete me.activeRowGroupBarItemEl;

        document.body.removeEventListener('mousemove', me.onColumnDragMouseMoveFn);
      }, {
        once: true
      });
    },

    // Syntactic mouse leave because cursor is over dragging cell
    onRowGroupBarMouseLeave(){
      this.removeGroupInBar(this.columnDragging.column);
    },

    removeGroupInBar(column){
      const me = this;

      if(column){
        const columnIndex = me.rowGroupBarItemColumns.findIndex((item)=>item.id === column.id);
        const prevGroupItem = me.rowGroupBarItems.splice(columnIndex, 1)[0];

        me.rowGroupBarItemColumns.splice(columnIndex, 1);
        prevGroupItem.remove();
        me.reSetRowGroupOrderIndex();
      }
      else {
        const prevGroupItem = me.rowGroupBarItems.pop();

        me.rowGroupBarItemColumns.pop();
        prevGroupItem.remove();
      }

      delete me.activeRowGroupBarItemEl;

      if(!me.rowGroupBarItems || me.rowGroupBarItems?.length === 0){
        me.rowGroupBarEmptyTextEl.style.setProperty('display', '');
      }
    },

    onRowGroupBarItemRemoveClick(event){
      const me = this;
      const groupItemEl = event.target.closest(`.${ROW_GROUP_BAR_ITEM_CONTAINER}`);
      const rowGroupOrderIndex = Number(groupItemEl.getAttribute('row-group-order-index'));
      const groupItemToRemove = me.rowGroupBarItems.splice(rowGroupOrderIndex, 1)[0];
      const column = me.rowGroupBarItemColumns.splice(rowGroupOrderIndex, 1)[0];

      groupItemToRemove.remove();
      me.showColumn(column, true);

      delete me.activeRowGroupBarItemEl;

      if(!me.rowGroupBarItems || me.rowGroupBarItems?.length === 0){
        me.rowGroupBarEmptyTextEl.style.setProperty('display', '');
      }

      me.reSetRowGroupOrderIndex();
      me.reConfigRowGroups();

      if(me.store.rowGroups.length === 0 && me.$rowGroupColumn){
        me.removeColumn(me.$rowGroupColumn);
      }
    },

    reSetRowGroupOrderIndex(){
      const me = this;

      me.rowGroupBarItems.forEach((item, index) => {
        item.setAttribute('row-group-order-index', index);
      });
    },

    getRowGroupBarElRect() {
      const barRect = this.rowGroupBarEl.getBoundingClientRect();

      return {
        x: barRect.x,
        y: barRect.y,
        bottomX: barRect.x + barRect.width,
        rightY: barRect.y + barRect.height
      }
    },

    getRowGroupBarItemsRect(){
      const itemsRect = [];

      this.rowGroupBarItems?.forEach(item => {
        const rect = item.getBoundingClientRect();

        itemsRect.push({
          x: rect.x,
          y: rect.y,
          rightX: rect.x + rect.width,
          bottomY: rect.y + rect.height
        });
      });

      return itemsRect;
    },

    changeRowGroupBarItemOrder(from, to){
      const me = this;
      const fromEl = me.rowGroupBarItems[from];
      const toEl = me.rowGroupBarItems[to];
      const fromColumn = me.rowGroupBarItemColumns[from];
      const toColumn = me.rowGroupBarItemColumns[to];

      fromEl.querySelector(`.${ROW_GROUP_BAR_ITEM_TEXT}`).innerHTML = toColumn.title;
      toEl.querySelector(`.${ROW_GROUP_BAR_ITEM_TEXT}`).innerHTML = fromColumn.title;

      fromEl.classList.remove(ROW_GROUP_BAR_ITEM_ACTIVE);
      toEl.classList.add(ROW_GROUP_BAR_ITEM_ACTIVE);

      me.activeRowGroupBarItemEl = toEl;

      me.columnDragging.rowGroupBarItemsRect = me.getRowGroupBarItemsRect();
      me.columnDragging.changedRowGroupItemOrderIndex = to;

      me.rowGroupBarItemColumns[from] = toColumn;
      me.rowGroupBarItemColumns[to] = fromColumn;
    }
  };

  Object.assign(Grid.prototype, GridMixinRowGroupBar);

})();

(()=> {
  const {
    CELL,
    CELL_SELECTION,
    CELL_SELECTED,
    ACTIVE_CELL,
    ACTIVE_CELL_ROW,
    ROW,
    ROW_SELECTED,
    ROW_GROUP,
    ROW_GROUP_CELL_SELECTION,
    INPUT_CHECKBOX,
    BODY
  } = Fancy.cls;

  /**
   * @mixin GridMixinSelection
   */

  const GridMixinSelection = {
    onRowCellSelectionClick(event) {
      const me = this;
      const inputEl = event.target;
      const cell = inputEl.closest(`.${CELL}`);
      const columnIndex = Number(cell.getAttribute('col-index'));
      const row = cell.closest(`.${ROW}`);
      const itemId = row.getAttribute('row-id');
      const column = me.columns[columnIndex];
      const store = me.store;
      const item = store.idItemMap.get(itemId);
      const selected = !item.$selected;
      const group = item.$rowGroupValue;

      store.selectRowItem(item, selected);

      if(selected){
        row.classList.add(ROW_SELECTED);
      }
      else {
        row.classList.remove(ROW_SELECTED);
      }

      if(column.headerCheckboxSelection){
       me.updateHeaderCheckboxSelection(column);
      }

      if(group){
        me.updateRowGroupRowsAndCheckBoxes();
      }
    },

    selectRow(cell){
      const me = this;
      const columnIndex = Number(cell.getAttribute('col-index'));
      const row = cell.closest(`.${ROW}`);
      const itemId = row.getAttribute('row-id');
      const column = me.columns[columnIndex];
      const store = me.store;
      const item = store.idItemMap.get(itemId);
      const selected = !item.$selected;
      const group = item.$rowGroupValue;
      const rowCheckBoxes = row.querySelectorAll(`div.${CELL_SELECTION} input.${INPUT_CHECKBOX}`);

      store.selectRowItem(item, selected);

      if(selected){
        row.classList.add(ROW_SELECTED);
        rowCheckBoxes.forEach(checkBox => {
          checkBox.checked = true;
        });
      }
      else {
        row.classList.remove(ROW_SELECTED);
        rowCheckBoxes.forEach(checkBox => {
          checkBox.checked = false;
        });
      }

      if(column.headerCheckboxSelection){
        me.updateHeaderCheckboxSelection(column);
      }

      if(group){
        me.updateRowGroupRowsAndCheckBoxes();
      }
    },

    onRowGroupCellSelectionClick(event){
      const me = this;
      const inputEl = event.target;
      const row = inputEl.closest(`.${ROW_GROUP}`);
      const itemId = row.getAttribute('row-id');
      const store = me.store;
      const item = store.idItemMap.get(itemId);
      const selected = !item.$selected;
      const group = item.$rowGroupValue;

      store.selectGroupRowItems(item, selected);

      if(selected){
        row.classList.add(ROW_SELECTED);
      }
      else {
        row.classList.remove(ROW_SELECTED);
      }

      me.updateHeaderCheckboxesSelection();

      store.groupsChildren[group].forEach(child => {
        const childRow = me.bodyEl.querySelector(`[row-id="${child.id}"]`);

        if(!childRow){
          return;
        }

        const childRowCheckBox = childRow.querySelector(`.${INPUT_CHECKBOX}`);

        if(selected){
          childRow.classList.add(ROW_SELECTED);
          if(childRowCheckBox){
            childRowCheckBox.checked = true;
          }
        }
        else {
          childRow.classList.remove(ROW_SELECTED);
          if(childRowCheckBox){
            childRowCheckBox.checked = false;
          }
        }
      });

      if(group){
        me.updateRowGroupRowsAndCheckBoxes();
        me.updateRowsAndCheckBoxes();
      }
    },

    updateHeaderCheckboxesSelection(){
      const me = this;

      me.scroller.columnsViewRange.forEach(columnIndex => {
        const column = me.columns[columnIndex];
        if(column.headerCheckboxSelection){
          me.updateHeaderCheckboxSelection(column);
        }
      });
    },

    updateRowGroupRowsAndCheckBoxes(){
      const me = this;
      const store = me.store;

      me.bodyEl.querySelectorAll(`.${ROW_GROUP}`).forEach(row => {
        const group = row.getAttribute('row-group').replaceAll('-', '/').replaceAll('$', '-');
        const checkBoxEl = row.querySelector(`.${ROW_GROUP_CELL_SELECTION} .${INPUT_CHECKBOX}`);
        const groupDetail = store.groupDetails[group];

        if(!groupDetail){
          return;
        }

        const groupSelectedStatus = groupDetail.selectedStatus;

        switch (groupSelectedStatus){
          case false:
            row.classList.remove(ROW_SELECTED);
            checkBoxEl.indeterminate = false;
            checkBoxEl.checked = false;
            break;
          case 'full':
            row.classList.add(ROW_SELECTED);
            checkBoxEl.checked = true;
            checkBoxEl.indeterminate = false;
            break;
          case 'partly':
            row.classList.remove(ROW_SELECTED);
            checkBoxEl.indeterminate = true;
            break;
        }
      });
    },

    updateRowsAndCheckBoxes(){
      const me = this;
      const store = me.store;

      me.bodyEl.querySelectorAll(`.${ROW}`).forEach(row => {
        const itemId = row.getAttribute('row-id');
        const item = store.idItemMap.get(itemId);
        if(!item){
          console.error(`store.idItemMap does not contain ${itemId}`);
        }
        const selected = item.$selected;
        const checkBoxEl = row.querySelector(`.${CELL_SELECTION} .${INPUT_CHECKBOX}`);

        if(selected){
          row.classList.add(ROW_SELECTED);
          if(checkBoxEl){
            checkBoxEl.checked = true;
          }
        }
        else {
          row.classList.remove(ROW_SELECTED);
          if(checkBoxEl){
            checkBoxEl.indeterminate = false;
            checkBoxEl.checked = false;
          }
        }
      });
    },

    onBodyCellMouseDown(event) {
      const me = this;
      const target = event.target;
      const cell = target.closest(`.${CELL}`);

      me.hideActiveEditor();

      Fancy.gridsMap.forEach(grid => {
        grid.active = false;
      });
      me.active = true;

      if(me.activeCell){
        const setActivateCell = ()=>{
          me.setActiveCell(cell);
          requestAnimationFrame(()=> {
            document.addEventListener('mousedown', (event) => {
              if (!event.target.closest(`div.${BODY}`)) {
                me.clearActiveCell();
                me.clearSelectionRange();
              }

            }, {
              once: true
            });
          });
        };

        if(target.getAttribute('type') === 'checkbox'){
          target.addEventListener('click', ()=>{
            setActivateCell();
          }, {
            once: true
          });
        }
        else {
          setActivateCell();
        }
      }

      if(me.selectingCells){
        me.isSelectingCells = true;
        document.addEventListener('mouseup', ()=>{
          delete me.isSelectingCells;
        }, {
          once: true
        });
      }
    },

    onBodyCellMouseEnter(event){
      const me = this;
      const target = event.target;
      const cell = target.closest(`.${CELL}`);

      if(!me.activeCell || me.activeCellColumnIndex === undefined || me.activeCellRowId === undefined || me.isSelectingCells !== true){
        return;
      }

      const columnIndex = Number(cell.getAttribute('col-index'));
      const row = cell.closest(`.${ROW}`);
      const itemId = row.getAttribute('row-id');

      me.secondActiveCell = cell;
      me.secondActiveCellColumnIndex = columnIndex;
      me.secondActiveCellRowId = itemId;

      me.generateCellsSelectionRange();
      me.selectCellsFromRange();
    },

    setShiftCellUp(){
      const me = this;

      if(!me.activeCell || me.activeCellColumnIndex === undefined || me.activeCellRowId === undefined){
        return;
      }

      const secondActiveCellRowIndex = me.store.idRowIndexesMap.get(me.secondActiveCellRowId);
      const prevRowIndex = grid.store.getPrevVisibleRowIndex(secondActiveCellRowIndex);

      if(prevRowIndex === undefined){
        return;
      }

      const itemId = grid.store.getItemByRowIndex(prevRowIndex).id;

      me.secondActiveCell = me.getCell(prevRowIndex, me.secondActiveCellColumnIndex);
      me.secondActiveCellRowId = itemId;

      me.scrollToCell(me.secondActiveCell);

      me.generateCellsSelectionRange();
      me.selectCellsFromRange();
    },

    setShiftCellDown(){
      const me = this;

      if(!me.activeCell || me.activeCellColumnIndex === undefined || me.activeCellRowId === undefined){
        return;
      }

      const secondActiveCellRowIndex = me.store.idRowIndexesMap.get(me.secondActiveCellRowId);
      const nextRowIndex = grid.store.getNextVisibleRowIndex(secondActiveCellRowIndex);

      if(nextRowIndex === undefined){
        return;
      }

      const itemId = grid.store.getItemByRowIndex(nextRowIndex).id;

      me.secondActiveCell = me.getCell(nextRowIndex, me.secondActiveCellColumnIndex);
      me.secondActiveCellRowId = itemId;

      me.scrollToCell(me.secondActiveCell);

      me.generateCellsSelectionRange();
      me.selectCellsFromRange();
    },

    setShiftCellLeft(){
      const me = this;

      if(!me.activeCell || me.activeCellColumnIndex === undefined || me.activeCellRowId === undefined){
        return;
      }

      const columnIndex = me.getPrevVisibleColumnIndex(me.secondActiveCellColumnIndex);
      const rowIndex = grid.store.idRowIndexesMap.get(me.secondActiveCellRowId);

      if(columnIndex === undefined){
        return;
      }

      me.secondActiveCellColumnIndex = columnIndex;
      me.secondActiveCell = me.getCell(rowIndex, columnIndex);

      me.scrollToCell(me.secondActiveCell);

      me.generateCellsSelectionRange();
      me.selectCellsFromRange();
    },

    setShiftCellRight(){
      const me = this;

      if(!me.activeCell || me.activeCellColumnIndex === undefined || me.activeCellRowId === undefined){
        return;
      }

      const columnIndex = me.getNextVisibleColumnIndex(me.secondActiveCellColumnIndex);
      const rowIndex = grid.store.idRowIndexesMap.get(me.secondActiveCellRowId);

      if(columnIndex === undefined){
        return;
      }

      me.secondActiveCellColumnIndex = columnIndex;
      me.secondActiveCell = me.getCell(rowIndex, columnIndex);

      me.scrollToCell(me.secondActiveCell);

      me.generateCellsSelectionRange();
      me.selectCellsFromRange();
    },

    clearActiveCell(){
      const me = this;

      me.activeCellEl?.classList.remove(ACTIVE_CELL);
      me.activeCellRowEl?.classList.remove(ACTIVE_CELL_ROW);

      delete me.activeCellEl;
      delete me.activeCellRowEl;
      delete me.activeCellColumnIndex;
      delete me.activeCellColumn;
      delete me.activeCellRowId;

      // if(me.$signalActiveCell){
      //   me.$signalControllerActiveCell.abort();
      // }
    },

    setActiveCell(cell){
      const me = this;
      const row = cell.closest(`.${ROW}`);

      const prevRowIndex = Number(me.activeCellRowEl?.getAttribute('row-index'));
      const newRowIndex = Number(row.getAttribute('row-index'));

      const columnIndex = Number(cell.getAttribute('col-index'));
      const itemId = row.getAttribute('row-id');
      const column = me.columns[columnIndex];

      if(me.selectionCellsRange){
        me.clearSelectionRange();
      }

      me.activeCellEl?.classList.remove(ACTIVE_CELL);
      me.activeCellEl = cell;
      me.activeCellEl.classList.add(ACTIVE_CELL);

      me.activeCellRowEl?.classList.remove(ACTIVE_CELL_ROW);
      me.activeCellRowEl = row;
      me.activeCellRowEl.classList.add(ACTIVE_CELL_ROW);

      me.activeCellColumnIndex = columnIndex;
      me.activeCellColumn = column;
      me.activeCellRowId = itemId;

      me.secondActiveCell = cell;
      me.secondActiveCellColumnIndex = columnIndex;
      me.secondActiveCellRowId = itemId;

      const rect = me.bodyEl.getBoundingClientRect();
      const rowTop = Fancy.getTranslateY(row);
      const rowRect = row.getBoundingClientRect();

      if(rect.height + me.scroller.scrollTop < rowTop + rowRect.height){
        const delta = newRowIndex - prevRowIndex;
        me.scroller.deltaChange(-rowRect.height * delta);
      }
      else if(me.scroller.scrollTop > rowTop){
        const delta = prevRowIndex - newRowIndex;
        me.scroller.deltaChange(delta * rowRect.height);
      }
      else if(rect.width + me.scroller.scrollLeft < column.left + column.width){
        const delta = (column.left + column.width) - (rect.width + me.scroller.scrollLeft);
        me.scroller.horizontalDeltaChange(-delta - me.scroller.scrollBarWidth - 2);
      }
      else if(me.scroller.scrollLeft > column.left){
        const delta = me.scroller.scrollLeft - column.left;
        me.scroller.horizontalDeltaChange(delta + 2);
      }
    },

    scrollToCell(cell){
      const me = this;
      const row = cell.closest(`.${ROW}`);
      const rect = me.bodyEl.getBoundingClientRect();
      const rowTop = Fancy.getTranslateY(row);
      const rowRect = row.getBoundingClientRect();
      const columnIndex = Number(cell.getAttribute('col-index'));
      const column = me.columns[columnIndex];

      if(rect.height + me.scroller.scrollTop < rowTop + rowRect.height){
        const delta = me.rowHeight;
        me.scroller.deltaChange(-delta);
      }
      else if(me.scroller.scrollTop > rowTop){
        const delta = me.rowHeight;
        me.scroller.deltaChange(delta);
      }
      else if(rect.width + me.scroller.scrollLeft < column.left + column.width){
        const delta = (column.left + column.width) - (rect.width + me.scroller.scrollLeft);
        me.scroller.horizontalDeltaChange(-delta - me.scroller.scrollBarWidth - 2);
      }
      else if(me.scroller.scrollLeft > column.left){
        const delta = me.scroller.scrollLeft - column.left;
        me.scroller.horizontalDeltaChange(delta + 2);
      }
    },

    hasActiveCell(){
      const me = this;

      return me.activeCellColumn !== undefined && me.activeCellRowId !== undefined && me.activeCellColumnIndex !== undefined;
    },

    scrollToNotVisibleNewActiveCell(newRowIndex, columnIndex){
      const me = this;

      const delta = me.scroller.scrollTop - (newRowIndex - 1) * me.rowHeight;
      me.$preventActiveCellRender = true;
      me.scroller.deltaChange(delta);
      setTimeout(()=>{
        const cell = me.getCell(newRowIndex, columnIndex);
        if (cell) {
          me.setActiveCell(cell);
        }
      },0);
    },

    setActiveCellUp(){
      const me = this;
      const columnIndex = me.activeCellColumnIndex;
      const row = me.activeCellRowEl;
      const rowIndex = Number(row.getAttribute('row-index'));
      const newRowIndex = me.store.getPrevVisibleRowIndex(rowIndex);

      if(newRowIndex === rowIndex || newRowIndex === undefined){
        if(newRowIndex === undefined && me.scroller.scrollTop !== 0){
          me.scroller.deltaChange(rowIndex * me.rowHeight);
        }

        return;
      }

      const cell = me.getCell(newRowIndex, columnIndex);
      if(cell){
        me.setActiveCell(cell);
      }
      else {
        me.scrollToNotVisibleNewActiveCell(newRowIndex, columnIndex);
      }
    },

    setActiveCellDown(){
      const me = this;
      const columnIndex = me.activeCellColumnIndex;
      const row = me.activeCellRowEl;
      const rowIndex = Number(row.getAttribute('row-index'));
      const totalDisplayed = me.store.getDisplayedDataTotal();
      const newRowIndex = me.store.getNextVisibleRowIndex(rowIndex);

      if(newRowIndex === rowIndex || newRowIndex === undefined){
        if(newRowIndex === undefined){
          const delta = totalDisplayed - rowIndex;
          me.scroller.deltaChange(-delta * me.rowHeight);
        }

        return false;
      }

      const cell = me.getCell(newRowIndex, columnIndex);
      if(cell) {
        me.setActiveCell(cell);
      }
      else {
        me.scrollToNotVisibleNewActiveCell(newRowIndex, columnIndex);
      }

      return cell;
    },

    setActiveCellLeft(){
      const me = this;
      const columnIndex = me.activeCellColumnIndex;
      const newColumnIndex = me.getPrevVisibleColumnIndex(columnIndex);
      const row = me.activeCellRowEl;
      const rowIndex = Number(row.getAttribute('row-index'));

      if(newColumnIndex === columnIndex || newColumnIndex === undefined){
        return;
      }

      const cell = me.getCell(rowIndex, newColumnIndex);
      if(cell){
        me.setActiveCell(cell);
      }
      else {
        me.scrollToNotVisibleNewActiveCell(rowIndex, newColumnIndex);
      }
    },

    setActiveCellRight(){
      const me = this;
      const row = me.activeCellRowEl;
      const rowIndex = Number(row.getAttribute('row-index'));
      const columnIndex = me.activeCellColumnIndex;
      const newColumnIndex = me.getNextVisibleColumnIndex(columnIndex);

      if(newColumnIndex === columnIndex || newColumnIndex === undefined){
        return false;
      }

      const cell = me.getCell(rowIndex, newColumnIndex);
      if(cell){
        me.setActiveCell(cell);
      }
      else {
        me.scrollToNotVisibleNewActiveCell(rowIndex, newColumnIndex);
      }

      return cell;
    },

    updateHeaderCheckboxSelection(column){
      const me = this;
      const store = me.store;
      const checkBoxEl = column.headerCheckboxSelectionEl;
      const selectedAmount = store.selectedItemsMap.size;

      if(selectedAmount){
        if(store.getDataTotal() === selectedAmount){
          checkBoxEl.checked = true;
          checkBoxEl.indeterminate = false;
        }
        else {
          checkBoxEl.indeterminate = true;
        }
      }
      else {
        checkBoxEl.indeterminate = false;
        checkBoxEl.checked = false;
      }
    },

    onHeaderCheckboxSelectionClick(event){
      const me = this;
      const store = me.store;
      const inputEl = event.target;
      const selected = inputEl.checked;

      store.selectAll(selected);

      if(store.rowGroups.length){
        me.updateRowGroupRowsAndCheckBoxes();
      }
      me.updateRowsAndCheckBoxes();
    },

    getSelection(){
      const me = this;
      const store = me.store;
      const items = [];

      store.selectedItemsMap.forEach(item => {
        if(!item.$isGroupRow){
          items.push(item);
        }
      });

      return items;
    },

    generateCellsSelectionRange(){
      const me = this;
      const activeCellRowIndex = me.store.idRowIndexesMap.get(me.activeCellRowId);
      const secondActiveCellRowIndex = me.store.idRowIndexesMap.get(me.secondActiveCellRowId);
      const rows = [];
      const columns = [];

      if(activeCellRowIndex <= secondActiveCellRowIndex){
        rows[0] = activeCellRowIndex;
        rows[1] = secondActiveCellRowIndex;
      }
      else {
        rows[0] = secondActiveCellRowIndex;
        rows[1] = activeCellRowIndex;
      }

      if(me.activeCellColumnIndex <= me.secondActiveCellColumnIndex){
        columns[0] = me.activeCellColumnIndex;
        columns[1] = me.secondActiveCellColumnIndex;
      }
      else {
        columns[0] = me.secondActiveCellColumnIndex;
        columns[1] = me.activeCellColumnIndex;
      }

      me.selectionCellsRange = {
        rows,
        columns
      };
    },

    selectCellsFromRange(){
      const me = this;
      const selectedCells = me.bodyEl.querySelectorAll(`div.${CELL_SELECTED}`);

      selectedCells.forEach(cell => {
        if(me.isCellInSelectedRange(cell) === false){
          cell.classList.remove(CELL_SELECTED);
        }
      });

      const {
        rows,
        columns
      } = me.selectionCellsRange;

      if(rows[0] < me.scroller.startRow){
        rows[0] = me.scroller.startRow;
      }

      if(rows[1] > me.scroller.endRow){
        rows[1] = me.scroller.endRow;
      }

      if(columns[0] < me.scroller.columnViewStart){
        columns[0] = me.scroller.columnViewStart;
      }

      if(columns[1] > me.scroller.columnViewEnd){
        columns[1] = me.scroller.columnViewEnd;
      }

      for(let i = rows[0];i<=rows[1];i++){
        for(let j = columns[0];j<=columns[1];j++){
          const cell = me.bodyEl.querySelector(`div.${ROW}[row-index="${i}"] div.${CELL}[col-index="${j}"]`);

          if(cell && !cell.classList.contains(CELL_SELECTED)) {
            cell.classList.add(CELL_SELECTED);
          }
        }
      }
    },

    isCellInSelectedRange(cell){
      const me = this;
      const columnIndex = Number(cell.getAttribute('col-index'));
      const row = cell.closest(`.${ROW}`);

      if(!row){
        return false;
      }

      const rowIndex = Number(row.getAttribute('row-index'));
      const {
        rows,
        columns
      } = me.selectionCellsRange;

      return rowIndex >= rows[0] && rowIndex <= rows[1] && columnIndex >= columns[0] && columnIndex <= columns[1];
    },

    clearSelectionRange(){
      const me = this;
      const selectedCells = me.bodyEl.querySelectorAll(`div.${CELL_SELECTED}`);

      selectedCells.forEach(cell => {
        cell.classList.remove(CELL_SELECTED);
      });

      delete me.selectionCellsRange;
    },

    copySelectedCells(){
      const me = this;
      const text = me.getTextFromSelectionRange();

      Fancy.copyText(text);
    },

    getTextFromSelectionRange(){
      const me = this;
      const {
        rows,
        columns
      } = me.selectionCellsRange || {
        rows: [],
        columns: []
      };
      const data = [];

      const getCellInner = (options) => {
        const column = options.column;
        const value = options.value;
        let cellInner;

        if(column.getter){
          cellInner = column.getter(options);
        }
        else if(column.render){
          // For cases when column.render uses dom cell
          try {
            cellInner = column.render(options);
          } catch (e) {
            cellInner = value;
          }
        }
        else {
          cellInner = value;
        }

        return cellInner;
      };

      if(rows.length === 0 && me.activeCellEl){
        const row = me.activeCellEl.closest(`.${ROW}`);
        if(!row){
          return;
        }
        const itemId = row.getAttribute('row-id');
        const item = me.store.idItemMap.get(itemId);
        const columnIndex = Number(me.activeCellEl.getAttribute('col-index'));
        const column = me.columns[columnIndex];
        const rowIndex = row.getAttribute('row-index');

        const value = item[column.index];
        const cellInner = getCellInner({
          item,
          column,
          rowIndex,
          columnIndex,
          value
        });

        return cellInner;
      }

      for(let i = rows[0];i<=rows[1];i++){
        let item = me.store.getItemByRowIndex(i);
        const rowData = [];

        for(let j = columns[0];j<=columns[1];j++){
          const column = me.columns[j];
          const value = item[column.index];
          const cellInner = getCellInner({
            item,
            column,
            rowIndex: i,
            columnIndex: j,
            value
          });

          rowData.push(cellInner);
        }

        data.push(rowData);
      }

      return data.map(row => row.join('\t')).join('\n');
    },

    insertCopiedCells(){
      const me = this;
      const textarea = document.createElement('textarea');
      textarea.style.display = 'none';
      document.body.appendChild(textarea);
      textarea.focus();

      const getRowsOffSet = (rowIndex, offset = 0) => {
        const row = me.bodyEl.querySelector(`div[row-index="${rowIndex + offset}"]`);

        if(!row){
          return offset;
        }

        if(row.classList.contains(ROW_GROUP)){
          return getRowsOffSet(rowIndex, offset + 1);
        }

        return offset;
      };

      document.addEventListener('paste', (event) => {
        const text = event.clipboardData.getData('text');
        if(document.body.contains(textarea)){
          document.body.removeChild(textarea);
        }

        const rows = text.split('\n');
        const data = rows.map(row => {
          const rowData = row.split('\t');

          return rowData;
        });

        const activeRowIndex = Number(me.activeCellRowEl.getAttribute('row-index'));
        let rowOffset = 0;

        data.forEach((dataRow, itemRowIndex)=>{
          const extraRowsOffset = getRowsOffSet(activeRowIndex + itemRowIndex + rowOffset);
          rowOffset += extraRowsOffset;

          const rowIndex = activeRowIndex + itemRowIndex + rowOffset;
          const item = me.store.getItemByRowIndex(rowIndex);

          if(!item){
            return;
          }

          const rowEl = me.bodyEl.querySelector(`.${ROW}[row-index="${rowIndex}"]`);

          let columnIndex = me.activeCellColumnIndex - 1;

          dataRow.forEach((value, itemColumnIndex)=>{
            columnIndex = me.getNextVisibleColumnIndex(columnIndex);

            const column = me.columns[columnIndex];

            if(!column || !column.editable){
              return;
            }

            me.store.setById(item.id,column.index, value);

            if(!rowEl || !column){
              return;
            }

            let cell = rowEl.querySelector(`[col-index="${columnIndex}"]`);

            cell?.remove();

            cell = me.createCell(rowIndex, columnIndex);
            rowEl.appendChild(cell);
          });
        });
      });
    },

    setBlankForSelectedCells(){
      const me = this;
      const {
        rows,
        columns
      } = me.selectionCellsRange || {
        rows: [],
        columns: []
      };

      const getCellSetterValue = (options) => {
        const column = options.column;
        let value = options.value;

        if(column.setter){
          value = column.setter(options);
        }

        return value;
      };

      if(rows.length === 0 && me.activeCellEl){
        const rowEl = me.activeCellEl.closest(`.${ROW}`);
        if(!rowEl){
          return;
        }
        const rowIndex = rowEl.getAttribute('row-index');
        const itemId = rowEl.getAttribute('row-id');
        const item = me.store.idItemMap.get(itemId);
        const columnIndex = Number(me.activeCellEl.getAttribute('col-index'));
        const column = me.columns[columnIndex];
        const value = getCellSetterValue({
          item,
          column,
          rowIndex,
          columnIndex,
          value: ''
        });

        me.store.setById(itemId ,column.index, value);

        me.activeCellEl.remove();

        const cell = me.createCell(rowIndex, columnIndex);
        rowEl.appendChild(cell);
        me.activeCellEl = cell;

        return;
      }

      for(let i = rows[0];i<=rows[1];i++){
        const rowIndex = i;
        let item = me.store.getItemByRowIndex(i);
        const rowEl = me.bodyEl.querySelector(`.${ROW}[row-index="${rowIndex}"]`);

        for(let j = columns[0];j<=columns[1];j++){
          const column = me.columns[j];
          const columnIndex = j;

          const value = getCellSetterValue({
            item,
            column,
            rowIndex: rowIndex,
            columnIndex: columnIndex,
            value: ''
          });

          me.store.setById(item.id ,column.index, value);

          if(!rowEl || !column){
            return;
          }

          let cell = rowEl.querySelector(`[col-index="${columnIndex}"]`);

          cell?.remove();

          cell = me.createCell(rowIndex, columnIndex);
          rowEl.appendChild(cell);
        }
      }
    }
  };

  Object.assign(Grid.prototype, GridMixinSelection);
})();

(()=> {
  const {
    DOWN,
    UP,
    LEFT,
    RIGHT,
    ESC,
    SPACE,
    C,
    V,
    ENTER,
    TAB,
    DELETE,
    BACKSPACE
  } = Fancy.key;

  const {
    ROW
  } = Fancy.cls;

  /**
   * @mixin GridMixinKeyNavigation
   */

  const GridMixinKeyNavigation = {
    initKeyNavigation(){
      const me = this;

      document.body.addEventListener('keydown', me.onKeyDown.bind(me));
    },
    onKeyDown(event){
      const me = this;

      switch (event.keyCode){
        case C:
          if(event.ctrlKey || event.metaKey){
            me.copySelectedCells();
          }
          break;
        case V:
          if(me.activeCell && me.activeCellEl && (event.ctrlKey || event.metaKey)){
            me.insertCopiedCells();
          }
          break;
        case ESC:
          if(!me.isEditing) {
            me.destroyHeaderCellMenuList();
          }
          break;
        case SPACE:
          event.preventDefault();
          if(me.activeCell && me.activeCellEl){
            const cell = me.activeCellEl;
            const columnIndex = Number(cell.getAttribute('col-index'));
            const column = me.columns[columnIndex];
            const row = cell.closest(`.${ROW}`);
            const itemId = row.getAttribute('row-id');
            const item = me.store.idItemMap.get(itemId);
            const value = item[column.index];

            if(column.type === 'boolean' && column.editable){
              me.store.setById(itemId, column.index, !value);
              me.activeCellEl.querySelector('input').checked = !value;
            }
            else if(me.checkboxSelection){
              me.selectRow(cell);
            }
          }
          break;
        case TAB:
          event.preventDefault();
          me.onKeyTAB();
          break;
        case DOWN:
          if(!me.isEditing){
            event.preventDefault();
            me.onKeyDOWN(event.shiftKey);
          }
          break;
        case UP:
          if(!me.isEditing) {
            event.preventDefault();
            me.onKeyUP(event.shiftKey);
          }
          break;
        case LEFT:
          if(!me.isEditing) {
            me.onKeyLEFT(event.shiftKey);
          }
          break;
        case RIGHT:
          if(!me.isEditing) {
            me.onKeyRIGHT(event.shiftKey);
          }
          break;
        case ENTER:
          if(!me.isEditing){
            me.onKeyENTER();
          }
          break;
        case BACKSPACE:
        case DELETE:
          if(!me.isEditing){
            me.setBlankForSelectedCells();
          }
          break;
        default:
          const code = event.code;

          if ( !me.activeEditor && (
              (code.startsWith('Key') && code.length === 4) || // KeyA - KeyZ
              (code.startsWith('Digit') && code.length === 6)   // Digit0 - Digit9
            )
          ) {
            if(me.startEditByTyping && me.hasActiveCell()){
              const cell = me.activeCellEl;
              const columnIndex = Number(cell.getAttribute('col-index'));
              const column = me.columns[columnIndex];

              if(column.editable){
                event.preventDefault();
                me.openEditorForCell(me.activeCellEl, event.key);
              }
            }
          }
      }
    },
    onKeyUP(shift){
      const me = this;

      if(me.active && me.hasActiveCell()){
        if(shift){
          me.setShiftCellUp();
        }
        else {
          me.setActiveCellUp();
        }
      }
    },
    onKeyDOWN(shift){
      const me = this;

      if(me.active && me.hasActiveCell()){
        if(shift){
          me.setShiftCellDown();
        }
        else {
          me.setActiveCellDown();
        }
      }
    },
    onKeyLEFT(shift){
      const me = this;

      if(me.active && me.hasActiveCell()){
        if(shift){
          me.setShiftCellLeft();
        }
        else {
          me.setActiveCellLeft();
        }
      }
    },
    onKeyRIGHT(shift){
      const me = this;

      if(me.active && me.hasActiveCell()){
        if(shift){
          me.setShiftCellRight();
        }
        else {
          me.setActiveCellRight();
        }
      }
    },
    onKeyENTER(){
      const me = this;

      if(me.$preventOpeningEditor){
        delete me.$preventOpeningEditor;
        return;
      }

      if(me.activeCellEl){
        if(me.editingCell?.getAttribute('id') === me.activeCellEl.getAttribute('id')){
          return;
        }
        me.openEditorForCell(me.activeCellEl);
      }
    },
    onKeyTAB(){
      const me = this;
      if(me.active && me.hasActiveCell()) {
        if (me.isEditing) {
          me.hideActiveEditor();

          const activeCell = me.setActiveCellRight();
          if (activeCell) {
            me.openEditorForCell(me.activeCellEl);
          }
        } else {
          me.setActiveCellRight();
        }
      }
    }
  };

  Object.assign(Grid.prototype, GridMixinKeyNavigation);

})();

(()=> {

  const {
    ANIMATE_CELLS_POSITION,
    COLUMN_DRAGGING,
    FAKE_COLUMN_CELL_DRAGGING,
    FAKE_COLUMN_CELL_DRAGGING_ALLOW,
    FAKE_COLUMN_CELL_DRAGGING_DENY,
    SVG_ITEM,
    SVG_BLOCK,
    SVG_GROUP,
    SVG_DRAG
  } = Fancy.cls;

  const OFFSET_DRAG_CELL = 10;

  /**
   * @mixin GridMixinColumnDrag
   */

  const GridMixinColumnDrag = {
    onColumnDragMouseMove(event){
      const me = this;

      if(me.columnDragging){
        const columnDragging = me.columnDragging;
        const dragColumnCellEl = columnDragging.dragColumnCellEl;
        const {
          pageX,
          pageY
        } = event;

        dragColumnCellEl.style.setProperty('left', (pageX - OFFSET_DRAG_CELL) + 'px');
        dragColumnCellEl.style.setProperty('top', (pageY - OFFSET_DRAG_CELL) + 'px');

        if(me.rowGroupBar && me.isCursorInRowGroupBar(event, columnDragging.rowGroupBarElRect)){
          if(!columnDragging.inBar){
            columnDragging.inBar = true;
            let isColumnPresentedInRowGroupBar = false;

            me.rowGroupBarItemColumns?.forEach(column => {
              if(column.title === columnDragging.column.title){
                isColumnPresentedInRowGroupBar = true;
              }
            });

            if((isColumnPresentedInRowGroupBar && !columnDragging.dragItemFromRowGroupBar) || columnDragging.column.$isRowGroupColumn){
              dragColumnCellEl.classList.add(FAKE_COLUMN_CELL_DRAGGING_DENY);
              dragColumnCellEl.classList.remove(FAKE_COLUMN_CELL_DRAGGING_ALLOW);
            }
            else {
              dragColumnCellEl.classList.add(FAKE_COLUMN_CELL_DRAGGING_ALLOW);
              dragColumnCellEl.classList.remove(FAKE_COLUMN_CELL_DRAGGING_DENY);

              if(!columnDragging.dragItemFromRowGroupBar){
                me.onRowGroupBarMouseEnter(event);
                me.hideColumn(me.columnDragging.column, true);
              }
            }
          }
          else {
            const cursorInRowGroupBarItem = me.isCursorInAnotherRowGroupBarItem(event, columnDragging.rowGroupBarItemsRect);
            const activeRowGroupIndex = Number(me.activeRowGroupBarItemEl.getAttribute('row-group-order-index'));
            if(cursorInRowGroupBarItem !== undefined && cursorInRowGroupBarItem !== activeRowGroupIndex){
              me.changeRowGroupBarItemOrder(activeRowGroupIndex, cursorInRowGroupBarItem);
            }
          }
        }
        else if(columnDragging.inBar) {
          delete columnDragging.inBar;

          if(columnDragging.dragItemFromRowGroupBar){
            dragColumnCellEl.classList.remove(FAKE_COLUMN_CELL_DRAGGING_ALLOW, FAKE_COLUMN_CELL_DRAGGING_DENY);
            dragColumnCellEl.classList.add(FAKE_COLUMN_CELL_DRAGGING_ALLOW);
          } else {
            if (!dragColumnCellEl.classList.contains(FAKE_COLUMN_CELL_DRAGGING_DENY)) {
              me.showColumn(columnDragging.column, true);
              me.onRowGroupBarMouseLeave(event);
            }
            dragColumnCellEl.classList.remove(FAKE_COLUMN_CELL_DRAGGING_ALLOW, FAKE_COLUMN_CELL_DRAGGING_DENY);
          }
        }
        else {
          if(!me.debouceColumnDraggingFn){
            me.debouceColumnDraggingFn = Fancy.debounce(me.onColumnDragging, 50);
          }
          me.debouceColumnDraggingFn(event);
        }
      }
      else {
        if(me.isEditing){
          me.hideActiveEditor();
        }

        const deltaX = Math.abs(event.pageX - me.columnDragDownX);
        const deltaY = Math.abs(event.pageY - me.columnDragDownY);

        if(deltaX > me.deltaStartColumnDrag || deltaY > me.deltaStartColumnDrag){
          const column = me.columnDragMouseDownColumn;

          me.columnDragging = {
            column,
            dragColumnCellEl: me.createDragColumnCellEl(column)
          };

          if(me.rowGroupBar){
            me.columnDragging.rowGroupBarItemsRect = me.getRowGroupBarItemsRect();
          }

          me.gridEl.classList.add(COLUMN_DRAGGING);

          if(me.rowGroupBar){
            me.columnDragging.rowGroupBarElRect = me.getRowGroupBarElRect();
          }
        }
      }
    },

    createDragColumnCellEl(column){
      const cell = document.createElement('div');

      const textEl = document.createElement('span');
      const cellText = column.title;
      textEl.innerHTML = cellText;

      const svgGroup = Fancy.svg.group;
      const groupLogoEl = document.createElement('span');
      groupLogoEl.classList.add(SVG_ITEM, SVG_GROUP);
      groupLogoEl.innerHTML = svgGroup;

      const dragSvgEl = document.createElement('span');
      dragSvgEl.classList.add(SVG_ITEM, SVG_DRAG);
      dragSvgEl.innerHTML = Fancy.svg.groupCellDrag;

      const blockSvgEl = document.createElement('span');
      blockSvgEl.classList.add(SVG_ITEM, SVG_BLOCK);
      blockSvgEl.innerHTML = Fancy.svg.block;

      cell.appendChild(blockSvgEl);
      cell.appendChild(groupLogoEl);
      cell.appendChild(dragSvgEl);
      cell.appendChild(textEl);
      cell.classList.add(FAKE_COLUMN_CELL_DRAGGING, 'fg-theme-' + this.theme);
      document.body.appendChild(cell);

      return cell;
    },

    isCursorInRowGroupBar({pageX, pageY}, barRect){
      return pageX < barRect.bottomX && pageX > barRect.x && pageY < barRect.rightY && pageY > barRect.y;
    },

    isCursorInAnotherRowGroupBarItem({pageX}, barItemsRect){
      if(barItemsRect.length === 0){
        return;
      }

      for(let i = 0, iL = barItemsRect.length;i<iL;i++){
        const itemRect = barItemsRect[i];

        if(pageX > itemRect.x && pageX < itemRect.rightX){
          return i;
        }
      }

      if(pageX < barItemsRect[0].x){
        return 0;
      }

      if(pageX > barItemsRect[barItemsRect.length - 1].rightX){
        return barItemsRect.length - 1;
      }
    },

    isCursorInAnotherColumn({pageX}){
      const me = this;
      const headerRect = me.headerEl.getBoundingClientRect();
      const columnsViewRange = me.scroller.columnsViewRange;

      pageX -= headerRect.x;

      for(let i = 0, iL = columnsViewRange.length;i<iL;i++){
        const columnIndex = columnsViewRange[i];
        const column = me.columns[columnIndex];

        if(pageX >= column.left && pageX <= column.left + column.width){
          return columnIndex;
        }
      }
    },

    onColumnDragging(event){
      const me = this;

      if(me.animatingColumnsPosition || me.activeRowGroupBarItemEl){
        return;
      }

      const cursorInColumnIndex = me.isCursorInAnotherColumn(event);

      if(cursorInColumnIndex !== undefined && me.columnDragMouseDownColumnIndex !== cursorInColumnIndex){
        if(me.columns[cursorInColumnIndex]?.type === 'order'){
          return;
        }
        me.moveColumn(me.columnDragMouseDownColumnIndex, cursorInColumnIndex);
        me.columnDragMouseDownColumnIndex = cursorInColumnIndex;
      }
    },

    moveColumn(columnIndex, toIndex){
      const me = this;

      me.animatingColumnsPosition = true;
      me.gridEl.classList.add(ANIMATE_CELLS_POSITION);

      const column = me.columns.splice(columnIndex, 1)[0];

      me.columns.splice(toIndex, 0, column);
      let oldOrders = [];

      me.reSetVisibleHeaderColumnsIndex();
      if(columnIndex<toIndex){
        for(let i=columnIndex, iL = toIndex;i<=iL;i++){
          oldOrders.push(i);
        }

        const removedIndex = oldOrders.shift();
        oldOrders.push(removedIndex);

        me.reSetVisibleBodyColumnsIndex(columnIndex, toIndex, oldOrders);
      }
      else {
        for(let i=toIndex, iL=columnIndex;i<=iL;i++){
          oldOrders.push(i);
        }

        const removedIndex = oldOrders.pop();
        oldOrders.unshift(removedIndex);

        me.reSetVisibleBodyColumnsIndex(toIndex, columnIndex, oldOrders);
      }

      me.scroller.generateNewRange(false);
      me.reCalcColumnsPositions();
      me.updateCellPositions();

      setTimeout(() => {
        me.gridEl.classList.remove(ANIMATE_CELLS_POSITION);
        delete me.animatingColumnsPosition;
      }, 300);
    }
  };

  Object.assign(Grid.prototype, GridMixinColumnDrag);

})();

(()=> {
  const {
    CELL,
    ROW,
    EDITING
  } = Fancy.cls;

  /**
   * @mixin GridMixinEdit
   */

  const GridMixinEdit = {
    onBodyCellDBLClick(event){
      const me = this;
      const target = event.target;
      const cell = target.closest(`.${CELL}`);

      me.openEditorForCell(cell);
    },

    openEditorForCell(cell, startValue){
      const me = this;
      let columnIndex = Number(cell.getAttribute('col-index'));
      let column = me.columns[columnIndex];
      let row = cell.closest(`.${ROW}`);
      let itemId = row.getAttribute('row-id');
      let rowIndex = row.getAttribute('row-index');
      let item = me.store.idItemMap.get(itemId);
      const rowTop = Fancy.getTranslateY(row);
      let value = item[column.index];
      let valueBeforeEdit = value;

      if(column.editable !== true){
        me.hideActiveEditor();
        return;
      }

      if(column.getter){
        const params = {
          item,
          column,
          rowIndex,
          columnIndex,
          value,
          cell
        };

        value = column.getter(params);
        valueBeforeEdit = value;
      }

      const memorizeChange = (value)=>{
        // Re-get cell on case of scroll
        if(me.activeCellEl){
          cell = me.activeCellEl;
          row = cell.closest(`.${ROW}`);
          columnIndex = Number(cell.getAttribute('col-index'));
          column = me.columns[columnIndex];
          rowIndex = row.getAttribute('row-index');
          itemId = row.getAttribute('row-id');
          item = me.store.idItemMap.get(itemId);
        }

        if(column.setter){
          const params = {
            item,
            column,
            rowIndex,
            columnIndex,
            value,
            cell,
            newValue: value
          };

          column.setter(params);
        }
        else {
          me.store.setById(itemId, column.index, value);
        }
        cell?.remove();

        cell = me.createCell(rowIndex, columnIndex);
        me.activeCellEl = cell;
        row.appendChild(cell);

        if(column.setter){
          me.rowCellsUpdateWithColumnIndex(row);
        }
        else {
          me.rowCellsUpdateWithColumnRender(row);
        }
      };

      if(startValue !== undefined){
        value = startValue;

        memorizeChange(value);
      }

      if(column.editorField){
        switch (column.type){
          case 'string':
          case 'number':
          case 'date':
            me.setStatusEditing(true);

            column.editorField.setValue(value);
            column.editorField.show({
              width: `${column.width}px`,
              left: `${column.left}px`,
              transform: `translateY(${rowTop - 1}px)`,
            });
            column.editorField.focus();

            me.activeEditor = column.editorField;
            break;
        }
      }
      else {
        switch(column.type){
          case 'string':
          case 'number':
          case 'date':
            me.setStatusEditing(true);
            column.editorField = new Fancy[Fancy.capitalizeFirstLetter(`${column.type}Field`)]({
              renderTo: me.editorsContainerEl,
              value,
              style: {
                position: 'absolute',
                width: `${column.width}px`,
                left: `${column.left}px`,
                transform: `translateY(${rowTop - 1}px)`,
                height: `${me.rowHeight + 1}px`
              },
              onChange(value, fromTyping){
                if(fromTyping === false){
                  return;
                }

                memorizeChange(value);
              },
              onEnter(){
                me.hideActiveEditor();
                let activeCell = false;
                switch (me.editorEnterAction){
                  case 'down':
                    activeCell = me.setActiveCellDown();
                    break;
                  case 'right':
                    activeCell = me.setActiveCellRight();
                    break;
                }

                if(activeCell === false){
                  me.$preventOpeningEditor = true;
                  setTimeout(()=>{
                    delete me.$preventOpeningEditor;
                  }, 100);
                }
              },
              onESC(){
                memorizeChange(valueBeforeEdit);
                me.hideActiveEditor();
              }
            });
            column.editorField.focus();

            me.activeEditor = column.editorField;
            break;
          default:
            me.hideActiveEditor();
        }
      }
    },

    hideActiveEditor(){
      const me = this;

      if(me.activeEditor){
        me.activeEditor.hide();
        delete me.activeEditor;
        me.setStatusEditing(false);
      }
    },

    setStatusEditing(value){
      const me = this;

      me.isEditing = value;

      if(value){
        me.gridEl.classList.add(EDITING);
        me.editingCell = me.activeCellEl;
      }
      else {
        me.gridEl.classList.remove(EDITING);
        delete me.editingCell;
      }
    },

    rowCellsUpdateWithColumnIndex(row){
      const me = this;
      const rowIndex = row.getAttribute('row-index');
      const cells = row.querySelectorAll(`.${CELL}`);

      cells.forEach(cell => {
        const columnIndex = Number(cell.getAttribute('col-index'));
        const column = me.columns[columnIndex];

        if(column.index === undefined){
          return;
        }

        cell?.remove();

        cell = me.createCell(rowIndex, columnIndex);
        row.appendChild(cell);
      });
    },

    rowCellsUpdateWithColumnRender(row, flash){
      const me = this;
      const rowIndex = row.getAttribute('row-index');
      const itemId = row.getAttribute('row-id');
      const cells = row.querySelectorAll(`.${CELL}`);

      cells.forEach(cell => {
        const columnIndex = Number(cell.getAttribute('col-index'));
        const column = me.columns[columnIndex];

        if(column.render === undefined || column.type === 'order' || column.index === 'id'){
          return;
        }

        const newCell = me.createCell(rowIndex, columnIndex);
        if(cell.innerHTML === newCell.innerHTML){
          return;
        }
        cell?.remove();
        cell = newCell;

        const cellStyle = cell.style;

        if(flash && !cell.style.backgroundColor){
          cellStyle.transition = 'background-color 2000ms';
          cellStyle.backgroundColor = me.flashChangesColors[me.store.selectedItemsMap.has(itemId)?1:0];

          setTimeout(()=>{
            cellStyle.backgroundColor = '';
          });

          setTimeout(()=>{
            cellStyle.transition = '';
            cellStyle.backgroundColor = '';
          }, 2000);
        }
        row.appendChild(cell);
      });
    },

    updateAfterAddRemove(){
      const me = this;

      me.scroller.calcMaxScrollTop();
      me.scroller.updateScrollTop();
      me.scroller.calcViewRange();
      me.scroller.setVerticalSize();
      me.scroller.updateHorizontalScrollSize();
      me.updateVisibleHeight();

      me.updateVisibleRowsAfterRemove();
      me.store.memorizePrevRowIndexesMap();
      me.updateHeaderCells();
    },

    updateVisibleRowsAfterRemove() {
      const me = this;

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          me.renderedRowsIdMap.forEach((rowEl, id) => {
            const item = me.store.idItemMap.get(id);

            if (me.actualRowsIdSet.has(item.id)) {
              me.updateRowPosition(item);
            }
          });
        });
      });
    }
  };

  Object.assign(Grid.prototype, GridMixinEdit);
})();

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
    'Clear': "M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z",
    'Contains': "M19,10H5V8H19V10M19,16H5V14H19V16Z",
    'Not Contains': "M21,10H9V8H21V10M21,16H9V14H21V16M4,5H6V16H4V5M6,18V20H4V18H6Z",
    'Equals': "M 10.56 10 L 1.508 10 L 1.508 8 L 10.56 8 L 10.56 10 M 10.56 16 L 1.508 16 L 1.508 14 L 10.56 14 L 10.56 16 Z M 22.009 10.01 L 12.984 10.01 L 12.984 8.01 L 22.009 8.01 L 22.009 10.01 M 22.009 16.01 L 12.984 16.01 L 12.984 14.01 L 22.009 14.01 L 22.009 16.01 Z",
    'Not Equals': "M 12.368 10 L 5.449 10 L 5.449 8 L 12.368 8 L 12.368 10 M 12.368 16 L 5.449 16 L 5.449 14 L 12.368 14 L 12.368 16 Z M 23.009 10.01 L 15.05 10.01 L 15.05 8.01 L 23.009 8.01 L 23.009 10.01 M 23.009 16.01 L 15.05 16.01 L 15.05 14.01 L 23.009 14.01 L 23.009 16.01 Z M 2.585 4.076 L 2.575 13.265 L 0.54 13.277 L 0.55 4.087 L 2.585 4.076 M 6.653 13.252 L 6.621 13.255 L 6.649 13.243 L 6.616 13.239 L 6.653 13.252 Z M 2.569 15.074 L 2.559 17.22 L 0.524 17.223 L 0.534 15.077 L 2.569 15.074 M 6.637 17.217 L 6.605 17.218 L 6.633 17.215 L 6.6 17.214 L 6.637 17.217 Z",
    'Empty': "M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z",
    'Not Empty': "M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z",
    'Starts with': "M11.14 4L6.43 16H8.36L9.32 13.43H14.67L15.64 16H17.57L12.86 4M12 6.29L14.03 11.71H9.96M4 18V15H2V20H22V18Z",
    'Ends with': "M11.14 4L6.43 16H8.36L9.32 13.43H14.67L15.64 16H17.57L12.86 4M12 6.29L14.03 11.71H9.96M20 14V18H2V20H22V14Z",
    'Regex': "M16,16.92C15.67,16.97 15.34,17 15,17C14.66,17 14.33,16.97 14,16.92V13.41L11.5,15.89C11,15.5 10.5,15 10.11,14.5L12.59,12H9.08C9.03,11.67 9,11.34 9,11C9,10.66 9.03,10.33 9.08,10H12.59L10.11,7.5C10.3,7.25 10.5,7 10.76,6.76V6.76C11,6.5 11.25,6.3 11.5,6.11L14,8.59V5.08C14.33,5.03 14.66,5 15,5C15.34,5 15.67,5.03 16,5.08V8.59L18.5,6.11C19,6.5 19.5,7 19.89,7.5L17.41,10H20.92C20.97,10.33 21,10.66 21,11C21,11.34 20.97,11.67 20.92,12H17.41L19.89,14.5C19.7,14.75 19.5,15 19.24,15.24V15.24C19,15.5 18.75,15.7 18.5,15.89L16,13.41V16.92H16V16.92M5,19A2,2 0 0,1 7,17A2,2 0 0,1 9,19A2,2 0 0,1 7,21A2,2 0 0,1 5,19H5Z",
    'Greater Than': "M5.5,4.14L4.5,5.86L15,12L4.5,18.14L5.5,19.86L19,12L5.5,4.14Z",
    'Less Than': "M18.5,4.14L19.5,5.86L8.97,12L19.5,18.14L18.5,19.86L5,12L18.5,4.14Z"
  };

  const FancyTextSign = {
    'Clear': "=",
    'Contains': "=",
    'Not Contains': "!=",
    'Equals': "==",
    'Not Equals': "!==",
    'Empty': "empty",
    'Not Empty': "!empty",
    'Starts with': "_a",
    'Ends with': "a_",
    'Regex': "regex",
    'Greater Than': ">",
    'Less Than': "<",
    'Positive': '+',
    'Negative': '-'
  };

  const FancySignText = {
    '=': "Clear",
    '=': "Contains",
    '!=': "Not Contains",
    '==': "Equals",
    '!==': "Not Equals",
    'empty': "Empty",
    '!empty': "Not Empty",
    '_a': "Starts with",
    'a_': "Ends with",
    'regex': "Regex",
    '>': "Greater Than",
    '<': "Less Than",
    '+': 'Positive',
    '-': 'Negative'
  };

  class FilterField {
    sign = '=';
    defaultSign = '=';

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

      me.container = me.renderTo;

      el.classList.add(FILTER_FIELD);

      const elSign = document.createElement('div');
      elSign.classList.add(FILTER_FIELD_SIGN);
      elSign.innerHTML = [
        '<svg width="17" height="17" viewBox="0 0 24 24" style="vertical-align: middle; fill: currentcolor;">',
        '<path d=""></path>',
        '</svg>'
      ].join('');
      me.elSign = elSign;

      const elInput = document.createElement('input');
      elInput.classList.add(FILTER_FIELD_INPUT);
      elInput.value = me.value;
      me.input = elInput;

      const elText = document.createElement('div');
      elText.classList.add(FILTER_FIELD_TEXT);
      me.elText = elText;

      me.updateUI(FancySignText[me.sign || me.defaultSign]);

      el.appendChild(elSign);
      el.appendChild(elInput);
      el.appendChild(elText);

      me.container.appendChild(el);
    }

    ons() {
      const me = this;

      me.debouceInputFn = Fancy.debounce(me.onInput.bind(this), 300);
      me.input.addEventListener('input', me.debouceInputFn);
      me.elSign.addEventListener('click', me.signClick.bind(this));
    }

    signClick() {
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

    onInput(event) {
      const me = this;
      const sign = me.sign || me.defaultSign;
      const value = event.target.value;

      me.onChange?.(value, sign, me.column);
    }

    hideAllOpenedComboList(){
      document.body.querySelectorAll(`.${FILTER_FIELD_LIST}`).forEach(el => {
        el.remove();
      });
    }

    destroyComboList() {
      const me = this;

      me.elComboList?.remove();
      delete me.elComboList;
    }

    showComboList() {
      const me = this;
      const el = document.createElement('div');
      const elSignRect = me.elSign.getBoundingClientRect();
      const top = elSignRect.top - 1 + elSignRect.height;
      const left = elSignRect.left;

      el.classList.add(FILTER_FIELD_LIST);
      el.style.top = `${top}px`;
      el.style.left = `${left}px`;

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

        innerHTML.push(`<div class="${FILTER_FIELD_LIST_ITEM_TEXT}">${sign}</div>`);
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

    setValue(value) {
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

      me.onChange?.(value, sign, me.column);
    }

    setSign(sign) {
      const me = this;

      me.sign = FancyTextSign[sign];
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

(() => {
  const {
    FIELD,
    FIELD_INPUT
  } = Fancy.cls;

  const {
    ENTER,
    ESC
  } = Fancy.key;

  class StringField {
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
      elInput.classList.add(FIELD_INPUT);
      elInput.value = me.value;
      me.input = elInput;

      el.appendChild(elInput);
      me.el = el;

      me.container.appendChild(el);
    }

    ons() {
      const me = this;

      //me.debounceInputFn = Fancy.debounce(me.onInput.bind(this), 300);
      //me.input.addEventListener('input', me.debounceInputFn);
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

  Fancy.StringField = StringField;

})();

(() => {
  const {
    FIELD,
    FIELD_INPUT
  } = Fancy.cls;

  const {
    ENTER,
    ESC
  } = Fancy.key;

  class NumberField {
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
      elInput.classList.add(FIELD_INPUT);
      elInput.value = me.value;
      me.input = elInput;

      el.appendChild(elInput);
      me.el = el;

      me.container.appendChild(el);
    }

    ons() {
      const me = this;

      //me.debounceInputFn = Fancy.debounce(me.onInput.bind(this), 300);
      //me.input.addEventListener('input', me.debounceInputFn);
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

  Fancy.NumberField = NumberField;

})();

  return Fancy;
});
