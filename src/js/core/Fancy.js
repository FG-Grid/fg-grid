const Fancy = {
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
      return obj.map(item => Fancy.deepClone(item));
    }

    const clonedObj = {};
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = Fancy.deepClone(obj[key]);
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

window.Fancy = window.Fancy || Fancy;
