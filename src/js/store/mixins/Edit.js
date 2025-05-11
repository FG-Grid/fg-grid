(()=> {
  const StoreEdit = {
    setById(id, key, value){
      const me = this;
      const item = me.idItemMap.get(id);

      if(typeof key === 'object'){
        for(let p in key){
          item[p] = key[p];
        }
      }
      else{
        item[key] = value;
      }
    }
  }

  Object.assign(Fancy.Store.prototype, StoreEdit);

})();
