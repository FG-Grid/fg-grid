const Fancy = {
  version: '0.3.9',
  isTouchDevice: 'ontouchstart' in window,
  gridIdSeed: 0,
  gridsMap: new Map(),
  get(id){
    return this.gridsMap.get(id);
  },
  capitalizeFirstLetter(str){
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
  deepClone(obj) {
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
  }
};

window.Fancy = window.Fancy || Fancy;
