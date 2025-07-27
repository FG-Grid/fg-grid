(() => {
  const typeOf = Fancy.typeOf;

  /**
   * @mixin StoreMixinEdit
   */
  const StoreMixinEdit = {
    setById(id, key, value){
      const item = this.idItemMap.get(id);

      if (!item) return false;

      if(typeOf(key) === 'object'){
        for(let p in key){
          item[p] = key[p];
        }
      } else {
        item[key] = value;
      }

      return item;
    },
    removeItemById(id){
      const me = this;
      const item = me.idItemMap.get(id);
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
        if (!item.id) (item.id = me.generateId());
      });

      if(me.rowGroups.length){
        items = me.set$rowGroupValue(items);
        items.forEach(item => {
          const group = item.$rowGroupValue;
          let groupDetail = me.groupDetails[group];

          !groupDetail && me.addGroup(group);

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

        me.generateDisplayedGroupedData();
        me.setIndexAndItemsMaps();

        return;
      }

      if(position === undefined){
        me.data.push(...items);
        me.displayedData && me.displayedData.push(...items);
      } else if(position === 0){
        me.data.unshift(...items);
        me.displayedData && me.displayedData.unshift(...items);
      } else if(typeOf(position) === 'number'){
        me.data.splice(position, 0, ...items);
        me.displayedData && me.displayedData.splice(position, 0, ...items);
      } else if(typeOf(position) === 'object'){
        me.data.splice(position.originalRowIndex, 0, ...items);
        me.displayedData && me.displayedData.splice(position.rowIndex, 0, ...items);
      }

      me.updateIndexes();
    },
    clearGroup(groupName){
      const me = this;

      const splitted = groupName.split('/');
      const level = splitted.length - 1;
      if(level === 0){
        me.levelsWithGroups[0][0].root = me.levelsWithGroups[0][0].root.filter(value => value !== groupName);
      } else {
        splitted.pop();
        const parentGroupName = splitted.join('/');
        me.levelsWithGroups[level][0][parentGroupName] = me.levelsWithGroups[level][0][parentGroupName].filter(value => value !== groupName);

        // Go to group level to remove a group that has subgroups
        const groupDetail = me.groupDetails[groupName];
        if(groupDetail?.$hasChildrenGroups && me.levelsWithGroups[level + 1]){
          delete me.levelsWithGroups[level + 1][0][groupName];
        }
      }

    }
  };

  Object.assign(Fancy.Store.prototype, StoreMixinEdit);
})();
