(()=> {
  const typeOf = Fancy.typeOf;

  const StoreEdit = {
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
      else{
        item[key] = value;
      }

      return item;
    },
    removeItemById(id){
      const me = this;
      const item = me.idItemMap.get(id);
      const rowIndex = item.originalRowIndex;

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
  }

  Object.assign(Fancy.Store.prototype, StoreEdit);

})();
